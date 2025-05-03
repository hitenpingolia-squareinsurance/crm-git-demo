import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from "angular-datatables";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { AddDetailsComponent } from '../add-details/add-details.component';
import { trim } from "jquery";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-service-location',
  templateUrl: './service-location.component.html',
  styleUrls: ['./service-location.component.css']
})
export class ServiceLocationComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false }) datatableElement: DataTableDirective;
  SearchForm: FormGroup;
  dropdownSettingsType: any = {};
  stOptions: DataTables.Settings = {};
  dataAr: any = [];
  ZoneData: any = [];
  CurrentUrl: string;
  Id: any;
  BranchData: any = [];
  selectedBranch: any;
  zone: any;
  ROData: any;
  Current_Tier: { Id: string; Name: string; }[];
  ro: any;
  Selected_location: any;
  Current_Tier_Val: any;
  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private router: Router,
    public FormBuilder: FormBuilder
  ) {
    this.SearchForm = this.FormBuilder.group({
      zone: [""],
      ro: [""],
      branch: [""],
      Current_Tier: [""],
      search_value: [""],
    });
    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.Current_Tier = [
      { Id: "Tier 1", Name: "Tier 1" },
      { Id: "Tier 2", Name: "Tier 2" },
      { Id: "Tier 3", Name: "Tier 3" },
    ];
  }

  ngOnInit() {
    this.getZoneData();
    this.Get();
    this.CurrentUrl = this.router.url;
  }

  ClearSearch() {
    var fields = this.SearchForm.reset(); 
    this.Reload();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page; 
      dtInstance.page(pageinfo).draw(false);
    });
  }

  SearchData(event: any) {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      const TablesNumber = `${dtInstance.table().node().id}`;
      const searchTerm = event.target.value.trim(); // Get the search term from the input
  
      if (TablesNumber == "service_location") {
        // Apply search term to the DataTables search function
        dtInstance.search(searchTerm).draw();  // This will trigger the server-side filtering
      } else if (TablesNumber == "service_location") {
        dtInstance.search(searchTerm).draw();
      }
    });
  }


  getZoneData() {

    this.api.IsLoading();
    this.api.HttpGetType('b-crm/EmployeeMasters/getZoneData').then((result:any) => {
      this.api.HideLoading();

      if (result['status'] == 1) {
        this.ZoneData = result['Data'];
      } else {
        const msg = 'msg';
        this.api.Toast('Warning', result['msg']);
      }
    }, (err) => {
      this.api.HideLoading();
      const newLocal = 'Warning';
      this.api.Toast(newLocal, 'Network Error : ' + err.name + '(' + err.statusText + ')');
    });

  }




  onItemDeSelect(type: any) {

    if (type === "Zone") {
      this.ro = [];
      this.selectedBranch = [];
    }

    if (type === "ro") {
      this.BranchData = [];
    }
    if (type === "Branch") {
      this.getBranchData();
    }

  }


   

  AddLocation() {

    const dialogRef = this.dialog.open(AddDetailsComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,

    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  getBranchData() {
    var fields = this.SearchForm.value;
    const formData = new FormData();
    if (this.ro[0]['Id'] != '' && this.zone[0]['Id'] != '') {
      formData.append("Zone", this.zone[0]['Id']);
      formData.append("Ro", this.ro[0]['Id']);
    } else {
      formData.append("Zone", fields["zone"][0]["Id"]);
      formData.append("Ro", fields["ro"][0]["Id"]);

    }

    this.api
      .HttpPostType("b-crm/EmployeeMasters/getBranchData", formData)
      .then((result: any) => {
        this.api.HideLoading();
        this.BranchData = result["BranchData"];
      });
  }


  getRoData() {
    this.BranchData = [];
    var fields = this.SearchForm.value;
    const formData = new FormData();
    if (this.zone[0]['Id'] != '') {

      formData.append("Zone", this.zone[0]['Id']);

    } else {

      formData.append("Zone", fields["zone"][0]["Id"]);

    }

    this.api
      .HttpPostType("b-crm/EmployeeMasters/getRoData", formData)
      .then((result: any) => {
        this.api.HideLoading();
        this.ROData = result["ROData"];
      });
  }


  Get(): void { 


    const httpOptions = {
          headers: new HttpHeaders({
            Authorization: "Bearer " + this.api.GetToken(),
          }),
        };
      
        const that = this;
        
        // Create a new DataTable instance based on the passed `tableId`
          this.stOptions = {
          pagingType: "full_numbers",
          pageLength: 10,
          serverSide: true,
          processing: true,
          // dom: "ilpftripl",
          ajax: (dataTablesParameters: any, callback) => {
            that.http
              .post<DataTablesResponse>(
                this.api.additionParmsEnc(environment.apiUrl +
                  "b-crm/EmployeeMasters/getServiceLocation?User_Id=" +
                  this.api.GetUserData("Id") +
                  "&User_Type=" +
                  this.api.GetUserType()),
                dataTablesParameters,
                httpOptions
              )
              .subscribe((res:any) => {
                var resp = JSON.parse(this.api.decryptText(res.response));
                that.dataAr = resp.data;
                console.log('data array : '+resp);
                this.api.HideLoading();

      
               
      
                if (that.dataAr.length > 0) {
                  // Perform any logic if data is received (if needed)
                }
                
                // Callback to update DataTable with fetched data
                callback({
                  recordsTotal: resp.recordsTotal,
                  recordsFiltered: resp.recordsFiltered,
                  data: [],  
                });
              }, (error) => {
                console.error('API Error:', error); 
              });
          },
        };

  }



  DeleteLocation(Id: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      const formData = new FormData();

      formData.append("login_type", this.api.GetUserType());

      formData.append("login_id", this.api.GetUserData("Id"));

      formData.append("Id", Id);

      this.api.IsLoading();
      this.api.HttpPostType("b-crm/EmployeeMasters/DeleteLocation", formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result['status'] == true) {
            this.Reload();
            this.api.Toast("Warning", result["msg"]);

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


  toggleStatus(Id: any, Status:any) {

    // console.log("Before Confirmation - ID:", Id, " Status:", newStatus);
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      const newStatus = Status == 0 ? 1 : 0;

      

      const formData = new FormData();

      formData.append("login_type", this.api.GetUserType());

      formData.append("login_id", this.api.GetUserData("Id"));

      formData.append("Id", Id);
      formData.append("status", newStatus.toString());

      this.api.IsLoading();
      this.api.HttpPostType("b-crm/EmployeeMasters/toggleStatus", formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result['status'] == true) {
            this.Reload();
            this.api.Toast("success", result["msg"]);

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

  UpdateLocation(Id: number) {
    // alert('Edit Id : '+Id);
    const dialogRef = this.dialog.open(AddDetailsComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { Id: Id }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });

  }

}
