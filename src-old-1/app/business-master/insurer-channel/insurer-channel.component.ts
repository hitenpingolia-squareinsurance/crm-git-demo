import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from 'angular-datatables';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { AddchannelComponent } from './addchannel/addchannel.component';
import { UpdatechannelComponent } from './updatechannel/updatechannel.component';

// import { AddBranchComponent } from './add-branch/add-branch.component';
// import { UpdateBranchComponent } from './update-branch/update-branch.component';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: 'app-insurer-channel',
  templateUrl: './insurer-channel.component.html',
  styleUrls: ['./insurer-channel.component.css']
})
export class InsurerChannelComponent implements OnInit {

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
  status: any[];
  type: any[];
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
  id: string;
  companyName: any;
  newID: string;

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
      // checkbox: [''],
      // status: [''],
    });

  }

   ngOnInit() {
     this.currentUrl = this.router.url;
     this.Get();
     this.getCompany();
     const urlParams = new URLSearchParams(window.location.search);
     this.id = urlParams.get('id');

     this.newID = atob(this.id);
   }
 
   
 
   Get() {
     this.api.IsLoading();
     const httpOptions = {
       headers: new HttpHeaders({
         Authorization: 'Bearer '+ this.api.GetToken(),
       }),
     };
     const urlParams = new URLSearchParams(window.location.search);
     this.id = urlParams.get('id');
    //  alert(id);
     
     const that = this;
     this.dtOptions = {
       pagingType: "full_numbers",
       pageLength: 10,
       serverSide: true,
       processing: true,
  
       ajax: (dataTablesParameters: any, callback) => {
         that.http
           .post<DataTablesResponse>(
             this.api.additionParmsEnc(environment.apiUrlBmsBase + "/../v2/business_master/InsurerChannels/ChannelData?User_Id=" +
             this.api.GetUserData("Id") +
             "&User_Type=" +
             this.api.GetUserType() +
             "&User_Code=" +
             this.api.GetUserData("Code")) +
             "&id=" + this.id,
             dataTablesParameters,
             httpOptions
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



   getCompany() {

    const formData = new FormData();
    formData.append('User_Id' , this.api.GetUserData("Id"));
    formData.append('User_Type' , this.api.GetUserType());
    formData.append('insurer_id' , this.newID);
    this.api
      .HttpPostType("reports/BussinessReport/Company", formData)
      .then(
        (resp:any) => {
         


          this.company = resp; // your full array of companies

          if (this.newID) {
            const matchedCompany = this.company.find((item: any) => item.Id == this.newID);

            if (matchedCompany) {
              this.companyName = matchedCompany.Name;
            } else {
              this.companyName = "Insurer Channels"; // fallback if ID not found
            }
          } else {
            this.companyName = "Insurer Channels";
          }
        },
        (err) => {
          console.error('HTTP error:', err);
        }
      );
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
    var company = field['company'];
    const idd = company[0]['Id'];
    var query = {
      Company_Id: company[0]['Id'],
    }

     this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
      //this.Is_Export = 1;
    });
  }

  setAsDefaultChannel(row: any) {
  
    if (!row) {
      alert("Invalid Channel ID!");
      return;
    }
    
    const formData = new FormData();
    formData.append('User_Id', this.api.GetUserData("Id"));
    formData.append('User_Type', this.api.GetUserType());
    formData.append('channel_id', row); 
    formData.append('insurer_id', this.id); 
    // formData.append('default_status', '1'); // Set as default
  
    this.api.HttpPostTypeBms("../v2/business_master/InsurerChannels/SetDefaultChannel", formData)
      .then((response: any) => {
     
        if (response.status == true) {
         this.api.Toast("Success", response["message"]);
        //  this.api.Toast("Success", response.message);
          this.Reload();
        } 
      });
     
  }
  

  ClearSearch(){
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().search('').draw();
    });

    this.AddFieldForm.reset();
  }



 dailog(type:any,id:any) {
  
    const dialogRef = this.dialog.open(AddchannelComponent, {

      width: "60%",
      height: "80%",
      disableClose: true,
      data:{type:type,id:id}
    })

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });
  }

  // update(id: any) {
  //   const dialogRef = this.dialog.open(UpdatechannelComponent, {

  //     width: "60%",
  //     height: "80%",
  //     disableClose: true,
  //     data: {
  //       id: id,
  //     }
  //   })

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.Reload();
  //   });
  // }




}
