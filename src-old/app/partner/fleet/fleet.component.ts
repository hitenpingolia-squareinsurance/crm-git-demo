import { HostListener, Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import swal from "sweetalert";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

class ColumnsObj {
  Id: string;
  Status: string;
  FleetName: string;
  ReferenceAgent: string;
  RM: string;
  Mobile: string;
  Email: string;
  Update_Stamp: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
}

@Component({
  selector: "app-fleet",
  templateUrl: "./fleet.component.html",
  styleUrls: ["./fleet.component.css"],
})
export class FleetComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  dropdownSettings: any = {};

  SearchForm: FormGroup;
  isSubmitted = false;

  Is_CutCopyPasteCls: string = "";

  UserRights: any = [];

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;

  Employee_Placeholder: any = "Select Employee";

  SQL_Where_STR: any;
  Is_Export: any = 0;

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Vertical_Id: ["0"],
      Region_Id: ["0"],
      Sub_Region_Id: ["0"],
      Emp_Id: [""],

      AgentType: ["0"],
      RM_Search_Type: ["0"],
      AgentStatus: ["0"],
      DateOrDateRange: [""],
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  @HostListener("contextmenu", ["$event"]) blockcontextmenu(e: KeyboardEvent) {
    const IsCutCopyPaste = localStorage.getItem("IsCutCopyPaste");
    if (IsCutCopyPaste == "0") {
      e.preventDefault();
    }
  }

  @HostListener("window:keydown", ["$event"])
  keyEvent(event: KeyboardEvent) {
    ////   //   console.log(event);
    ////   //   console.log(event.keyCode);

    const IsCutCopyPaste = localStorage.getItem("IsCutCopyPaste");

    if (IsCutCopyPaste == "0") {
      // Prevent F12 -
      if (event.keyCode == 123) {
        return false;
      }
      // Prevent Ctrl+a = disable select all
      // Prevent Ctrl+u = disable view page source
      // Prevent Ctrl+s = disable save
      // Prevent Ctrl+c = disable copy
      // Prevent Ctrl+v = disable paste
      else if (
        event.ctrlKey &&
        (event.keyCode === 85 ||
          event.keyCode === 83 ||
          event.keyCode === 65 ||
          event.keyCode === 44 ||
          event.keyCode === 80 ||
          event.keyCode === 67 ||
          event.keyCode === 86)
      ) {
        return false;
      }
      // Prevent Ctrl+Shift+I = disabled debugger console using keys open
      else if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
        return false;
      } else {
        //event.preventDefault();
      }
    }
  }

  ngOnInit(): void {
    const IsCutCopyPaste = localStorage.getItem("IsCutCopyPaste");
    if (IsCutCopyPaste == "0") {
      this.Is_CutCopyPasteCls = "Is_CutCopyPasteCls";
    }

    this.SearchComponentsData();
    this.GetUserRights();
    this.Get();
  }

  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "reports/AgentReport/SearchComponentsData?User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"]["Vertical"];
            //this.Emps_Ar = result['Data']['Hierarchy']['Employee'];
            //this.Companies_Ar = result['Data']['Ins_Compaines'];
            //this.Products_Ar = result['Data']['Products_Ar'];
            this.Region_Ar = result["Data"]["Region_Ar"];
          } else {
            //alert(result['Message']);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();

          //alert(err.message);
        }
      );
  }

  GetEmployees() {
    this.Emps_Ar = [];
    //this.Agents_Ar=[];

    this.SearchForm.get("Emp_Id").setValue(null);
    //this.SearchForm.get('Agent_Id').setValue(null);

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    //formData.append('Type',Type);
    formData.append("Vertical_Id", this.SearchForm.value["Vertical_Id"]);
    formData.append("Region_Id", this.SearchForm.value["Region_Id"]);
    formData.append("Sub_Region_Id", this.SearchForm.value["Sub_Region_Id"]);

    this.api.HttpPostTypeBms("reports/AgentReport/GetEmployees", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Emps_Ar = result["Data"];
          this.Employee_Placeholder =
            "Select Employee (" + this.Emps_Ar.length + ")";
          //this.Agents_Placeholder = 'Select Agent';
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast(
          "Warning",
          "Network Error, Please try again ! " + err.message
        );
      }
    );
  }

  GetSubBranches(e) {
    this.GetEmployees();

    this.SearchForm.get("Sub_Region_Id").setValue("0");

    var Branch_Id = e.target.value;

    this.api.IsLoading();
    this.api
      .CallBms(
        "reports/AdminSrReport/GetSubBranches?Branch_Id=" +
          Branch_Id +
          "&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Sub_Branch_Ar = result["Data"];
          } else {
            //alert(result['Message']);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();

          //alert(err.message);
        }
      );
  }

  SearchBtn() {
    ////   //   console.log(this.SearchForm.value);

    var fields = this.SearchForm.value;

    var RM_Id_value, Franchisee_Id_value, ToDate, FromDate;

    var DateOrDateRange = fields["DateOrDateRange"];

    if (DateOrDateRange) {
      ToDate = DateOrDateRange[0];
      FromDate = DateOrDateRange[1];
    }

    //   //   //   console.log(RM_Id_value);
    //   //   //   console.log(Franchisee_Id_value);

    var query = {
      Vertical_Id: fields["Vertical_Id"],
      Region_Id: fields["Region_Id"],
      Sub_Region_Id: fields["Sub_Region_Id"],
      Emp_Id: fields["Emp_Id"],

      AgentType: fields["AgentType"],
      RM_Search_Type: fields["RM_Search_Type"],
      AgentStatus: fields["AgentStatus"],
      To_Date: this.api.StandrdToDDMMYYY(ToDate),
      From_Date: this.api.StandrdToDDMMYYY(FromDate),
    };

    //   //   //   console.log(query);

    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
    });
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.SearchForm.get("Vertical_Id").setValue("0");
    this.SearchForm.get("Region_Id").setValue("0");
    this.SearchForm.get("Sub_Region_Id").setValue("0");
    this.SearchForm.get("Emp_Id").setValue(null);
    this.SearchForm.get("AgentType").setValue("0");
    this.SearchForm.get("RM_Search_Type").setValue("0");
    this.SearchForm.get("AgentStatus").setValue("0");

    this.Employee_Placeholder = "Select Employee";

    this.dataAr = [];
    this.Emps_Ar = [];
    this.ResetDT();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  GetUserRights() {
    this.api.IsLoading();
    this.api.CallBms("User/GetUserRights?User_Id=" + this.api.GetUserId()).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.UserRights = result["User_Rights"];
        } else {
          //this.api.ErrorMsg(result['Message']);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        ////   //   console.log(err.message);
        //this.api.ErrorMsg(err.message);
      }
    );
  }

  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/reports/Fleet/GridData?User_Id=" +
                this.api.GetUserId()
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            this.dataAr = resp.data;
            this.SQL_Where_STR = resp.SQL_Where;
            if (this.dataAr.length > 0) {
              this.Is_Export = 1;
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

  promptfn() {
    var msg = prompt("Please Enter QC Reject Remark", "");
    if (msg == null) {
      return "";
    }
    if (msg == "") {
      return this.promptfn();
    } else {
      return msg;
    }
  }

  QC_Status_Update(e, Fleet_Id) {
    var QC_Status = e.target.value;
    //alert(QC_Status);
    var remark = "";
    if (QC_Status == 2) {
      remark = this.promptfn();
      //   //   //   console.log(remark);
    }

    if (remark != "" || QC_Status == 1) {
      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());

      formData.append("Fleet_Id", Fleet_Id);
      formData.append("QC_Status", QC_Status);
      formData.append("QC_Remark", remark);

      this.api.HttpPostTypeBms("reports/Fleet/QC_Update", formData).then(
        (result) => {
          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.Reload();
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again ! " + err.message
          );
        }
      );
    }
  }
}
