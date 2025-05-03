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
declare function loadingServiceShow(zindex, id, flag);
declare function loadingServiceHide(id);
@Component({
  selector: "app-follow-up-tele-rm",
  templateUrl: "./follow-up-tele-rm.component.html",
  styleUrls: ["./follow-up-tele-rm.component.css"],
})
export class FollowUpTeleRmComponent implements OnInit {
  id: any;
  loadAPI: Promise<any>;
  dataArr: any;
  table_name: void;
  UpdateFollowForm: FormGroup;
  isSubmitted: boolean;
  TableName: any;
  Id: any;
  Type: any;
  currentUrl: string;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<FollowUpTeleRmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.Id;
    // this.table_name = this.data.table_name;
    // console.log(this.table_name);

    this.TableName = this.data.table_name;
    this.Id = this.data.Id;
    this.Type = this.data.Type;

    // console.log(this.data);

    this.UpdateFollowForm = this.formBuilder.group({
      Dates: ["", Validators.required],
      Times: ["", Validators.required],
      Remarks: ["", Validators.required],
    });

    this.currentUrl = this.router.url;
    // console.log(this.currentUrl);
  }

  ngOnInit() {
    this.id = this.data.Id;
    this.getdata();
  }
  ClearSearch() {
    this.UpdateFollowForm.reset();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  callme() {
    loadingServiceShow(1, "loginbtnadd", false);
  }
  callmestop() {
    loadingServiceHide("loginbtnadd");
  }

  UpdateFollowFormS() {
    var fields = this.UpdateFollowForm.value;
    const formData = new FormData();
    this.isSubmitted = true;
    if (this.UpdateFollowForm.invalid) {
      return;
    } else {
      var fields = this.UpdateFollowForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("User_Name", this.api.GetUserData("Name"));
      formData.append("table_name", "user_agent");
      formData.append("Id", this.Id);
      formData.append("Type", "Follow-Up");
      formData.append("dates", fields["Dates"]);
      formData.append("times", fields["Times"]);
      formData.append("remark", fields["Remarks"]);

      var Confirms = confirm("Are You Sure?");
      if (Confirms == true) {
        this.api.HttpPostType("MyPos/UpdateTeleRmFollowUp", formData).then(
          (result) => {
            if (result["status"] == true) {
              this.UpdateFollowForm.reset();
              this.api.Toast("Success", result["msg"]);
              this.getdata();
            } else {
              this.api.Toast("Warning", result["msg"]);
              this.getdata();
            }
          },
          (err) => {
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
      }
    }
  }

  get FC() {
    return this.UpdateFollowForm.controls;
  }

  getdata() {
    const formData = new FormData();

    formData.append("AgentId", this.id);

    this.callme();
    this.api.HttpPostType("MyPos/show_action_details", formData).then(
      (result) => {
        this.callmestop();
        this.dataArr = result;
        // console.log(this.dataArr);
      },
      (err) => {
        this.callmestop();
        this.dataArr = err["error"]["text"];
        // console.log(this.dataArr);
      }
    );
  }
}
