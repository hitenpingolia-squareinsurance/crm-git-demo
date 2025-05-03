import { Component, OnInit, Inject } from "@angular/core";
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

@Component({
  selector: "app-view-follow-ups",
  templateUrl: "./view-follow-ups.component.html",
  styleUrls: ["./view-follow-ups.component.css"],
})
export class ViewFollowUpsComponent implements OnInit {
  id: any;
  loadAPI: Promise<any>;
  dataArr: any;
  table_name: void;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<ViewFollowUpsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.Id;
    this.table_name = this.data.table_name;
    // console.log(this.table_name);
  }

  ngOnInit() {
    this.id = this.data.Id;
    // this.table_name = this.data.table_name;
    this.getdata();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  getdata() {
    // console.log(this.id);

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "CustomerQuery/show_action_details?id=" +
          this.id +
          "&table_name=" +
          this.table_name
      )
      .then(
        (result) => {
          this.api.HideLoading();
          this.dataArr = result;
          // console.log( this.dataArr);

          // if (result["status"] == true) {
          //   this.dataArr = result["Data"];
          //   // console.log(this.dataArr);
          // } else {
          //   const msg = "msg";
          //   this.api.Toast("Warning", result["msg"]);
          // }
        },
        (err) => {
          this.api.HideLoading();
          this.dataArr = err["error"]["text"];
          // console.log( this.dataArr);

          // const newLocal = "Warning";
          // this.api.Toast(
          //   newLocal,
          //   "Network Error : " + err.name + "(" + err.statusText + ")"
          // );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }
}
