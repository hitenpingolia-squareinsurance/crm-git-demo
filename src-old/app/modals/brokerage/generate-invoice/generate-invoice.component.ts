import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { BmsapiService } from "../../../providers/bmsapi.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AddPayorComponent } from "../add-payor/add-payor.component";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-generate-invoice",
  templateUrl: "./generate-invoice.component.html",
  styleUrls: ["./generate-invoice.component.css"],
})
export class GenerateInvoiceComponent implements OnInit {
  modalForm: FormGroup;
  isSubmitted = false;

  Payors: any = [];
  pendingAmount: any;

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  DiscriptionVal: any;
  discriptionname: any;
  hsnNodata: any;

  constructor(
    public api: BmsapiService,
    public API: ApiService,
    private route: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<GenerateInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.modalForm = this.formBuilder.group({
      Payor_Type: ["", Validators.required],
      Customer_Type: ["New", Validators.required],
      Part_Name: [],
      Agent_Category: [],
      Part_Address: [],
      Pan_No: [],
      GST_No: [],
      Aadhar_No: [],
      GST_Per: [],
      Amount_With_GST: [
        "",
        [Validators.required, Validators.max(this.data.Amount)],
      ],
      Amount_Without_GST: [],
      Description: ["", [Validators.required]],
      hsnnumber: ["", [Validators.required]],
      remark: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.GetPayors();
    this.FilterDiscription();
    //   //   //   console.log(this.data.Id);
  }

  FilterDiscription() {
    this.API.IsLoading();
    this.API.HttpGetType(
      "reports/Invoice_Settlement/FilterDiscription?User_Id=" +
        this.API.GetUserData("Id") +
        "&User_Type=" +
        this.API.GetUserType()
    ).then(
      (result) => {
        this.API.HideLoading();
        if (result["status"] == 1) {
          this.DiscriptionVal = result["Data"];
          // console.log(this.Category);
        } else {
          this.API.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.API.HideLoading();
        this.API.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  //FORM CONTROLS
  get formControls() {
    return this.modalForm.controls;
  }

  AddNewPayor() {
    const dialogRef = this.dialog.open(AddPayorComponent, {
      width: "50%",
      height: "60%",
      disableClose: true,
      data: { Id: 0 },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.GetPayors();
    });
  }

  GetPayors() {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());

    this.api.IsLoading();
    this.api.HttpPostType("../v2/reports/Invoicing/GetPayors", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.Payors = result["Data"];

          this.GetDetails();
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
        this.api.HideLoading();
      }
    );
  }

  //===== GET REJECTION DETAILS =====//
  GetDetails() {
    const formData = new FormData();
    formData.append("User_Id", this.API.GetUserId());
    formData.append("Posting_Id", this.data.Id);
    formData.append("Amount", this.data.Amount);
    formData.append("AgentCode", this.data.agentcode);
    //formData.append('Customer_Type', this.modalForm.value.Customer_Type);
    formData.append("Customer_Type", "New");

    this.API.IsLoading();
    this.API.HttpPostType(
      "reports/Invoice_Settlement/CustomerDetails",
      formData
    ).then(
      (result) => {
        this.API.HideLoading();
        if (result["Status"] == true) {
          this.modalForm.patchValue(result["Data"]);
        } else {
          // this.API.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // this.API.ErrorMsg("Network Error, Please try again ! " + err.message);
        this.API.HideLoading();
      }
    );
  }

  // ------------------------------INVOICE GENERATE FUNCTION----------------

  // submitForm() {
  //   this.isSubmitted = true;
  //   if (this.modalForm.invalid) {
  //     return;
  //   } else {
  //     var fields = this.modalForm.value;
  //     const formData = new FormData();

  //     formData.append("User_Id", this.api.GetUserId());
  //     formData.append("Posting_Id", this.data.Id);

  //     Object.keys(this.modalForm.controls).forEach((key) => {
  //       formData.append(key, this.modalForm.get(key).value);
  //     });

  //     this.api.IsLoading();
  //     this.api.HttpPostType("../v2/reports/Invoicing/Submit", formData).then(
  //       (result) => {
  //         this.api.HideLoading();

  //         if (result["Status"] == true) {
  //           this.api.Toast("Success", result["Message"]);
  //           this.dialogRef.close();

  //           window.open(
  //             result["InvoiceUrl"],
  //             "",
  //             "left=100,top=50,width=800%,height=600"
  //           );
  //         } else {
  //           const msg = "msg";
  //           this.api.Toast("Warning", result["Message"]);
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

  submitForm() {
    this.isSubmitted = true;
    if (this.modalForm.invalid) {
      return;
    } else {
      var fields = this.modalForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.API.GetUserId());
      formData.append("Login_type", this.API.GetUserType());
      formData.append("Posting_Id", this.data.Id);
      //   //   //   console.log(this.data.Id);

      this.pendingAmount = (
        this.data.Amount - fields["Amount_With_GST"]
      ).toFixed(2);
      formData.append("AgentCode", this.data.agentcode);
      formData.append("PendingAmount", this.pendingAmount);

      Object.keys(this.modalForm.controls).forEach((key) => {
        if (key == "Description") {
          formData.append("Description", fields["Description"]["0"]["Name"]);
        } else if (key == "hsnnumber") {
          formData.append("hsnnumber", fields["hsnnumber"]["0"]["Name"]);
        } else {
          formData.append(key, this.modalForm.get(key).value);
        }
      });

      // console.log(this.modalForm.controls);

      this.API.IsLoading();

      this.API.HttpPostTypeBms(
        "../v2/reports/Invoicing/CRMSubmit",
        formData
      ).then(
        (result: any) => {
          this.API.HideLoading();

          if (result["Status"] == true) {
            this.API.Toast("Success", result["Message"]);
            this.dialogRef.close();

            window.open(
              result["InvoiceUrl"],
              "",
              "left=100,top=50,width=800%,height=600"
            );
          } else {
            const msg = "msg";
            this.API.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.API.HideLoading();
          const newLocal = "Warning";
          this.API.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    }
  }

  // ------------------------------SETTLEMENT FUNCTION----------------

  submitForm1() {
    this.isSubmitted = true;
    if (this.modalForm.invalid) {
      return;
    } else {
      var fields = this.modalForm.value;
      const formData = new FormData();
      this.pendingAmount = (
        this.data.Amount - fields["Amount_With_GST"]
      ).toFixed(2);

      formData.append("Posting_Id", this.data.Id);
      formData.append("AgentCode", this.data.agentcode);
      formData.append("PendingAmount", this.pendingAmount);

      this.API.IsLoading();
      this.API.HttpPostType(
        "reports/Invoice_Settlement/Settlement",
        formData
      ).then(
        (result: any) => {
          this.API.HideLoading();

          if (result["status"] == true) {
            this.API.Toast("Success", result["msg"]);
            this.dialogRef.close();

            // window.open(
            //   result["InvoiceUrl"],
            //   "",
            //   "left=100,top=50,width=800%,height=600"
            // );
          } else {
            const msg = "msg";
            this.API.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.API.HideLoading();
          const newLocal = "Warning";
          this.API.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    }
  }

  close() {
    this.dialogRef.close();
  }

  searchHsnNo() {
    // console.log(this.SelectedmakeName);

    // this.Selectmake = this.SelectedmakeName[0].Name;

    const formData = new FormData();
    // if (this.Selectmake != "") {
    //   formData.append("make", this.SelectedmakeName[0].Name);
    // } else {
    this.discriptionname = this.modalForm.get("Description").value[0].Id;
    formData.append("discriptionName", this.discriptionname);
    // }

    this.API.IsLoading();
    this.API.HttpPostType(
      "reports/Invoice_Settlement/FilterHsnNumber",
      formData
    ).then(
      (result) => {
        this.API.HideLoading();

        if (result["status"] == true) {
          this.hsnNodata = result["Data"];
          //this.selectedModel = result['modelValue'];
        }
      },
      (err) => {
        this.API.HideLoading();
        this.API.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }
}
