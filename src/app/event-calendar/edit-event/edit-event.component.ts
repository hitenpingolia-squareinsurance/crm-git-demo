import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
// form
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ApiService } from "../../providers/api.service";

@Component({
  selector: "app-edit-event",
  templateUrl: "./edit-event.component.html",
  styleUrls: ["./edit-event.component.css"],
})
export class EditEventComponent implements OnInit {
  Meen_Id: any;
  // form
  AddEvent: FormGroup;
  minEvent_End: any;
  type: any;
  url: any;

  EventTypeArr: { Id: string; Name: string }[];
  RequestTypeArr: { Id: string; Name: string }[];
  TypeArr: { Id: string; Name: string }[];
  isSubmitted = false;
  categoryName: any;

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  dropdownSettingsTypeSingle: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  verticalArr: any;
  VerticalMemberArr: any;
  EmployeeProfileArr: any;
  EventTypeValue: any;
  UrlLable: string;
  vertical_member_value: any;
  events: any;
  ShowVertical: any;
  Type_Value: any;
  ShowPOSP: any;
  ShowPOSPValue: any;
  POSPArr: any;
  currentDate: any;
  RequestMemberArr: any;
  EmployeeProfile: any;
  RequestedTypeValue: any;
  constructor(
    private dialogRef: MatDialogRef<EditEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // form
    private formBuilder: FormBuilder,
    private api: ApiService
  ) {
    this.dropdownSettingsType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };
    this.dropdownSettingsTypeSingle = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.Meen_Id = this.data.id;
    this.type = this.data.type;
    if (this.data.Event != "") {
      this.events = this.data.Event;
    }
    // alert(this.Meen_Id);
    this.AddEvent = this.formBuilder.group({
      Event_Name: ["", Validators.required],
      Event_Start: ["", Validators.required],
      Event_End: [""],
      remark: ["", Validators.required],
      Event_Color: ["", Validators.required],
      Event_Label: [""],
      Location_Name: ["", Validators.required],
      Type: [""],
      start_time: ["", Validators.required],
      end_time: [""],
      City_Name: [""],
      URL: ["", Validators.required],
      // URL: ['', [Validators.required, Validators.pattern('(https?://)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)')]],
      vertical: [""],
      RequestMember: [""],
      EventType: ["", Validators.required],
      VerticalMember: [""],
      POSP: [""],
      RequestType: [""],
      EmployeeProfile: [""],
    });


    this.EventTypeArr = [
      { Id: "offline", Name: "Offline" },
      { Id: "online", Name: "Online" },
    ];
    this.RequestTypeArr = [
      { Id: "Requested", Name: "Requested" },
      { Id: "Not-Requested", Name: "Not-Requested" },
    ];
    this.TypeArr = [
      { Id: "All", Name: "All" },
      { Id: "Employee", Name: "Employee" },
      { Id: "POSP", Name: "POSP" },
      { Id: "Customers", Name: "Customers" },
    ];
  }

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
  }

  validateEvent_End(control) {
    const Event_Start = this.AddEvent.get("Event_Start").value;
    const Event_End = control.value;
    if (
      Event_Start &&
      Event_End &&
      new Date(Event_End) <= new Date(Event_Start)
    ) {
      return { invalidDate: true };
    }
    return null;
  }

  updateMinEvent_End() {
    const Event_Start = this.AddEvent.get("Event_Start").value;
    this.minEvent_End = Event_Start;
  }
  ngOnInit() {
    this.AddEvent.get("Type").setValidators(Validators.required);
    if (this.type == "Edit") {
      this.getValueEdit();
    } else {
      this.AddEvent.get("Event_Color").setValue("#212121");
    }
    this.UrlLable = "URL";
    this.getCurrentDate();
  }
  getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month: string | number = today.getMonth() + 1;
    let day: string | number = today.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    this.currentDate = `${year}-${month}-${day}`;
  }
  get formControls() {
    return this.AddEvent.controls;
  }

  CloseModel() {
    this.dialogRef.close();
  }

  submit() {
    this.isSubmitted = true;
    if (this.AddEvent.invalid) {
      return;
    } else {
      var fields = this.AddEvent.value;
      const formData = new FormData();
      formData.append("Event_Name", fields["Event_Name"]);
      formData.append("Event_Start", fields["Event_Start"]);
      formData.append("Event_End", fields["Event_End"]);
      formData.append("remark", fields["remark"]);
      formData.append("Color", fields["Event_Color"]);
      formData.append("Label", fields["Event_Label"]);
      formData.append("vertical", JSON.stringify(fields["vertical"]));
      formData.append("EventType", JSON.stringify(fields["EventType"]));
      formData.append("EmployeeProfile", JSON.stringify(fields["EmployeeProfile"]));
      formData.append(
        "VerticalMember",
        JSON.stringify(fields["VerticalMember"])
      );
      formData.append("Type", JSON.stringify(fields["Type"]));
      formData.append("POSP", JSON.stringify(fields["POSP"]));
      formData.append("Location_Name", fields["Location_Name"]);
      formData.append("City_Name", fields["City_Name"]);
      formData.append("URL", fields["URL"]);
      formData.append("start_time", fields["start_time"]);
      formData.append("end_time", fields["end_time"]);
      formData.append("end_time", fields["end_time"]);
      // new 
      formData.append("RequestType", JSON.stringify(fields["RequestType"]));
      formData.append("RequestMember", JSON.stringify(fields["RequestMember"]));

      this.api.IsLoading();

      if (this.type == "Edit") {
        formData.append("Id", this.Meen_Id);
        this.url = "Event/EditEvent";
      } else {
        this.url = "Event/AddEvent";
      }
      this.api.HttpPostType(this.url, formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    }
  }

  getValueEdit() {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("id", this.Meen_Id);
    formData.append("type", this.type);
    this.api.IsLoading();
    this.api.HttpPostType("Event/GetEventtEditValue", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.AddEvent.patchValue(result["data"]);
          if (result["event_type"] != "") {
            this.onEventTypeSelect();
          }

          this.ShowVertical = 1;

          this.Type_Value = result["Type"];

          if (result["Type"] == "All") {
            this.ShowVertical = 0;
            this.vertical_member_value = 0;
            this.AddEvent.get("vertical").clearValidators();
            this.AddEvent.get("vertical").updateValueAndValidity();
          }

          if (result["Type"] != "All" && result["Type"] != "Customers") {

            this.getVertical(); 
            if(result["Type"] =='Employee'){
              
              this.onEmployeeProfileSelect();
              this.EmployeeProfileFunction();
            }
          }

          if (result["Type"] == "Customers") {
            this.ShowVertical = 0;
            this.vertical_member_value = 1;
            this.vertical_member("");
            this.AddEvent.get("vertical").clearValidators();
            this.AddEvent.get("vertical").updateValueAndValidity();
          }

          if (result["Type"] == "POSP") {
            this.ShowPOSP = 1;
            this.ShowPOSPValue = 0;
          } else {
            this.ShowPOSPValue = 0;
          }

          if (result["data"]["SQLpospData"] != "") {
            if (
              result["data"]["VerticalMember"].length == 1 &&
              result["Type"] == "POSP"
            ) {
              this.vertical_member_posp(
                result["data"]["VerticalMember"][0]["Id"]
              );
            }
          }
          if(result["data"]["vertical"] != "" && result["data"]["EmployeeProfile"] != ""){
            var fields = this.AddEvent.value;
            var valueForm = fields["vertical"];
          this.vertical_member(JSON.stringify(valueForm));
          }

          let verticalGEt = result["data"]["vertical"];
          if (verticalGEt != "") {
            if (verticalGEt.length > 1) {
              this.vertical_member_value = 0;
            } else {
              this.vertical_member_value = 1;
              this.vertical_member(JSON.stringify(verticalGEt));
            }
          }

          if (result["RequestType"] == 'Requested') {
            this.onRequestedTypeSelect();
          }
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  getVertical() {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    this.api.IsLoading();
    this.api.HttpPostType("Event/getVertical", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.verticalArr = result["data"];
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }
  requestForMeeting() {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    this.api.IsLoading();
    this.api.HttpPostType("Meeting_request/requestForMeeting", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.RequestMemberArr = result["data"];
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  // onEventTypeSelect(selectedItems: any[]) {
  onEventTypeSelect() {
    // this.EventTypeValue = selectedItems["Id"];
    var fields = this.AddEvent.value;
    var EventTypeValue = fields["EventType"];
    if (EventTypeValue != '') {
      if (EventTypeValue[0]["Id"] == "offline") {
        this.EventTypeValue='offline';
        this.UrlLable = "Map URL";
        this.AddEvent.get("Location_Name").setValidators(Validators.required);
        this.AddEvent.get("City_Name").setValidators(Validators.required);
      }
      else {
        this.EventTypeValue='online';
        this.UrlLable = "Meeting URL";
        this.AddEvent.get("Location_Name").clearValidators();
        this.AddEvent.get("Location_Name").updateValueAndValidity();
        this.AddEvent.get("City_Name").clearValidators();
        this.AddEvent.get("City_Name").updateValueAndValidity();
      }
    }
  }

  onRequestedTypeSelect() {
    var fields = this.AddEvent.value;
    var valueRequestType = fields["RequestType"];
    if (valueRequestType != '') {
      if (valueRequestType[0]["Id"] == "Requested") {
        this.RequestedTypeValue = 1;
        this.requestForMeeting();
        this.AddEvent.get("Type").clearValidators();
        this.AddEvent.get("Type").updateValueAndValidity();
      } else {
        this.RequestedTypeValue = 0;
        this.AddEvent.get("Type").setValidators(Validators.required);
        this.AddEvent.get("RequestMember").setValue("");
      }
    }
  }

  onverticalSelect($event) {
    const value = $event;
    var fields = this.AddEvent.value;
    var valueEmployeeProfile = fields["EmployeeProfile"];

    if (value.length > 1) {
      this.AddEvent.get("vertical").setValue(value);
      if (valueEmployeeProfile == '') {
        this.vertical_member_value = 0;
        this.VerticalMemberArr = "";
        this.AddEvent.get("VerticalMember").setValue("");
      } else {
        var valueForm = fields["vertical"];
        this.vertical_member(JSON.stringify(valueForm));
      }
      this.ShowPOSPValue = 0;
      this.POSPArr = '';
      this.AddEvent.get("POSP").setValue("");
    } else {
      var valueForm = fields["vertical"];
      if (valueForm.length > 1) {
        if (valueEmployeeProfile == '') {
          this.vertical_member_value = 0;
          this.VerticalMemberArr = "";
          this.AddEvent.get("VerticalMember").setValue("");
        }
        else {
          this.vertical_member_value = 1;
          
          this.vertical_member(JSON.stringify(valueForm));
        }
      }else{
        this.vertical_member_value = 1;

        this.vertical_member(JSON.stringify(valueForm));
      }

    }
  }

  vertical_member(id: any) {
    var fields = this.AddEvent.value;
    var valueEmployeeProfile = fields["EmployeeProfile"];
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("id", id);
    formData.append("Type_Value", this.Type_Value);
    formData.append("ShowPOSPValue", this.ShowPOSPValue);
    formData.append("valueEmployeeProfile", JSON.stringify(valueEmployeeProfile));
    this.api.IsLoading();
    this.api.HttpPostType("Event/getVerticalMember", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.vertical_member_value = 1;
          this.VerticalMemberArr = result["data"];
        } else {
          this.api.Toast("Warning", result["msg"]);
          this.VerticalMemberArr='';
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }
  EmployeeProfileFunction() {
    this.EmployeeProfile = 1;
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("Type_Value", this.Type_Value);
    this.api.IsLoading();
    this.api.HttpPostType("Event/EmployeeProfile", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.EmployeeProfileArr = result["data"];
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  vertical_member_posp(id: any) {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("id", id);
    formData.append("Type_Value", this.Type_Value);
    formData.append("ShowPOSPValue", this.ShowPOSPValue);
    this.api.IsLoading();
    this.api.HttpPostType("Event/getVerticalMember_posp", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.ShowPOSPValue = 1;
          this.POSPArr = result["data"];
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }
  onVerticalMemberSelect($eventt) {
    const values = $eventt;
    if (values.length > 1) {
      this.AddEvent.get("VerticalMember").setValue(values);
      this.ShowPOSPValue = 0;
      this.POSPArr = '';
      this.AddEvent.get("POSP").setValue("");
    } else {
      var fields = this.AddEvent.value;
      var valueForm = fields["VerticalMember"];
      if (valueForm.length == 1) {

        if (this.Type_Value == "POSP") {
          this.ShowPOSPValue = 1;
          this.vertical_member_posp(valueForm[0]["Id"]);
        } else {
          this.ShowPOSPValue = 0;
          this.POSPArr = '';
          this.AddEvent.get("POSP").setValue("");
        }
      } else {
        this.ShowPOSPValue = 0;
        this.POSPArr = '';
        this.AddEvent.get("POSP").setValue("");
      }
    }
  }

  onTypeSelect() {
    var fields = this.AddEvent.value;
    var valueForm = fields["Type"][0]["Id"];
    this.Type_Value = valueForm;
    this.ShowVertical = 1;
    this.verticalArr = "";
    this.VerticalMemberArr = "";
    this.POSPArr = "";
    this.AddEvent.get("vertical").setValue("");
    this.AddEvent.get("VerticalMember").setValue("");
    this.AddEvent.get("POSP").setValue("");

    if (valueForm == "All") {
      this.ShowVertical = 0;
      this.vertical_member_value = 0;
      this.AddEvent.get("vertical").clearValidators();
      this.AddEvent.get("vertical").updateValueAndValidity();

      this.vertical_member_value = 0;
      this.VerticalMemberArr = "";
      this.AddEvent.get("VerticalMember").setValue("");
      this.AddEvent.get("EmployeeProfile").setValue("");
      this.EmployeeProfile = 0;

    }
    else if (valueForm == "Customers") {
      this.ShowVertical = 0;
      this.vertical_member_value = 1;
      this.vertical_member("");
      this.AddEvent.get("vertical").clearValidators();
      this.AddEvent.get("vertical").updateValueAndValidity();

      this.vertical_member_value = 0;
      this.VerticalMemberArr = "";
      this.AddEvent.get("VerticalMember").setValue("");
      this.AddEvent.get("EmployeeProfile").setValue("");
      this.EmployeeProfile = 0;


    }
    else if (valueForm == "POSP") {
      this.getVertical();
      this.ShowPOSP = 1;
      this.ShowPOSPValue = 0;

      this.vertical_member_value = 0;
      this.VerticalMemberArr = "";
      this.AddEvent.get("VerticalMember").setValue("");
      this.AddEvent.get("EmployeeProfile").setValue("");
      this.EmployeeProfile = 0;


    } else {
      this.getVertical();
      this.EmployeeProfileFunction();
      this.ShowPOSPValue = 0;
    }
  }

  // new 
  onEmployeeProfileSelect() {
    var fields = this.AddEvent.value;
    var valueEmployeeProfile = fields["EmployeeProfile"];
    if (valueEmployeeProfile != '') {
      this.AddEvent.get("VerticalMember").setValidators(Validators.required);
      this.AddEvent.get("vertical").setValidators(Validators.required);
    } else {
      this.AddEvent.get("VerticalMember").clearValidators();
      this.AddEvent.get("VerticalMember").updateValueAndValidity();
      this.AddEvent.get("vertical").clearValidators();
      this.AddEvent.get("vertical").updateValueAndValidity();
    }
  }
}

