import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";

@Component({
  selector: "app-daily-tracking-circle-followup",
  templateUrl: "./daily-tracking-circle-followup.component.html",
  styleUrls: ["./daily-tracking-circle-followup.component.css"],
})
export class DailyTrackingCircleFollowupComponent implements OnInit {
  Id: any;
  Agent_Id: any;
  Creator_Id: any;
  Circle_Type: any;

  FollowupForm: FormGroup;
  isSubmitted = false;
  mytime: Date = new Date();

  latitude: any = "";
  longitude: any;
  selectedFiles: File;
  Camera!: File;
  showTab: any = "No";
  Action_User_Type: any;
  lobList: any;
  Other_image: any = 0;

  constructor(
    public dialogRef: MatDialogRef<DailyTrackingCircleFollowupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    public formBuilder: FormBuilder
  ) {
    this.FollowupForm = this.formBuilder.group({
      CircleType: [""],
      ActionType: ["", [Validators.required]],
      FollowUpType: [""],
      FollowUpRemark: [""],
      Camera: [""],
      FollowUpDate: [""],
      FollowUpTime: [""],
      Remark: [""],
    });

    this.Circle_Type = this.data.Circle_Type;
    this.Id = this.data.Row_Id;
    this.Agent_Id = this.data.Agent_Id;
    this.Creator_Id = this.data.Creator_Id;
    this.showTab = this.data.showTab;
    this.Action_User_Type = this.data.Action_User_Type;
  }

  ngOnInit() {
    //Get Login User Location
    this.api.getPosition().then((pos) => {
      this.latitude = `${pos.lat}`;
      this.longitude = `${pos.lng}`;
    });
  }

  get formControls() {
    return this.FollowupForm.controls;
  }

  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  //===== SUBMIT FORM =====//
  SubmitFollowupAction() {
    this.isSubmitted = true;
    if (this.FollowupForm.invalid) {
      return;
    } else {
      var CurrentCircleType = "";
      if (this.Action_User_Type == "RM") {
        if (this.Circle_Type == "Prospect Call") {
          CurrentCircleType = "Prospect Call";
        } else {
          CurrentCircleType = "Business Call";
        }
      } else {
        CurrentCircleType = this.Circle_Type;
      }

      const formData = new FormData();

      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("Action_User_Type", this.Action_User_Type);
      formData.append("Id", this.Id);
      formData.append("AgentId", this.Agent_Id);
      formData.append("CreatorId", this.Creator_Id);
      formData.append("CircleType", CurrentCircleType);
      formData.append("ActionType", this.FollowupForm.value["ActionType"]);
      formData.append("FollowUpType", this.FollowupForm.value["FollowUpType"]);
      formData.append(
        "FollowUpRemark",
        this.FollowupForm.value["FollowUpRemark"]
      );
      formData.append("Camera", this.Camera);
      formData.append("FollowUpDate", this.FollowupForm.value["FollowUpDate"]);
      formData.append("FollowUpTime", this.FollowupForm.value["FollowUpTime"]);
      formData.append("Latitude", this.latitude);
      formData.append("Longitude", this.longitude);
      formData.append("Remark", this.FollowupForm.value["Remark"]);
      formData.append("Device_Type", "CRM");
      formData.append("Portal", "CRM");

      this.api.IsLoading();
      if (this.Action_User_Type == "RM") {
        this.api
          .HttpPostTypeBms(
            "daily-tracking-circle/CircleReports/SubmitRmFollowUpDetailsNew",
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
      } else {
        this.api
          .HttpPostTypeBms(
            "daily-tracking-circle/CircleReports/SubmitFollowUpDetailsNew",
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
  }

  //===== CHECK IMAGE TYPE =====//
  checkFileType(event: any, Type: any) {
    this.Other_image = 0;
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg") {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size+ ' kb');

        if (Total_Size >= 1024) {
          // allow only 1 mb
          this.api.Toast("Error", "File size is greater than 1 mb");
        } else {
          if (Type == "Camera") {
            this.Camera = this.selectedFiles;
          }
          this.Other_image = 1;
        }
      } else {
        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }
}
