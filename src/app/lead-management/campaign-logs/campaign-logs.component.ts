import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, ViewChild, Inject, Optional } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { trim } from "jquery";
import { PolicyWiseDetailsAgentComponent } from "../policy-wise-details-agent/policy-wise-details-agent.component";
// import {CampaignLogsComponent} from "../campaign-logs/campaign-logs.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  campaign_name: string;
  requesterName: string;
  requesterCode: string;
  campaign_for: string;
  lob: string;
  state: string;
  city: string;
  status: string;
  requester_remark: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-campaign-logs',
  templateUrl: './campaign-logs.component.html',
  styleUrls: ['./campaign-logs.component.css']
})


export class CampaignLogsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[];
  DataAr: any[];
  CampaignForm: FormGroup;
  RequestData: FormGroup;
  RejectForm: FormGroup;
  CompleteForm: FormGroup;
  Logs_Id: any;
  url_segment: string;
  ApprovalStatus: any;
  isSubmitted = false;
  Id: any;
  Remark: any;
  status: any;
  UserName: any;
  Quote_Data: any;
  fileError: any;
  HotelSelectedFiles: File[] = [];
  TravelSelectedFiles: File[] = [];
  validImageExtensions: string[] = ["jpg", "jpeg", "png", "gif", "pdf"];
  HotelFiles: any;
  TravelFiles: string;
  hotelDisabled: boolean = false;
  travelDisabled: boolean = false;
  hoteldocs: any;
  traveldocs: any;
  SetStatus: any;
  State_Ar: any;
  City_Ar: any;
  ItemLOBSelection: any = [];

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
  CampaignForVAl: any;
  ShowProductInput: number = 0;
  PrimaryKey: any;
  CampaignVal: any;
  stateVal: any = [];
  cityVal: any;
  Lob: any;
  url: string;
  StatusVal: { Id: string; Name: string }[];
  allDetails: any = [];
  type: any;
  count: any;

  percentages = {
    pending: 0,
    follow: 0,
    converted: 0,
    lost: 0,
    close: 0
  };
  campaignData: any;
  CampaignFor: any;
  Campaignname: any;
  CampaignLob: any;
  active_tab: any;
  start_date: any;
  end_date: any;


  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder,
    
  ) {
    this.Id = router.url.split("/")[3];
    
 
  }

  ngOnInit() {
    this.Get();

    this.SetActiveTab("Total");


  }





  ClearSearch() {
    this.dataAr = [];
    // this.RequestData.reset();
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

  SearchData() {
    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      // var fields = this.RequestData.value;

      // var Quote_Type = fields["Request_type"];
      // var Search = fields["SearchVal"];

      // if (Quote_Type != "" && Quote_Type != null) {
      //   Quote_Type = fields["Request_type"][0]["Id"];
      // }

      // var query = {
      //   QuoteType: trim(Quote_Type),
      //   Search: trim(Search),
      // };

      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify('')))
        .draw();
     });
  }


  SetActiveTab(tab_value: any) {
    this.dataAr = [];
    this.active_tab = tab_value;
    this.SearchData();
  }




  Get() {
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
                "/Campaign/Report?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Id=" +
                this.Id + "&active_tab=" + this.active_tab 
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrl)
          )
          .subscribe((res: any) => {
            this.api.HideLoading();
            var resp = JSON.parse(this.api.decryptText(res.response));
            this.campaignData = resp.campaignData;
            that.dataAr = resp.data;
            that.count = resp.count;
          
            this.CampaignFor = that.campaignData.campaignfor;
            this.CampaignLob = that.campaignData.lob;
            this.Campaignname = that.campaignData.campaign_name;
            this.start_date = that.campaignData.start_date;
            this.end_date = that.campaignData.end_date;
            const total = that.count.Total || 1; // Avoid divide-by-zero

            this.percentages.pending = (that.count.pending / total) * 100;
            this.percentages.follow = (that.count.follow / total) * 100;
            this.percentages.converted = (that.count.converted / total) * 100;
            this.percentages.lost = (that.count.lost / total) * 100;
            this.percentages.close = (that.count.close / total) * 100;
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







  
  AgentBusiness(id: any,name:any) {

    const dialogRef = this.dialog.open(PolicyWiseDetailsAgentComponent, {
      width: "60%",
      height: "70%",
      disableClose: false,
      data: { id: id, name: name },
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      // this.Reload();
    });
  }

}

