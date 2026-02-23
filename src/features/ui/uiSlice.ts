import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "../../types/category";

interface UIState {
    categoryFocusedIndex: 'search' | 'categories' | 'pagination' | 'grid' | 'details';
    categoryFocused: Category;
    category: Category;
    paginationFocused: 'prev' | 'next';
    gridFocusedIndex: number;
    detailsFocused: 'back' | 'favorites';
    searchQuery: string;
}

const initialState: UIState = {
    categoryFocusedIndex: 'categories',
    categoryFocused: "popular",
    category: "popular",
    paginationFocused: 'next',
    gridFocusedIndex: 0,
    detailsFocused: 'back',
    searchQuery: "",
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setActiveCategory(state, action: PayloadAction<Category>) {
            state.category = action.payload;
            state.gridFocusedIndex = 0;
        },

        // keyboard events
        keyPressed: (_state, _action: PayloadAction<string>) => {},
        setCategoryFocusedIndex(state, action: PayloadAction<UIState['categoryFocusedIndex']>) {
            state.categoryFocusedIndex = action.payload;
        },
        resetFocus(state) {
            state.gridFocusedIndex = 0;
        },

        //search
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },

        // categories navigation
        setCategory(state, action: PayloadAction<Category>) {
            state.category = action.payload;
        },
        categoriesFocusMoveRight(state) {
            const categories: Category[] = ["popular", "airingNow", "favorites"];

            const currentIndex = categories.indexOf(state.categoryFocused);
            const nextIndex = (currentIndex + 1) % categories.length;

            state.categoryFocused = categories[nextIndex];
        },
        categoriesFocusMoveLeft(state) {
            const categories: Category[] = ["popular", "airingNow", "favorites"];

            const currentIndex = categories.indexOf(state.categoryFocused);
            const nextIndex = (currentIndex - 1 + categories.length) % categories.length;

            state.categoryFocused = categories[nextIndex];
        },

        // pagination navigation
        setPaginationFocused(state, action: PayloadAction<UIState['paginationFocused']>) {
            state.paginationFocused = action.payload;
        },

        // grid navigation
        gridMoveRight(state, action: PayloadAction<number>) {
            const maxIndex = action.payload - 1;

            console.log(Math.min(
                state.gridFocusedIndex + 1,
                maxIndex
            ));

            state.gridFocusedIndex = Math.min(
                state.gridFocusedIndex + 1,
                maxIndex
            );
        },
        gridMoveLeft(state) {
            state.gridFocusedIndex = Math.max(state.gridFocusedIndex - 1, 0);
        },
        gridMoveDown(state, action: PayloadAction<number>) {
            const itemsPerRow = 4;
            const maxIndex = action.payload - 1;

            state.gridFocusedIndex = Math.min(
                state.gridFocusedIndex + itemsPerRow,
                maxIndex
            );
        },
        gridMoveUp(state) {
            const itemsPerRow = 4;

            const newValue = state.gridFocusedIndex - itemsPerRow;

            if (newValue < 0) {
                if (state.category === "popular" || state.category === "airingNow") {
                    state.categoryFocusedIndex = "pagination"; 
                } else {
                    state.categoryFocusedIndex = "categories";
                }
                state.gridFocusedIndex = 0;
            } else {
                state.gridFocusedIndex = Math.max(
                    state.gridFocusedIndex - itemsPerRow,
                    0
                );
            }
        },

        // details navigation
        setDetailsFocused(state, action: PayloadAction<UIState['detailsFocused']>) {
            state.detailsFocused = action.payload;
        },
        detailsMoveDown(state) {
            if (state.detailsFocused === "back") {
                state.detailsFocused = "favorites";
            } else {
                state.detailsFocused = "back";
            }
        },
        detailsMoveUp(state) {
            if (state.detailsFocused === "favorites") {
                state.detailsFocused = "back";
            } else {
                state.detailsFocused = "favorites";
            }
        },
    },
});

export const {
    setCategoryFocusedIndex,
    setActiveCategory,
    keyPressed,
    setCategory,
    setSearchQuery,
    categoriesFocusMoveRight,
    categoriesFocusMoveLeft,
    setPaginationFocused,
    gridMoveDown,
    gridMoveLeft,
    gridMoveRight,
    gridMoveUp,
    setDetailsFocused,
    detailsMoveDown,
    detailsMoveUp,
    resetFocus
} = uiSlice.actions;

export default uiSlice.reducer;