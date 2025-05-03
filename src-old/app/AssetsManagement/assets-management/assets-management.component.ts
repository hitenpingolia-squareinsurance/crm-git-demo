import { Component, OnInit, Inject, ViewChildren } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-assets-management",
  templateUrl: "./assets-management.component.html",
  styleUrls: ["./assets-management.component.css"],
})
export class AssetsManagementComponent implements OnInit {
  assetUserform: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;
  Category: any;
  Item: any;

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
  item: any;

  // item: any = [];
  // Category: any = [];

  // Item: { Id: string; Name: string }[];
  // Category: { Id: string; Name: string }[];

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.assetUserform = this.formBuilder.group({
      Category: ["", Validators.required],
      remarks: ["", Validators.required],
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
    this.FilterCategory();
  }

  get formControls() {
    return this.assetUserform.controls;
  }

  FilterCategory() {
    // this.api.IsLoading();
    this.api
      .HttpGetType(
        "Inventory/GetCategory?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          // this.api.HideLoading();
          if (result["Status"] == true) {
            this.Category = result["Data"];
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
    if (this.assetUserform.invalid) {
      return;
    } else {
      var fields = this.assetUserform.value;
      const formData = new FormData();

      formData.append("login_type", this.api.GetUserType());

      formData.append("login_id", this.api.GetUserData("Id"));

      formData.append("Category", fields["Category"][0]["Id"]);
      // formData.append("Item", JSON.stringify(fields["Item"]) );
      formData.append("remarks", fields["remarks"]);

      // console.log(fields);

      this.api.IsLoading();
      this.api.HttpPostType("Assest/CreateRequest", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.router.navigate(["assest-manegment/view-assest-manegment"]);
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
}
