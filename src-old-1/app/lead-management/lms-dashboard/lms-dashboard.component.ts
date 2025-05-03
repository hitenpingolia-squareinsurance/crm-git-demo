


import { Component, OnInit, ViewChild, Inject, Optional } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { HttpClient } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: 'app-lms-dashboard',
  templateUrl: './lms-dashboard.component.html',
  styleUrls: ['./lms-dashboard.component.css']
})
export class LmsDashboardComponent implements OnInit {
  
  dataAr: any;
  activeCheck: string = '7';

  //new try
  leadStatus: any[];
  leadQuoteStatus: any[];
  dropdownSettingsmultiselect: any = {};
  constructor(
    private api: ApiService,
    private http: HttpClient,
  ) {
    
    
    this.leadStatus = [
      { Id: "Untouched", Name: "Untouched" },
      { Id: "1", Name: "Pending" },
      { Id: "2", Name: "Follow Up" },
      { Id: "3", Name: "Converted" },
      { Id: "4", Name: "Lost" },
      { Id: "6", Name: "Close" },
      { Id: "transferred", Name: "Transferred" },

    ];

    this.leadQuoteStatus = [
      { Id: "1", Name: "Quotation" },
      { Id: "2", Name: "Proposal" },
      { Id: "3", Name: "Payment Page" },
      { Id: "4", Name: "Converted" },
    ];
    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };
   }

  ngOnInit() {
    this.Get();
  }
  

  Get() { 
      const formData = new FormData();
      formData.append("login_type", this.api.GetUserType());
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("v", this.activeCheck);
      this.api.IsLoading();
      this.api.HttpPostType("/LmsReport/Topperformer", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
           this.dataAr=result["data"]; 
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
  onButtonChange(event) {
    this.activeCheck=event
  
  }
}

