import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import type { Movie } from '../types/movie';

type MovieCardProps = Movie & {
    focused?: boolean;
};

export default function MovieCard({ backdrop_path, title, focused }: MovieCardProps) {
    return (
        <Card
            sx={{ 
                ...(focused ? { outline: '3px solid #1976d2' } : {}),
            }}
        >
            <CardMedia
                component="img"
                image={`https://media.themoviedb.org/t/p/w220_and_h330_face/${backdrop_path}`}
                alt={title}
                width="220"
                height="330"
                sx={{ height: 'auto'}}
            />
            <CardContent>
                <Typography variant="h5" component="h6" className="movie-title">{title}</Typography>
            </CardContent>
        </Card>
    );
}