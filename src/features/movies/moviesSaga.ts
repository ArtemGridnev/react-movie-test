import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  fetchPopularRequest,
  fetchPopularSuccess,
  fetchPopularFailure,
  fetchAiringNowRequest,
  fetchAiringNowSuccess,
  fetchAiringNowFailure,
  fetchDetailsRequest,
  fetchDetailsSuccess,
  fetchDetailsFailure,
  fetchSearchRequest,
  fetchSearchFailure,
  fetchSearchSuccess,
} from "./moviesSlice";
import type { Movie } from "../../types/movie";
import { selectAiringNowPage, selectPopularPage } from "./moviesSelectors";

const API_KEY = "3527207d6cbad029e45de029b7fedc01";
const BASE_URL = "https://api.themoviedb.org/3";

export type MoviesQueryObject = {
  page?: string;
};

export type SearchQueryObject = {
  query: string;
};

const requestTimestamps: number[] = [];

async function fetchPopularApi(queryObject?: MoviesQueryObject) {
  const queryParams = new URLSearchParams(queryObject);

  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch popular movies");
  }

  const data = await response.json();
  return data.results;
}

async function fetchAiringNowApi(queryObject?: MoviesQueryObject): Promise<Movie[]> {
  const queryParams = new URLSearchParams(queryObject);

  const response = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch airing now movies");
  }

  const data = await response.json();
  return data.results;
}

async function fetchSearchApi(queryObject?: SearchQueryObject) {
  const queryParams = new URLSearchParams(queryObject);

  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch popular movies");
  }

  const data = await response.json();
  return data.results;
}

async function fetchMovieDetailsApi(movieId: string): Promise<Movie> {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  const data = await response.json();
  return data;
}

function* fetchPopularWorker(): Generator<any, void, unknown> {
  try {
    const page = yield select(selectPopularPage);

    const movies: any = yield call(() => fetchPopularApi({ page: page as string }));

    yield put(fetchPopularSuccess(movies));
  } catch (error: any) {
    yield put(fetchPopularFailure(error.message));
  }
}

function* fetchAiringNowWorker(): Generator<any, void, unknown> {
  try {
    const page = yield select(selectAiringNowPage);

    const movies: any = yield call(() => fetchAiringNowApi({ page: page as string }));

    yield put(fetchAiringNowSuccess(movies));
  } catch (error: any) {
    yield put(fetchAiringNowFailure(error.message));
  }
}

function* fetchSearchWorker(action: any): Generator<any, void, unknown> {
  const now = Date.now();

  const validTimestamps = requestTimestamps.filter(
    (timestamp) => now - timestamp < 10000
  );

  requestTimestamps.length = 0;
  requestTimestamps.push(...validTimestamps);

  if (requestTimestamps.length >= 5) {
    yield put(fetchSearchFailure("Rate limit exceeded"));
    return;
  }

  requestTimestamps.push(now);

  try {
    const movies: any = yield call(() => fetchSearchApi(action.payload));

    yield put(fetchSearchSuccess(movies));
  } catch (error: any) {
    yield put(fetchSearchFailure(error.message));
  }
}

function* fetchDetailsWroker(action: any): Generator<any, void, unknown> {
  try {
    const movie: any = yield call(() => fetchMovieDetailsApi(action.payload));

    yield put(fetchDetailsSuccess(movie));
  } catch (error: any) {
    yield put(fetchDetailsFailure(error.message));
  }
}

export function* moviesSaga() {
  yield takeLatest(fetchPopularRequest.type, fetchPopularWorker);
  yield takeLatest(fetchAiringNowRequest.type, fetchAiringNowWorker);
  yield takeLatest(fetchDetailsRequest.type, fetchDetailsWroker);
  yield takeLatest(fetchSearchRequest.type, fetchSearchWorker);
}
