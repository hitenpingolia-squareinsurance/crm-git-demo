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
import { CKEditorComponent } from "ckeditor4-angular";

@Component({
  selector: "app-addpossocialleads",
  templateUrl: "./addpossocialleads.component.html",
  styleUrls: ["./addpossocialleads.component.css"],
})
export class AddpossocialleadsComponent implements OnInit {
  socialleadform: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;

  State: any;
  City: any;

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

  ItemLOBSelection: any;

  // item: any;

  // State: any = [];
  // City: any = [];

  // Item: { Id: string; Name: string }[];
  // Category: { Id: string; Name: string }[];

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddpossocialleadsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.socialleadform = this.formBuilder.group({
      platform: ["", Validators.required],
      name: ["", Validators.required],
      email: ["", Validators.required],
      mobile: ["", Validators.required],
      state: ["", Validators.required],
      city: ["", Validators.required],
      pincode: ["", Validators.required],
      remark: ["", Validators.required],
    });

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
  }

  ngOnInit() {
    this.FilterState();
    // this.FilterItem();
  }

  get formControls() {
    return this.socialleadform.controls;
  }

  FilterState() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "UserAgent/FilterState?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.State = result["Data"];
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  FilterCity(e) {
    // // console.log(e);
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "UserAgent/FilterCity?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&State=" +
          e.Id
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            // this.Category.Id;
            this.City = result["Data"];
            // console.log(this.City);
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  submit() {
    this.isSubmitted = true;
    if (this.socialleadform.invalid) {
      return;
    } else {
      var fields = this.socialleadform.value;
      const formData = new FormData();

      formData.append("login_type", this.api.GetUserType());

      formData.append("login_id", this.api.GetUserData("Id"));

      formData.append("platform", fields["platform"]);
      formData.append("name", fields["name"]);
      formData.append("email", fields["email"]);
      formData.append("mobile", fields["mobile"]);
      formData.append("pincode", fields["pincode"]);
      formData.append("remark", fields["remark"]);
      formData.append("state", fields["state"][0]["Id"]);
      formData.append("city", fields["city"][0]["Id"]);

      // console.log(fields);

      this.api.IsLoading();
      this.api.HttpPostType("UserAgent/SubmitPosLeads", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
            // this.router.navigate(["assest-manegment/view-assest-manegment"]);
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );

          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }

  //===== ON OPTION SELECT =====//
  onItemSelect(item: any, Type: any) {
    //Lob
    var city = item.Id;
    // // console.log(item.Id);
    if (Type == "State") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.FilterCity(item);
    }
  }

  //===== ON OPTION DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    //Vertical
    if (Type == "State") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.FilterCity("OneByOneDeSelect");
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
