import moment from "moment";
import qs from "querystring";
import { PageData } from "../../common/models";
import request from "../../common/request";
import {
  AddFolderOwnerForm,
  AdminFolderFilterForm,
  AdminFolderViewModel,
  FolderStructure,
} from "../models";

class AdminFolderManagementService {
  public async getRootFolders(): Promise<FolderStructure[]> {
    const url = "/api/v1/folder-structure/root";
    const result = await request.get(url);

    return result.data.data;
  }

  public async getFolderList(
    data?: AdminFolderFilterForm
  ): Promise<PageData<AdminFolderViewModel>> {
    const url = "/api/v1/folderManagement";
    const result = await request.get(url, {
      params: data,
      paramsSerializer: (params: any): any => {
        const newParams = { ...params };
        if (newParams.validationStartDate) {
          newParams.validationStartDate = moment(
            newParams.validationStartDate
          ).format();
        }
        if (newParams.validationEndDate) {
          newParams.validationEndDate = moment(
            newParams.validationEndDate
          ).format();
        }
        if (newParams.notifiedStartDate) {
          newParams.notifiedStartDate = moment(
            newParams.notifiedStartDate
          ).format();
        }
        if (newParams.notifiedEndDate) {
          newParams.notifiedEndDate = moment(
            newParams.notifiedEndDate
          ).format();
        }

        return qs.stringify(newParams);
      },
    });

    return result.data.data;
  }

  public async AddFolderOwner(data: AddFolderOwnerForm): Promise<void> {
    const url = "/api/v1/folderOwner/";
    await request.post(url, data);
  }

  public async DeleteFolderOwner(id: string): Promise<void> {
    const url = "/api/v1/folderOwner/";
    await request.delete(url, { params: { id } });
  }

  public async SendToRevalidate(data: {
    folderIds: string[] | number[];
  }): Promise<void> {
    const url = "/api/v1/folderManagement/sendToRevalidate/";
    await request.post(url, data);
  }

  public async ExportReport(data?: AdminFolderFilterForm): Promise<void> {
    const url = "/api/v1/folderManagement/export";

    const formData: any = { ...data };
    if (data && data.validationStartDate) {
      formData.validationStartDate = moment(data.validationStartDate).format();
    }
    if (data && data.validationEndDate) {
      formData.validationEndDate = moment(data.validationEndDate).format();
    }
    if (data && data.notifiedStartDate) {
      formData.notifiedStartDate = moment(data.notifiedStartDate).format();
    }
    if (data && data.notifiedEndDate) {
      formData.notifiedEndDate = moment(data.notifiedEndDate).format();
    }

    // await commonService.downloadFile(url, "FoldersReport.xlsx", formData);
  }
}

const adminFolderManagementSrv = new AdminFolderManagementService();
export default adminFolderManagementSrv;
