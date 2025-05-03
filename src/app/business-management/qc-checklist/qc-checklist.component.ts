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
import { AddckecklistComponent } from '../../modals/addckecklist/addckecklist.component';



class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: 'app-qc-checklist',
  templateUrl: './qc-checklist.component.html',
  styleUrls: ['./qc-checklist.component.css']
})
export class QcChecklistComponent implements OnInit {
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
  selectedType: string = 'online';
  ActiveTab: any;

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
 
   
 
   }

  ngOnInit() {
    this.Get();
    this.selectedType = 'Online';
  }

   Get() {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: "Bearer " + this.api.GetToken(),
        }),
      };
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
                environment.apiUrlBmsBase +
                  "/../v2/reports/CheckListQcReport/viewCheckList?User_Id=" +
                  this.api.GetUserData("Id") +
                  "&User_Type=" +
                  this.api.GetUserType() +
                  "&source_type=" + this.selectedType
              ),
  
              dataTablesParameters,
              httpOptions
            )
            .subscribe((resp: any) => {
              var resp = JSON.parse(this.api.decryptText(resp.response));
              if (resp.status === "urlWrong") {
                that.hasAccess = false;
                that.errorMessage = resp.msg;
                return;
              }
              that.hasAccess = true;
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

 


   dailog(type:any,id:any) {
    
      const dialogRef = this.dialog.open(AddckecklistComponent, {
  
        width: "80%",
        height: "80%",
        disableClose: true,
        panelClass: "addcompanymodulecss",
        data:{type:type,id:id}
      })
  
      dialogRef.afterClosed().subscribe(result => {
        console.log("result--------",result)
        const newType = result.Active == 2 ? 'Offline' : 'Online';
        this.loadData(newType);
        this.ResetDT();
   
      });
    }



  DeleteRequest(DeleteId: any, status: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("Id", DeleteId);
      formData.append("status", status);

      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());
      this.api.IsLoading();
      this.api.HttpPostTypeBms("/../../v2/reports/CheckListQcReport/DeleteById", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.Reload();
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
        
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
         
        }
      );
    }
  }



  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  loadData(type: string) {
    this.selectedType = type;
  
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(); // Reload the table data
    });
  }
}
