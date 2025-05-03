import { AddNocComponent } from "./../../noc/add-noc/add-noc.component";
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

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { PosDetailsComponent } from "../../modals/pos-details/pos-details.component";
import { PoliciesDataComponent } from "../../modals/policies-data/policies-data.component";
import { DocumentsComponent } from "../../useragent/documents/documents.component";
import { UpdatePospReportingComponent } from "../update-posp-reporting/update-posp-reporting.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  LOB: string;
  TypeName: string;
  Quotation_Id: string;
  Company: string;
  PolicyNo: string;
  CustomerName: string;
  CustomerMobile: string;
  DownloadUrl: string;
  Vehicle_No: string;
  Policy_Type: string;
  BookingDate: string;
  NetPremium: string;
  IssuedDate: string;
  GrossPremium: string;
  TotalFiles: string;
  TotalPremium: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}

@Component({
  selector: "app-mypos",
  templateUrl: "./mypos.component.html",
  styleUrls: ["./mypos.component.css"],
})
export class MyposComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

  ActivePage: string = "Default";
  Masking: any = "Temp";
  MaskingType: any = "Temp";
  SearchForm: FormGroup;

  isSubmitted = false;

  Ins_Compaines: any = [];
  GlobelLOB: any = [];
  PolicyFileType: any = [];
  PolicyType: any = [];
  ProductType: any = [];
  SR_Session_Year: any = [];
  SRSource_Ar: any = [];
  filterrd: any = [];

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsingleselect: any = {};

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";

  QidSr: any;
  statusData: { Id: string; Name: string }[];
  Total: number;
  loginType: string | null;
  StateData: any;
  CityData: any;
  ItemLOBSelection: string | Blob;
  TypeData: { Id: number; Name: string }[];
  loginId: any;
  SelectStatusValue: { Id: string; Name: string }[];
  UpdatePospReportingForm: FormGroup;
  ChangePospId: any;
  ChangePospIdAgentId: any;
  AlLEmployeeData: any;
  ChangePospRm: any;
  PosId: any;
  create_pos_permission: any;
  AgentId: any;
  BA_BP_List: any;
  UpdatePosForm: FormGroup;
  LoginDepartmentId: any;
  LSPData: any;
  url: string;

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {




    this.url = this.router.url;

    this.LoginDepartmentId = this.api.GetUserData("department");
    //   //   //   console.log(this.LoginDepartmentId);
    this.UpdatePospReportingForm = this.fb.group({
      reference: ["", Validators.required],
    });
    this.UpdatePosForm = this.fb.group({
      Remark: [""],
      BA_BP_List: [""],
    });
    this.loginType = this.api.GetUserType();
    this.loginId = this.api.GetUserData("Id");
    // api.GetUserData(" Id");
    this.dropdownSettingsmultiselect = {
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
    };

    this.SearchForm = this.fb.group({
      DateOrDateRange: [""],
      Type: [""],

      SearchValue: [""],
      status: [""],
      State: [""],
      City: [""],
      pincode: [""],
      lsp: [""],
    });

    this.TypeData = [
      { Id: 1, Name: "User" },
      { Id: 2, Name: "POSP" },
    ];
    this.statusData = [
      { Id: "0", Name: "Pending" },
      { Id: "1", Name: "Verified" },
      { Id: "2", Name: "Certified" },
      { Id: "3", Name: "Incomplete" },
      { Id: "4", Name: "Under Training" },
      { Id: "6", Name: "Rejected" },
      { Id: "7", Name: "NOC Released" },
    ];
    this.UserAgent_Filter();

    this.SelectStatusValue = [{ Id: "2", Name: "Certified" }];

    // if(this.LoginDepartmentId == 41){
    this.GetLspData();
    // }
  }

  GetLspData() {
    this.api.HttpGetType("/PospManegment/GetLspData").then(
      (result: any) => {
        if (result["status"] == true) {
          this.LSPData = result["Data"];
        }
      },
      (err) => {
        // this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  ngOnInit() {
    this.Get();
  }

  UpdatePosData(Id: any, type: any, AgentId: any) {
    this.PosId = Id;
    this.create_pos_permission = type;
    this.AgentId = AgentId;
    this.BA_BP_List = [];
    const formdata = new FormData();
    if (this.create_pos_permission == 3) {
      this.api.HttpPostType("/pos/Babp/getInternalBabp", formdata).then(
        (result: any) => {
          if (result["status"] == true) {
            // this.BA_BP_List = result['Data'][0]['Name'];
            this.BA_BP_List = result["Data"].map((item: any) => {
              return {
                Id: item.Id,
                Name: item.Name,
              };
            });
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    }
  }

  get FC() {
    return this.UpdatePosForm.controls;
  }

  Update_Pos_Form() {
    this.isSubmitted = true;
    var fields = this.UpdatePosForm.value;

    const formdata = new FormData();
    formdata.append("Remark", fields["Remark"]);
    formdata.append("AgentId", this.AgentId);
    if (this.create_pos_permission == 3) {
      formdata.append("BA_BP_List", fields["BA_BP_List"][0].Id);
    }

    formdata.append("Type", this.create_pos_permission);

    formdata.append("User_Id", this.api.GetUserData("Id"));
    formdata.append("User_Type", this.api.GetUserType());

    if (this.UpdatePosForm.invalid) {
      return;
    } else {
      this.api
        .HttpPostType("pos/Babp/UpdatePospStatusAndMapping", formdata)
        .then(
          (result: any) => {
            if (result["status"] == 1) {
              this.api.Toast("Success", result["msg"]);
              document.getElementById("close_pop").click();
              this.Get();
              this.ResetDT();

              this.UpdatePosForm.reset();
            } else {
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            // this.api.HideLoading();
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    }
  }

  UpdatePospReporting(Id, AgentId, type) {
    this.ChangePospId = Id;
    this.ChangePospIdAgentId = AgentId;
    this.UpdatePospReportingForm.reset();
    this.getEmployee(0);
  }
  getEmployee(event) {
    const formData = new FormData();
    var fields = this.UpdatePospReportingForm.value;

    formData.append("agentId", this.ChangePospId);
    formData.append("AgentRmChange", "1");
    formData.append("UpdateRmType", "ChangeRM");
    formData.append("vertical", JSON.stringify(fields["vertical"]));

    this.api.HttpPostType("MyPos/GetEmployee", formData).then(
      (result: any) => {
        if (result["status"] == true) {
          this.AlLEmployeeData = result["Data"];
          this.ChangePospRm = result["PospRm"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  ChangePospReporting() {
    var Fields = this.UpdatePospReportingForm.value;
    var msg = "Are You sure you want to change reporting";

    var r = confirm(msg);
    if (r == true) {
      const formData = new FormData();
      formData.append("agentId", this.ChangePospId);
      formData.append("new_rm_jd", Fields["reference"][0]["Id"]);
      formData.append("UpdateRmType", "ChangeRM");

      this.api
        .HttpPostType("PospReporting/UpdatePospReportingCoreRmNew", formData)
        .then(
          (result) => {
            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
            } else {
              this.api.Toast("Warning", result["msg"]);
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

  get formControls() {
    return this.SearchForm.controls;
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    //  this.dataAr = [];
    this.ResetDT();

    this.Is_Export = 0;
  }
  Reload() {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.draw();
    // });
  }
  ResetDT() {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.search('').column(0).search('').draw();
    // });
  }
  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          dtElement.dtInstance.then((dtInstance: any) => {
            var TablesNumber = `${dtInstance.table().node().id}`;
            if (TablesNumber == "Table1") {
              var fields = this.SearchForm.value;
              var DateOrDateRange = fields["DateOrDateRange"];
              var ToDate, FromDate;
              if (DateOrDateRange) {
                ToDate = DateOrDateRange[0];
                FromDate = DateOrDateRange[1];
              }
              var query = {
                User_Id: this.api.GetUserData("Id"),
                User_Type: this.api.GetUserType(),
                To_Date: this.api.StandrdToDDMMYYY(ToDate),
                From_Date: this.api.StandrdToDDMMYYY(FromDate),
                SearchValue: fields["SearchValue"],
                Type: fields["Type"],
                status: fields["status"],
                state: fields["State"],
                city: fields["City"],
                pincodeValue: fields["pincode"],
                lsp: fields["lsp"],
              };
              // console.log(query);

              dtInstance
                .column(0)
                .search(this.api.encryptText(JSON.stringify(query)))
                .draw();
            }
          });
        }
      );
    }
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  Get() {

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
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/MyPos/ViewMyAgent?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Action=" +
                this.ActionType +
                "&Pos_Type=" +
                this.api.GetUserData("pos_type")
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            // console.log(that.dataAr);

            that.FilterData = resp.FilterPolicyData;
            that.Total = resp.recordsFiltered;

            if (that.dataAr.length > 0) {
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
              FilterPolicyData: [],
            });
          });
      },
    };
  }

  PospDetails(Id: any, Type: any) {
    const dialogRef = this.dialog.open(PosDetailsComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { Id: Id, type: Type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  PospNocRequest(id: any, type: any, status: any, url: any) {
    const dialogRef = this.dialog.open(AddNocComponent, {
      width: "60%",
      height: "60%",
      disableClose: true,
      data: { id: id, type: type, status: status, url: url },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  PoliciesData(Id: any, Type: any) {
    const dialogRef = this.dialog.open(PoliciesDataComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { Id: Id, type: Type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  UpdateDocs(Id: any, Type: any) {
    const dialogRef = this.dialog.open(DocumentsComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { id: Id, type: Type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  UserAgent_Filter() {
    this.api.HttpGetType("MyPos/GetAllFilter").then(
      (result) => {
        //this.api.HideLoading();

        if (result["Status"] == true) {
          this.StateData = result["Data"]["State"];
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
        //this.api.ErrorMsg('Network Error :- ' + err.message);
      }
    );
  }

  onItemSelect(item: any, Type: any) {
    this.SearchForm.get("City").setValue("");
    // console.log("Type : " + Type);
    // console.log("onItemSelect", item);

    if (Type == "State") {
      this.ItemLOBSelection = item.Id;
      // console.log(this.ItemLOBSelection);
      this.GetCItyFilter("OneByOneSelect");
    }
  }
  onItemDeSelect(item: any, Type) {
    this.SearchForm.get("City").setValue("");

    if (Type == "State") {
      var index = (this.ItemLOBSelection = item.Id);
      // if (index > -1) {
      //   this.ItemLOBSelection.splice(index, 1);
      // }
      // console.log(this.ItemLOBSelection);
      this.GetCItyFilter("OneByOneDeSelect");
    }
  }

  GetCItyFilter(e) {
    var fields = this.ItemLOBSelection;

    const formData = new FormData();

    formData.append("StateId", this.ItemLOBSelection);
    // console.log(formData);
    this.api.IsLoading();
    this.api.HttpPostType("MyPos/CityFilter", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.CityData = result["Data"]["City"];
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
  ShowMaskingField(i) {
    this.Masking = i;
  }

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
    // navigator.clipboard.writeText(inputElement);
  }

  // lekharaj work

  UpdatePos(AgentId: any, action: any) {
    const dialogRef = this.dialog.open(UpdatePospReportingComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { AgentId: AgentId, Action: action },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
