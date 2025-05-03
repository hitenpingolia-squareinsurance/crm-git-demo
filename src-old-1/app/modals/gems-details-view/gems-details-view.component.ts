import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import swal from "sweetalert";
import { MatDialog } from "@angular/material/dialog";
import { GemsDetailsViewRemarkComponent } from "../../modals/gems-details-view-remark/gems-details-view-remark.component";

@Component({
  selector: "app-gems-details-view",
  templateUrl: "./gems-details-view.component.html",
  styleUrls: ["./gems-details-view.component.css"],
})
export class GemsDetailsViewComponent implements OnInit {
  Agent_Id: any;
  DataAr: any = [];

  constructor(
    public dialogRef: MatDialogRef<GemsDetailsViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public api: ApiService,
    public dialog: MatDialog
  ) {
    this.Agent_Id = this.data.Id;
  }

  ngOnInit() {
    this.GetDetails();
  }
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  GetDetails() {
    //this.api.IsLoading();
    this.api
      .CallBms(
        "other/Gems/ViewDetails?Agent_Id=" +
          this.Agent_Id +
          "&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          //this.api.HideLoading();

          if (result["Status"] == true) {
            this.DataAr = result["Data"];
            //this.api.ToastMessage(result['Message']);
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          ////   //   console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
  }

  ViewGemsRemark(v) {
    const dialogRef = this.dialog.open(GemsDetailsViewRemarkComponent, {
      width: "30%",
      height: "30%",
      data: { Remark: v },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      //   //   console.log(result);
    });
  }
}
