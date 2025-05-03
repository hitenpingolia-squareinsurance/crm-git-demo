// import {
//   FormGroup,
//   FormBuilder,
//   Validators,
//   FormControl,
// } from "@angular/forms";
// import { Component, Inject, OnInit, ViewChild } from "@angular/core";
// import { ApiService } from "../../providers/api.service";
// import { Router, ActivatedRoute } from "@angular/router";

// import {
//   MatDialog,
//   MatDialogConfig,
//   MatDialogRef,
//   MAT_DIALOG_DATA,
// } from "@angular/material/dialog";

// @Component({
//   selector: 'app-add-excel-leada',
//   templateUrl: './add-excel-leada.component.html',
//   styleUrls: ['./add-excel-leada.component.css']
// })
// export class AddExcelLeadaComponent implements OnInit {

//   AddLeads: FormGroup;
//   isSubmitted = false;
//   selectedFile: File;

//   constructor(
//     private api: ApiService,
//     private router: Router,
//     private formBuilder: FormBuilder,
//     public dialogRef: MatDialogRef<AddExcelLeadaComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any
//   ) {
//     this.AddLeads = this.formBuilder.group({
//       file: ["", Validators.required],
//     });
//   }

//   ngOnInit() {}

//   get formControls() {
//     return this.AddLeads.controls;
//   }

//   onFileSelect(event) {
//     const file = event.target.files[0];
//     const fileExtension = file.name.split('.').pop().toLowerCase();

//     if (fileExtension === 'csv' || fileExtension === 'xlsx') {
//       const fileSizeInMB = file.size / (1024 * 1024);
//       if (fileSizeInMB > 2) {
//         this.api.Toast("Warning", "File size is greater than 2 MB");
//         this.AddLeads.get("file").setValue("");
//       } else {
//         this.selectedFile = file;
//         this.AddLeads.get("file").setValue(file.name);
//       }
//     } else {
//       this.api.Toast("Warning", "Please choose a valid file! Example: .csv or .xlsx");
//       this.AddLeads.get("file").setValue("");
//     }
//   }

//   submit() {
//     this.isSubmitted = true;
//     if (this.AddLeads.invalid) {
//       return;
//     } else {
//       const formData = new FormData();
//       formData.append("user_id", this.api.GetUserData("Id"));
//       formData.append("user_type", this.api.GetUserType());
//       formData.append("file", this.selectedFile);

//       this.api.IsLoading();
//       this.api.HttpPostTypeBms("/lms/LmsManagerRelated/addContacts", formData).then(
//         (result) => {
//           this.api.HideLoading();
//           if (result["status"] == 1) {
//             this.api.Toast("Success", result["msg"]);
//             this.closeModel();
//           } else {
//             this.api.Toast("Warning", result["msg"]);
//           }
//         },
//         (err) => {
//           this.api.HideLoading();
//           this.api.Toast("Warning", "Network Error: " + err.name + " (" + err.statusText + ")");
//         }
//       );
//     }
//   }

//   closeModel(): void {
//     this.dialogRef.close({ Status: "Model Close" });
//   }
// }

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "app-add-excel-leada",
  templateUrl: "./add-excel-leada.component.html",
  styleUrls: ["./add-excel-leada.component.css"],
})
export class AddExcelLeadaComponent implements OnInit {
  Addvertical: FormGroup;
  isSubmitted = false;

  dropdownSettingsTypeSingle: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  verticalSelectArr: any;
  verticalManagerArr: any;
  EmployeeArr: any;
  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddExcelLeadaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dropdownSettingsTypeSingle = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.dropdownSettingsType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };
    this.Addvertical = this.formBuilder.group({
      verticalSelect: [""],
      verticalName: [""],
      verticalManager: ["", Validators.required],
      Employee: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.GetEmployee();
    this.GetAddvertical();
  }

  get formControls() {
    return this.Addvertical.controls;
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.Addvertical.invalid) {
      return;
    } else {
      var fields = this.Addvertical.value;
      const formData = new FormData();
      formData.append("verticalName", fields["verticalName"]);
      formData.append(
        "verticalSelect",
        JSON.stringify(fields["verticalSelect"])
      );
      formData.append(
        "verticalManager",
        JSON.stringify(fields["verticalManager"])
      );
      formData.append("Employee", JSON.stringify(fields["Employee"]));

      this.api.IsLoading();
      this.api.HttpPostType("LmsReport/verticalSubmit", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
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
  }

  GetEmployee() {
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    this.api
      .HttpPostType("/LmsReport/GetEmployeeDataReports", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.EmployeeArr = result["Data"];
          this.verticalManagerArr = result["Data"];
        }
      });
  }

  GetAddvertical() {
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");

    this.api
      .HttpPostType("/LmsReport/GetAddvertical", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.verticalSelectArr = result["Data"];
        }
      });
  }

  CloseModel(): void {
    this.dialogRef.close({ Status: "Model Close" });
  }
  onverticalSelectSelect(): void {
    var fields = this.Addvertical.value;

    if (fields["verticalSelect"] != "") {
      const formData = new FormData();
      //   //   //   console.log(fields["verticalSelect"]);
      formData.append(
        "verticalSelect",
        JSON.stringify(fields["verticalSelect"])
      );
      formData.append("user_code", this.api.GetUserData("Code"));
      formData.append("portal", "crm");
      this.api
        .HttpPostType("/LmsReport/GetVerticalData", formData)
        .then((result: any) => {
          if (result["status"] == true) {
            // this.myForm.patchValue({
            this.Addvertical.patchValue({
              verticalName: result["Data"]["VerticalName"],
              Employee: result["Data"]["Employees"],
              verticalManager: result["Data"]["ManageEmployees"],
            });
          }
        });
    }
  }
}
