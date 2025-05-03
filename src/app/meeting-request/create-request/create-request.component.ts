import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-create-request",
  templateUrl: "./create-request.component.html",
  styleUrls: ["./create-request.component.css"],
})
export class CreateRequestComponent implements OnInit {
  request: FormGroup;
  isSubmitted = false;

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettingsMultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
    closeDropDownOnSelection: boolean;
    showSelectedItemsAtTop: boolean;
    defaultOpen: boolean;
    limitSelection: number;
  };

  dataArr: any;
  url: any;
  Menues: any[];

  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      limitSelection: 5,
    };

    this.request = this.formBuilder.group({
      meetingFor: ["", Validators.required],
      remarks: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.filterMenues();
  }

  filterMenues() {
    this.api
      .HttpGetType(
        "Meeting_request/FilterMenues?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          if (result["status"] == true) {
            this.Menues = result["Data"];
            //   //   //   console.log(this.Menues);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  get formControls() {
    return this.request.controls;
  }

  Submit() {
    // alert(this.Divshow);

    this.isSubmitted = true;

    if (this.request.invalid) {
      return;
    } else {
      var fields = this.request.value;
      const formData = new FormData();

      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      formData.append("meeting_topic", fields["meetingFor"][0]["Id"]);
      formData.append("remarks", fields["remarks"]);

      this.api.IsLoading();
      this.api.HttpPostType("Meeting_request/CreateRequest", formData).then(
        (result) => {
          this.api.HideLoading();

          //   //   //   console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.router.navigate(["meeting_request/view_request"]);
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
