import { createStore, compose, applyMiddleware } from "redux";
import { persistState } from "redux-devtools";
import rootReducer from "./reducers";
import thunk from "redux-thunk";

import DevTools from "../modules/common/DevTools";

const enhancer = compose(DevTools.instrument());
const state = persistState(
  window.location.href.match(/[?&]debug_session=([^&#]+)\b/)
);

export default function configureStore(initialState = {}) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(thunk), state, enhancer)
  );
  return store;
}
