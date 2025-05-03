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
  selector: "app-leads-details",
  templateUrl: "./leads-details.component.html",
  styleUrls: ["./leads-details.component.css"],
})
export class LeadsDetailsComponent implements OnInit {
  id: any;
  Data: any;

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettingsMultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
    closeDropDownOnSelection: boolean;
    showSelectedItemsAtTop: boolean;
    defaultOpen: boolean;
    limitSelection: number;
  };

  LeadData: any;
  addLead: FormGroup;
  isSubmitted = false;
  loadAPI: Promise<any>;
  lead_idd: any;
  type: any;
  lead: any;
  name: any;
  email: any;
  mobile: any;
  regno: any;
  make: any;
  model: any;
  variant: any;
  fuel_type: any;
  policy_type: any;
  policy_expiry_period: any;
  previous_ins: any;
  expiry_date: any;
  remainingdays: any;
  file_type: any;
  remarks: any;
  addon: any;
  quotescompany: any;
  status: any;
  employee: any;
  policyno: any;
  Pos: any;
  typed: any;
  POs: any[];
  AssignedTo: any[];
  SP: any;
  ServiceProvider: any[];
  health_policy_type: any;
  lead_followUp_time: any;
  any_disease: any;
  gender: any;
  sum_assured: any;
  pincode: any;
  spouseage: any;
  fatherage: any;
  motherage: any;
  selfage: any;
  corporate_ins_type: any;
  organisation_name: any;
  city: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<LeadsDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.id;

    this.lead_idd = this.data.leadid;

    // console.log(this.lead_idd);

    this.addLead = this.formBuilder.group({
      leadform: ["", Validators.required],
      sp: [""],
      pos: [""],
      refrence: [""],
      assignedto: [""],
    });

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      limitSelection: 5,
    };
  }

  ngOnInit() {
    this.GetLeadData();
    this.FilterPOS();
    this.FilterAssigned();
    this.FilterSP();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  FileType_Status() {
    // const leadform = this.addLead.get('leadform');
    const sp = this.addLead.get("sp");
    const pos = this.addLead.get("pos");
    const refrence = this.addLead.get("refrence");
    const assignedto = this.addLead.get("assignedto");

    this.type = this.addLead.get("leadform").value;
    // .subscribe(type => {
    // // console.log( this.type);
    if (this.type == "POS") {
      // leadform.setValidators([Validators.required]);
      pos.setValidators([Validators.required]);
      sp.setValidators(null);
      refrence.setValidators(null);
      assignedto.setValidators([Validators.required]);
    } else if (this.type == "SP") {
      // leadform.setValidators([Validators.required]);
      pos.setValidators(null);
      sp.setValidators([Validators.required]);
      refrence.setValidators(null);
      assignedto.setValidators([Validators.required]);
    } else if (this.type == "Refrence") {
      // leadform.setValidators([Validators.required]);
      pos.setValidators(null);
      sp.setValidators(null);
      refrence.setValidators([Validators.required]);
      assignedto.setValidators([Validators.required]);
    }

    // leadform.updateValueAndValidity();
    sp.updateValueAndValidity();
    pos.updateValueAndValidity();
    refrence.updateValueAndValidity();
    assignedto.updateValueAndValidity();

    // });
  }

  GetLeadData() {
    // console.log(this.id);
    const formData = new FormData();

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    this.api.IsLoading();

    this.api
      .HttpGetType(
        "MyAccountLeads/GetLeadsData?id=" +
          this.id +
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
            this.LeadData = result["data"];

            this.lead = this.LeadData.LeadId;

            this.name = this.LeadData.name;
            this.email = this.LeadData.email;
            this.mobile = this.LeadData.mobile;

            this.regno = this.LeadData.regno;
            this.make = this.LeadData.make;
            this.model = this.LeadData.model;
            this.variant = this.LeadData.variant;
            this.fuel_type = this.LeadData.fuel_type;
            this.policy_type = this.LeadData.policy_type;
            this.policy_expiry_period = this.LeadData.policy_expiry_period;

            this.previous_ins = this.LeadData.previous_ins;
            this.expiry_date = this.LeadData.expiry_date;
            this.remainingdays = this.LeadData.remainingdays;
            this.file_type = this.LeadData.file_type;
            this.remarks = this.LeadData.remarks;
            this.addon = this.LeadData.addon;

            this.quotescompany = this.LeadData.quotescompany;
            this.status = this.LeadData.status;
            this.employee = this.LeadData.employee;
            this.policyno = this.LeadData.policyno;

            this.type = this.LeadData.type;

            this.health_policy_type = this.LeadData.health_policy_type;
            this.lead_followUp_time = this.LeadData.lead_followUp_time;
            this.any_disease = this.LeadData.any_disease;
            this.gender = this.LeadData.gender;
            this.sum_assured = this.LeadData.sum_assured;
            this.pincode = this.LeadData.pincode;
            this.spouseage = this.LeadData.spouseage;
            this.fatherage = this.LeadData.spouseage;
            this.motherage = this.LeadData.spouseage;
            this.selfage = this.LeadData.selfage;

            this.corporate_ins_type = this.LeadData.corporate_ins_type;
            this.organisation_name = this.LeadData.organisation_name;
            this.city = this.LeadData.city;

            // // console.log(this.LeadData);
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
    return this.addLead.controls;
  }

  submit() {
    // console.log(this.id);
    this.type = this.addLead.get("leadform").value;

    this.isSubmitted = true;
    if (this.addLead.invalid) {
      return;
    } else {
      var fields = this.addLead.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("lead_idd", this.id);

      formData.append("lead_from", fields["leadform"]);
      if (this.type == "SP") {
        formData.append("lead_from_sp", fields["sp"][0]["Id"]);
      }
      if (this.type == "POS") {
        formData.append("lead_from_pos", fields["pos"][0]["Id"]);
      }
      formData.append("lead_from_employee", fields["refrence"]);
      formData.append("mapping_employee", fields["assignedto"][0]["Id"]);

      // console.log(fields);

      // // console.log('formData');
      this.api.IsLoading();
      this.api
        .HttpPostType("MyAccountLeads/update_lead_mapping", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            // console.log(result);
            if (result["status"] == 1) {
              this.api.Toast("success", result["msg"]);
              this.CloseModel();
              // this.router.navigate(["Mypos/View-Docs"]);
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

  FilterPOS() {
    this.typed = "POS";
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "MyAccountLeads/FilterPos?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.POs = result["Data"];
            // console.log(this.POs);
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

  FilterSP() {
    this.typed = "SP";
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "MyAccountLeads/FilterSP?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.ServiceProvider = result["Data"];
            // console.log(this.POs);
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

  FilterAssigned() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "MyAccountLeads/FilterMapping?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.AssignedTo = result["Data"];
            // console.log(this.AssignedTo);
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
