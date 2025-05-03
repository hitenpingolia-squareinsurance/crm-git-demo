import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { AddEventComponent } from '../add-event/add-event.component';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  Total_Data: any[];

}

@Component({
  selector: 'app-event-gallery',
  templateUrl: './event-gallery.component.html',
  styleUrls: ['./event-gallery.component.css']
})
export class EventGalleryComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  ID : any;
  dataAr: any;
  hasAccess: boolean = true;
  errorMessage: string = "";
  constructor(
    private api: ApiService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.Get();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  Get():void{
 
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
      
        this.http.post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
            "/EventGallery/EventData?User_Id="+ this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() ),
            dataTablesParameters,this.api.getHeader(environment.apiUrl)
          )
          .subscribe((res:any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            if (resp.status === "urlWrong") {
              this.hasAccess = false;
              this.errorMessage = resp.msg;
              return;
            }
            this.hasAccess = true;

            this.dataAr = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
           
           
          }); 
         
      },
     
    };
  
  }

  
  AddEvent() {
    const dialogRef = this.dialog.open(AddEventComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => { 
    this.Reload();
    });
  }

  edit_image(ID:any){
    const dialogRef = this.dialog.open(AddEventComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { Id: ID },
    });

    dialogRef.afterClosed().subscribe((result: any) => { 
      this.Reload();
    });
  }


delete_img(ID: any) {
  var confirms = confirm("Are you sure you want to delete this image !");
  if (confirms == true) {
    this.api.IsLoading();

    const formData = new FormData();

    formData.append("Id", ID);

    formData.append("UserId", this.api.GetUserData("Id"));
    formData.append("UserType", this.api.GetUserType());

    this.api.IsLoading();
    this.api.HttpPostType("EventGallery/DeleteData", formData).then(
      (result:any) => {
        this.api.HideLoading();
   
        if (result[0].status == true) {
         
          this.api.Toast("Success", result["msg"]);
          this.Reload();
        } else {
          this.api.Toast("Warning", result["msg"]);
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



view(url){
  window.open(url, "", "left=100,top=50,width=800%,height=600");
}








}


