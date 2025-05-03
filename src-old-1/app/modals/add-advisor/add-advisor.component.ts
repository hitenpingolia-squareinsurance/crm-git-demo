import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-add-advisor",
  templateUrl: "./add-advisor.component.html",
  styleUrls: ["./add-advisor.component.css"],
})
export class AddAdvisorComponent implements OnInit {
  AddAdvisor: FormGroup;

  isSubmitted = false;

  loadAPI: Promise<any>;
  SelectedFiles: File;
  dropdownMultiSelectSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  type: any;
  id: any;
  dataArr: any;
  minDisableDate: any;
  categoryName: any;
  url: string;
  agentId: any;
  CityData: any;
  userType: any;
  cityName: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddAdvisorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.Id;
    this.agentId = this.data.AgentId;
    this.type = this.data.Type;
    this.userType = this.data.UserType;

    //   //   //   console.log(this.id);
    //   //   //   console.log(this.agentId);
    //   //   //   console.log(this.type);

    this.dropdownMultiSelectSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    if (this.type == "Add") {
      this.AddAdvisor = this.formBuilder.group({
        City: ["", Validators.required],
      });
    } else {
      this.AddAdvisor = this.formBuilder.group({
        City: ["", Validators.required],
        experience: ["", Validators.required],
        rating: ["", Validators.required],
      });
    }
  }

  ngOnInit() {
    this.FilterCity("", 0);

    if (this.type == "Edit") {
      this.getValues();
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  FilterCity(e, Type) {
    var Quote = "";

    if (Type == 1) {
      Quote = e.target.value;
    }

    this.api
      .HttpGetType(
        "Advisor/City?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&citysearch=" +
          Quote
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.CityData = result["Data"];
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

  getValues() {
    // console.log(this.id);
    // console.log(this.type);

    //  var fields = this.loginform.value;
    const formData = new FormData();

    // formData.append("login_type", this.api.GetUserType());

    // formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", this.id);
    formData.append("type", this.type);
    formData.append("code", this.agentId);
    formData.append("userType", this.userType);

    this.api.IsLoading();
    this.api.HttpPostType("Advisor/EditValues", formData).then(
      (result: any) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = result["data"];

          this.cityName = result["category"];

          this.AddAdvisor.patchValue(this.dataArr);
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
    return this.AddAdvisor.controls;
  }

  submit() {
    // console.log(this.id);

    this.isSubmitted = true;
    if (this.AddAdvisor.invalid) {
      return;
    } else {
      var fields = this.AddAdvisor.value;
      const formData = new FormData();

      formData.append("city", fields["City"][0]["Name"]);
      formData.append("userType", this.userType);
      formData.append("id", this.id);
      formData.append("agentId", this.agentId);

      // console.log(fields);

      this.api.IsLoading();

      if (this.type == "Edit") {
        formData.append("rating", fields["rating"]);
        formData.append("experince", fields["experience"]);
        this.url = "Advisor/UpdateAdvisorCRM";
      } else {
        this.url = "Advisor/AddAdvisorsCRM";
      }

      this.api.HttpPostType(this.url, formData).then(
        (result: any) => {
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
}
