
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import {AddDynamicValueComponent} from "../add-dynamic-value/add-dynamic-value.component";


class ColumnsObj {
  SrNo: string;
  Id: string;
  type: string;
  policyno: string;
  vehicleno: string;
  engineno: string;
  clientname: string;
  clientcontact: string;
  expirydate: string;
  delete_status:string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}


@Component({
  selector: 'app-view-ratings',
  templateUrl: './view-ratings.component.html',
  styleUrls: ['./view-ratings.component.css']
})
export class ViewRatingsComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false }) datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;

  ActionType: any = "";
  // searchform: FormGroup;
  // isSubmitted = false;
  dtElements: any;
  SearchForm: FormGroup;

  isSubmitted = false;
  Is_Export: number;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.Get();
  }



  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
  }


  Reload(){
	 
	this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
		var pageinfo = dtInstance.page.info().page;
					//dtInstance.draw();
					dtInstance.page(pageinfo).draw(false);
	});
  }


  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search('').column(0).search('').draw();
    });
  }


  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "Table1") {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
      }
    });
  }


  Get() {
    // alert(this.api.GetUserData("type"));
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization:  this.api.GetToken(),
      }),
    };
    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
            "/WebsiteSection/ViewWebsiteRatings?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType()),

            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            console.log(that.dataAr);
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


  AddProductQuotes(type:any , id:any) {
    const dialogRef = this.dialog.open(AddDynamicValueComponent, {
      width: "50%",
      height: "80%",
      disableClose: true,
      data: { type: type, id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.Get();
      this.ResetDT();
    });
  }


  //Delete REQUEST
  
  DeleteRequest(DeleteId: any, status: any) {

    var confirms = confirm("Are You Sure..!");

    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append('Id', DeleteId);
      formData.append('status', status);

      formData.append('UserId', this.api.GetUserData("Id"));
      formData.append('UserType', this.api.GetUserType());

      this.api.IsLoading();
      this.api.HttpPostType('DocsWallet/DeleteStatus', formData).then((result) => {
        this.api.HideLoading();
        console.log(result);

        if (result['status'] == true) {
          this.api.Toast("Warning", result["msg"]);
          this.ResetDT();
        } else {
          const msg = 'msg';
          //alert(result['message']);
          this.api.Toast('Warning', result['msg']);
        }

      }, (err) => {
        // Error log
        // console.log(err);
        this.api.HideLoading();
        const newLocal = 'Warning';
        this.api.Toast(newLocal, 'Network Error : ' + err.name + '(' + err.statusText + ')');
        //this.api.ErrorMsg('Network Error :- ' + err.message);
      });
    }
  }


  
//Active Inactive REQUEST
ActiveInactive(Id: any, Status: any, TableName: any, Type:any) {

  var confirms = confirm("Are You Sure..!");
  if (confirms == true) {
    this.api.IsLoading();

    const formData = new FormData();

    formData.append('Id', Id);
    formData.append('TableName', TableName);
    formData.append('Status', Status);
    formData.append('Type', Type);
    formData.append('UserId', this.api.GetUserData("Id"));
    formData.append('UserType', this.api.GetUserType());
    
    this.api.IsLoading();
    this.api.HttpPostType('WebsiteSection/UpdateActiveInactive', formData).then((result:any) => {
      this.api.HideLoading();
      console.log(result);

      if (result['status'] == true) {
        this.api.Toast("Success", result["msg"]);
        this.ResetDT();

      } else {
        const msg = 'msg';
        //alert(result['message']);
        this.api.Toast('Warning', result['msg']);
      }

    }, (err) => {
      // Error log
      // console.log(err);
      this.api.HideLoading();
      const newLocal = 'Warning';
      this.api.Toast(newLocal, 'Network Error : ' + err.name + '(' + err.statusText + ')');
      //this.api.ErrorMsg('Network Error :- ' + err.message);
    });
  }

}

}




