import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../providers/api.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { LifeRenewalActionComponent } from '../../modals/life-renewal-action/life-renewal-action.component';
import { LifeRenewalsTrackComponent } from '../../modals/life-renewals-track/life-renewals-track.component';
import { UpdatePaymentFrequencyComponent } from '../../modals/life-renewals/update-payment-frequency/update-payment-frequency.component';
import { UpdateRenewalDateComponent } from '../../modals/life-renewals/update-renewal-date/update-renewal-date.component';

class ColumnsObj {
  Request_Type: string;
  isSelected: any;
  Track_Id: any;
  Id: string;
  Step_Id: string;
  Agent_Id: any;
  Posting_Status_Web: any;
  SR_No: string;
  Add_Stamp: string;
  LI_Status: any;
  LOB_Name: string;
  Segment_Id: string;
  Product_Id: string;
  SubProduct_Id: string;
  Agent_Name: string;
  RM_Name: string;
  ShowAction: string;
  Policy_Issuance_Date: string;
  Estimated_Gross_Premium: string;
  Net_Premium: string;
  Renewal_Date: string;
  Renewal_Sequence: string;
  LI_Payment_Frequency: string;
  LI_Proposer_Type: string;
  Renewal_Status: string;
  Lapsed_Days: string;
  ChangePayFrequency: string;
  RenewalYear: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  PostingCountAr: any;
  SQL_Where: any;
  FilterData: any[];
  RenewalQuery: any[];
}

@Component({
  selector: 'app-life-renewals-report',
  templateUrl: './life-renewals-report.component.html',
  styleUrls: ['./life-renewals-report.component.css']
})

export class LifeRenewalsReportComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  UserId: number = this.api.GetUserData('Id');

  urlSegment: any = 'life-renewals-report';
  ActivePage: string = 'Default';
  ActiveTab: any = 1;
  statusType: string = '';

  SearchForm: FormGroup;
  isSubmitted = false;

  DisableMonthField = false;
  DisableStatusField = false;
  ReportTypeDisable = false;

  ShowDateFilter: any = 'No';
  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Emps_Ar: Array<any>;
  ReportTypeData: Array<any>;
  SelectedReportType: Array<any>;

  Agents_Ar: Array<any>;
  Companies_Ar: Array<any>;
  Year_Ar: Array<any>;
  Months_Ar: Array<any>;
  Status_Ar: Array<any>;
  SrStatusValue: Array<any>;
  RenewalPeriod_Ar: Array<any>;

  SRAgentType_Ar: any = [];
  SRStatus_Ar: any = [];
  SRType_Ar: any = [];
  SRSource_Ar: any = [];

  dropdownSettingsmultiselect: {};
  dropdownSettingsmultiselect1: {};
  dropdownSettingsingleselect: {};
  dropdownSettingsingleselect1: {};

  Employee_Placeholder: any = 'Select Employee';
  Agents_Placeholder: any = 'Select POS';
  LoginProfileName: any = '';

  DisableNextMonth: any;

  Assign_User: any = '';
  Remark: any = '';

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];
  CurrentMonth: any = '';
  Name: any = '';
  SelectedYear: any = [];
  SelectedCurrentMonth: any = [];
  SelectedCurrentStatus: any = [];
  MonthRenewal: any = [];
  FilterDatatype: any;

  maxDate = new Date();
  minDate = new Date();

  SQL_Where_STR: any;
  TotalRes: any = 0;
  TotalPremium: any = 0;
  TotalPending: any = 0;
  TotalPendingPremium: any = 0;
  TotalRenewed: any = 0;
  TotalRenewedPremium: any = 0;
  TotalLost: any = 0;
  TotalLostPremium: any = 0;

  Is_Export: any = 0;
  dateRange: any;

  constructor(public api: ApiService, private http: HttpClient, public dialog: MatDialog, private router: Router, private fb: FormBuilder) {

    this.SearchForm = this.fb.group({
      Financial_Year: ['', [Validators.required]],
      Business_Line_Id: [''],
      Vertical_Id: [''],
      Region_Id: [''],
      Emp_Id: [''],
      Report_Type: [''],
      Agent_Id: [''],
      Product_Id: [''],
      Company_Id: [''],
      SR_Source_Type: [''],
      GlobalSearch: [''],
      DateOrDateRange: [''],
      Month_Name: ['', [Validators.required]],
      Status: ['', [Validators.required]]
    });


    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true
    };

    this.dropdownSettingsmultiselect1 = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false
    };

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false
    };

    this.ReportTypeData = [{ Id: "Self", Name: "Self" }, { Id: "Team", Name: "Team" }];

    this.SelectedReportType = [{ Id: "Team", Name: "Team" }];
    this.SelectedCurrentStatus = [{ Id: 'Due', Name: 'Dues' }];

    //Month Related Filter Values
    const d = new Date();
    this.CurrentMonth = d.getMonth();
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    //Month String Value
    this.Name = month[d.getMonth()];

    //Month Numeric Value
    this.CurrentMonth = +this.CurrentMonth + +1;
    if (this.CurrentMonth < 11) {
      this.CurrentMonth = '0' + this.CurrentMonth;
    }

    this.SelectedCurrentMonth = [{ 'Id': this.CurrentMonth, 'Name': this.Name }];

  }

  ngOnInit(): void {

    this.ActivePage = 'Renewals';

    this.SearchComponentsData();
    this.GetEmployees();
    this.GetLoginEmployeeData();
    this.Get(1);
    this.FilterDataGetMonthRenewal();

  }


  //===== UPDATE DATE RANGE =====//
  CheckDateLimit(item: any) {

    var Years = item.Id;
    var Explods = Years.split("-");
    var Year1 = parseInt(Explods[0]);
    var Year2 = Year1 + 1;

    this.minDate = new Date("04-01-" + Year1);
    this.maxDate = new Date("03-31-" + Year2);

    this.SearchForm.get("DateOrDateRange").setValue("");

  }
  ChangeStatus(e: any) {

  }

  //===== FORM CONTROLS VALIDATION =====//
  get FC() { return this.SearchForm.controls; }


  //===== GET LOGIN EMPLOYEE DATA =====//
  GetLoginEmployeeData() {

    const formData = new FormData();
    formData.append('Portal', 'CRM');
    formData.append('User_Code', this.api.GetUserData('Code'));
    formData.append('IdType', 'Code');
    formData.append('UrlSegment', 'Employee-Targets');

    this.api.HttpPostTypeBms('common/Common/GetLoginEmployeeData', formData).then((result:any) => {
      if (result['Status'] == true) {
        this.LoginProfileName = result['ProfileName'];

      }

    }, (err) => {
      this.api.Toast('Warning', 'Network Error : ' + err.name + '(' + err.statusText + ')');
    });

  }


  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {

    this.Emps_Ar = [];
    this.Employee_Placeholder = 'Select Employee';
    this.SearchForm.get('Emp_Id').setValue('');
    this.SearchForm.get('Vertical_Id').setValue('');

    const formData = new FormData();
    formData.append('Portal', 'CRM');
    formData.append('PageName', this.urlSegment);
    formData.append('User_Code', this.api.GetUserData('Code'));

    this.api.IsLoading();
    this.api.HttpPostTypeBms('common/FilterData/SearchComponentsData', formData).then((result:any) => {
      this.api.HideLoading();
      if (result['Status'] == true) {
        //this.BusinessLine_Ar = result['Data']['Business_Line_Ar'];
        this.Year_Ar = result['Data']['YearsArray'];
        this.SelectedYear = result['Data']['CurrentYear'];
        this.Vertical_Ar = result['Data']['Vertical'];
        this.Region_Ar = result['Data']['Region_Ar'];
        this.Companies_Ar = result['Data']['LifeInsCompanyArray'];
        this.SRSource_Ar = result['Data']['SrSourceArray'];
        this.RenewalPeriod_Ar = result['Data']['RenewalPeriodArray'];
        this.Status_Ar = result['Data']['RenewalStatusArray'];
        this.Months_Ar = result['Data']['RenewalMonthsArray'];

        var Values1 = this.SelectedYear[0].Id;
        var Year1 = parseInt(Values1);
        var Year2 = Year1 + 1;

        this.minDate = new Date("04-01-" + Year1);
        this.maxDate = new Date("03-31-" + Year2);

      }
    }, (err) => {
      this.api.HideLoading();
    });

  }


  //===== GET VERTICAL DATA =====//
  GetVerticalData() {

    this.Emps_Ar = [];
    this.Employee_Placeholder = 'Select Employee';
    this.SearchForm.get('Emp_Id').setValue('');

    const formData = new FormData();
    formData.append('Portal', 'CRM');
    formData.append('PageName', this.urlSegment);
    formData.append('User_Code', this.api.GetUserData('Code'));
    formData.append('Business_Line_Id', JSON.stringify(this.SearchForm.value['Business_Line_Id']));

    this.api.HttpPostTypeBms('common/FilterData/GetVerticalData', formData).then((result:any) => {
      if (result['Status'] == true) {
        this.Vertical_Ar = result['Data'];

      } else {
        this.api.Toast('Warning', result['Message']);
        this.SearchForm.get('Vertical_Id').setValue('');
      }

    }, (err) => {
      this.api.Toast('Warning', 'Network Error : ' + err.name + '(' + err.statusText + ')');
    });

  }


  //===== GET EMPLOYEES DATA =====//
  GetEmployees() {

    this.Emps_Ar = [];
    this.Agents_Ar = [];
    this.SearchForm.get('Emp_Id').setValue('');
    this.SearchForm.get('Agent_Id').setValue('')
    this.SelectedReportType = [{ Id: "Team", Name: "Team" }];
    this.ReportTypeDisable = false;

    const formData = new FormData();
    formData.append('Portal', 'CRM');
    formData.append('PageName', this.urlSegment);
    formData.append('User_Code', this.api.GetUserData('Code'));
    formData.append('Vertical_Id', JSON.stringify(this.SearchForm.value['Vertical_Id']));
    formData.append('Region_Id', JSON.stringify(this.SearchForm.value['Region_Id']));

    this.api.HttpPostTypeBms('common/FilterData/GetEmployees', formData).then((result:any) => {
      if (result['Status'] == true) {

        this.Emps_Ar = result['Data'];
        this.Employee_Placeholder = 'Select Employee (' + this.Emps_Ar.length + ')';
        this.Agents_Placeholder = 'Select Agent';

      } else {
        this.api.Toast('Warning', result['Message']);
        this.SearchForm.get('Emp_Id').setValue('');
        this.Emps_Ar = [];

      }

    }, (err) => {
      this.api.Toast('Warning', 'Network Error : ' + err.name + '(' + err.statusText + ')');
    });

  }


  //SET REPORT TYPE
  SetReportType() {
    this.GetAgents('0');
  }


  //===== GET AGENTS DATA =====//
  GetAgents(e: any) {
    this.Agents_Placeholder = 'Select Agents';
    this.Agents_Ar = [];

    const formData = new FormData();

    if (this.SearchForm.get("Emp_Id").value.length > 1) {
      this.ReportTypeDisable = true;
      if (e == 1) {
        this.SelectedReportType = [{ Id: "Team", Name: "Team" }];
      }

    } else {
      this.ReportTypeDisable = false;
    }

    formData.append('User_Code', this.api.GetUserData('Code'));
    formData.append('Portal', 'CRM');
    formData.append('PageName', this.urlSegment);
    formData.append('Agent_Type', '');
    formData.append('Report_Type', JSON.stringify(this.SearchForm.value['Report_Type']));
    formData.append('RM_Ids', JSON.stringify(this.SearchForm.value['Emp_Id']));

    this.api.HttpPostTypeBms('common/FilterData/GetAgents', formData).then((result:any) => {
      if (result['Status'] == true) {

        this.Agents_Ar = result['Data'];
        this.Agents_Placeholder = 'Select Agents (' + this.Agents_Ar.length + ')';

      } else {
        this.Agents_Ar = [];
        this.api.Toast('Warning', result['Message']);
      }

    }, (err) => {
      this.api.Toast('Warning', 'Network Error : ' + err.name + '(' + err.statusText + ')');
    });

  }


  //===== GET MONTH RENEWAL =====//
  FilterDataGetMonthRenewal() {

    const formData = new FormData();

    formData.append('User_Id', this.api.GetUserData('Id'));
    formData.append('User_Code', this.api.GetUserData('Code'));

    this.api.HttpForSR('post', 'RenewalsReport/GetMonthRenewal', formData).then((result:any) => {

      if (result["Status"] == true) {
        this.MonthRenewal = result["Data"];

      } else {
        this.api.Toast("Warning", result["Message"]);
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


  //===== ENABLE / DISABLE MONTH FILTER =====//
  EnableDisableMonthFilter(Type: any) {

    //== Renewal Status ==//
    if (Type == 'Status') {
      this.SearchForm.get("DateOrDateRange").setValue("");
      var Renewal_Status = this.SearchForm.value['Status'];

      //Dues Condition
      if (Renewal_Status.length == 1 && Renewal_Status[0]['Id'] == 'Due') {
        this.SelectedCurrentMonth = [{ 'Id': this.CurrentMonth, 'Name': this.Name }];

        this.SearchForm.get("Month_Name").setValidators([Validators.required]);
        this.SearchForm.get("Month_Name").updateValueAndValidity();

        this.SearchForm.get("DateOrDateRange").setValidators(null);
        this.SearchForm.get("DateOrDateRange").updateValueAndValidity();
        this.SearchForm.get("DateOrDateRange").setValue("");

        //Grace Condition
      } else if (Renewal_Status.length == 1 && Renewal_Status[0]['Id'] == 'Grace') {

        var date = new Date();
        var yesterday = new Date(date.getTime());
        yesterday.setDate(date.getDate() - 1);

        var EndD = yesterday;
        let day2 = EndD.getDate();
        let month2 = EndD.getMonth();
        let year2 = EndD.getFullYear();

        let format2 = month2 + "/" + day2 + "/" + year2;

        var StartD = yesterday;
        StartD.setMonth(StartD.getMonth() - 1);
        StartD.toLocaleDateString();

        this.dateRange = [StartD, EndD];

        let day1 = StartD.getDate();
        let month1 = StartD.getMonth();
        let year1 = StartD.getFullYear();

        let format1 = month1 + "/" + day1 + "/" + year1;

        this.SearchForm.get("DateOrDateRange").setValue(format1 + '-' + format2);

        this.SelectedCurrentMonth = [];
        this.SearchForm.get("Month_Name").setValidators(null);
        this.SearchForm.get("Month_Name").setValue("");
        this.SearchForm.get("Month_Name").updateValueAndValidity();

        this.SearchForm.get("DateOrDateRange").setValidators([Validators.required]);
        this.SearchForm.get("DateOrDateRange").updateValueAndValidity();

        //Others
      } else {
        this.SelectedCurrentMonth = [];

        this.SearchForm.get("Month_Name").setValidators(null);
        this.SearchForm.get("Month_Name").setValue("");
        this.SearchForm.get("Month_Name").updateValueAndValidity();

        this.SearchForm.get("DateOrDateRange").setValidators([Validators.required]);
        this.SearchForm.get("DateOrDateRange").updateValueAndValidity();
      }

    }

  }


  //===== SET ACTIVE TAB =====//
  SetActiveTab(ActiveTab: any) {
    this.ActiveTab = ActiveTab;
    this.SearchBtn();
  }


  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {

    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {

      var fields = this.SearchForm.value;
      var DateOrDateRange = fields['DateOrDateRange'];
      var ToDate, FromDate;
      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      var query = {
        User_Id: this.api.GetUserData('Id'),
        User_Type: this.api.GetUserType(),

        Financial_Year: fields['Financial_Year'],
        Vertical_Id: fields['Vertical_Id'],
        Region_Id: fields['Region_Id'],

        Emp_Id: fields['Emp_Id'],
        Report_Type: fields['Report_Type'],
        Agent_Id: fields['Agent_Id'],
        Company_Id: fields['Company_Id'],
        Source: fields['SR_Source_Type'],
        Month_Name: fields['Month_Name'],
        Renewal_Status: fields['Status'],
        GlobalSearch: fields['GlobalSearch'],
        ActiveTab: this.ActiveTab,

        To_Date: this.api.StandrdToDDMMYYY(ToDate),
        From_Date: this.api.StandrdToDDMMYYY(FromDate),

      }

      this.Is_Export = 0;
      this.dataAr = [];
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {

        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
        this.Is_Export = 0;
      });
    }

  }


  //===== CLEAR SEARCH FORM =====//
  ClearSearch() {

    this.SearchForm.reset();
    this.SearchComponentsData();

    this.SearchForm.get('Financial_Year').setValue('');
    this.SearchForm.get('Vertical_Id').setValue('');
    this.SearchForm.get('Region_Id').setValue('');
    this.SearchForm.get('Emp_Id').setValue('');
    this.SearchForm.get('Report_Type').setValue('');
    this.SearchForm.get('Agent_Id').setValue('');
    this.SearchForm.get('Company_Id').setValue('');
    this.SearchForm.get('SR_Source_Type').setValue('');
    this.SearchForm.get('Month_Name').setValue('');
    this.SearchForm.get("DateOrDateRange").setValue("");

    this.SelectedCurrentMonth = [{ 'Id': this.CurrentMonth, 'Name': this.Name }];
    this.SelectedReportType = [{ Id: "Team", Name: "Team" }];
    this.SelectedCurrentStatus = [{ Id: 'Due', Name: 'Dues' }];

    this.Emps_Ar = [];
    this.Agents_Ar = [];

    this.Employee_Placeholder = 'Select Employee';
    this.Agents_Placeholder = 'Select Agent';

    this.dataAr = [];
    this.Reload();

    this.Is_Export = 0;

  }


  //===== RELOAD PAGE =====//
  Reload() {

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }


  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search('').column(0).search('').draw();
    });
  }


  //===== GET DATATABLE DATA =====//
  Get(ActiveTab: any) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.api.GetToken()
      })
    };

    const that = this;
    this.api.IsLoading();
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [10, 25, 50, 100],
      pageLength: 10,
      //searching: false,
      serverSide: true,
      processing: true,
      dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(this.api.additionParmsEnc(environment.apiUrlBms + '/RenewalsReport/Renewals_Datatable?User_Id=' + this.api.GetUserData('Id') + '&User_Code=' + this.api.GetUserData('Code') + '&User_Type=' + this.api.GetUserType() + '&ActiveTab=' + ActiveTab), dataTablesParameters, this.api.getHeader(environment.apiUrlBms)).subscribe((res:any) => {
          var resp = JSON.parse(this.api.decryptText(res.response));

          that.dataAr = resp.data;
          that.SQL_Where_STR = resp.SQL_Where;
          this.GetRenewalDashboardData();

          this.api.HideLoading();

          if (that.dataAr.length > 0) {
            that.Is_Export = 1;
          }

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },

      columnDefs: [{
        targets: [0, 1, 2, 3, 4, 5, 6], // column index (start from 0)
        orderable: false, // set orderable false for selected columns
      }]
    };
  }


  //===== GET RENEWAL DASHBOARD DATA =====//
  GetRenewalDashboardData() {

    const formData = new FormData();
    formData.append('WhereAr', this.SQL_Where_STR);

    this.api.HttpForSR('post', 'RenewalsReport/GetRenewalDashboardData', formData).then((result:any) => {

      if (result["Status"] == true) {
        this.TotalRes = result['Data']["TotalRes"];
        this.TotalPremium = result['Data']["TotalPremium"];
        this.TotalPending = result['Data']["TotalPending"];
        this.TotalPendingPremium = result['Data']["TotalPendingPremium"];
        this.TotalRenewed = result['Data']["TotalRenewed"];
        this.TotalRenewedPremium = result['Data']["TotalRenewedPremium"];
        this.TotalLost = result['Data']["TotalLost"];
        this.TotalLostPremium = result['Data']["TotalLostPremium"];

      } else {
        this.api.Toast("Warning", result["Message"]);
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


  //===== VIEW DOCUMENTS =====//
  ViewDocument(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }


  //===== SR POPUP =====//
  SrPopup(type: any, row_Id: any): void {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Code"));
    formData.append("Source", "CRM");

    this.api.HttpPostTypeBms("../v2/sr/life/LifeSubmit/GetUserId", formData).then((result:any) => {
      if (result["Status"] == true) {
        var baseurl = "https://crm.squareinsurance.in/";
        var url = baseurl + "business-login/form/life-insurance/" + type + "/crm/" + result["User_Id"] + "/" + row_Id + "/web";
        window.open(url, "", "fullscreen=yes");
      } else {
        this.api.Toast("Error", result["Message"]);
      }
    },

      (err) => {
        this.api.Toast(
          "Warning",
          "Network Error, Please try again! " + err.message
        );
      }
    );
  }


  //===== UPDATE SR RENEWAL DETAILS MODAL =====//
  UpdateRenewalAction(row_Id: any, Track_Id: any): void {

    const dialogRef = this.dialog.open(LifeRenewalActionComponent, {
      width: '35%',
      height: '60%',
      data: { Id: row_Id, Track_Id: Track_Id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });

  }


  //===== VIEW RENEWAL TRACK MODAL =====//
  ViewRenewalTrack(row_Id: any, ShowAction: any): void {

    const dialogRef = this.dialog.open(LifeRenewalsTrackComponent, {
      width: '65%',
      height: '75%',
      data: { Id: row_Id, ShowAction: ShowAction }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });

  }


  //===== VIEW RENEWAL TRACK MODAL =====//
  UpdatePaymentFrequency(row_Id: any, RenewalYear: any): void {

    const dialogRef = this.dialog.open(UpdatePaymentFrequencyComponent, {
      width: '35%',
      height: '60%',
      data: { Id: row_Id, RenewalYear: RenewalYear }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });

  }


  //===== UPDATE RENEWAL DATE MODAL =====//
  UpdateRenewalDate(row_id: any, renewal_year: any, sequence: any, renewal_date: any, payment_frequency: any, track_id: any): void {

    const dialogRef = this.dialog.open(UpdateRenewalDateComponent, {
      width: '25%',
      height: '35%',
      data: { row_id: row_id, renewal_year: renewal_year, sequence: sequence, renewal_date: renewal_date, payment_frequency: payment_frequency, track_id: track_id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });

  }

  onItemSelect(item: any, type) { }


}