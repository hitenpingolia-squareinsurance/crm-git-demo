import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AddMastersModalComponent } from "./add-masters-modal/add-masters-modal.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  Name: string;
  VerticalName: string;
  ZoneName: string;
  BranchAddress: string;
  Status: string;
  InsertDate: string;
  Action: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-employee-masters",
  templateUrl: "./employee-masters.component.html",
  styleUrls: ["./employee-masters.component.css"],
})
export class EmployeeMastersComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  ActivePage: string = "Default";
  ActionType: any = "";
  loginId: any = "";
  loginType: any = "";
  mainOption: any = "";
  subOption: any = "";
  rightType: any = "";

  isSubmitted = false;

  currentUrl: string;
  filterFormData: any;
  urlSegment: any;
  urlSegmentRoot: string;
  masterType: any;
  searchForm: FormGroup;
  LoginDepartment: any;
  SingleId: any;

  hasAccess: boolean = true;
  errorMessage: string = "";

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private uri: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.loginId = this.api.GetUserData("Id");
    this.loginType = this.api.GetUserType();
    this.LoginDepartment = this.api.GetUserData("department");

    this.searchForm = this.formBuilder.group({
      SearchValue: [""],
    });
  }

  ngOnInit() {
    this.fetchEmployeeMastersData();

    //Master Type
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != undefined) {
      this.urlSegment = splitted[2];
    }

    this.getMasterType();
  }

  //===== FETCH ALL SURVEY REQUEST DATA =====//
  fetchEmployeeMastersData() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    const that = this;
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
                "/b-crm/NewEmployeeMasters/fetchEmployeeMastersDataNew?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;
            that.dataAr = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== FILTER DATA =====//
  // SearchData(event: any) {
  //   this.datatableElement.dtInstance.then((dtInstance: any) => {
  //     const TablesNumber = `${dtInstance.table().node().id}`;
  //     const searchTerm = event.target.value.trim(); // Get the search term from the input

  //     if (TablesNumber == "employee_table") {
  //       // Apply search term to the DataTables search function
  //       dtInstance.search(searchTerm).draw();  // This will trigger the server-side filtering
  //     }
  //   });
  // }
  SearchData() {
    const fields = this.searchForm.value;
    // console.log(fields);
    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(fields)))
        .draw();
    });
  }

  //===== CLEAR FILTER =====//
  ClearSearch() {
    var fields = this.searchForm.reset();
    this.fetchEmployeeMastersData();
    this.ResetDT();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //===== MASTER TYPE =====//
  getMasterType() {
    if (this.urlSegment == "coreline") {
      this.masterType = "Coreline";
    } else if (this.urlSegment == "vertical") {
      this.masterType = "Vertical";
    } else if (this.urlSegment == "profile") {
      this.masterType = "Profile";
    } else if (this.urlSegment == "designation") {
      this.masterType = "Designation";
    } else if (this.urlSegment == "grade") {
      this.masterType = "Grade";
    } else if (this.urlSegment == "organisation") {
      this.masterType = "Organisation";
    } else if (this.urlSegment == "zone") {
      this.masterType = "Zone";
    } else if (this.urlSegment == "branch") {
      this.masterType = "Branch";
    } else if (this.urlSegment == "service-location") {
      this.masterType = "Service-Location";
    } else if (this.urlSegment == "regional-office") {
      this.masterType = "Regional-Office";
    } else if (this.urlSegment == "department") {
      this.masterType = "Department";
    }
  }

  //UPDATE MASTERS STATUS
  updateMasterStatus(id: any, status: any, columnName: any) {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("id", id);
    formData.append("status", status);
    formData.append("colName", columnName);
    formData.append("masterType", this.masterType);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpPostType("b-crm/EmployeeMasters/updateMasterStatus", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["status"] == 1) {
              this.api.Toast("Success", result["msg"]);
              this.ResetDT();
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

  //===== OPEN ADD MORE MASTER MODAL =====//
  openAddDialog(
    masterType: any,
    urlSegment: any,
    Action: any,
    Id: any,
    rowData: any
  ) {
    const dialogConfig = this.dialog.open(AddMastersModalComponent, {
      width: "30%",
      height: "60%",
      disableClose: true,
      data: {
        masterType: masterType,
        urlSegment: urlSegment,
        ActionType: Action,
        Id: Id,
        rowData: rowData,
      },
    });

    dialogConfig.afterClosed().subscribe((result: any) => {
      this.ResetDT();
    });
  }

  deleteData(masterType: any, Id: any) {
    let url = "b-crm/EmployeeMasters/deleteMasters";
    if (confirm("Are you sure you want to delete this item?")) {
      const formData = new FormData();
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());
      formData.append("masterType", masterType);
      formData.append("Id", Id);
      this.api.HttpPostType(url, formData).then(
        (result: any) => {
          console.log("Deleted successfully", result);
          this.ResetDT(); // Refresh the data after deletion
        },
        (error) => {
          console.error("Error deleting item", error);
        }
      );
    }
  }

  // toggleStatus(Id: any, Status: any) {
  //   var confirms = confirm("Are You Sure..!");
  //   if (confirms == true) {
  //     const newStatus = Status == 0 ? 1 : 0;
  //     const formData = new FormData();

  //     formData.append("login_type", this.api.GetUserType());
  //     formData.append("login_id", this.api.GetUserData("Id"));
  //     formData.append("Id", Id);
  //     formData.append("status", newStatus.toString());
  //     this.api.IsLoading();

  //     // Make API call based on masterType
  //     let apiEndpoint = ""; // Default API

  //     if (this.urlSegment == "vertical") {
  //       apiEndpoint = "b-crm/EmployeeMasters/toggleVerticalStatus";
  //     } else if (this.urlSegment == "designation") {
  //       apiEndpoint = "b-crm/EmployeeMasters/toggleEmployeeMasterStatus";
  //     }else if (this.urlSegment == "zone") {
  //       apiEndpoint = "b-crm/EmployeeMasters/toggleZoneStatus";
  //     }else if (this.urlSegment == "profile") {
  //       apiEndpoint = "b-crm/EmployeeMasters/toggleEmployeeMasterStatus";
  //     }else if (this.urlSegment == "coreline") {
  //       apiEndpoint = "b-crm/EmployeeMasters/toggleEmployeeMasterStatus";
  //     }else if (this.urlSegment == "branch") {
  //       apiEndpoint = "b-crm/EmployeeMasters/toggleBranchStatus";
  //     }else if (this.urlSegment == "regional-office") {
  //       apiEndpoint = "b-crm/EmployeeMasters/toggleRoStatus";
  //     }else if (this.urlSegment == "service-location") {
  //       apiEndpoint = "b-crm/EmployeeMasters/toggleStatus";
  //     }

  //     this.api.HttpPostType(apiEndpoint, formData).then(
  //       (result: any) => {
  //         this.api.HideLoading();
  //         if (result['status'] == 1) {
  //           this.api.Toast("success", result["msg"]);
  //           this.Reload();
  //         } else {
  //           this.api.Toast("Warning", result["msg"]);
  //         }
  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //         this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")");
  //       }
  //     );
  //   }
  // }

  toggleStatus(masterType: any, Id: any, Status: any) {
    let url = "b-crm/EmployeeMasters/toggleStatus";
    // if (confirm("Are you sure you want to delete this item?")) {
    const newStatus = Status == 0 ? 1 : 0;
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());
    formData.append("masterType", masterType);
    formData.append("Id", Id);

    formData.append("status", newStatus.toString());
    this.api.HttpPostType(url, formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          console.log("Deleted successfully", result);
          this.ResetDT(); // Refresh the data after deletion
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
    // }
  }
} //END
