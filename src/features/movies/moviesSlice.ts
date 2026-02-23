import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SearchQueryObject } from "./moviesSaga";
import type { Movie } from "../../types/movie";

interface MovieListState {
    items: Movie[];
    loading: boolean;
    error: string | null;
    page: number;
}

interface MovieDetailsState {
    item: Movie | null;
    loading: boolean;
    error: string | null;
}

interface MoviesState {
    popular: MovieListState;
    airingNow: MovieListState;
    search: MovieListState;
    details: MovieDetailsState;
}

const createMovieListState = (): MovieListState => ({
    items: [],
    loading: false,
    error: null,
    page: 1,
});

const initialState: MoviesState = {
    popular: createMovieListState(),
    airingNow: createMovieListState(),
    search: createMovieListState(),
    details: {
        item: null,
        loading: false,
        error: null,
    }
};

const moviesSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {
        // Popular
        fetchPopularRequest(state, action: PayloadAction<{ page?: 'next' | 'prev' } | undefined>) {
            if (action.payload?.page === 'next') {
                state.popular.page += 1;
            }

            if (action.payload?.page === 'prev' && state.popular.page > 1) {
                state.popular.page -= 1;
            }

            state.popular.loading = true;
            state.popular.error = null;
        },
        fetchPopularSuccess(state, action: PayloadAction<Movie[]>) {
            state.popular.loading = false;
            state.popular.items = action.payload;
        },
        fetchPopularFailure(state, action: PayloadAction<string>) {
            state.popular.loading = false;
            state.popular.error = action.payload;
        },

        // Airing now
        fetchAiringNowRequest(state, action: PayloadAction<{ page?: 'next' | 'prev' } | undefined>) {
            if (action.payload?.page === 'next') {
                state.airingNow.page += 1;
            }

            if (action.payload?.page === 'prev' && state.airingNow.page > 1) {
                state.airingNow.page -= 1;
            }

            state.airingNow.loading = true;
            state.airingNow.error = null;
        },
        fetchAiringNowSuccess(state, action: PayloadAction<Movie[]>) {
            state.airingNow.loading = false;
            state.airingNow.items = action.payload;
        },
        fetchAiringNowFailure(state, action: PayloadAction<string>) {
            state.airingNow.loading = false;
            state.airingNow.error = action.payload;
        },

        // Search
        fetchSearchRequest(state, _action: PayloadAction<SearchQueryObject>) {
            state.search.loading = true;
            state.search.error = null;
        },
        fetchSearchSuccess(state, action: PayloadAction<Movie[]>) {
            state.search.loading = false;
            state.search.items = action.payload;
        },
        fetchSearchFailure(state, action: PayloadAction<string>) {
            state.search.loading = false;
            state.search.error = action.payload;
        },

        // Movie details
        fetchDetailsRequest(state, _: PayloadAction<string>) {
            state.details.loading = true;
            state.details.error = null;
        },
        fetchDetailsSuccess(state, action: PayloadAction<Movie>) {
            state.details.loading = false;
            state.details.item = action.payload;
        },
        fetchDetailsFailure(state, action: PayloadAction<string>) {
            state.details.loading = false;
            state.details.error = action.payload;
        },
    },
});

export const {
    fetchPopularRequest,
    fetchPopularSuccess,
    fetchPopularFailure,
    fetchAiringNowRequest,
    fetchAiringNowSuccess,
    fetchAiringNowFailure,
    fetchSearchRequest,
    fetchSearchSuccess,
    fetchSearchFailure,
    fetchDetailsRequest,
    fetchDetailsSuccess,
    fetchDetailsFailure,
} = moviesSlice.actions;

export default moviesSlice.reducer;
