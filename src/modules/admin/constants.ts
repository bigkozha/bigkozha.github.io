import { OptionProps } from "antd/lib/select";

export const SliderMenuKeys = {
  UserManagement: "1",
  FolderManagement: "2",
};

export const AllYesNoSelectOptions: OptionProps[] = [
  {
    value: 0,
    title: "All",
    children: undefined,
  },
  {
    value: 1,
    title: "Yes",
    children: undefined,
  },

  {
    value: -1,
    title: "No",
    children: undefined,
  },
];

export const BooleanSelect = [
  {
    text: "Yes",
    value: true,
  },
  {
    text: "No",
    value: false,
  },
];

export const PageSizeOptions: string[] = ["10", "20", "30"];
