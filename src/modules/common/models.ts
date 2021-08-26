export interface AdUser {
  nk: string;
  fullName: string;
  position: string;
}

export interface CustomResponse<T> {
  success: boolean;
  data: T;
}

export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationObj<T> = {
  dirty?: boolean;
  name?: string;
  touched?: boolean;
  validating?: false;
  errors?: ValidationError[];
  value: T;
};

export interface DataItem {
  id: string | number;
  title?: string;
  name?: string;
}

export interface DataItemExt extends DataItem {
  code: string;
}

export interface Employee {
  id: string;
  fullName: string;
  nk: string;
  position: string;
  department: string;
}

export interface MoaPosition {
  id: string;
  positionId: string;
  positionTitle: string;
  departmentName: string;
  isActive: boolean;
  nLevel: string;
  isNew: boolean;

  [prop: string]: any;
}

export interface PageData<T> {
  count: number;
  data: T[];
}

export interface UserInfo {
  DisplayName: string;
  Email: string;
  FirstName: string;
  Initials: string;
  LastName: string;
  Roles: string[];
  sub: string; // nk
}

export interface FilterDto {
  pageNumber: number;
  countPerPage: number;
}
