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
  selector: "app-add-margin",
  templateUrl: "./add-margin.component.html",
  styleUrls: ["./add-margin.component.css"],
})
export class AddMarginComponent implements OnInit {
  AddUrl: FormGroup;

  isSubmitted = false;

  loadAPI: Promise<any>;
  SelectedFiles: File;
  PosterImage: File;
  type: any;
  id: any;
  dataArr: any;
  url: string;
  marginType: any;
  mobile: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddMarginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.Id;
    this.marginType = this.data.type;
    this.mobile = this.data.mobile;
    //   //   //   console.log(this.id);
    this.AddUrl = this.formBuilder.group({
      margin: ["", Validators.required],
    });
  }

  ngOnInit() {
    if (this.marginType == "Edit") {
      this.getValueEdit();
    }
  }

  getValueEdit() {
    // console.log(this.id);
    // console.log(this.type);

    //  var fields = this.loginform.value;
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", this.id);
    formData.append("mobile", this.mobile);

    this.api.IsLoading();
    this.api.HttpPostType("Subpos/GetMarginValue", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = result["data"];

          // // console.log(this.company);

          this.AddUrl.patchValue(this.dataArr);

          // this.addtoolForm.patchValue(this.dataArr);

          // this.api.Toast("Success", result["msg"]);
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
    return this.AddUrl.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.AddUrl.invalid) {
      return;
    } else {
      var fields = this.AddUrl.value;
      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("id", this.id);

      // if (this.type == "Edit") {
      //   formData.append("Id", this.id);
      // }

      formData.append("margin", fields["margin"]);

      // console.log(fields);

      // if (this.type == 'Add') {
      //   this.url = 'WebsiteSection/AddUrl';
      // } else if (this.type == 'Edit') {
      //   this.url = 'WebsiteSection/updateUrl';
      // }

      this.api.IsLoading();
      this.api.HttpPostType("Subpos/AddMargin", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
            // this.router.navigate(["/Assets/Products"]);
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
