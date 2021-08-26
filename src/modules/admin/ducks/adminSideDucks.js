const SET_ADMIN_FILTERS = "SET_ADMIN_FILTERS";

const initialState = {
  UserManagementFilter: {
    NkOrName: null,
    Roles: [],
    IsActive: [],
    CurrentPage: 1,
    CountPerPage: 10,
    Expand: false,
  },
};

export const changeAdminFiltersReducer = (payload) => {
  return {
    type: SET_ADMIN_FILTERS,
    payload,
  };
};

const editAdminFiltersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ADMIN_FILTERS:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

export default editAdminFiltersReducer;
