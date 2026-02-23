import type { RootState } from "../../app/store";

export const selectPopular = (state: RootState) => state.movies.popular;

export const selectAiringNow = (state: RootState) => state.movies.airingNow;

export const selectSearch = (state: RootState) => state.movies.search;

export const selectPopularItems = (state: RootState) => state.movies.popular.items;

export const selectPopularPage = (state: RootState) => state.movies.popular.page;

export const selectAiringNowItems = (state: RootState) => state.movies.airingNow.items;

export const selectAiringNowPage = (state: RootState) => state.movies.airingNow.page;

export const selectSearchItems = (state: RootState) => state.movies.search.items;