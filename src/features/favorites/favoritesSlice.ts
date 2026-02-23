import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Movie } from "../../types/movie";

interface FavoritesState {
    items: Movie[];
}

const initialState: FavoritesState = {
    items: [],
}

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addFavorite(_, _action: PayloadAction<Movie>) {},
        removeFavorite(_, _action: PayloadAction<Movie>) {},
        fetchFavoritesRequest(_) {},
        fetchFavoritesSuccess(state, action: PayloadAction<Movie[]>) {
            state.items = action.payload;
        }
    }
});

export const {
    addFavorite,
    removeFavorite,
    fetchFavoritesRequest,
    fetchFavoritesSuccess
} = favoritesSlice.actions;

export default favoritesSlice.reducer;