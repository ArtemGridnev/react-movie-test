import type { RootState } from "../../app/store";

export const selectFavorites = (state: RootState) => state.favorites;

export const selectFavoritesItems = (state: RootState) => state.favorites.items;

export const selectIsMovieFavorite = (movieId: number) => (state: RootState) =>
  state.favorites.items.some(m => m.id === movieId);