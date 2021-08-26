import request from "../../common/request";
import { FolderStructure } from "../models";

class AdminFolderStructureService {
  public async getRoot(): Promise<FolderStructure[]> {
    const url = "/api/v1/folder-structure/root";
    const result = await request.get(url);

    return result.data.data;
  }

  public async getChildren(id: string): Promise<FolderStructure[]> {
    const url = `/api/v1/folder-structure/children/${id}`;
    const result = await request.get(url);

    return result.data.data;
  }
}

const adminFolderStructureSrv = new AdminFolderStructureService();
export default adminFolderStructureSrv;
