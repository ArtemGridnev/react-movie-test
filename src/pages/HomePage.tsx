import { Box, Button, Container, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import MoviesGrid from "../components/MoviesGrid";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { Movie } from "../types/movie";
import { ArrowBackOutlined, ArrowForwardOutlined, SearchOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { selectAiringNow, selectPopular, selectSearch } from "../features/movies/moviesSelectors";
import { selectFavorites } from "../features/favorites/favoritesSelectors";
import { selectCategory, selectCategoryFocused, selectCategoryFocusedIndex, selectGridFocusedIndex, selectPaginationFocused, selectSearchQuery } from "../features/ui/uiSelectors";
import { setSearchQuery } from "../features/ui/uiSlice";

export default function HomePage() {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const searchTerm = useSelector(selectSearchQuery);

    const dispatch = useDispatch();

    const categoryFocusedIndex = useSelector(selectCategoryFocusedIndex);

    const paginationFocused = useSelector(selectPaginationFocused);

    const gridFocusedIndex = useSelector(selectGridFocusedIndex);

    const category = useSelector(selectCategory);
    const categoryFocused = useSelector(selectCategoryFocused);

    const popular = useSelector(selectPopular);
    const airingNow = useSelector(selectAiringNow);
    const favorites = useSelector(selectFavorites);
    const search = useSelector(selectSearch);

    useLayoutEffect(() => {
        if (categoryFocusedIndex !== "grid") {
            window.scrollTo(0, 0);
            return;
        }
        const activeItem = document.querySelector(`[data-focus-index="${gridFocusedIndex}"]`);
        activeItem?.scrollIntoView({ 
            block: 'center', 
        });
    }, [gridFocusedIndex, categoryFocusedIndex]);

    useEffect(() => {
        if (categoryFocusedIndex === "search") {
            inputRef.current?.focus();
        } else {
            inputRef.current?.blur();
        }
    }, [categoryFocusedIndex]);

    return (
        <Box component="section" sx={{ py: 4 }}>
            <Container>
                <Typography sx={{ mb: 3 }} variant="h4" component="h1">Movies App</Typography>
                <Box>
                    <TextField
                        inputRef={inputRef}
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        placeholder="Search Movies"
                        variant="standard"
                        fullWidth
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchOutlined />
                                    </InputAdornment>
                                ),
                            }
                        }}
                        sx={{
                            mb: 3,
                            maxWidth: 400,
                            ...(categoryFocusedIndex === "search"
                                ? { outline: "2px solid #1976d2" }
                                : {})
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        <Button 
                            sx={{ ...(categoryFocusedIndex === "categories" && categoryFocused === 'popular' ? { outline: "2px dashed #1976d2" } : {}) }} 
                            variant={category === "popular" ? "contained" : "outlined"}
                        >Popular</Button>
                        <Button 
                            sx={{ ...(categoryFocusedIndex === "categories" && categoryFocused === 'airingNow' ? { outline: "2px dashed #1976d2" } : {}) }} 
                            variant={category === "airingNow" ? "contained" : "outlined"}
                        >Airing Now</Button>
                        <Button 
                            sx={{ ...(categoryFocusedIndex === "categories" && categoryFocused === 'favorites' ? { outline: "2px dashed #1976d2" } : {}) }} 
                            variant={category === "favorites" ? "contained" : "outlined"}
                        >My Favorites</Button>
                    </Box>

                    {(category === "popular" || category === "airingNow") && (
                        <Box sx={{ display: "flex", mb: 2, gap: 2, alignItems: "center" }}>
                            <IconButton sx={{ ...(categoryFocusedIndex === "pagination" && paginationFocused === 'prev' ? { outline: "2px solid #1976d2" } : {}) }} >
                                <ArrowBackOutlined />
                            </IconButton>
                            <IconButton sx={{ ...(categoryFocusedIndex === "pagination" && paginationFocused === 'next' ? { outline: "2px solid #1976d2" } : {}) }} >
                                <ArrowForwardOutlined />
                            </IconButton>
                            <Typography>Page {category === "popular" ? popular.page : airingNow.page}</Typography>
                        </Box>
                    )}
                    
                    {category === "popular" && (
                        <>
                            {popular.error && <Typography color="error">{popular.error}</Typography>}
                            {!popular.loading && popular.items && popular.items.length === 0 && <Typography>No movies found.</Typography>}
                            {popular.items && <MoviesGrid focused={categoryFocusedIndex === "grid"} focusedIndex={gridFocusedIndex} movies={popular.items as unknown as Movie[]} />}
                            {popular.loading && <Typography>Loading...</Typography>}
                        </>
                    )}

                    {category === "airingNow" && (
                        <>

                            {airingNow.error && <Typography color="error">{airingNow.error}</Typography>}
                            {!airingNow.loading && airingNow.items && airingNow.items.length === 0 && <Typography>No movies found.</Typography>}
                            {airingNow.items && <MoviesGrid focused={categoryFocusedIndex === "grid"} focusedIndex={gridFocusedIndex} movies={airingNow.items as unknown as Movie[]} />}
                            {airingNow.loading && <Typography>Loading...</Typography>}
                        </>
                    )}

                    {category === "favorites" && (
                        <>
                            {favorites.items && favorites.items.length > 0 && <MoviesGrid focused={categoryFocusedIndex === "grid"} focusedIndex={gridFocusedIndex} movies={favorites.items as unknown as Movie[]} />}
                            {favorites.items && favorites.items.length === 0 && <Typography>No favorites yet.</Typography>}
                        </>
                    )}

                    {category === "searchResults" && (
                        <>
                            {search.error && <Typography color="error">{search.error}</Typography>}
                            {!search.error && !search.loading && search.items && search.items.length === 0 && <Typography>No movies found.</Typography>}
                            {search.items && !search.loading && <MoviesGrid focused={categoryFocusedIndex === "grid"} focusedIndex={gridFocusedIndex} movies={search.items as unknown as Movie[]} />}
                            {search.loading && <Typography>Searching...</Typography>}
                        </>
                    )}
                </Box>
            </Container>
        </Box>
    );
}