import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from 'angular-datatables';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { ActivatedRoute, Router } from '@angular/router';
import { stringify } from 'querystring';
import {
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { CompanyAddComponent } from './company-add/company-add.component';
import { CompanyUpdateComponent } from './company-update/company-update.component';
import { AddchannelComponent } from '../insurer-channel/addchannel/addchannel.component';


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}


@Component({
  selector: 'app-company-master',
  templateUrl: './company-master.component.html',
  styleUrls: ['./company-master.component.css']
})
export class CompanyMasterComponent implements OnInit {

  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];
  currentUrl: string;
  ActionType: any = "";
  AddFieldForm: FormGroup;
  company: any[];
  active: any[];
  checkBox: any[];

  hasAccess: boolean = true;
  errorMessage: string = "";

  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownStatus: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.dropdownStatus = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.AddFieldForm = this.formBuilder.group({
      company: [''],
      checkbox: [''],
      status: [''],
    });

    this.active = [
      { Id: 1, Name: 'Active' },
      { Id: 0, Name: 'Inactive' },
    ];

    this.checkBox = [
      { Id: 1, Name: 'Motor' },
      { Id: 2, Name: 'Health' },
      { Id: 3, Name: 'Non_Motor' },
      { Id: 4, Name: 'Life' },
      { Id: 5, Name: 'PA' },
      { Id: 6, Name: 'Travel' },
    ];

  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.Get();
    this.getCompany();
  }

  getCompany() {
    const formData = new FormData();

    this.api
      .HttpPostTypeBms('../v2/business_master/CompanyMaster/getcompany', formData)
      .then(
        (resp) => {
          this.company = resp['data'].map(item => ({ Id: item.com, Name: item.com }));
        },
        (err) => {
          console.error('HTTP error:', err);
        }
      );
  }

  toggleCheckbox(checked: boolean, form: any) {
    this.AddFieldForm.get(form).setValue(checked ? '1' : '0');
  }

  Get() {
    this.api.IsLoading();

  

    const that = this;
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      ordering: false,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrlBmsBase + "/../v2/business_master/CompanyMaster/company?User_Id="  +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&User_Code=" +
            this.api.GetUserData("Code")),
            dataTablesParameters,this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res:any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;

            that.dataAr = resp.data;
            console.log(that.dataAr);
            let logoUrls = that.dataAr.map(item => item.logo);


            this.api.HideLoading();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  SearchData() {
    var field = this.AddFieldForm.value;

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(field))).draw();
    });
  }

  ClearSearch() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().search('').draw();
    });

    this.AddFieldForm.reset();
  }

  dailog() {
    const dialogRef = this.dialog.open(CompanyAddComponent, {

      width: "60%",
      height: "60%",
      disableClose: true,
      panelClass: "addcompanymodulecss",
    })

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
      this.getCompany();
    });
  }

  update(id: any) {
    const dialogRef = this.dialog.open(CompanyUpdateComponent, {

      width: "60%",
      height: "60%",
      disableClose: true,
      panelClass: "addcompanymodulecss",
      data: {
        id: id,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
      this.getCompany();
    });
  }


  ViewDocument(name: any) {
    var url = name;
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }


   addpopup(id:any) {

    const encryptedId = btoa(id); 
  
    this.router.navigate(['/business-master/insurer-channels'], { queryParams: { id: encryptedId } });


    
    }
}
