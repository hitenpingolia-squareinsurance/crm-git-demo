import { Component, OnInit, Inject, ViewChildren } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
// import { AddCategoryComponent } from "../../AssetsManagement/add-category/add-category.component";

@Component({
  selector: "app-create-assest",
  templateUrl: "./create-assest.component.html",
  styleUrls: ["./create-assest.component.css"],
})
export class CreateAssestComponent implements OnInit {
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

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.assetUserform = this.formBuilder.group({
      Category: ["", Validators.required],
      Item: ["", Validators.required],
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
    // this.FilterItem();
  }

  CategoryAdd(type: any) {
    // const dialogRef = this.dialog.open(AddCategoryComponent, {
    //   width: "80%",
    //   height: "70%",
    //   disableClose: true,
    //   data: { Id: type },
    // });
    // dialogRef.afterClosed().subscribe((result:any) => {
    //   // console.log(result);
    //   this.FilterCategory();
    //   // this.SearchBtn();
    // });
  }

  get formControls() {
    return this.assetUserform.controls;
  }

  FilterCategory() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "AssetsManagement/FilterCategory?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
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

  FilterItem(e) {
    // // console.log(e);
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "AssetsManagement/FilterItem?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Category=" +
          e
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            // this.Category.Id;
            this.Item = result["Data"];
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
      formData.append("Item", JSON.stringify(fields["Item"]));
      formData.append("remarks", fields["remarks"]);

      // console.log(fields);

      this.api.IsLoading();
      this.api.HttpPostType("Maneger/Submit", formData).then(
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

  //===== ON OPTION SELECT =====//
  onItemSelect(item: any, Type: any) {
    //Lob
    var item = item.Id;
    // // console.log(item.Id);
    if (Type == "Category") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.FilterItem(item);
    }
  }

  //===== ON OPTION DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    //Vertical
    if (Type == "Category") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.FilterItem("OneByOneDeSelect");
    }
  }
}
