import moment from "moment";
import { FilterDto } from "../common/models";

export interface AdminFolderFilterForm extends FilterDto {
  nk?: string;
  folder?: string;
  isActive: number;
  hasOwner: number;
  validationStartDate?: moment.Moment;
  validationEndDate?: moment.Moment;
  notifiedStartDate?: moment.Moment;
  notifiedEndDate?: moment.Moment;
  root?: string;
}

export interface AdminRequestFilterForm extends FilterDto {
  statusCode?: string;
  requestNumber?: string;
  employeeNameOrNk?: string;
  folderPathOrName?: string;
  createdStartDate?: moment.Moment;
  createdEndDate?: moment.Moment;
  requestorNk?: string;
}

export interface MyRequestFilterForm extends FilterDto {
  statusCode?: string[];
  requestNumber?: string;
  employeeNameOrNk?: string;
  folderPathOrName?: string;
}

export interface AdminFolderOwnerViewModel {
  id: string;
  nk: string;
  firstName: string;
  lastName: string;
}

export interface AdminFolderViewModel {
  id: string;
  folderName: string;
  folderPath: string;
  securityGroupName: string;
  isActive: boolean;
  lastValidationDate?: moment.Moment;
  notifiedDate?: moment.Moment;
  folderOwners: AdminFolderOwnerViewModel[];
}

export interface AddFolderOwnerForm {
  folderId: string;
  nk: string;
}

export interface FolderStructure {
  id: string;
  folderName: string;
  path: string;
  level: number;
  hasSecurityGroup: boolean;
  children: FolderStructure[] | undefined;
}
