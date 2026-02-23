import type { RootState } from "../../app/store";

export const selectCategory = (state: RootState) => state.ui.category;

export const selectCategoryFocused = (state: RootState) => state.ui.categoryFocused;


export const selectGridFocusedIndex = (state: RootState) => state.ui.gridFocusedIndex;

export const selectCategoryFocusedIndex = (state: RootState) => state.ui.categoryFocusedIndex;

export const selectPaginationFocused = (state: RootState) => state.ui.paginationFocused;

export const selectGirdItems = (state: RootState) => {
    const category = selectCategory(state);

    switch (category) {
        case "popular":
            return state.movies.popular.items;
        case "airingNow":
            return state.movies.airingNow.items;
        case "searchResults":
            return state.movies.search.items;
        case "favorites":
            return state.favorites.items;
    }
};

export const selectGridFocusedItem = (state: RootState) => {
    const category = selectCategory(state);

    let items: any = [];

    switch (category) {
        case "popular":
            items = state.movies.popular.items;
            break;
        case "airingNow":
            items = state.movies.airingNow.items;
            break;
        case "searchResults":
            items = state.movies.search.items;
            break;
        case "favorites":
            items = state.favorites.items;
            break;
    }

    return items[selectGridFocusedIndex(state)];
}

export const selectDetailsFocused = (state: RootState) => state.ui.detailsFocused;

export const selectSearchQuery = (state: RootState) => state.ui.searchQuery;