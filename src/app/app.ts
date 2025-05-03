export interface IFormField {
    label: string;
    f_Name: string;
    f_Type: string;
    f_Value: string;
    placeholder: string;
    values: IDropdown[]; // To fill dropdown values
}
export interface IDropdown {
    displayValue: string;
    internalValue: string;
}
export interface IUser {
    userName: string;
}