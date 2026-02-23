import { Grid } from "@mui/material";
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

export default function MoviesGrid({ movies, focusedIndex, focused }: { movies: Movie[], focusedIndex: number, focused: boolean }) {
    return (
        <Grid container spacing={2}>
            {movies.map((movie, index) => (
                <Grid key={movie.id} size={3} data-focus-index={index}>
                    <MovieCard 
                        focused={focused && index === focusedIndex}
                        {...movie} 
                    />
                </Grid>
            ))}
        </Grid>
    );
}