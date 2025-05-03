import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";

@Component({
  selector: "app-rights-form-popup",
  templateUrl: "./rights-form-popup.component.html",
  styleUrls: ["./rights-form-popup.component.css"],
})
export class RightsFormPopupComponent implements OnInit {
  public data: any;
  menu_type: any;
  ImageForm: FormGroup;
  UserRightForm: FormGroup;
  opction_data: any;
  regional: any;
  Right_Menu_data: any;
  Right_SubMenu_data: any;
  selected_data_id: any;
  UserId: any;
  loginId: any;

  ServiceLocationData: any = [];
  ZoneData: any = [];
  RegionalData: any = [];
  BranchData: any = [];
  VerticalData: any = [];

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogRefData: any,
    public dialogRef: MatDialogRef<RightsFormPopupComponent>,
    private api: ApiService,
    private fb: FormBuilder
  ) {
    this.GetEmployeeMasters();

    this.dropdownSettingsType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.loginId = this.api.GetUserData("Id");
    this.data = dialogRefData;
    this.menu_type = this.data["page_type"];

    if (this.menu_type == "User_Right") {
      this.loginId = this.data["Id"];
    }
  }

  ngOnInit() {
    console.log(this.data["page_type"]);

    if (this.menu_type == "sub_menu" || this.menu_type == "many_sub_menu") {
      this.ImageForm = this.fb.group({
        name: ["", Validators.required],
        url: ["", Validators.required],
        selectBox: ["", Validators.required],
        selectedRegional: ["", Validators.required],
      });
    } else {
      this.ImageForm = this.fb.group({
        name: ["", Validators.required],
        url: ["", Validators.required],
        selectBox: ["", Validators.required],
        Icon: [""],
      });
    }
    this.Right_SubMenu_data = "";

    if (this.menu_type == "sub_menu" || this.menu_type == "many_sub_menu") {
      this.regional_office();
    }

    if (this.menu_type == "User_Right") {
      const formData = new FormData();
      formData.append("menu_type", this.menu_type);
      formData.append("EmployeeId", this.loginId);

      this.api.IsLoading();
      this.api.HttpPostType("Rights_management/User_Right_Menu", formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.Right_Menu_data = result["data"];
            this.UserRightForm = this.fb.group({});
            console.log(this.UserRightForm);

            this.createForm(this.Right_Menu_data, this.UserRightForm);
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    }
    this.right_chack();
  }

  // createForm(menuItems: any[], formGroup: FormGroup) {
  //   menuItems.forEach(item => {
  //     const formControl = new FormControl();
  //     formGroup.addControl(item.Id, formControl);

  //     ['Right'].forEach(value => {
  //       const radioControl = new FormControl();
  //       formGroup.addControl(`${item.Id}_${value}`, radioControl);
  //     });

  //     if (item.TotalSubMenu > 0) {
  //       this.createForm(item.SubMenu, formGroup);
  //     }
  //   });
  // }

  // createForm(menuItems: any[], formGroup: FormGroup) {
  //   menuItems.forEach(item => {
  //     const formControl = new FormControl();
  //     formGroup.addControl(item.Id, formControl);

  //     ['Right', 'Manager'].forEach(value => {
  //       const radioControl = new FormControl();
  //       formGroup.addControl(`${item.Id}_${value}`, radioControl);
  //     });

  //     // Set values for the controls
  //     const formControlItem = formGroup.get(item.Id);
  //     if (formControlItem) {
  //       formControlItem.setValue(item.menu_checked);
  //     }

  //     ['Right'].forEach(value => {
  //       const controlName = `${item.Id}_${value}`;
  //       const radioControlItem = formGroup.get(controlName);
  //       if (radioControlItem) {
  //         radioControlItem.setValue(item.Rigth_Checked);
  //       }
  //     });

  //     if (item.TotalSubMenu > 0) {
  //       this.createForm(item.SubMenu, formGroup);
  //     }
  //   });
  // }

  createForm(menuItems: any[], formGroup: FormGroup) {
    menuItems.forEach((item) => {
      const formControl = new FormControl();

      formGroup.addControl(item.Id, formControl);

      ["Right", "Manager"].forEach((value) => {
        const radioControl = new FormControl();
        formGroup.addControl(`${item.Id}_${value}`, radioControl);
      });

      ["UserRights"].forEach((value) => {
        if (item.RightsValue && item.RightsValue.length > 0) {
          item.RightsValue.forEach((rightsItem, index) => {
            const radioControl = new FormControl();

            const managerZoneControl = new FormControl();
            const managerRegionalControl = new FormControl();
            const managerBranchControl = new FormControl();
            const managerServiceLocationControl = new FormControl();
            const managerVerticalControl = new FormControl();

            formGroup.addControl(`${rightsItem.id}_${value}`, radioControl);

            if (rightsItem.report == 1) {
              formGroup.addControl(
                `${rightsItem.id}_ManagerZoneDataRights`,
                managerZoneControl
              );
            } else if (rightsItem.report == 2) {
              formGroup.addControl(
                `${rightsItem.id}_ManagerRegionalDataRights`,
                managerRegionalControl
              );
            } else if (rightsItem.report == 3) {
              formGroup.addControl(
                `${rightsItem.id}_ManagerBranchDataRights`,
                managerBranchControl
              );
            } else if (rightsItem.report == 4) {
              formGroup.addControl(
                `${rightsItem.id}_ManagerServiceLocationDataRights`,
                managerServiceLocationControl
              );
            } else if (rightsItem.report == 5) {
              formGroup.addControl(
                `${rightsItem.id}_ManagerVerticalDataRights`,
                managerVerticalControl
              );
            }

            if (rightsItem.Checked == "Checked") {
              radioControl.setValue(rightsItem.name);

              // if (rightsItem.report == 1) {
              //   managerZoneControl.setValue(rightsItem.name);
              // } else if (rightsItem.report == 2) {
              //   managerRegionalControl.setValue(rightsItem.name);
              // } else if (rightsItem.report == 3) {
              //   managerBranchControl.setValue(rightsItem.name);
              // } else if (rightsItem.report == 4) {
              //   managerServiceLocationControl.setValue(rightsItem.name);
              // } else if (rightsItem.report == 5) {
              //   managerVerticalControl.setValue(rightsItem.name);
              // }
              // console.log(rightsItem);
            }
          });
        }
      });

      // Set values for the controls
      const formControlItem = formGroup.get(item.Id);
      if (formControlItem) {
        formControlItem.setValue(item.menu_checked);
      }

      ["Right", "Manager"].forEach((value) => {
        const controlName = `${item.Id}_${value}`;
        const radioControlItem = formGroup.get(controlName);
        if (radioControlItem) {
          if (value == "Right") {
            radioControlItem.setValue(item.Rigth_Checked);
          } else if (value == "Manager") {
            radioControlItem.setValue(item.manager_report);
          }
        }

        // console.log(value);
      });

      if (item.TotalSubMenu > 0) {
        this.createForm(item.SubMenu, formGroup);
      }
    });
  }

  rights_menu_submit() {
    const formDatas = this.UserRightForm.value;

    console.log("Form submitted successfully!");
    const formData = new FormData();

    formData.append("form_data", JSON.stringify(formDatas));
    formData.append("EmployeeId", this.loginId);

    this.api.IsLoading();
    this.api.HttpPostType("Rights_management/Rights_menu_data", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == "success") {
          this.api.Toast("Success", result["message"]);
          this.CloseModel();
        } else {
          this.api.Toast("Warning", result["message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  submitFormImage() {
    if (this.ImageForm.valid) {
      console.log("Form submitted successfully!");
      const formData = new FormData();
      formData.append("menu_name", this.ImageForm.get("name").value);
      formData.append("selectBox", this.ImageForm.get("selectBox").value);
      formData.append("url", this.ImageForm.get("url").value);

      formData.append("menu_type", this.menu_type);
      if (this.menu_type == "sub_menu" || this.menu_type == "many_sub_menu") {
        formData.append(
          "selectedRegional",
          this.ImageForm.get("selectedRegional").value
        );
      } else {
        formData.append("Icon", this.ImageForm.get("Icon").value);
      }

      this.api.IsLoading();
      this.api.HttpPostType("Rights_management/GetFetchDetails", formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == "success") {
            this.api.Toast("Success", result["message"]);
            this.CloseModel();
          } else {
            this.api.Toast("Warning", result["message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    } else {
      console.log("Form validation failed!");
    }
  }

  regional_office() {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("menu_type", this.menu_type);
    this.api.IsLoading();
    this.api
      .HttpPostType("Rights_management/get_regional_office", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.regional = result["Data"];
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  // ClickMenu(Routess: any) {
  //   this.api.IsLoading();
  //   this.router.navigateByUrl("/" + Routess);
  //   this.api.HideLoading();
  // }

  User_Right_Menu() {
    const formData = new FormData();
    formData.append("menu_type", this.menu_type);

    formData.append("EmployeeId", this.loginId);
    this.api.IsLoading();
    this.api.HttpPostType("Rights_management/User_Right_Menu", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.Right_Menu_data = result["data"];
          // console.log(this.Right_Menu_data);
        } else {
          const msg = "msg";
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  // User_Right_SubMenu(datattt: any) {
  //   this.selected_data_id = datattt;

  //   const selectedCheckboxes = this.UserRightForm.get('Menu_data').value;
  //   console.log('Selected checkboxes:', selectedCheckboxes);

  //   if (selectedCheckboxes == true) {
  //     const formData = new FormData();
  //     formData.append("Menu_data", this.selected_data_id);
  //     this.api.IsLoading();
  //     this.api.HttpPostType("Rights_management/User_Right_SubMenu", formData).then(
  //       (result: any) => {
  //         this.api.HideLoading();
  //         if (result["status"] == true) {
  //           this.Right_SubMenu_data = result['Data'];
  //         } else {
  //           const msg = "msg";
  //           this.api.Toast("Warning", result["msg"]);
  //         }
  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //         const newLocal = "Warning";
  //         this.api.Toast(
  //           newLocal,
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //       }
  //     );
  //   }
  // }

  User_Right_SubMenut(datattt: any) {
    this.selected_data_id = datattt;
    alert(this.selected_data_id);

    const selectedCheckboxes = this.UserRightForm.get("Menu_data").value;
    console.log("Selected checkboxes:", selectedCheckboxes);
  }

  right_chack() {
    const formData = new FormData();
    formData.append("url", "/business reports");
    this.api.IsLoading();

    this.api.HttpPostType("Rights_management/user_right_check", formData).then(
      (result: any) => {
        this.api.HideLoading();

        if (result["success"] == "true") {
          // this.api.Toast("Success", result["message"]);
          this.CloseModel();
        } else {
          // alert(121)
          // this.api.Toast("Warning", result["message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  GetEmployeeMasters() {
    const formData = new FormData();
    // formData.append("url", "/business reports");
    this.api.IsLoading();

    this.api
      .HttpPostType("Rights_management/GetEmployeeMasters", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();

          if (result["success"] == true) {
            this.ServiceLocationData = result["ServiceLocationData"];
            this.ZoneData = result["ZoneData"];
            this.RegionalData = result["RegionalData"];
            this.BranchData = result["BranchData"];
            this.VerticalData = result["VerticalData"];

            console.log(result);

            // this.api.Toast("Success", result["message"]);
            // this.CloseModel();
          } else {
            // alert(121)
            // this.api.Toast("Warning", result["message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }
}
