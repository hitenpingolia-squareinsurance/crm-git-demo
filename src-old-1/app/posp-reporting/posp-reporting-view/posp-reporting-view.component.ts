import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { UpdatePospReportingComponent } from "src/app/mypos/update-posp-reporting/update-posp-reporting.component";
import { TransferLobComponent } from "../transfer-lob/transfer-lob.component";
import { TransferMultiplePospComponent } from "../transfer-multiple-posp/transfer-multiple-posp.component";

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
  AgentId: string;
  selected: any;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
  EmployeeType: any;
}

@Component({
  selector: "app-posp-reporting-view",
  templateUrl: "./posp-reporting-view.component.html",
  styleUrls: ["./posp-reporting-view.component.css"],
})
export class PospReportingViewComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

  ActivePage: string = "Default";
  Masking: any = "Temp";
  MaskingType: any = "Temp";
  SearchForm: FormGroup;

  isSubmitted = false;
  isSubmitted1 = false;

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

  currentUrl: string;
  loginUserCode: any;
  StatusDataAr: any[];
  TranferMultiplePospForm: FormGroup;
  LobData: any = [];
  StatusDataArValue: { Id: number; Name: string }[];
  selectAll: any;
  console: any;
  StatusDataStatusValue: number = 0;
  VerticalData: any;
  EmployeeData: any;
  DataSelected: any = [];
  postNested: Array<any> = [];
  postNestedRemove: Array<any> = [];
  pageNo: number;
  RightsData: any;
  NewEmployeeType: any;
  AgentLobWiseLog: any;
  WhatsAppCheck: any;
  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.StatusDataAr = [
      { Id: 0, Name: "Vertical Assigned" },
      { Id: 1, Name: "RM Assigned" },
      { Id: 2, Name: "Withdraw Request" },
      { Id: 3, Name: "Withdrawn" },
      // { Id: 4, Name: "Team Request" },
    ];
    this.StatusDataArValue = [{ Id: 0, Name: "Vertical Assigned" }];
    this.loginType = this.api.GetUserType();
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

    this.StatusDataStatusValue = 0;
    this.SearchForm = this.fb.group({
      LOB: [""],
      SearchValue: [""],
      Status: [""],
      State: [""],
      City: [""],
      QuoteType: [""],
      Vertical: [""],
    });

    this.statusData = [
      { Id: "0", Name: "Pending" },
      { Id: "1", Name: "Verified" },
      { Id: "2", Name: "Certified" },
      { Id: "3", Name: "Incomplete" },
      { Id: "4", Name: "Under Taining" },
      { Id: "6", Name: "Rejected" },
      { Id: "7", Name: "NOC Released" },
    ];
  }

  ngOnInit() {
    this.loginUserCode = this.api.GetUserData("Code");
    this.currentUrl = this.router.url;
    this.CheckRights();

    this.Get();

    // let ApiUrl = "/PospReporting/ViewLobWisePosp?User_Id=";
    // if (this.currentUrl == "/posp-reporting/posp-lob-request-admin") {
    //   ApiUrl = "/PospReporting/ViewLobWisePospAdmin?User_Id=";
    // }

    if (this.currentUrl == "/posp-reporting/posp-lob-request") {
      this.FetchMultiplePospVertical();
    }
    this.setWhatsAppHref();
  }

  ngAfterViewInit(): void {}

  get formControls() {
    return this.SearchForm.controls;
  }

  get formControls2() {
    return this.TranferMultiplePospForm.controls;
  }

  CheckRights() {
    // ['status' => true, 'Message' => '', 'Rights' => 'Allowed

    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginCode", this.api.GetUserData("Code"));
    formData.append("loginType", this.api.GetUserType());
    this.api
      .HttpPostType("PospReporting/PospLobWiseRights", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.RightsData = result["Rights"];
        }
      });
  }

  selectAllRows() {
    this.dataAr.forEach((row) => {
      row.selected = true;
      this.postNested = this.postNested.concat(row);
    });
    if (!this.selectAll) {
      // If "Select All" is unchecked, uncheck the header checkbox
      this.selectAll = false;
    }
  }

  headerClick(event: Event) {
    event.stopPropagation();
  }

  getSelectedItems() {
    const selectedItems: any = this.dataAr.filter(
      (postNested) => this.postNestedRemove
    );

    const selectedItemsw: any = this.postNested;

    // const selectedIds = selectedItems.map((item) => item.Id);

    //   //   //   console.log(selectedItems);
    //   //   //   console.log(selectedItemsw);
  }

  // Function to select a single row
  selectRow(row: any) {
    if (!row.selected) {
      const index = this.postNested.indexOf(row);
      // If the row is found, remove it from postNested
      if (index !== -1) {
        this.postNested.splice(index, 1);
      }
      this.selectAll = false;
    } else {
      this.postNested = this.postNested.concat(row);
    }
  }

  TransferPospData() {}

  FetchMultiplePospVertical() {
    var fields = this.ItemLOBSelection;

    this.VerticalData = [];
    this.LobData = [];
    this.StateData = [];
    this.CityData = [];
    const formData = new FormData();
    const Status: any = this.SearchForm.get("Status").value;

    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("Status", JSON.stringify(Status));

    // console.log(formData);
    this.api.IsLoading();
    this.api
      .HttpPostType("PospReporting/FetchMultiplePospVertical", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.VerticalData = result["VerticalData"];

            this.FetchMultiplePospLob();
          } else {
            this.dataAr = [];
            this.FilterData = [];
            this.Total = 0;

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

  FetchMultiplePospLob() {
    var fields = this.ItemLOBSelection;
    const formData = new FormData();

    this.LobData = [];
    this.StateData = [];
    this.CityData = [];

    const Status: any = this.SearchForm.get("Status").value;
    const Vertical: any = this.SearchForm.get("Vertical").value;
    formData.append("Vertical", JSON.stringify(Vertical));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("Status", JSON.stringify(Status));
    // console.log(formData);
    this.api.IsLoading();
    this.api.HttpPostType("PospReporting/FetchMultiplePospLob", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.LobData = result["LobData"];

          this.GetStatePospFilter("");
        } else {
          this.dataAr = [];
          this.FilterData = [];
          this.Total = 0;

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

  GetStatePospFilter(e) {
    this.SearchForm.get("City").setValue("");
    this.SearchForm.get("State").setValue("");
    this.StateData = [];
    this.CityData = [];
    const formData = new FormData();

    const lob: any = this.SearchForm.get("LOB").value;
    const Status: any = this.SearchForm.get("Status").value;
    const Vertical: any = this.SearchForm.get("Vertical").value;
    formData.append("Vertical", JSON.stringify(Vertical));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("lob", JSON.stringify(lob));
    formData.append("Status", JSON.stringify(Status));

    // formData.append("lob", JSON.stringify(lob));
    // console.log(formData);
    this.api.IsLoading();
    this.api.HttpPostType("PospReporting/GetStatePospFilterLob", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.StateData = result["StateData"];
          this.GetCityPospFilter("");
        } else {
          this.dataAr = [];
          this.FilterData = [];
          this.Total = 0;

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

  GetCityPospFilter(e) {
    this.SearchForm.get("City").setValue("");

    const lob: any = this.SearchForm.get("LOB").value;
    const State: any = this.SearchForm.get("State").value;
    const Status: any = this.SearchForm.get("Status").value;
    this.CityData = [];
    const Vertical: any = this.SearchForm.get("Vertical").value;

    const formData = new FormData();
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("lob", JSON.stringify(lob));
    formData.append("State", JSON.stringify(State));
    formData.append("Status", JSON.stringify(Status));
    formData.append("Vertical", JSON.stringify(Vertical));
    // formData.append("lob", JSON.stringify(lob));
    // console.log(formData);
    this.api.IsLoading();

    this.api.HttpPostType("PospReporting/GetCityPospFilterLob", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.CityData = result["CityData"];
          // this.StateData = result["Data"]["State"];
        } else {
          this.api.Toast("Warning", result["Message"]);

          this.dataAr = [];

          this.FilterData = [];
          this.Total = 0;
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

  ClearSearch() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
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

              var query = {
                SearchValue: fields["SearchValue"],
                Status: fields["Status"],
                State: fields["State"],
                City: fields["City"],
                LOB: fields["LOB"],
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

  Get() {
    // alert();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    // console.log(this.currentUrl);
    let ApiUrl = "/PospReporting/ViewLobWisePosp?User_Id=";
    if (
      this.currentUrl == "/posp-reporting/posp-lob-request-admin" ||
      this.currentUrl == "/posp-reporting/posp-lob-request-user"
    ) {
      ApiUrl = "/PospReporting/ViewLobWisePospAdmin?User_Id=";
    }

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
                ApiUrl +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&Action=" +
                this.ActionType +
                "&Pos_Type=" +
                this.api.GetUserData("pos_type") +
                "&url=" +
                this.currentUrl
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            this.postNested = [];

            that.dataAr = resp.data;
            that.NewEmployeeType = resp.EmployeeType;
            // console.log(that.dataAr);

            that.FilterData = resp.FilterPolicyData;
            that.Total = resp.recordsFiltered;

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

  onItemSelect(item: any, Type: any) {
    this.SearchForm.get("City").setValue("");

    if (Type == "Vertical") {
      this.SearchForm.get("LOB").setValue("");

      this.FetchMultiplePospLob();
    }
    if (Type == "State") {
      this.GetCityPospFilter("OneByOneSelect");
    }
    if (Type == "LOB") {
      this.ItemLOBSelection = item.Id;
      // console.log(this.ItemLOBSelection);

      this.SearchForm.get("State").setValue("");

      this.GetStatePospFilter("OneByOneSelect");
    }

    if (Type == "Status") {
      this.ItemLOBSelection = item.Id;
      this.StatusDataStatusValue = item.Id;

      this.FetchMultiplePospVertical();
    }
  }

  onItemDeSelect(item: any, Type) {
    if (Type == "Vertical") {
      this.SearchForm.get("LOB").setValue("");

      this.FetchMultiplePospLob();
    }
    if (Type == "State") {
      this.SearchForm.get("City").setValue("");

      this.GetCityPospFilter("");
    }
    if (Type == "LOB") {
      this.SearchForm.get("State").setValue("");

      this.GetStatePospFilter("");
    }

    if (Type == "Status") {
      this.ItemLOBSelection = item.Id;
      this.StatusDataStatusValue = item.Id;
    }

    // if (Type == "State") {
    //   var index = (this.ItemLOBSelection = item.Id);
    //   // if (index > -1) {
    //   //   this.ItemLOBSelection.splice(index, 1);
    //   // }
    //   // console.log(this.ItemLOBSelection);
    //   this.GetCItyFilter("OneByOneDeSelect");
    // }
  }

  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "Table1") {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
    });
  }

  ShowMaskingField(i) {
    this.Masking = i;
  }

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
    // navigator.clipboard.writeText(inputElement);
  }

  // lekharaj work

  UpdatePos(Id: any, AgentId: any) {
    const dialogRef = this.dialog.open(UpdatePospReportingComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { Id: Id, AgentId: AgentId },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  TransferPos(
    parentCode: any,
    AgentId: any,
    Lob: any,
    department_id: any,
    Id: any,
    Action: any
  ) {
    const dialogRef = this.dialog.open(TransferLobComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: {
        ParentCode: parentCode,
        AgentId: AgentId,
        Lob: Lob,
        department_id: department_id,
        LogId: Id,
        Action: Action,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Get();
    });
  }

  ApproveRequest(
    parentCode: any,
    AgentId: any,
    Lob: any,
    department_id: any,
    Id: any
  ) {
    // // console.log(fields);
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_code", this.api.GetUserData("Code"));
    formData.append("parentCode", parentCode);
    formData.append("AgentId", AgentId);
    formData.append("Lob", Lob);
    formData.append("department_id", department_id);
    formData.append("RequestId", Id);
    formData.append("Remark", "RM Update");

    this.api.IsLoading();
    this.api.HttpPostType("PospReporting/ApproveRequest", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == 1) {
          this.api.Toast("Success", result["msg"]);
          this.SearchBtn();
        } else {
          const msg = "msg";

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

  MultipleTransferFillterWise() {
    var fields = this.SearchForm.value;
    if (
      fields["Vertical"] != "" &&
      fields["LOB"] != "" &&
      fields["State"] != "" &&
      fields["Status"][0]["Id"] == 0
    ) {
      const agentIds: any = this.postNested.map((item) => item.AgentId);
      agentIds.join(", ");

      //   //   //   console.log(agentIds);

      const dialogRef = this.dialog.open(TransferMultiplePospComponent, {
        width: "80%",
        height: "80%",
        disableClose: true,
        data: {
          Vertical: fields["Vertical"][0]["Id"],
          LOB: fields["LOB"],
          State: fields["State"],
          City: fields["City"],
          Status: fields["Status"],
          agentIds: agentIds,
        },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        this.SearchBtn();
      });
    } else {
      if (fields["Vertical"] == "") {
        this.api.Toast("Warning", "Please Select Vertical Frist");
      }
      if (fields["LOB"] == "") {
        this.api.Toast("Warning", "Please Select LOB After Vertical");
      }
      if (fields["State"] == "") {
        this.api.Toast("Warning", "Please Select State After LOB");
      }
    }
  }

  UpdatePospReporting(AgentId: any, action: any) {
    const dialogRef = this.dialog.open(UpdatePospReportingComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { AgentId: AgentId, Action: action },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  UpdatePospReportingViewRequest(lob, AgentId) {
    const formData = new FormData();
    formData.append("lob", lob);
    formData.append("AgentId", AgentId);
    this.api
      .HttpPostType("PospReporting/UpdatePospReporting", formData)
      .then((result: any) => {
        if (result["Status"] == true) {
          this.AgentLobWiseLog = result["Data"];
        } else {
          this.AgentLobWiseLog = [];
        }
      });
  }

  //new
  setWhatsAppHref(): any {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      this.WhatsAppCheck = true;
    } else {
      this.WhatsAppCheck = false;
    }
  }
}
