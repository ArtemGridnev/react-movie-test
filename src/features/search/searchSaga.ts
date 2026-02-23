import { call, debounce, fork, put } from "redux-saga/effects";
import {
    fetchSearchRequest,
    fetchSearchSuccess,
    fetchSearchFailure,
} from "./searchSlice";

const API_KEY = "3527207d6cbad029e45de029b7fedc01";
const BASE_URL = "https://api.themoviedb.org/3";

export type SearchQueryObject = {
    query: string;
};

const requestTimestamps: number[] = [];

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

function* watchSearch(): Generator<any, void, unknown>  {
    yield debounce(500, fetchSearchRequest.type, fetchSearchWorker);
}

function* fetchSearchWorker(action: any): Generator<any, void, unknown> {
    if (action.payload.query.length < 2) return;

    const now = Date.now();

    const validTimestamps = requestTimestamps.filter(
        (timestamp) => now - timestamp < 10000
    );

    requestTimestamps.length = 0;
    requestTimestamps.push(...validTimestamps);

    if (requestTimestamps.length >= 5) {
        yield put(fetchSearchFailure("Rate limit exceeded"));
    }

    requestTimestamps.push(now);

    try {
        const movies: any = yield call(() => fetchSearchApi(action.payload));

        yield put(fetchSearchSuccess(movies));
    } catch (error: any) {
        yield put(fetchSearchFailure(error.message));
    }
}

export function* searchSaga() {
    yield fork(watchSearch);
}
