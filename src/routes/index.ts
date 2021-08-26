import { AdminUserManagementPage } from "../modules/admin/index";
import ForbiddenContainer from "../modules/common/containers/ForbiddentContainer";
import InternalErrorContainer from "../modules/common/containers/InternalErrorContainer";
import NotFoundContainer from "../modules/common/containers/NotFoundContainer";
import { ApplicationName } from "../api-authorization/ApiAuthorizationConstants";
import { MainPage } from "../modules/registry";

const routes = [
  {
    path: "/",
    component: MainPage,
    exact: true,
  },
  {
    path: "/admin/userManagement",
    component: AdminUserManagementPage,
    exact: true,
  },
  // {
  //   path: "/admin/Form1/:id",
  //   component: AdminForm1DetailPage,
  //   exact: true,
  // },
  {
    path: "/Error",
    component: InternalErrorContainer,
    exact: true,
  },
  {
    path: "/Forbidden",
    component: ForbiddenContainer,
    exact: true,
  },
  {
    path: "/NotFound",
    component: NotFoundContainer,
    exact: true,
  },
];

export default routes;
