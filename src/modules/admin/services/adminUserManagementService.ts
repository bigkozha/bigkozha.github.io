import request from "../../common/request";
import { AdUser } from "../../common/models";

class AdminUserManagementService {
  public async getUsersFromAdByQuery(query: string): Promise<AdUser[]> {
    const url = `/api/v1/userManagement/getUsersFromAdByQuery/${query}`;
    const result = await request.get(url);

    return result.data.data;
  }
}

const adminUserManagementSrv = new AdminUserManagementService();
export default adminUserManagementSrv;
