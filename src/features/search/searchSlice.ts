import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Movie } from "../../types/movie";
import type { SearchQueryObject } from "./searchSaga";

interface MovieListState {
    items: Movie[];
    loading: boolean;
    error: string | null;
    page: number;
}

const initialState: MovieListState  = {
    items: [],
    loading: false,
    error: null,
    page: 1,
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        fetchSearchRequest(state, _action: PayloadAction<SearchQueryObject>) {
            state.loading = true;
            state.error = null;
        },
        fetchSearchSuccess(state, action: PayloadAction<Movie[]>) {
            state.loading = false;
            state.items = action.payload;
        },
        fetchSearchFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchSearchRequest,
    fetchSearchSuccess,
    fetchSearchFailure,
} = searchSlice.actions;

export default searchSlice.reducer;
