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
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.css"],
})
export class EditComponent implements OnInit {
  PosEditForm: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;

  ActionType: any = "";
  gender: any = "";
  qualification: any = "";
  accounttype: any = "";

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

  SubProducts: { Id: number; Name: string }[];

  productvalue: any;
  id: any;
  type: any;
  dataArr: any;
  url: string;
  company: any[];
  product: any;
  sub_product: any;
  types: any;
  City: any;
  State: any;
  Bank: any[];

  StateName: any[];
  Gen: any;
  Qualify: any;
  gend: { Id: string; Name: string }[];
  banks: any;
  Account: any;
  cities: any;
  Citis: any[];
  Citi: any;

  // City:any[];

  // patchVallue: any;

  // rcfront: File;
  // mandate: File;
  // proposalform: File;
  // kyc: File;
  // rcback: File;
  // gst: File;
  // insurance: File;
  // others: File;
  // document: any;

  // showForm1: any = 0;
  // showForm2: any = 0;
  // showForm3: any = 0;
  // SingleSrLogData: any;
  // financialYearVal: { Id: string; Name: string; }[];

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.id;

    // console.log(this.id);

    this.PosEditForm = this.formBuilder.group({
      fullname: [""],
      email: [""],
      mobile: [""],
      gender: [""],
      dob: [""],
      password: [""],
      qualification: [""],
      pancard: [""],
      aadharno: [""],
      additionalmobileno: [""],

      address1: [""],
      address2: [""],
      address3: [""],
      state: [""],
      city: [""],
      pincode: [""],

      bank: [""],
      branch: [""],
      accounttype: [""],
      accountno: [""],
      ifsc: [""],
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

    this.gender = [
      { Id: "Male", Name: "Male" },
      { Id: "Female", Name: "Female" },
    ];

    this.qualification = [
      { Id: "10 Pass", Name: "10 Pass" },
      { Id: "12 Pass", Name: "12 Pass" },
      { Id: "Graduation", Name: "Graduation" },
      { Id: "Post Graduation", Name: "Post Graduation" },
    ];

    // this.accounttype = [
    //   { Id: "Saving Account", Name: "Saving Account" },
    //   { Id: "Current Account", Name: "Current Account" },
    // ];
  }

  ngOnInit() {
    this.getValueEdit();

    this.FilterState();
    this.FilterBank();
    this.FilterAccountType();
  }

  FilterBank() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "UserAgent/FilterBank?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.Bank = result["Data"];
            // // console.log(this.Bank);
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

  FilterAccountType() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "UserAgent/FilterAccountType?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.accounttype = result["Data"];
            // // console.log(this.Bank);
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

  getValueEdit() {
    // console.log(this.id);
    // // console.log(this.type);

    //  var fields = this.loginform.value;
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", this.id);

    this.api.IsLoading();
    this.api.HttpPostType("UserAgent/PosDetails", formData).then(
      (result) => {
        this.api.HideLoading();

        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = result["data"];

          // this.company = result["company"];

          this.StateName = result["StateName"];

          this.banks = result["Bank"];

          this.Gen = result["Gender"];

          this.Qualify = result["Qualification"];

          this.Account = result["AccountType"];

          this.Citis = result["City"];

          // // console.log(this.Citis);]

          this.PosEditForm.patchValue(this.dataArr);
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

  get formControls() {
    return this.PosEditForm.controls;
  }

  submit() {
    // // console.log(this.id);

    // alert();

    this.isSubmitted = true;
    if (this.PosEditForm.invalid) {
      return;
    } else {
      var fields = this.PosEditForm.value;
      // console.log(fields);

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("id", this.id);

      formData.append("fullname", fields["fullname"]);
      formData.append("email", fields["email"]);
      formData.append("mobile", fields["mobile"]);
      formData.append("gender", fields["gender"][0]["Id"]);
      formData.append("dob", fields["dob"]);
      formData.append("qualification", fields["qualification"][0]["Id"]);
      formData.append("pancard", fields["pancard"]);
      formData.append("password", fields["password"]);

      formData.append("additionalmobileno", fields["additionalmobileno"]);
      formData.append("aadharno", fields["aadharno"]);

      formData.append("address1", fields["address1"]);
      formData.append("address2", fields["address2"]);
      formData.append("address3", fields["address3"]);
      formData.append("state", fields["state"][0]["Id"]);
      formData.append("city", fields["city"][0]["Id"]);
      formData.append("pincode", fields["pincode"]);
      formData.append("bank", fields["bank"][0]["Id"]);
      formData.append("branch", fields["branch"]);
      formData.append("accounttype", fields["accounttype"][0]["Id"]);
      formData.append("accountno", fields["accountno"]);
      formData.append("ifsc", fields["ifsc"]);

      // console.log(fields);

      // // console.log('formData');
      this.api.IsLoading();
      this.api.HttpPostType("UserAgent/UpdatePosDetails", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();

            // this.router.navigate(["Mypos/View-Docs"]);
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

  onItemSelect(item: any, Type: any) {
    //Lob
    var city = item.Id;
    // // console.log(item.Id);
    if (Type == "State") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.FilterCity(item);
    }
    if (this.getValueEdit) {
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

    if (this.getValueEdit) {
      this.FilterCity(item);
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
