import { Component, OnInit, ViewChild, Optional, Inject } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-view-plans",
  templateUrl: "./view-plans.component.html",
  styleUrls: ["./view-plans.component.css"],
})
export class ViewPlansComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[];
  EditData: any;

  //-----MODEL Variable-------------
  AddPlanForm: FormGroup;
  isSubmitted = false;
  EmployeeSelected: any = [];
  dropdownSettingsMultiselect: any = {};
  fileError: any;
  FileNames: any;
  validImageExtensions: string[] = ["jpg", "jpeg", "png", "gif"];
  employeeData: any;
  mainOption: string;
  subOption: string;
  agentData: any;
  UpdateId: any = "";
  UpdateType: any;
  Partners: any = [];
  Employee_selected: any = [];
  planname: any;
  Background_image: any;
  urlSegment: any;

  //-----MODEL Variable-------------

  constructor(
    private api: ApiService,
    private http: HttpClient,
    public FormBuilder: FormBuilder,
    public Router: Router
  ) {
    this.urlSegment = Router.url.split("/")[2];

    this.AddPlanForm = this.FormBuilder.group({
      PlanName: ["", [Validators.required]],
      PlanDescription: ["", [Validators.required]],
      Leads: ["", [Validators.required]],
      Amount: ["", [Validators.required]],
      Background_image: [""],
      SelectEmployee: [[]],
      SelectPartner: [[]],
    });

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };
  }

  get formControls() {
    return this.AddPlanForm.controls;
  }

  ngOnInit() {
    this.Get();
    this.searchEmployee();
  }

  ClearSearch() {
    this.dataAr = [];
    this.ResetDT();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  SearchData(event: any) {
    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(event)))
        .draw();
    });
  }

  Get() {
    const that = this;

    let apiUrl = "";
    if (this.urlSegment == "plans") {
      apiUrl = "/SyncLeads/view_plans?User_Id=";
    } else if (this.urlSegment == "agent_plans") {
      apiUrl = "/SyncLeads/Plans?User_Id=";
    }

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                apiUrl +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType()
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrl)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            if (that.dataAr.length > 0) {
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  ViewImage(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  searchAgent() {
    let IDS = this.AddPlanForm.value["SelectEmployee"];
    if (this.UpdateId != "") {
      IDS = this.Employee_selected;
    }

    //   //   //   console.log(this.Employee_selected);
    if (IDS != "") {
      this.EmployeeSelected = IDS.map((item) => item.Id);
      const formData = new FormData();
      formData.append("loginId", this.api.GetUserData("Id"));
      formData.append("Id", this.UpdateId);
      formData.append("loginType", this.api.GetUserType());
      formData.append("EmployeeId", this.EmployeeSelected);

      this.api
        .HttpPostType("SyncLeads/searchAgent", formData)
        .then((result: any) => {
          if (result["status"] == true) {
            this.agentData = result["data"];
          }
        });
    }
  }

  ChangeStatus(Id: any, type: any) {
    this.EditData = "";
    this.UpdateId = Id;
    this.UpdateType = type;
    const formdata = new FormData();
    formdata.append("Id", this.UpdateId);
    formdata.append("Type", this.UpdateType);
    formdata.append("LoginId", this.api.GetUserData("Id"));
    formdata.append("LoginType", this.api.GetUserData("Type"));

    if (type == "Edit") {
      this.Background_image = this.AddPlanForm.get("Background_image");

      if (this.UpdateId != "" || this.UpdateId != undefined) {
        this.AddPlanForm.get("Background_image").setValidators(null);
      } else {
        this.AddPlanForm.get("Background_image").setValidators(
          Validators.required
        );
      }

      this.AddPlanForm.get("Background_image").updateValueAndValidity();

      this.api.HttpPostType("SyncLeads/view_plans", formdata).then(
        (result: any) => {
          if (result["status"] == true) {
            this.EditData = result.data[0] || [];
            this.AddPlanForm.patchValue(this.EditData);

            this.Partners = result.Partner;
            this.Employee_selected = result.Employee;
            this.searchAgent();
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    } else {
      if (confirm("Are you sure !") == true) {
        this.api.HttpPostType("SyncLeads/AddPlans", formdata).then(
          (result: any) => {
            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              this.ResetDT();
            } else {
              this.api.Toast("Warning", result["msg"]);
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

  onFileChange(event: any) {
    this.fileError = null;
    const file = event.target.files[0];

    const extension = file.name.split(".").pop().toLowerCase();
    if (!this.validImageExtensions.includes(extension)) {
      this.fileError = `Invalid file type for ${file.name}. Please upload an image with a valid extension (jpg, jpeg, png, gif).`;
      return;
    }
    this.FileNames = file;
  }

  searchEmployee() {
    // this.mainOption = '626';
    this.mainOption = "423";
    this.subOption = "Is_View";

    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("portal", "Crm");
    formData.append("mainOption", this.mainOption);
    formData.append("subOption", this.subOption);
    this.api
      .HttpPostType("b-crm/Filter/commonSearchEmployee", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.employeeData = result["data"];
        }
      });
  }

  AddPlan() {
    this.isSubmitted = true;
    const formdata = new FormData();
    const Fields = this.AddPlanForm.value;

    //   //   console.log(this.AddPlanForm.controls);
    if (this.AddPlanForm.invalid) {
      return;
    }

    formdata.append("Id", this.UpdateId);
    formdata.append("Type", this.UpdateType);
    formdata.append("plan_name", Fields["PlanName"]);
    formdata.append("description", Fields["PlanDescription"]);
    formdata.append("leads", Fields["Leads"]);
    formdata.append("amount", Fields["Amount"]);
    formdata.append("file", this.FileNames);
    formdata.append("employee", JSON.stringify(Fields["SelectEmployee"]));
    formdata.append("partner", JSON.stringify(Fields["SelectPartner"]));
    formdata.append("LoginId", this.api.GetUserData("Id"));
    formdata.append("LoginType", this.api.GetUserData("Type"));

    this.api.HttpPostType("SyncLeads/AddPlans", formdata).then(
      (result: any) => {
        if (result["status"] == true) {
          this.api.Toast("Success", result["msg"]);
          const Closebutton = document.getElementById("CloseModel");
          Closebutton.click();
          this.Get();
          this.ResetDT();
          this.formReset();
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  formReset() {
    this.UpdateId = "";
    this.UpdateType = "";
    this.isSubmitted = false;
    this.AddPlanForm.reset();
    this.Partners = "";
    this.Employee_selected = "";

    this.Background_image = this.AddPlanForm.get("Background_image");

    if (this.UpdateId != "") {
      alert(this.UpdateId);
      this.AddPlanForm.get("Background_image").setValidators(null);
    } else {
      this.AddPlanForm.get("Background_image").setValidators(
        Validators.required
      );
    }

    this.AddPlanForm.get("Background_image").updateValueAndValidity();
  }
}
