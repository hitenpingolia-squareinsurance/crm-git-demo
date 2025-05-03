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
  selector: "app-profile-approval",
  templateUrl: "./profile-approval.component.html",
  styleUrls: ["./profile-approval.component.css"],
})
export class ProfileApprovalComponent implements OnInit {
  id: any;
  profileform: FormGroup;
  // title = 'setValidators';
  isSubmitted = false;
  dataArr: any;
  type: any;
  loadAPI: Promise<any>;

  requestid: any;
  statuscheck: any;
  status: any;
  url: any;
  currentUrl: string;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<ProfileApprovalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.Id;
    this.requestid = this.data.RequestId;
    this.status = this.data.Status;
    // this.url = this.data.url;

    // // console.log(this.status);

    this.profileform = this.formBuilder.group({
      quantities: this.formBuilder.array([]),
    });
  }

  // checkvalue: ['', Validators.required],
  // remarks: ['', Validators.required],

  quantities(): FormArray {
    return this.profileform.get("quantities") as FormArray;
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    // console.log(this.currentUrl);
    this.id = this.data.Id;
    this.requestid = this.data.RequestId;
    this.getdata();
  }

  // ViewDocument(url) {
  //   var fullurl =
  //     "https://www.squareinsurance.in/squareadmin/uploads/user_agents/" + url;
  //   window.open(fullurl, "", "left=100,top=50,width=800%,height=600");
  // }

  ViewDocument(url) {
    var fullurl = url;
    window.open(fullurl, "", "left=100,top=50,width=800%,height=600");
  }

  getdata() {
    // // console.log(this.id);
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Profile/ApprovalData?id=" +
          this.id +
          "&requestid=" +
          this.requestid +
          "&url=" +
          this.currentUrl +
          "&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == true) {
            this.dataArr = result["data"];
            // console.log(this.dataArr);

            for (let data of this.dataArr) {
              this.quantities().push(
                this.formBuilder.group({
                  id: [data.Id],
                  agentcode: [data.agentcode],
                  statuscheck: [data.statuscheck],
                  columnname: [data.columnname],
                  columnvalue: [data.columnvalue],
                  checkvalue: ["", Validators.required],
                  remarks: ["", Validators.required],
                })
              );
            }

            // console.log(this.quantities);

            // this.statuscheck = result["statuscheck"];
            // // console.log(this.statuscheck);

            // console.log(result);
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
    return this.profileform.value;
  }

  submit() {
    // console.log(this.url);
    var fields = this.profileform.value;

    // var fields1 = this.profileform.controls;

    // console.log(fields);

    const formData = new FormData();

    this.isSubmitted = true;
    if (this.profileform.invalid) {
      return;
    } else {
      var fields = this.profileform.value;
      const formData = new FormData();
      // // console.log(formData);

      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      // formData.append("id", this.id);

      formData.append("url", this.currentUrl);
      formData.append("requestid", this.requestid);
      formData.append("status", this.status);
      formData.append("quantities", JSON.stringify(fields["quantities"]));
      this.api.IsLoading();

      this.api.HttpPostType("Profile/ProfileSubmit", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
            // this.router.navigate(["Assets/Action"]);
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

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
