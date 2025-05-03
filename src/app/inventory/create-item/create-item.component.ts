import { Component, OnInit, Inject, ViewChildren } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AddCategoryComponent } from "../add-category/add-category.component";
// import { AddCategoryComponent } from "../../AssetsManagement/add-category/add-category.component";
import { IFormField, IDropdown, IUser } from "../../app";

@Component({
  selector: "app-create-item",
  templateUrl: "./create-item.component.html",
  styleUrls: ["./create-item.component.css"],
})
export class CreateItemComponent implements OnInit {
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
  FieldFetch: any;
  AddedField: number;
  sampleform: FormGroup;
  controlform: any;
  lstForm: any;
  appService: any;
  Type: any = "Add";
  currentUrl: any;

  QuantityValue: any = [];
  ItemDetails: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.sampleform = this.formBuilder.group({});

    this.Category = this.activatedRoute.snapshot.paramMap.get("category");
    this.Item = this.activatedRoute.snapshot.paramMap.get("item");

    this.currentUrl = this.router.url;
    const segments = this.currentUrl.split("/");
    const action = segments[2];
    if (action == "Edit-Item") {
      this.Type = "Edit";
    }

    this.assetUserform = this.formBuilder.group({
      // Category: ["", Validators.required],
      ItemName: ["", Validators.required],
      ModelName: ["", Validators.required],
      Remarks: ["", Validators.required],
      // Quantity: ["", Validators.required],
      Purchase_Date: ["", Validators.required],
      SerialNo: ["", Validators.required],
      Purchase_Price: ["", Validators.required],
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
    this.FieldFatch(this.Category);
    // this.FilterItem();
  }

  CategoryAdd(type: any) {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: "60%",
      height: "80%",
      disableClose: true,
      data: { Id: type },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.FilterCategory();
      // this.SearchBtn();
    });
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

  FieldFatch(item) {
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("Category", this.Category);
    formData.append("Item", this.Item);
    formData.append("Type", this.Type);

    this.api.HttpPostType("Inventory/FieldFatch", formData).then(
      (result) => {
        // this.api.HideLoading();
        if (result["Status"] == true) {
          this.FieldFetch = result["Data"];
          this.ItemDetails = result["OtherDetails"];

          if (this.Type == "Edit") {
            this.assetUserform.patchValue(this.ItemDetails);
          }

          //   //   //   console.log(this.ItemDetails);

          this.formValidation();

          // this.EditItem();
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

  EditItem() {
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("Category", this.Category);
    formData.append("ItemId", this.Item);

    this.api.HttpPostType("Inventory/EditItem", formData).then(
      (result) => {
        // this.api.HideLoading();
        if (result["Status"] == true) {
          // this.FieldFetch = result["Data"];

          // this.formValidation();

          this.EditItem();
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
  // AddField(): FormArray {
  //   return this.assetUserform.get("AddField") as FormArray;
  // }

  // NewAddedField(): FormGroup {
  //   return this.formBuilder.group({

  //   });
  // }

  // AddMoreField() {
  //   this.AddedField = +this.AddedField + +1;

  //   if (this.AddedField <= 3) {
  //     this.AddField().push(this.NewAddedField());
  //     // console.log(this.NewAddedField());
  //   }
  //   // console.log(this.AddedField);
  // }

  //===== ON OPTION SELECT =====//
  onItemSelect(item: any, Type: any) {
    //Lob
    var item = item.Id;
    // // console.log(item.Id);
    if (Type == "Category") {
      this.FieldFatch(item);
    }
  }

  //===== ON OPTION DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    //Vertical
    if (Type == "Category") {
      // this.FieldFatch(item);
      this.FieldFatch("OneByOneDeSelect");
    }
  }

  onSubmitControl() {
    if (this.controlform.value.valueType == "text") {
      let _un = <IFormField>{
        label: this.controlform.value.labelname,
        f_Name: this.controlform.value.typename,
        f_Type: this.controlform.value.valueType,
        f_Value: this.controlform.value.typename,
      };
      this.lstForm.push(_un);
    }
    if (this.controlform.value.valueType == "dropdown") {
      let stateList = this.appService.getList(); // Get test list from service
      let _ddlStateList = <IFormField>{
        label: this.controlform.value.labelname,
        f_Name: this.controlform.value.typename,
        f_Type: this.controlform.value.valueType == "dropdown" ? "select" : "",
        f_Value: "0",
        values: stateList,
      };
      this.lstForm.push(_ddlStateList);
    }
    if (this.controlform.value.valueType == "radio") {
      let _radio = <IFormField>{
        label: this.controlform.value.labelname,
        f_Name: this.controlform.value.typename,
        f_Type: this.controlform.value.valueType,
        f_Value: this.controlform.value.typename,
      };
      this.lstForm.push(_radio);
    }
    if (this.controlform.value.valueType == "datepicker") {
      let _radio = <IFormField>{
        label: this.controlform.value.labelname,
        f_Name: this.controlform.value.typename,
        f_Type: this.controlform.value.valueType == "datepicker" ? "date" : "",
        f_Value: this.controlform.value.typename,
      };
      this.lstForm.push(_radio);
    }
    this.formValidation();
  }

  formValidation() {
    const group: any = {};

    for (const field of this.FieldFetch) {
      let defaultValue =
        this.Type === "Edit" ? field.FieldSetValue : field.FieldVal || "";

      if (field.FieldType == "text") {
        group[field.Name] = new FormControl(defaultValue, [
          Validators.required,
        ]);
      } else if (field.FieldType.toLowerCase().indexOf("email") > -1) {
        group[field.Name] = new FormControl(defaultValue, [
          Validators.required,
          Validators.pattern(
            "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$"
          ),
        ]);
      } else if (field.FieldType == "list") {
        group[field.Name] = new FormControl(defaultValue, Validators.required);
      } else if (field.FieldType == "date") {
        group[field.Name] = new FormControl(defaultValue, [
          Validators.required,
        ]);
      }
    }

    this.sampleform = new FormGroup(group);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.assetUserform.invalid) {
      return;
    } else {
      var fielassetUserformds = this.assetUserform.value;
      var sampleform = this.sampleform.value;
      const formData = new FormData();
      formData.append("login_type", this.api.GetUserType());

      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("Category", this.Category);
      formData.append("Item", this.Item);
      formData.append("Type", this.Type);
      formData.append(
        "ItemName",
        JSON.stringify(fielassetUserformds["ItemName"])
      );
      formData.append(
        "ModelName",
        JSON.stringify(fielassetUserformds["ModelName"])
      );
      formData.append("Remarks", fielassetUserformds["Remarks"]);
      formData.append("Quantity", "1");
      formData.append("Fields", JSON.stringify(sampleform));
      formData.append("Purchase_Date", fielassetUserformds["Purchase_Date"]);
      formData.append("SerialNo", fielassetUserformds["SerialNo"]);
      formData.append("Purchase_Price", fielassetUserformds["Purchase_Price"]);

      // console.log(fielassetUserformds);
      // console.log(sampleform);

      this.api.IsLoading();
      this.api.HttpPostType("Inventory/AddItem", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["Status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.sampleform.reset();
            this.router.navigate(["Inventory/View-item"]);
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
