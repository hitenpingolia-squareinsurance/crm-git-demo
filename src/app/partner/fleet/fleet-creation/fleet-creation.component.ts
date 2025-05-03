import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-fleet-creation",
  templateUrl: "./fleet-creation.component.html",
  styleUrls: ["./fleet-creation.component.css"],
})
export class FleetCreationComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;

  RM_Data: any = [];
  Agent_Ar: any = [];

  dropdownSettings: any = {};

  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      RM_Id: ["", [Validators.required]],
      Agent_Id: ["", [Validators.required]],
      Fleet_Name: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z ]*$")],
      ],
      Email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      Mobile_No: [
        "",
        [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")],
      ],
      Address: ["", [Validators.required]],
    });

    this.dropdownSettings = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.Get_Rms();
  }
  get formControls() {
    return this.AddForm.controls;
  }

  Get_Rms() {
    this.api.IsLoading();
    this.api
      .CallBms("em/POS/Get_Rms?User_Id=" + this.api.GetUserData("User_Id"))
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.RM_Data = result["RM_Data"];
          } else {
            //alert(result['Message']);
          }
        },
        (err) => {
          this.api.HideLoading();
          ////   //   console.log(err.message);
          alert(err.message);
        }
      );
  }

  onChangeRM(item: any) {
    this.api.IsLoading();
    this.api.CallBms("sr/Sales/Get_Agents?RM_Id=" + item.Id).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.Agent_Ar = result["Data"];
        } else {
          //alert(result['Message']);
        }
      },
      (err) => {
        this.api.HideLoading();
        ////   //   console.log(err.message);
        alert(err.message);
      }
    );
  }

  Add() {
    //   //   console.log(this.AddForm.value);

    this.isSubmitted = true;
    if (this.AddForm.invalid) {
      return;
    } else {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());
      formData.append("User_Type", this.api.GetUserData("UserType_Name"));

      formData.append("RM_Id", this.AddForm.value["RM_Id"][0]["Id"]);
      formData.append("Agent_Id", this.AddForm.value["Agent_Id"][0]["Id"]);
      formData.append("Fleet_Name", this.AddForm.value["Fleet_Name"]);
      formData.append("Email", this.AddForm.value["Email"]);
      formData.append("Mobile_No", this.AddForm.value["Mobile_No"]);
      formData.append("Address", this.AddForm.value["Address"]);

      this.api.IsLoading();
      this.api.HttpPostTypeBms("reports/Fleet/Add", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.router.navigate(["/partner/fleet/report"]);
          } else {
            //alert(result['Message']);
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          ////   //   console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
    }
  }
}
