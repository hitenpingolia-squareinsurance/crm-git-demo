import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse,HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../providers/api.service';
import { Router } from  '@angular/router';
 
class ColumnsObj {
  Id: string;
  Name: string;
  EmpCode: string;
  Type: string;
  Mobile: string;
  Email: string;
  Vertical: string;
  Branch_Sub_Name: string;
  
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
} 

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit {

  	
@ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective; 
  
 dtOptions: DataTables.Settings = {};
 dataAr: ColumnsObj[]; 

  constructor(public api : ApiService,private http: HttpClient) { }

  ngOnInit(): void {
	 
	this.Get();
  }
  
  Get(){
	 //alert(environment.apiUrl);
	 
	 //"headers": {
       // "Authorization": "Bearer: ......"
    //}
	//this.api.GetUserType()
	
	const httpOptions = {
		  headers: new HttpHeaders({
			'Authorization' : this.api.GetToken()
			})
		  };
		   
		  
	const that = this;
	 
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
 dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        that.http
           .post<DataTablesResponse>(environment.apiUrl+'/Employee/RoleSetEmployeeData?User_Id='+this.api.GetUserData('Id')+'&User_Type='+this.api.GetUserType(),dataTablesParameters, httpOptions
          ).subscribe(resp => {
            that.dataAr = resp.data; 
			
			if(that.dataAr.length>0){
				//that.Is_Export = 1; 
			}
			
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      }, 
      //columns: [
		//		{ data: 'Id' },
		//		{ data: 'Type' }
				 
		//]
    }; 
  }
  
   
  
}
