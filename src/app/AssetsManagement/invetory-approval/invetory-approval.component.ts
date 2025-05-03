import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { exit } from "process";
import { DataTableDirective } from "angular-datatables";

class ColumnsObj {
  SrNo: string;
  Id: string;
  type: string;
  CategoryName: string;
  ItemName: string;
  Quantity: string;
  Amount: string;
  totalamount: string;
  Add_stamp: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-invetory-approval",
  templateUrl: "./invetory-approval.component.html",
  styleUrls: ["./invetory-approval.component.css"],
})
export class InvetoryApprovalComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  id: any;
  Item: any;
  Category: any;
  inventoryform: FormGroup;

  isSubmitted = false;
  dataArr: any;
  type: any;
  loadAPI: Promise<any>;
  isShow = false;
  isShown = false;

  yes: any;
  no: any;

  value: any;
  event: any;

  status_check: any;
  dataArr2: any;
  statusData: any;
  void: any;
  key: string;
  valu: any;
  totalamount: number = 0;
  amount: void;
  currentUrl: string;
  router: any;
  dataArray: any;
  userid: void;

  Payment: any;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<InvetoryApprovalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.Id;
    this.status_check = this.data.status_check;

    this.inventoryform = this.formBuilder.group({
      quantity: [""],
      TotalAmount: [""],
      Amount: [""],
      itemname: [""],
      remark: [""],
      managerremark: ["", [Validators.required]],
      Payment: [],
      utrno: [],
      accremark: [],
    });
  }

  ngOnInit() {
    // // console.log(valu);
    // // console.log(this.value);
    // this.id = this.data.Id;
    // this.status_check = this.data.status_check;

    this.getdata();
    this.onSearchChange();
    this.FileType_Status();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  FileType_Status() {
    const utrno = this.inventoryform.get("utrno");
    const accremark = this.inventoryform.get("accremark");
    const managerremark = this.inventoryform.get("managerremark");

    this.inventoryform.get("Payment").valueChanges.subscribe((type) => {
      if (type == "cash") {
        utrno.setValidators(null);
        managerremark.setValidators(null);
        accremark.setValidators(Validators.required);

        //disable previous policy status new
      } else if (type == "online") {
        utrno.setValidators(Validators.required);
        managerremark.setValidators(null);
        accremark.setValidators(null);
      }

      utrno.updateValueAndValidity();
      accremark.updateValueAndValidity();
      managerremark.updateValueAndValidity();
    });
  }

  onSearchChange() {
    const amount = this.inventoryform.value["Amount"];

    const quantity = this.inventoryform.value["quantity"];

    this.totalamount = quantity * amount;

    // console.log( this.totalamount );

    this.inventoryform.get("TotalAmount").setValue(this.totalamount);
  }

  // get formControls() {
  //   return this.remarkform.controls;
  // }

  // submit() {
  //   this.isSubmitted = true;
  //   if (this.remarkform.invalid) {
  //     return;
  //   } else {

  //     var fields = this.remarkform.value;
  //     const formData = new FormData();

  //     formData.append("login_id", this.api.GetUserData("Id"));
  //     formData.append("login_type",  this.api.GetUserType());

  //     formData.append("id", this.id);
  //     formData.append("status_check", this.status_check);

  //     formData.append("quantities", JSON.stringify(fields["quantities"]));

  //     // console.log(fields);
  //     this.api.IsLoading();
  //     this.api.HttpPostType("AssetsManagement/Request", formData).then(
  //       (result) => {
  //         this.api.HideLoading();
  //         // console.log(result);
  //         if (result["status"] == 1) {
  //           this.api.Toast("Success", result["msg"]);
  //           this.CloseModel();
  //           // this.router.navigate(["Assets/Action"]);

  //         } else {
  //           const msg = "msg";
  //           //alert(result['message']);
  //           this.api.Toast("Warning", result["msg"]);
  //         }
  //       },
  //       (err) => {
  //         // Error log
  //         // // console.log(err);
  //         this.api.HideLoading();
  //         const newLocal = "Warning";
  //         this.api.Toast(
  //           newLocal,
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //         //this.api.ErrorMsg('Network Error :- ' + err.message);
  //       }
  //     );
  //   }

  // }

  get formControls() {
    return this.inventoryform.controls;
  }

  getdata() {
    // console.log(this.id);

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "AssetsManagement/ApprovalData?id=" +
          this.id +
          "&status_check=" +
          this.status_check +
          "&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          // this.dataArr = result["data"];
          // console.log(result);
          // // console.log(this.dataArr);

          if (result["status"] == 1) {
            this.dataArr = result["data"];
            // console.log(this.dataArr);

            this.userid = this.api.GetUserData("Id");

            // console.log(this.dataArr.Quantity);

            this.dataArr2 = this.dataArr.Quantity * this.dataArr.Amount;

            // console.log(this.dataArr2);

            this.inventoryform.patchValue({
              quantity: this.dataArr.Quantity,
              TotalAmount: this.dataArr2,
              Amount: this.dataArr.Amount,
              itemname: this.dataArr.ItemName,
              remark: this.dataArr.Remark,
            });
          } else {
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

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "AssetsManagement/Showinventory?id=" +
          this.id +
          "&status_check=" +
          this.status_check +
          "&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          // this.dataArr = result["data"];
          // console.log(result);
          // // console.log(this.dataArr);

          if (result["status"] == 1) {
            this.dataArray = result["data"];
            // console.log(this.dataArray);
          } else {
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

  submit() {
    this.isSubmitted = true;
    if (this.inventoryform.invalid) {
      return;
    } else {
      var fields = this.inventoryform.value;
      const formData = new FormData();

      formData.append("login_type", this.api.GetUserType());

      formData.append("login_id", this.api.GetUserData("Id"));

      formData.append("id", this.id);
      formData.append("Status", this.status_check);

      formData.append("quantity", fields["quantity"]);
      formData.append("TotalAmount", fields["TotalAmount"]);
      formData.append("Amount", fields["Amount"]);
      formData.append("itemname", fields["itemname"]);
      formData.append("managerremark", fields["managerremark"]);
      formData.append("Payment", fields["Payment"]);
      formData.append("utrno", fields["utrno"]);
      formData.append("accremark", fields["accremark"]);

      // console.log(fields);

      this.api.IsLoading();
      this.api.HttpPostType("AssetsManagement/Request", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
            // this.router.navigate(["Assets/Request"]);
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

function quantity(quantity: any) {
  throw new Error("Function not implemented.");
}

function valu(valu: any) {
  throw new Error("Function not implemented.");
}
