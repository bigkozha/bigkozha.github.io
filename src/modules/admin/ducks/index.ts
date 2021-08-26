// import adminUserManagementDuck from './adminSideDucks';
// import directoratesDuck from './directoratesDuck';

// export interface AdminState {
//     adminUserManagementDuck: ReturnType<typeof adminUserManagementDuck>;
//     directoratesDuck: ReturnType<typeof directoratesDuck>;
// }

// export {
//     adminUserManagementDuck,
//     directoratesDuck,
// };

import adminUserManagementDuck from "./adminSideDucks";

export interface AdminState {
  adminUserManagementDuck: ReturnType<typeof adminUserManagementDuck>;
}

export { adminUserManagementDuck };
