import { combineReducers } from "redux";
import {
  adminUserManagementDuck,
  // directoratesDuck,
} from "../modules/admin/ducks";

const reducers = {
  adminUserManagementDuck,
  // directoratesDuck,
};

const rootReducer = combineReducers(reducers as any);
export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
