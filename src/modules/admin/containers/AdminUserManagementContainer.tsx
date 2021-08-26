import UserManagementListComponent from '../components/UserManagementListComponent';
import { SliderMenuKeys } from '../constants';
import { LoginType } from '../../common/constants';
import withAccessCheck from '../../../utils/withAccessCheck';

export default withAccessCheck(UserManagementListComponent, [LoginType.Admin.code], SliderMenuKeys.UserManagement);
