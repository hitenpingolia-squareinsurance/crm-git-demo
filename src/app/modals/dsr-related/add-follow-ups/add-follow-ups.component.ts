import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-add-follow-ups",
  templateUrl: "./add-follow-ups.component.html",
  styleUrls: ["./add-follow-ups.component.css"],
})
export class AddFollowUpsComponent implements OnInit {
  Id: any;
  row_id: any = "";
  followup_type: any;
  action_user: any;
  Creator_Id: any;
  Circle_Type: any;

  FollowupForm: FormGroup;
  AddProspectCallForm: FormGroup;
  isSubmitted = false;
  isSubmitted1 = false;
  mytime: Date = new Date();

  latitude: any = "";
  longitude: any;
  selectedFiles: File;
  camera!: File;
  Other_image: any = 0;

  action_type: any = "";
  circle_type: any = "";
  prospect_type: any = "";

  followup_req_ar: any = [];
  followup_remarks_ar: any = [];
  agent_ar: any;
  mapping_type_ar: any = [];
  mapped_rm_ar: any = [];

  prospect_type_ar: any = [];
  call_type_ar: any = [];
  prospect_id: any = 0;
  agent_sql: any = "";

  agent_placeholder: any = "Partner";

  dropdownSettingMultipleSelect: {};
  dropdownSettingsingleselect: {};
  dropdownSettingsingleselect1: {};

  constructor(
    public dialogRef: MatDialogRef<AddFollowUpsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    public formBuilder: FormBuilder
  ) {
    this.FollowupForm = this.formBuilder.group({
      agent: [""],
      followup_req: ["", [Validators.required]],
      followup_remarks: [""],
      camera: [""],
      followup_date: [""],
      followup_time: [""],
      remark: [""],
    });

    this.AddProspectCallForm = this.formBuilder.group({
      Name: ["", [Validators.required, Validators.pattern("[a-zA-Z ]*$")]],
      Email: [
        "",
        [
          Validators.pattern(
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$"
          ),
        ],
      ],
      Mobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
        ],
      ],
      Occupation: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z ]*$")],
      ],
      Prospect_Type: ["", [Validators.required]],
      Call_Type: ["", [Validators.required]],
      Remark: [""],
    });

    this.dropdownSettingMultipleSelect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
      closeDropDownOnSelection: true,
    };

    this.action_type = this.data.action_type;
    this.circle_type = this.data.circle_type;
    this.action_user = this.data.action_user;
  }

  ngOnInit() {
    if (this.circle_type == "Business Call" || this.circle_type == "Club") {
      this.agent_placeholder = "Partner";
    } else if (this.circle_type == "Prospect Call") {
      this.agent_placeholder = "Prospect";
    } else if (this.circle_type == "Cross Sell") {
      this.agent_placeholder = "Customer";
    }

    //Get Login User Location
    this.api.getPosition().then((pos) => {
      this.latitude = `${pos.lat}`;
      this.longitude = `${pos.lng}`;
    });

    this.UpdateValidation();
    this.SearchComponentsData();
  }

  get formControls() {
    return this.FollowupForm.controls;
  }
  get formControls1() {
    return this.AddProspectCallForm.controls;
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    const formData = new FormData();

    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("user_id", "");
    formData.append("circle_type", this.circle_type);
    formData.append("portal", "crm");
    formData.append("device_type", "web");
    formData.append("page_name", "add-followup");

    this.api
      .HttpPostTypeBms("dsr/DsrCommon/SearchComponentsData", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.followup_req_ar = result["data"]["followup_req_ar"];

            if (result["data"]["agent_ar"].length > 0) {
              this.agent_ar = result["data"]["agent_ar"];
            } else {
              this.agent_ar = [];
            }
            this.prospect_type_ar = result["data"]["prospect_type_ar"];
            this.call_type_ar = result["data"]["call_type_ar"];
            this.agent_sql = result["data"]["sql"];
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
        }
      );
  }

  //===== SEARCH AGENT DATA =====//
  SearchAgents(search_text: any) {
    var search_value = search_text.target.value;
    const formData = new FormData();

    formData.append("circle_type", this.circle_type);
    formData.append("search_value", search_value);
    formData.append("agent_sql", this.agent_sql);

    this.api.IsLoading();

    this.api.HttpPostTypeBms("dsr/DsrCommon/GetAgentOnSearch", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.agent_ar = result["data"]["agent_ar"];
        }
      },
      (err) => {
        this.api.HideLoading();
      }
    );
  }

  //===== GET PROSPECT TYPE =====//
  // GetProspectRemarks() {
  //   var prospect_id = "";
  //   if (
  //     this.FollowupForm.value["agent"].length == 1 &&
  //     this.circle_type == "Prospect Call"
  //   ) {
  //     prospect_id = this.FollowupForm.value["agent"][0]["Id"];
  //   } else {
  //     prospect_id = this.prospect_id;
  //   }

  //   const formData = new FormData();

  //   formData.append("prospect_id", prospect_id);

  //   this.api.IsLoading();

  //   this.api.HttpPostTypeBms("dsr/DsrCommon/GetProspectType", formData).then(
  //     (result) => {
  //       this.api.HideLoading();
  //       if (result["status"] == true) {
  //         this.followup_remarks_ar = result["data"];
  //       }
  //     },
  //     (err) => {
  //       this.api.HideLoading();
  //     }
  //   );
  // }

  GetProspectRemarks() {
    var prospect_id = "";
    if (
      this.FollowupForm.value["agent"].length == 1 &&
      this.circle_type == "Prospect Call"
    ) {
      prospect_id = this.FollowupForm.value["agent"][0]["Id"];
    } else {
      prospect_id = this.prospect_id;
    }

    const formData = new FormData();

    formData.append("prospect_id", prospect_id);
    formData.append("CircleType", this.circle_type);

    this.api.IsLoading();

    this.api.HttpPostTypeBms("dsr/DsrCommon/GetProspectType1", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.followup_remarks_ar = result["data"];
        }
      },
      (err) => {
        this.api.HideLoading();
      }
    );
  }

  //===== UPDATE VALIDATION =====//
  UpdateValidation() {
    if (
      this.circle_type == "Business Call" ||
      (this.circle_type == "Prospect Call" &&
        (this.prospect_id == "" || this.prospect_id == 0))
    ) {
      this.FollowupForm.get("agent").setValidators([Validators.required]);
    } else {
      this.FollowupForm.get("agent").setValidators(null);
    }

    if (this.action_type == "Visit") {
      this.FollowupForm.get("camera").setValidators([Validators.required]);
    } else {
      this.FollowupForm.get("camera").setValidators(null);
    }

    this.FollowupForm.get("agent").updateValueAndValidity();
    this.FollowupForm.get("camera").updateValueAndValidity();

    if (
      this.FollowupForm.get("followup_req").value.length > 0 &&
      this.FollowupForm.get("followup_req").value[0]["Id"] == "Yes"
    ) {
      this.FollowupForm.get("followup_date").setValidators([
        Validators.required,
      ]);
      this.FollowupForm.get("followup_time").setValidators([
        Validators.required,
      ]);
    } else {
      this.FollowupForm.get("followup_date").setValidators(null);
      this.FollowupForm.get("followup_time").setValidators(null);
    }

    this.FollowupForm.get("followup_date").updateValueAndValidity();
    this.FollowupForm.get("followup_time").updateValueAndValidity();
  }

  //===== SUBMIT FORM =====//
  SubmitFollowupAction() {
    this.isSubmitted = true;
    if (this.FollowupForm.invalid) {
      return;
    } else {
      var agent_id = "";
      if (this.action_user == "rm") {
        if (this.prospect_id != "" && this.prospect_id != 0) {
          agent_id = this.prospect_id;
        } else {
          agent_id = this.FollowupForm.value["agent"][0]["Id"];
        }
      } else {
        agent_id = this.row_id;
      }

      const formData = new FormData();

      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("Action_User", this.action_user);
      formData.append("Id", this.Id);
      formData.append("AgentId", agent_id);
      formData.append("CreatorId", this.Creator_Id);
      formData.append("CircleType", this.circle_type);
      formData.append("ActionType", this.action_type);
      formData.append(
        "FollowUpType",
        JSON.stringify(this.FollowupForm.value["followup_req"])
      );
      formData.append(
        "FollowUpRemark",
        JSON.stringify(this.FollowupForm.value["followup_remarks"])
      );
      formData.append("Camera", this.camera);
      formData.append("FollowUpDate", this.FollowupForm.value["followup_date"]);
      formData.append("FollowUpTime", this.FollowupForm.value["followup_time"]);
      formData.append("Latitude", this.latitude);
      formData.append("Longitude", this.longitude);
      formData.append("Remark", this.FollowupForm.value["remark"]);
      formData.append("Device_Type", "CRM");
      formData.append("Portal", "CRM");

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms("dsr/DsrCommon/SubmitFollowUpDetails", formData)
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

  //===== SUBMIT PROSPECT DETAILS FORM =====//
  SubmitProspectDetails(action: any) {
    this.isSubmitted1 = true;
    if (this.AddProspectCallForm.invalid) {
      return;
    } else {
      var circle_type = "Prospect Call";

      const formData = new FormData();

      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("action_user", "rm");
      formData.append("CircleType", circle_type);
      formData.append("Name", this.AddProspectCallForm.value["Name"]);
      formData.append("Email", this.AddProspectCallForm.value["Email"]);
      formData.append("Mobile", this.AddProspectCallForm.value["Mobile"]);
      formData.append(
        "Occupation",
        this.AddProspectCallForm.value["Occupation"]
      );
      formData.append(
        "Prospect_Type",
        JSON.stringify(this.AddProspectCallForm.value["Prospect_Type"])
      );
      formData.append(
        "Call_Type",
        JSON.stringify(this.AddProspectCallForm.value["Call_Type"])
      );
      formData.append("Device_Type", "CRM");
      formData.append("Portal", "CRM");

      this.api.IsLoading();

      this.api
        .HttpPostTypeBms("dsr/ProspectCalls/AddProspectCalls", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.prospect_id = result["Row_Id"];
              this.action_type = action;
              this.GetProspectRemarks();

              //this.CloseModel();
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

  //===== CHECK IMAGE TYPE =====//
  checkFileType(event: any, Type: any) {
    this.Other_image = 0;
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      ////   //   console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      ////   //   console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg") {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + ' kb');

        if (Total_Size >= 1024) {
          // allow only 1 mb
          this.api.Toast("Error", "File size is greater than 1 mb");
        } else {
          if (Type == "Camera") {
            this.camera = this.selectedFiles;
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

  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
