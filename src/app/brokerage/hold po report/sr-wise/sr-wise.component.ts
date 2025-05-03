
import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { BmsapiService } from "../../../providers/bmsapi.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { HoldPoReportComponent } from "../../hold-po-report/hold-po-report.component";

class ColumnsObj {
  Id: string;
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
  TotalNP: any;
  TotalPo: any;
}




@Component({
  selector: 'app-sr-wise',
  templateUrl: './sr-wise.component.html',
  styleUrls: ['./sr-wise.component.css']
})
export class SrWiseComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  urlSegment: any;
  TotalRecord: number;
  TotalNetPremium: any;
  TotalPO: any;
  querySegment: string;

  constructor(
    public api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.urlSegment = this.router.url;
    this.Get();
  }


 

  Add(): void {
    const dialogRef = this.dialog.open(HoldPoReportComponent, {
      width: "90%",
      height: "60%",
      disableClose: true,
      data: { Id: 0 },
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      this.Reload();
      this.Get();
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
            this.api.additionParmsEnc(environment.apiUrlBmsBase +
              "/../v3/hold-po/Partner/SrmasterData?User_Id=" +
              this.api.GetUserId() +
              "&source=crm"),
            dataTablesParameters,this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));

            if(resp['success'] == true){
              that.dataAr = resp.data;
              this.TotalNetPremium = resp.TotalNP;
              this.TotalPO =resp.TotalPo;
              this.TotalRecord =resp.recordsTotal;
            }
            else {
              that.dataAr =[];
            }
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      }
    };
  }


  UnHold(Id: any) {
    var formData=new FormData();
     this.querySegment = this.urlSegment.includes('partner-wise') ? 'partner-wise' : 'sr-wise';

    formData.append('Id',Id);
    
  this.api.HttpPostType("../v3/hold-po/Partner/unHoldData?urlSegment=" + this.querySegment +"&User_Id=" +this.api.GetUserId(), formData).then(
          (response) => {
      
          this.api.ToastMessage(response["message"]);
          this.Reload();
          
          },
          (error) => {
            
            console.error('Error', error);
          }
        );
    }



  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }



  Actions(row_Id): void {}
  ViewDocuments(row_Id): void {}
}
