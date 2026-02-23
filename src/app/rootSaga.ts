import { all } from "redux-saga/effects";
import { moviesSaga } from "../features/movies/moviesSaga";
import { favoritesSaga } from "../features/favorites/favoritesSaga";
import { uiSaga } from "../features/ui/uiSaga";

export default function* rootSaga() {
  yield all([
    moviesSaga(),
    favoritesSaga(),
    uiSaga(),
  ]);
}
