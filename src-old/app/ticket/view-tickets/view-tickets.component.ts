import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";

import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder,  FormGroup, FormControl, FormArray,  Validators } from "@angular/forms";

class ColumnsObj {
  Id: string;
  Claim_Id: string;
  Claim_Creator: string;
  Claim_Manager: string;
  PolicyType: string;
  LossType: string;
  Intimated_To_Insurer: string;
  Survey_Status: string;
  Add_Stamp: string;
  SrNo: string;
  Status: string;
  Ticket_Id: string;
  Completed_Timestamp: string;
  TicketType: string;
  Ticket_Creator: string;
  Ticket_Manager: string;
  Status_Data: string;
  Quotation_Id: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-view-tickets",
  templateUrl: "./view-tickets.component.html",
  styleUrls: ["./view-tickets.component.css"],
})

export class ViewTicketsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";

  currentUrl: string;
  RequestTypesFilter: boolean;
  PageType: string = '';

  constructor( public api: ApiService, private http: HttpClient, private router: Router, private fb: FormBuilder, private activatedRoute: ActivatedRoute ) {
    this.router.events.subscribe((value) => {
      this.UserTypesView = activatedRoute.snapshot.url[0].path;

      if (this.UserTypesView == "all-tickets-assign") {
        this.ActionType = "ManageRequests";
        this.PageType = "ManageRequests";
        this.RequestTypesFilter=true;
        

      }else if (this.UserTypesView == "ticket") {
        this.PageType = "Reports";
      }

    });

    

    this.SearchForm = this.fb.group({ });
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.Get();

    this.api.TargetComponent.subscribe(
      (page) => {
        if (page == "Ticket") {
          this.Reload();
        }
      },
      (err) => {}
    );
  }


  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

    if (TablesNumber == "kt_datatable") {
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
    }
   });
  }


  //CLEAR SEARCH
  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.dataAr = [];
    this.ResetDT();
    this.Is_Export = 0;
  }

  //RELAOD
  Reload(){
	 
	this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
		var pageinfo = dtInstance.page.info().page;
					//dtInstance.draw();
					dtInstance.page(pageinfo).draw(false);
	});
  }

  //RESET DT
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //GET DATATABLE DATA
  Get() {
  

    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
//  dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(this.api.additionParmsEnc(environment.apiUrl +"/Ticket/TicketDatas?User_Id=" +this.api.GetUserData("Id") +"&User_Type=" +
              this.api.GetUserType() +"&url=" +this.currentUrl +'&PageType='+this.PageType+"&Action=" +this.ActionType),dataTablesParameters,this.api.getHeader(environment.apiUrl) )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            if (that.dataAr.length > 0) { }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  //VIEW DOCUMENTS
  ViewDocument(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  //CHANGE TICKET STATUS
  ChangeStatusTicket(Current_Status, Ticket_Id, Change_Status) {
    alert(Current_Status + " " + Ticket_Id + " " + Change_Status);
  }

  //ACCEPT REQUEST
  AcceptRequest(TicketId: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "Ticket/UpdateAcceptManger?TicketId=" +
            TicketId +
            "&User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType()
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["Status"] == true) {
              this.api.Toast("Success", result["Message"]);
              this.ResetDT();
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
  }
  ViewGetInWindowPoupup(url) {
    const url2 = url;
    window.open(
      url2,
      "",
      "right=150,left=500,top=200,bottom=200 width=700%,height=450"
    );
  }
} //ENDy
