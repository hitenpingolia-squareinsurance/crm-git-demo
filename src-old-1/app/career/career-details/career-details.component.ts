
import { FormGroup, FormBuilder, Validators, FormControl, } from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { MatDialogRef, MAT_DIALOG_DATA, } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: 'app-career-details',
  templateUrl: './career-details.component.html',
  styleUrls: ['./career-details.component.css']
})
export class CareerDetailsComponent implements OnInit {
  UpdateFollowForm: FormGroup;
  isSubmitted = false;
  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  Follow_Up: { Id: string; Name: string }[];
  type: any;
  id: any;
  id_lob: any;
  dataArr: any;
  minDisableDate: any;
  Follow_UpName: any;
  url: string;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CareerDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = this.data.type;
    this.id_lob = this.data.id;
    this.UpdateFollowForm = this.formBuilder.group({
      Follow_Up: ["", Validators.required],
      Dates: ["", Validators.required],
      Remarks: ["", Validators.required],
      Times: [""],
      // Times: ["", Validators.required],
    });
    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.Follow_Up = [
      { Id: "Follow Up", Name: "Follow Up" },
      { Id: "Selected", Name: "Selected" },
      { Id: "Don`t Selected", Name: "Don't Selected" },
    ];
  }
  ngOnInit() {
      this.getValue();
    
  }
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
  getValue() {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("id", this.id_lob);
    formData.append("type", this.type);
    this.api.IsLoading();
    this.api.HttpPostType("WebsiteSection/GetAddFollowUp", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.dataArr = result["data"];
          console.log(this.dataArr);
        } else {
          const msg = "msg";
          // this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        // this.api.Toast( newLocal,"Network Error : " + err.name + "(" + err.statusText + ")");
      }
    );
  }

  get formControls() {
    return this.UpdateFollowForm.controls;
  }
  submit() {
    this.isSubmitted = true;
    if (this.UpdateFollowForm.invalid) {
      return;
    } else {
      var fields = this.UpdateFollowForm.value;
      const formData = new FormData();
      formData.append("Date", fields["Dates"]);
      formData.append("Remark", fields["Remarks"]);
      formData.append("time", fields["Times"]);
      formData.append("id", this.id_lob);
      formData.append("Follow_Up", JSON.stringify(fields["Follow_Up"]));
      this.api.IsLoading();
      this.url = "WebsiteSection/AddFollowUp";
      this.api.HttpPostType(this.url, formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            // this.CloseModel();
            this.getValue();
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
  }

}
