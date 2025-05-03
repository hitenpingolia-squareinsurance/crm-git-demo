import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";

@Component({
  selector: "app-pos-categorization",
  templateUrl: "./pos-categorization.component.html",
  styleUrls: ["./pos-categorization.component.css"],
})
export class PosCategorizationComponent implements OnInit {
  Id: any;

  AddForm: FormGroup;
  isSubmitted = false;
  dropdownSettings: any = {};
  CircleAr: any = [];
  lobList: any;

  constructor(
    public dialogRef: MatDialogRef<PosCategorizationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    public formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      Category: [""],
      Remark: [""],
    });

    this.Id = this.data.Id;
    this.lobList = this.data.lobList;
    // console.log(this.lobList);

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
    };
  }

  ngOnInit() {
    // console.log(this.lobList);
    if (this.lobList == "Club_NonMotor") {
      this.CircleAr = [
        { Id: "Health", Name: "Health" },
        { Id: "LI", Name: "Life" },
        { Id: "Finance", Name: "Finance" },
        { Id: "Mutual Fund", Name: "Mutual Fund" },
      ];
    } else if (this.lobList == "Club_Health") {
      this.CircleAr = [
        { Id: "Non Motor", Name: "Non Motor" },
        { Id: "LI", Name: "Life" },
        { Id: "Finance", Name: "Finance" },
        { Id: "Mutual Fund", Name: "Mutual Fund" },
      ];
    } else if (this.lobList == "Club_Life") {
      this.CircleAr = [
        { Id: "Non Motor", Name: "Non Motor" },
        { Id: "Health", Name: "Health" },
        { Id: "Finance", Name: "Finance" },
        { Id: "Mutual Fund", Name: "Mutual Fund" },
      ];
    } else if (this.lobList == "Club_Finance") {
      this.CircleAr = [
        { Id: "Non Motor", Name: "Non Motor" },
        { Id: "Health", Name: "Health" },
        { Id: "LI", Name: "Life" },
        { Id: "Mutual Fund", Name: "Mutual Fund" },
      ];
    } else if (this.lobList == "Club_Mutual_Fund") {
      this.CircleAr = [
        { Id: "Non Motor", Name: "Non Motor" },
        { Id: "Health", Name: "Health" },
        { Id: "LI", Name: "Life" },
        { Id: "Finance", Name: "Finance" },
      ];
    } else {
      this.CircleAr = [
        { Id: "Non Motor", Name: "Non Motor" },
        { Id: "Health", Name: "Health" },
        { Id: "LI", Name: "Life" },
        { Id: "Finance", Name: "Finance" },
        { Id: "Mutual Fund", Name: "Mutual Fund" },
      ];
    }

    this.GetAgentCircle(this.Id);
  }

  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  //===== SUBMIT FORM =====//
  SubmitForm() {
    if (this.AddForm.invalid) {
      return;
    } else {
      const formData = new FormData();

      formData.append("Device_Type", "CRM");
      formData.append("Portal", "CRM");
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("Id", this.Id);
      formData.append(
        "Category",
        JSON.stringify(this.AddForm.value["Category"])
      );
      formData.append("Remark", this.AddForm.value["Remark"]);

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms(
          "daily-tracking-circle/AllClubReport/SubmitProspect",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.CloseModel();

              this.api.Toast("Success", result["Message"]);
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
  }

  //===== GET AGENT CIRCLE LIST =====//
  GetAgentCircle(Agent_Id: any) {
    const formData = new FormData();
    formData.append("Agent_Id", this.Id);
    formData.append("LobList", this.lobList);
    formData.append("Portal", "CRM");

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "daily-tracking-circle/AllClubReport/GetAgentCircleArray",
        formData
      )
      .then((result: any) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.CircleAr = result["Data"];
        } else {
          this.CircleAr = [];
        }
      });
  }
}
