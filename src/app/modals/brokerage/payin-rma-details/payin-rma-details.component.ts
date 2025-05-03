import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BmsapiService } from "../../../providers/bmsapi.service";
import swal from "sweetalert";

@Component({
  selector: "app-payin-rma-details",
  templateUrl: "./payin-rma-details.component.html",
  styleUrls: ["./payin-rma-details.component.css"],
})
export class PayinRmaDetailsComponent implements OnInit {
  RMA_Id: any;
  result_ar: any = [];

  constructor(
    public dialogRef: MatDialogRef<PayinRmaDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: BmsapiService
  ) {}

  ngOnInit() {
    this.RMA_Id = this.data.RMA_Id;
    this.GetDetails();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  GetDetails() {
    this.api.IsLoading();
    this.api
      .Call(
        "../v2/pay-in/RMA/ViewRMADetailsById?Id=" +
          this.RMA_Id +
          "&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.result_ar = result["Data"];

            //this.api.ToastMessage(result['Message']);
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
