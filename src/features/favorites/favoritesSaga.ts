import { call, put, takeLatest } from "redux-saga/effects";
import { addFavorite, fetchFavoritesRequest, fetchFavoritesSuccess, removeFavorite } from "./favoritesSlice";
import type { Movie } from "../../types/movie";

function* fetchFavoritesWorker() {
    const favorites: Movie[] = JSON.parse(localStorage.getItem("favorites") || "[]");
    yield put(fetchFavoritesSuccess(favorites));
}

function* addFavoriteWorker(action: any) {
    const favorites: Movie[] = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (!favorites.some(movie => movie.id === action.payload.id)) {
        favorites.push(action.payload);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        yield put(fetchFavoritesSuccess(favorites));
    }
}

function* removeFavoriteWorker(action: any) {
    const favorites: Movie[] = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updatedFavorites = favorites.filter(movie => movie.id !== action.payload.id);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    yield put(fetchFavoritesSuccess(updatedFavorites));
}

export function* favoritesSaga() {
    yield call(fetchFavoritesWorker),
    yield takeLatest(fetchFavoritesRequest.type, fetchFavoritesWorker);
    yield takeLatest(addFavorite.type, addFavoriteWorker);
    yield takeLatest(removeFavorite.type, removeFavoriteWorker);
}