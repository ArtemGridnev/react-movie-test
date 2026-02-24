# React Movie App - Technical Test

## Features Implemented
✅ Popular movies (TMDB API)  
✅ Filter: Popular / Airing Now / My Favorites  
✅ Search (≥2 chars, 500ms debounce, 5req/10s rate limit)  
✅ Pagination (Popular/Airing Now)  
✅ Movie details + localStorage favorites  
✅ **100% Keyboard Navigation** (arrows/Enter/Escape)  
✅ **No Tab/mouse scroll** (overflow: hidden)  
✅ 4 cards/row + keyboard grid navigation  

## Tech Stack
**Vite** + React 18 + Redux Toolkit + **Redux-Saga** + Material UI + TMDB API

## Installation & Setup
```bash
npm install
npm run dev
```
## Environment Variables

This project uses the TMDB API.

Create a `.env` file in the root of the project and add:

```env
VITE_TMDB_API_KEY=your_api_key_here
```
