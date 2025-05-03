import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { environment } from "src/environments/environment";
import { BmsapiService } from "../../../providers/bmsapi.service";
import swal from "sweetalert";
import { HttpClient, HttpResponse } from "@angular/common/http";

import { BrokrageRequestLoaderComponent } from "../../../modals/brokerage/brokrage-request-loader/brokrage-request-loader.component";

@Component({
  selector: "app-update-utr-no",
  templateUrl: "./update-utr-no.component.html",
  styleUrls: ["./update-utr-no.component.css"],
})
export class UpdateUtrNoComponent implements OnInit {
  Posting_Ids: any;

  UTR_No: any = "";
  Status: any = "";
  Remark: any = "";
  snackbar_msg: any = "";

  dataAr: any = [];
  PostingData: any = [];
  paymentFromAr: any = [];

  constructor(
    public dialogRef: MatDialogRef<UpdateUtrNoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public api: BmsapiService,
    private http: HttpClient
  ) {
    this.Posting_Ids = this.data.Posting_Ids;
  }

  ngOnInit() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("Posting_Ids", this.Posting_Ids);

    this.api.IsLoading();
    this.api
      .HttpPostType("brokerage/LPA_PayoutRequest/GetRequestsList", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.dataAr = result["Data"];
            this.paymentFromAr = result["paymentFrom"];
          } else {
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg(err.message);
        }
      );
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  UpdateSingleUTR(e, Id, Index, columnType) {
    var val = e.target.value;
    // console.log(val);
    /*
	  if(columnType == 'Part_Amount'){
		if(val>0){
			// console.log('custom');
			this.dataAr[Index]['Net_Payable_Amt'] = (this.dataAr[Index]['Net_Payable_Amt_Backup']-val);
			this.dataAr[Index][columnType] = val;
		}else{
			// console.log('auto');
			this.dataAr[Index]['Net_Payable_Amt'] = this.dataAr[Index]['Net_Payable_Amt_Backup'];
			//this.dataAr[Index][columnType] = val;
		}
		  
	  }else{
		*/
    this.dataAr[Index][columnType] = val;
    //}
  }

  UpdateBulkUTRNo() {
    // console.log(this.dataAr);

    for (var i = 0; i < this.dataAr.length; i++) {
      if (
        this.dataAr[i]["UTR_Update_Date"] == "" ||
        typeof this.dataAr[i]["UTR_Update_Date"] === null
      ) {
        this.Toast(
          "Please enter " + this.dataAr[i]["Agent_Name"] + " Transfer date"
        );
        return;
      } else if (
        (this.dataAr[i]["UTR_Type"] == "Partially Payment" ||
          this.dataAr[i]["UTR_Type"] == "MF Fund") &&
        this.dataAr[i]["Partially_Amount"] == ""
      ) {
        this.Toast(
          "Please enter " +
            this.dataAr[i]["Agent_Name"] +
            " " +
            this.dataAr[i]["UTR_Type"] +
            " Amount"
        );
        return;
      } else if (
        this.dataAr[i]["UTR_No"] == "" &&
        this.dataAr[i]["UTR_Type"] !== "MF Fund"
      ) {
        this.Toast("Please enter " + this.dataAr[i]["Agent_Name"] + " UTR No.");
        return;
      } else if (
        this.dataAr[i]["Payment_Mode"] == "" &&
        this.dataAr[i]["UTR_Type"] !== "MF Fund"
      ) {
        this.Toast(
          "Please enter " + this.dataAr[i]["Agent_Name"] + " Payment Mode"
        );
        return;
      } else if (
        this.dataAr[i]["Payment_From"] == "" &&
        this.dataAr[i]["UTR_Type"] !== "MF Fund"
      ) {
        this.Toast(
          "Please enter " + this.dataAr[i]["Agent_Name"] + " Payment From"
        );
        return;
      } else if (this.dataAr[i]["Remark"] == "") {
        this.Toast("Please enter " + this.dataAr[i]["Agent_Name"] + " Remark");
        return;
      }
    }

    var Is_Confirm = "Are you sure that you want to change update this data?";

    if (confirm(Is_Confirm) == true) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());
      formData.append("Data", JSON.stringify(this.dataAr));

      this.api.IsLoading();
      this.api
        .HttpPostType(
          "brokerage/LPA_PayoutRequest/StoreUTRNO_Request",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              //this.api.ToastMessage(result['Message']);
              //

              const dialogRef = this.dialog.open(
                BrokrageRequestLoaderComponent,
                {
                  width: "35%",
                  height: "18%",
                  //disableClose : true,
                  data: {
                    Type: "UpdateUTRNo",
                    Payout_Mode: "",
                    TotalRequest: result["TotalRequest"],
                    Store_Id: result["Store_Id"],
                  },
                }
              );

              dialogRef.afterClosed().subscribe((result: any) => {
                // console.log(result);
                //alert('Modal closed');
                this.CloseModel();
              });
            } else {
              this.api.ErrorMsg(result["Message"]);
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            //// console.log(err.message);
            this.api.ErrorMsg(err.message);
          }
        );
    }
  }

  Toast(msg) {
    this.snackbar_msg = msg;
    var x = document.getElementById("snackbar_UTR");
    x.className = "show";
    setTimeout(() => {
      x.className = x.className.replace("show", "");
    }, 3000);
  }
}
