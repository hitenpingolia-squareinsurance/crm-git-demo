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
  selector: 'app-policy-wise-details-agent',
  templateUrl: './policy-wise-details-agent.component.html',
  styleUrls: ['./policy-wise-details-agent.component.css']
})
export class PolicyWiseDetailsAgentComponent implements OnInit {
  agentCode: any;
  agentName: any;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[];

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PolicyWiseDetailsAgentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.agentCode = this.data.id;
    this.agentName = this.data.name;
    console.log(this.agentName);
  }

  ngOnInit() {
    this.Get();
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
                  "/Campaign/PosBusiness?User_Id=" +
                  this.api.GetUserData("Id") +
                  "&User_Type=" +
                  this.api.GetUserType() +
                  "&AgentCode=" +
                  this.agentCode
              ),
              dataTablesParameters,
              this.api.getHeader(environment.apiUrl)
            )
            .subscribe((res: any) => {
              this.api.HideLoading();
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


    CloseModel(){
      this.dialogRef.close();
    }
  
  
}
