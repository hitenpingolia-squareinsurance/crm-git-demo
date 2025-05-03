
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { DataTableDirective } from "angular-datatables";
import { AddMotorQuotesLabelComponent } from '../add-motor-quotes-label/add-motor-quotes-label.component';
import { EditMotorQuotesLabelComponent } from '../edit-motor-quotes-label/edit-motor-quotes-label.component';
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { environment } from 'src/environments/environment';




class ColumnsObj {
  SrNo: string;
  id: string;
  lob: string;
  insurer: string;
  product_type: string;
  plan_type: string;
  label_type: string;
  icon_name: string;
  icon_color: string;
  font_color: string;
  label_name: string;

}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-motor-quotes-label',
  templateUrl: './motor-quotes-label.component.html',
  styleUrls: ['./motor-quotes-label.component.css']
})
export class MotorQuotesLabelComponent implements OnInit  {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  buttonDisable = false;
  totalCount: number;
  currentUrl: string;
  TotalFiles: number;
  ActionType: any = "";
  data: any;
  Is_Export: number;
  urlSegment: string;

  hasAccess: boolean = true;
  errorMessage: string = '';
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private api: ApiService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    // this.fetchData();
    this.Get();
  }

  Addmotorquoteslabel() {
    const dialogRef = this.dialog.open(AddMotorQuotesLabelComponent, {
      width: "60%",
      height: "62%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      // this.fetchData();
    });
  }

  EditMotorQuotesLabelComponent(id: any) {
    // alert(id);
    // return;
    const dialogRef = this.dialog.open(EditMotorQuotesLabelComponent, {
      width: "60%",
      height: "62%",
      disableClose: true,
      data: { Id: id },

    });

    dialogRef.afterClosed().subscribe(() => {
      // this.fetchData();
      // this.toggleStatus();
    });
  }

  // fetchData() {
  //   this.api.HttpGetType("WebsiteSection/get_motor_quotes", {}).then(
  //     (result: { status: string, data: any[] }) => { 
  //       this.api.HideLoading();
  //       if (result.status === 'success') {
  //         this.dataAr = result.data; 
  //       } else {
  //         this.api.Toast("Warning", "No data found!");
  //       }
  //     },
  //     (err) => {
  //       this.api.HideLoading();
  //       this.api.Toast("Warning", "Network Error: " + err.name + " (" + err.statusText + ")");
  //     }
  //   );
  // }

  // ResetDT() {
  //   this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.search("").column(0).search("").draw();
  //   });
  // }  
  toggleStatus(id: any, currentStatus: any) {

    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      let newStatus = currentStatus == 1 ? 0 : 1;
      const formData = new FormData();
      formData.append("id", id);
      formData.append("status", currentStatus);

      this.api.HttpPostType("WebsiteSection/update_status", formData).then(updateResponse => {
        if (updateResponse['success']) {
          this.SearchData('');
          console.log('Status updated successfully');
          // this.fetchData();
        } else {
          console.error('Failed to update status on server');
        }
      });
    }

  }

  labelStatus(id: any, currentStatus: any) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("label_type", currentStatus);

    this.api.HttpPostType("WebsiteSection/update_label", formData).then(updateResponse => {
      if (updateResponse['success']) {
        // console.log('Status updated successfully');
        // this.fetchData();
      } else {
        console.error('Failed to update status on server');
      }
    });
  }

  productStatus(id: any, currentStatus: any) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("product_type", currentStatus);

    this.api.HttpPostType("WebsiteSection/update_product", formData).then(updateResponse => {
      if (updateResponse['success']) {
        // console.log('Status updated successfully');
        // this.fetchData();
      } else {
        console.error('Failed to update status on server');
      }
    });
  }

  planStatus(id: any, currentStatus: any) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("plan_type", currentStatus);

    this.api.HttpPostType("WebsiteSection/update_plan", formData).then(updateResponse => {
      if (updateResponse['success']) {
        // console.log('Status updated successfully');
        // this.fetchData();
      } else {
        console.error('Failed to update status on server');
      }
    });
  }

  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "kt_datatable_new") {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
      }
    });
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
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
              "/WebsiteSection/get_motor_quotes?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&url=" +
              this.currentUrl +
              "&Action=" +
              this.ActionType),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((resp:any) => {
            var resp = JSON.parse(this.api.decryptText(resp.response));
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;
            this.buttonDisable = false;
            that.dataAr = resp.data;
            that.totalCount = resp.recordsFiltered;
          
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

}
