import { Alert, Box, Button, CardMedia, Container, IconButton, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../app/store";
import { fetchDetailsRequest } from "../features/movies/moviesSlice";
import { ArrowBackOutlined, FavoriteOutlined } from "@mui/icons-material";
import { selectIsMovieFavorite } from "../features/favorites/favoritesSelectors";

import { selectDetailsFocused } from "../features/ui/uiSelectors";

export default function MovieDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const {
        loading,
        error,
        item: movie,
    } = useSelector((state: RootState) => state.movies.details);

    const focused = useSelector(selectDetailsFocused);

    const isFavorite = useSelector(selectIsMovieFavorite(Number(id)));

    useEffect(() => {
        if (id) {
            dispatch(fetchDetailsRequest(id));
        }
    }, [id, dispatch]);

    return (
        <Box component="section" sx={{ py: 4 }}>
            <Container>
                {loading && <Typography>Loading...</Typography>}

                {!loading && error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {!loading && !error && !movie && <Typography>Movie not found</Typography>}
    
                {!loading && !error && movie && (
                    <Box sx={{ display: 'flex', gap: 4 }}>
                        <CardMedia
                            component="img"
                            image={`https://media.themoviedb.org/t/p/w220_and_h330_face/${movie.backdrop_path}`}
                            alt={movie.title}
                            sx={{ width: '400px', flexShrink: 0 }}
                        />

                        <Box sx={{ py: 2 }}>
                            <IconButton
                                sx={{ mb: 2, ...(focused === 'back' ? { outline: "2px solid #1976d2" } : {}) }}
                            >
                                <ArrowBackOutlined />
                            </IconButton>
                            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>{movie.title}</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>{movie.overview}</Typography>
                            <Typography variant="subtitle1" sx={{ mb: 4 }}>Release date: {movie.release_date}</Typography>
                            <Button 
                                variant={isFavorite ? "outlined" : "contained"} 
                                endIcon={<FavoriteOutlined />}
                                sx={{ ...(focused === 'favorites' ? { outline: "2px dashed #1976d2" } : {}) }}
                            >
                                {isFavorite ? "Remove form favorites" : "Add to favorites"} 
                            </Button>
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    );
    
}