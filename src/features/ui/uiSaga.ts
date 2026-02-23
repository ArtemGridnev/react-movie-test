import { call, debounce, delay, fork, put, race, select, take, takeEvery, takeLatest } from "redux-saga/effects";
import { categoriesFocusMoveLeft, categoriesFocusMoveRight, detailsMoveDown, detailsMoveUp, gridMoveDown, gridMoveLeft, gridMoveRight, gridMoveUp, keyPressed, setCategory, setCategoryFocusedIndex, setDetailsFocused, setPaginationFocused, setSearchQuery } from "./uiSlice";
import { selectCategory, selectCategoryFocused, selectCategoryFocusedIndex, selectDetailsFocused, selectGirdItems, selectGridFocusedItem, selectPaginationFocused } from "./uiSelectors";
import { navigateTo } from "../../services/navigationService";
import { addFavorite, fetchFavoritesRequest, removeFavorite } from "../favorites/favoritesSlice";
import type { Category } from "../../types/category";
import { fetchAiringNowRequest, fetchPopularRequest, fetchSearchRequest } from "../movies/moviesSlice";

function* paginationNavigationWorker(action: ReturnType<typeof keyPressed>): Generator {
    const key = action.payload;

    if (key === "Enter") {
        const categoryFocusedIndex = yield select(selectCategoryFocusedIndex);

        if (categoryFocusedIndex === "pagination") {
            const category = yield select(selectCategory);
            const paginationFocused = yield select(selectPaginationFocused);

            if (category === "popular") {
                yield put(fetchPopularRequest({ page: paginationFocused as "next" | "prev" }));
            } else if (category === "airingNow") {
                yield put(fetchAiringNowRequest({ page: paginationFocused as "next" | "prev" }));
            }
        }
    }

    if (key === "ArrowRight") yield put(setPaginationFocused("next"));
    if (key === "ArrowLeft") yield put(setPaginationFocused("prev"));

    if (key === "ArrowUp") yield put(setCategoryFocusedIndex("categories"));
    if (key === "ArrowDown") yield put(setCategoryFocusedIndex("grid"));
}

function* gridNavigationWorker(action: ReturnType<typeof keyPressed>): Generator {
    const key = action.payload;

    let items: any = yield select(selectGirdItems);

    if (!items) return;

    const totalItems = items.length;

    if (key === "Enter") {
        const focusedItem: any = yield select(selectGridFocusedItem);
        yield put(setCategoryFocusedIndex("details"));
        yield put(setDetailsFocused("back"));
        navigateTo(`/movie/${focusedItem.id}`);
    }
    if (key === "ArrowRight") yield put(gridMoveRight(totalItems));
    if (key === "ArrowLeft") yield put(gridMoveLeft());
    if (key === "ArrowDown") yield put(gridMoveDown(totalItems));
    if (key === "ArrowUp") yield put(gridMoveUp());
}

function* categoryNavigationWorker(action: ReturnType<typeof keyPressed>): Generator {
    const key = action.payload;
    const categoryFocused = yield select(selectCategoryFocused);
    const category = yield select(selectCategory);

    if (key === "Enter") yield put(setCategory(categoryFocused as Category));
    if (key === "ArrowRight") yield put(categoriesFocusMoveRight());
    if (key === "ArrowLeft") yield put(categoriesFocusMoveLeft());
    if (key === "ArrowDown") {
        if (category === "popular" || category === "airingNow") {
            yield put(setCategoryFocusedIndex("pagination"));
        } else {
            yield put(setCategoryFocusedIndex("grid"));
        }
    }
    if (key === "ArrowUp") yield put(setCategoryFocusedIndex("search"));
}

function* applyFocusedCategoryWorker(): Generator {
    const categoryFocused = yield select(selectCategoryFocused);
    yield put(setCategory(categoryFocused as Category));
}

function* handleCategoryFocus(_: any): Generator {
    const categoryFocusedIndex = yield select(selectCategoryFocusedIndex);
    if (categoryFocusedIndex !== "categories") return;
    
    const raceResult: any = yield race({
        delay: delay(2000),
        cancel: take(setCategoryFocusedIndex.type)
    });

    const { delay: timeout } = raceResult;
    
    if (timeout) {
        const focusedCategory = yield select(selectCategoryFocused);
        const category = yield select(selectCategory);

        const stillInCategories = yield select(selectCategoryFocusedIndex);
        if (stillInCategories === "categories" && focusedCategory !== category) {
            yield call(applyFocusedCategoryWorker);
        }
    }
}

function* watchCategoryFocus(): Generator {
    yield takeEvery(categoriesFocusMoveRight.type, handleCategoryFocus);
    yield takeEvery(categoriesFocusMoveLeft.type, handleCategoryFocus);
}

function* searchNavigationWorker(action: ReturnType<typeof keyPressed>): Generator {
    const key = action.payload;

    if (key === "Enter") yield put(setCategory("searchResults"));
    if (key === "ArrowDown") yield put(setCategoryFocusedIndex("categories"));
}

function* detailsNavigationWorker(action: ReturnType<typeof keyPressed>): Generator {
    const key = action.payload;

    const detailsFocused = yield select(selectDetailsFocused);

    if (key === "Enter" && detailsFocused === 'back' || key === 'Escape') {
        yield put(setCategoryFocusedIndex("grid"));
        navigateTo("/");
    }

    if (key === "Enter" && detailsFocused === 'favorites') {
        const focusedItem: any = yield select(selectGridFocusedItem);

        if (!focusedItem) return;

        const isFavorite = yield select(state => state.favorites.items.some((item: any) => item.id === focusedItem.id));

        if (isFavorite) {
            yield put(removeFavorite(focusedItem));
        } else {
            yield put(addFavorite(focusedItem));
        }
    }

    if (key === "ArrowDown") yield put(detailsMoveDown());
    if (key === "ArrowUp") yield put(detailsMoveUp());
}

function* watchKeyboardWorker(action: ReturnType<typeof keyPressed>): Generator {
    const categoryFocusedIndex = yield select(selectCategoryFocusedIndex);
  
    switch (categoryFocusedIndex) {
        case "pagination":
            yield* paginationNavigationWorker(action);
            break;
        case "grid":
            yield* gridNavigationWorker(action);
            break;
        case "categories":
            yield* categoryNavigationWorker(action);
            break;
        case "search":
            yield* searchNavigationWorker(action);
            break;
        case "details":
            yield* detailsNavigationWorker(action);
            break;
    }
}

function* fetchDataByCategoryWorker(): Generator {
    const category = yield select(selectCategory);

    if (category === "searchResults") return;

    switch (category) {
        case "popular":
            yield put(fetchPopularRequest());
            break;
        case "airingNow":
            yield put(fetchAiringNowRequest());
            break;
        case "favorites":
            yield put(fetchFavoritesRequest())
            break;
    }
}

function* searchWorker(action: ReturnType<typeof setSearchQuery>): Generator {
    if (action.payload.length < 2) return;

    yield put(setCategory("searchResults"));
    yield put(fetchSearchRequest({ query: action.payload }));
}

function* watchSearch(): Generator  {
    yield debounce(500, setSearchQuery.type, searchWorker);
}

function* setFocusedCategoryByPathWorker(): Generator {
    const path = window.location.pathname;

    if (path.startsWith("/movie/")) {
        yield put(setCategoryFocusedIndex("details"));
    } else {
        yield put(setCategoryFocusedIndex("categories"));
    }
}

export function* uiSaga() {
    yield call(fetchDataByCategoryWorker);
    yield call(setFocusedCategoryByPathWorker);
    yield fork(watchSearch);
    yield fork(watchCategoryFocus);
    yield takeEvery(keyPressed.type, watchKeyboardWorker);
    yield takeLatest(setCategory.type, fetchDataByCategoryWorker);
}