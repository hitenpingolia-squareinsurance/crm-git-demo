import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { BmsapiService } from "src/app/providers/bmsapi.service";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

class ColumnsObj {
  Id: string;
  isSelected: any;
  SR_No: string;
  LOB_Name: string;
  File_Type: string;
  Customer_Name: string;
  RM_Name: string;
  Estimated_Gross_Premium: string;
  Add_Stamp: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  totalPremium: any[];
  SR_Current_UsersList: any;
  SQL_Where: any;
  brokreage_Ar: any;
}

@Component({
  selector: "app-brokerage-report",
  templateUrl: "./brokerage-report.component.html",
  styleUrls: ["./brokerage-report.component.css"],
})
export class BrokerageReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SQL_Where_STR: any;
  SR_Current_UsersList_Ar: any = [];
  SR_Current_UsersList_Flag: any = 1;

  SearchForm: FormGroup;
  isSubmitted = false;

  FY_Ar: Array<any>;
  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  Companies_Ar: Array<any>;
  Products_Ar: Array<any>;
  SR_Posting_Status_Ar: Array<any>;
  SR_Payout_Mode_Ar: Array<any>;
  Is_Export: any = 0;

  dataParams: any;

  SRAgentType_Ar: any = [];
  SR_Broker_Ar: any = [];
  SRLOB_Ar: any = [];
  SRStatus_Ar: any = [];
  SRType_Ar: any = [];
  SRSource_Ar: any = [];
  selectedItemsSR_Status: any = [];

  vertical_dropdownSettings: any = {};
  dropdownSettings: any = {};
  AgentdropdownSettings: any = {};
  LOB_dropdownSettings: any = {};
  SR_StatusDropdownSettings: any = {};

  ItemVerticalSelection: any = [];
  ItemEmployeeSelection: any = [];
  ItemLOBSelection: any = [];

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";

  CountHierarchy_Emp: any = 0;

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  Report_Type: any = "";

  maxDate = new Date();
  minDate = new Date();

  GroupReport: string = "No";
  activeTab: any = "Revenue";
  brokreage_Ar: any = [];
  Actual_brokreage_Ar: any = [];
  posting_Ar: any = [];
  SearchDataVal: number;
  checkLob: any;
  fillterData: any;

  constructor(
    public api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Vertical_Id: ["0"],
      Region_Id: ["0"],
      Sub_Region_Id: ["0"],
      Emp_Id: [""],
      Report_Type: [{ value: "0", disabled: true }],
      SRAgent_Type: [""],
      Agent_Id: [""],
      Product_Id: [""],
      Company_Id: [""],
      SR_Broker: [""],
      SRLOB: [""],
      CurrentUser_Id: [""],
      SRStatus: ["", [Validators.required]],
      SRType: [""],
      SR_Posting_Status: [""],
      SR_Payout_Mode: [""],
      SR_Source_Type: [""],
      FY: ["", [Validators.required]],
      DateOrDateRange: [""],
      GlobalSearch: [""],
    });

    this.vertical_dropdownSettings = {
      singleSelection: true,
      //enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };

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

    this.AgentdropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 2,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.LOB_dropdownSettings = {
      singleSelection: false,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };
    this.SR_StatusDropdownSettings = {
      singleSelection: true,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };

    this.SRAgentType_Ar = [
      { Id: "POS", Name: "POS" },
      { Id: "SP", Name: "SP" },
      { Id: "SPC", Name: "SPC" },
      { Id: "Dealer", Name: "Dealer" },
      { Id: "Direct", Name: "Direct" },
    ];
    this.SRLOB_Ar = [
      { Id: "Motor", Name: "Motor" },
      { Id: "Non Motor", Name: "Non Motor" },
      { Id: "Health", Name: "Health" },
      { Id: "Travel", Name: "Travel" },
      { Id: "Personal Accident", Name: "Personal Accident" },
      { Id: "Life-Fresh", Name: "Life Fresh" },
      { Id: "Life-Renewal", Name: "Life Renewal" },
    ]; //

    //this.selectedItemsSR_Status = [{ Id: 'Logged', Name: 'Logged' }];

    //this.SearchForm.get('SRStatus').setValue(this.selectedItemsSR_Status);
    //this.SearchForm.get('Vertical_Id').setValue(this.api.GetUserData('Department_Id'));
  }

  ngOnInit(): void {
    this.Get();
    this.SearchComponentsData();
    this.GetEmployees();
  }

  get FC() {
    return this.SearchForm.controls;
  }

  onItemSelectFY(item: any, type: any) {
    //Financial Year
    ////   //   console.log(item.target.value);
    if (type == 1) {
      var Years = item;
    } else {
      var Years = item.target.value;
    }

    var Explods = Years.split("-");
    var Year1 = parseInt(Explods[0]);
    var Year2 = Year1 + 1;
    this.minDate = new Date("04-01-" + Year1);
    this.maxDate = new Date("03-31-" + Year2);
    this.SearchForm.get("DateOrDateRange").setValue("");
    this.SearchForm.get("DateOrDateRange").updateValueAndValidity();
  }

  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .Call(
        "sr/Agent/SearchComponentsData?User_Id=" +
          this.api.GetUserId() +
          "&activeTab=" +
          this.activeTab
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.FY_Ar = result["Data"]["FY_Ar"];
            this.Vertical_Ar = result["Data"]["Vertical"];
            //this.Emps_Ar = result['Data']['Hierarchy']['Employee'];
            this.Companies_Ar = result["Data"]["Ins_Compaines"];
            //this.Products_Ar = result['Data']['Products_Ar'];
            this.Region_Ar = result["Data"]["Region_Ar"];
            this.SR_Broker_Ar = result["Data"]["Broker_Ar"];

            //this.SRLOB_Ar =  result['Data']['SRLOB_Ar'];
            this.SRStatus_Ar = result["Data"]["SRStatus_Ar"];
            this.SRType_Ar = result["Data"]["SRType_Ar"];
            this.SRSource_Ar = result["Data"]["SRSource_Ar"];
            this.SR_Payout_Mode_Ar = result["Data"]["SRPayout_Mode_Ar"];
            this.SR_Posting_Status_Ar = result["Data"]["SRPosting_Status_Ar"];

            this.SearchForm.get("FY").setValue(result["Data"]["CurrentFY"]);
            this.SearchForm.get("FY").updateValueAndValidity();
            this.onItemSelectFY(result["Data"]["CurrentFY"], 1);
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

  tab(t: any) {
    this.activeTab = t;
  }

  Get() {
    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBms +
                "/../../v2/reports/BrokerageReport_v2/Grid?User_Id=" +
                this.api.GetUserId() +
                "&activeTab=" +
                this.activeTab
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBms)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            that.dataAr = resp.data;

            //that.SQL_Where_STR = resp.SQL_Where;

            if (that.dataAr.length > 0) {
              that.Is_Export = 1;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              //TotalNetPremiumAr: resp.totalPremium,
              data: [],
            });
          });
      },
      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }

  ReportTypeFilter(selectionAr) {
    //   //   console.log(selectionAr.length);

    if (selectionAr.length == 1) {
      this.SearchForm.get("Report_Type").enable();
      this.SearchForm.get("Report_Type").updateValueAndValidity();

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Vertical_Id", this.SearchForm.value["Vertical_Id"]);
      formData.append("Hierarchy_Emp_Id", selectionAr[0]);
      this.api
        .HttpPostType("sr/AgentTest/CountHierarchy_Employees", formData)
        .then(
          (result) => {
            if (result["Status"] == true) {
              this.CountHierarchy_Emp = result["Total"];
            } else {
              this.api.ErrorMsg(result["Message"]);
            }
          },
          (err) => {
            this.api.ErrorMsg(
              "Network Error, Please try again ! " + err.message
            );
          }
        );
    } else {
      this.SearchForm.get("Report_Type").setValue("0");
      this.SearchForm.get("Report_Type").disable();
      this.SearchForm.get("Report_Type").updateValueAndValidity();
    }
  }

  onItemSelect(item: any, Type: any) {
    //   //   console.log("Type : " + Type);
    //   //   console.log("onItemSelect", item);

    if (Type == "Vertical") {
      this.Emps_Ar = [];
      this.Agents_Ar = [];

      this.ItemVerticalSelection.push(item.Id);
      //   //   console.log(this.ItemVerticalSelection);
      //this.GetEmployees('OneByOneSelect');
    }

    if (Type == "Employee") {
      this.Agents_Ar = [];
      this.ItemEmployeeSelection.push(item.Id);
      ////   //   console.log(this.ItemEmployeeSelection.length);

      this.ReportTypeFilter(this.ItemEmployeeSelection);

      this.GetAgents("OneByOneSelect");
    }
    if (Type == "LOB") {
      this.ItemLOBSelection.push(item.Id);
      //   //   console.log(this.ItemLOBSelection);
      this.GetProducts("OneByOneSelect");
    }
  }

  onItemDeSelect(item: any, Type: any) {
    //   //   console.log("Type : " + Type);
    //   //   console.log("onDeSelect", item);

    if (Type == "Vertical") {
      this.Emps_Ar = [];
      this.Agents_Ar = [];

      var index = this.ItemVerticalSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemVerticalSelection.splice(index, 1);
      }
      ////   //   console.log(this.ItemVerticalSelection);
      //this.GetEmployees('OneByOneDeSelect');
    }

    if (Type == "Employee") {
      this.Agents_Ar = [];

      var index = this.ItemEmployeeSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemEmployeeSelection.splice(index, 1);
      }
      ////   //   console.log(this.ItemEmployeeSelection);

      this.ReportTypeFilter(this.ItemEmployeeSelection);

      this.GetAgents("OneByOneDeSelect");
    }
    if (Type == "LOB") {
      var index = this.ItemLOBSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemLOBSelection.splice(index, 1);
      }
      //   //   console.log(this.ItemLOBSelection);
      this.GetProducts("OneByOneDeSelect");
    }
  }

  GetEmployees() {
    this.Emps_Ar = [];
    this.Agents_Ar = [];
    this.ItemEmployeeSelection = [];

    this.SearchForm.get("Emp_Id").setValue(null);
    this.SearchForm.get("Agent_Id").setValue(null);

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    //formData.append('Type',Type);
    formData.append("Vertical_Id", this.SearchForm.value["Vertical_Id"]);
    formData.append("Region_Id", this.SearchForm.value["Region_Id"]);
    formData.append("Sub_Region_Id", this.SearchForm.value["Sub_Region_Id"]);

    this.api.HttpPostType("sr/AgentTest/GetEmployees", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Emps_Ar = result["Data"];
          this.Employee_Placeholder =
            "Select Employee (" + this.Emps_Ar.length + ")";
          this.Agents_Placeholder = "Select Agent";
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  GetSubBranches(e) {
    this.GetEmployees();

    this.SearchForm.get("Sub_Region_Id").setValue("0");

    var Branch_Id = e.target.value;

    this.api.IsLoading();
    this.api
      .Call(
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

  GetAgents(Type) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("Payout_Mode", this.Report_Type);
    formData.append("RM_Ids", this.ItemEmployeeSelection.join());
    this.api.HttpPostType("sr/AgentTest/GetAgentsInPosting", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Agents_Ar = result["Data"];
          this.Agents_Placeholder =
            "Select Agents (" + this.Agents_Ar.length + ")";
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  GetProducts(Type) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", this.ItemLOBSelection.join());
    this.api.HttpPostType("sr/AgentTest/GetProducts", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Products_Ar = result["Data"];
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  ViewAgentGroupWise(type_: any) {
    var query = {
      type: type_,
      Params: this.fillterData,
    };
    //   //   console.log(query);
    this.Is_Export = 0;
    //this.SR_Current_UsersList_Flag = 1;
    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
      //this.Is_Export = 1;
    });

    // 		this.isSubmitted = true;
    // 	if(this.SearchForm.invalid){
    // 		return;
    // 	}else{
    // 		////   //   console.log(this.SearchForm.value);
    // 		this.GroupReport='Yes';

    // 		var fields = this.SearchForm.value;

    // 		var DateOrDateRange = fields['DateOrDateRange'];
    // 		var ToDate,FromDate;

    // 		if(DateOrDateRange){
    // 		ToDate = DateOrDateRange[0];
    // 		FromDate = DateOrDateRange[1];
    // 		}

    // 	var query = {
    // 		Role : this.api.GetUserData('UserType_Name'),
    // 		PO_Type : type,
    // 		Vertical_Id : fields['Vertical_Id'],
    // 		Region_Id : fields['Region_Id'],
    // 		Sub_Region_Id : fields['Sub_Region_Id'],

    // 		Report_Type : fields['Report_Type'],
    // 		Emp_Id : fields['Emp_Id'],
    // 		SRAgent_Type : fields['SRAgent_Type'],
    // 		Agent_Id : fields['Agent_Id'],

    // 		Broker : fields['SR_Broker'],
    // 		LOB : fields['SRLOB'],
    // 		Product_Id : fields['Product_Id'],
    // 		Company_Id : fields['Company_Id'],

    // 		CurrentUser_Id : fields['CurrentUser_Id'],
    // 		Source : fields['SR_Source_Type'],
    // 		SR_Status : fields['SRStatus'],
    // 		SR_Type : fields['SRType'],
    // 		SR_Posting_Status : fields['SR_Posting_Status'],
    // 		SR_Payout_Mode : fields['SR_Payout_Mode'],
    // 		FY : fields['FY'],
    // 		GlobalSearch : fields['GlobalSearch'],

    // 		To_Date : this.api.StandrdToDDMMYYY(ToDate),
    // 		From_Date : this.api.StandrdToDDMMYYY(FromDate),
    // 	}

    // 	//   //   console.log(query);
    // 	this.Is_Export = 0;
    // 	//this.SR_Current_UsersList_Flag = 1;
    // 	this.dataAr = [];
    // 	this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // 		dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
    // 		//this.Is_Export = 1;
    // 	});

    //   }
  }

  SearchData(event: any) {
    this.fillterData = event;
    //   //   //   console.log(event);
    // alert();
    // this.SearchDataVal = 1;
    // if (event["LOB"] != "") {
    //   this.checkLob = event["LOB"][0]["Id"];
    // }

    // this.datatableElement.dtInstance.then((dtInstance: any) => {
    //   var TablesNumber = `${dtInstance.table().node().id}`;
    //   // alert();
    //   if (TablesNumber == "Table1") {
    //     dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
    //   }
    // });
    // this.api.IsLoading();

    this.dataAr = [];
    this.ResetDT();
    this.GroupReport = "No";

    const formData = new FormData();
    formData.append("Params", JSON.stringify(event));
    this.api.IsLoading();
    this.api
      .HttpPostType(
        "../v2/reports/BrokerageReport_v2?User_Id=" +
          this.api.GetUserId() +
          "&activeTab=" +
          this.activeTab,
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            if (this.activeTab == "Revenue") {
              this.brokreage_Ar = result["brokreage_Ar"];
            } else if (this.activeTab == "Actual_Revenue") {
              this.Actual_brokreage_Ar = result["brokreage_Ar"];
            } else {
              this.posting_Ar = result["brokreage_Ar"];
            }
          } else {
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      ////   //   console.log(this.SearchForm.value);

      var fields = this.SearchForm.value;

      var DateOrDateRange = fields["DateOrDateRange"];
      var ToDate, FromDate;

      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      var query = {
        Role: this.api.GetUserData("UserType_Name"),

        Vertical_Id: fields["Vertical_Id"],
        Region_Id: fields["Region_Id"],
        Sub_Region_Id: fields["Sub_Region_Id"],

        Report_Type: fields["Report_Type"],
        Emp_Id: fields["Emp_Id"],
        SRAgent_Type: fields["SRAgent_Type"],
        Agent_Id: fields["Agent_Id"],

        Broker: fields["SR_Broker"],
        LOB: fields["SRLOB"],
        Product_Id: fields["Product_Id"],
        Company_Id: fields["Company_Id"],

        CurrentUser_Id: fields["CurrentUser_Id"],
        Source: fields["SR_Source_Type"],
        SR_Status: fields["SRStatus"],
        SR_Type: fields["SRType"],
        SR_Posting_Status: fields["SR_Posting_Status"],
        SR_Payout_Mode: fields["SR_Payout_Mode"],
        FY: fields["FY"],
        GlobalSearch: fields["GlobalSearch"],

        To_Date: this.api.StandrdToDDMMYYY(ToDate),
        From_Date: this.api.StandrdToDDMMYYY(FromDate),
      };

      //   //   //   console.log(query);

      /*
    this.Is_Export = 0;	 
    this.SR_Current_UsersList_Flag = 1;	
    this.dataAr = []; 
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
      //this.Is_Export = 1;
      
    });
    */

      this.dataAr = [];
      this.ResetDT();
      this.GroupReport = "No";

      const formData = new FormData();
      formData.append("Params", JSON.stringify(query));
      this.api.IsLoading();
      this.api
        .HttpPostType(
          "../v2/reports/BrokerageReport_v2?User_Id=" +
            this.api.GetUserId() +
            "&activeTab=" +
            this.activeTab,
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["Status"] == true) {
              if (this.activeTab == "Revenue") {
                this.brokreage_Ar = result["brokreage_Ar"];
              } else if (this.activeTab == "Actual_Revenue") {
                this.Actual_brokreage_Ar = result["brokreage_Ar"];
              } else {
                this.posting_Ar = result["brokreage_Ar"];
              }
            } else {
            }
          },
          (err) => {
            this.api.HideLoading();
          }
        );
    }
  }

  ExportExcel(): void {
    ////   //   console.log(this.SQL_Where_STR);
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.SearchForm.get("Vertical_Id").setValue("0");
    this.SearchForm.get("Region_Id").setValue("0");
    this.SearchForm.get("Sub_Region_Id").setValue("0");
    this.SearchForm.get("Report_Type").setValue("0");

    this.Emps_Ar = [];
    this.Agents_Ar = [];

    this.Employee_Placeholder = "Select Employee";
    this.Agents_Placeholder = "Select Agent";

    this.ItemVerticalSelection = [];
    this.ItemEmployeeSelection = [];
    this.ItemLOBSelection = [];
    //this.SR_Current_UsersList_Ar=[];

    this.masterSelected = false;
    this.checkedList = [];

    this.dataAr = [];
    this.ResetDT();
    this.GroupReport = "No";
    this.Is_Export = 0;
  }

  Reload() {
    this.masterSelected = false;
    this.checkedList = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }
}
