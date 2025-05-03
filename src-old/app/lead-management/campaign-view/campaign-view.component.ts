import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, ViewChild, Inject, Optional } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { trim } from "jquery";

class ColumnsObj {
  SrNo: string;
  Id: string;
  campaign_name: string;
  requesterName: string;
  requesterCode: string;
  campaign_for: string;
  lob: string;
  state: string;
  city: string;
  status: string;
  requester_remark: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-campaign-view",
  templateUrl: "./campaign-view.component.html",
  styleUrls: ["./campaign-view.component.css"],
})
export class CampaignViewComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[];
  DataAr: any[];
  CampaignForm: FormGroup;
  RequestData: FormGroup;
  RejectForm: FormGroup;
  CompleteForm: FormGroup;
  Logs_Id: any;
  url_segment: string;
  ApprovalStatus: any;
  isSubmitted = false;
  Id: any;
  Remark: any;
  status: any;
  UserName: any;
  Request_Type: any[];
  CampaignFor: any[];
  ProductList: any[];
  Default_Request: any[];
  Quote_Data: any;
  fileError: any;
  HotelSelectedFiles: File[] = [];
  TravelSelectedFiles: File[] = [];
  validImageExtensions: string[] = ["jpg", "jpeg", "png", "gif", "pdf"];
  HotelFiles: any;
  TravelFiles: string;
  hotelDisabled: boolean = false;
  travelDisabled: boolean = false;
  hoteldocs: any;
  traveldocs: any;
  SetStatus: any;
  State_Ar: any;
  City_Ar: any;
  ItemLOBSelection: any = [];

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettingsMultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
    closeDropDownOnSelection: boolean;
    showSelectedItemsAtTop: boolean;
    defaultOpen: boolean;
    limitSelection: number;
  };
  CampaignForVAl: any;
  ShowProductInput: number = 0;
  PrimaryKey: any;
  CampaignVal: any;
  stateVal: any = [];
  cityVal: any;
  Lob: any;
  url: string;
  StatusVal: { Id: string; Name: string }[];
  allDetails: any = [];
  type: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.url_segment = router.url.split("/")[2];

    //   //   //   console.log(this.url_segment);
    const name = this.api.GetUserData("Name");
    const code = this.api.GetUserData("Code");
    this.UserName = `${name}-${code}`;

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.Default_Request = [{ Id: "Raise Request", Name: "Raise Request" }];

    this.CampaignForm = this.fb.group({
      campaign: ["", Validators.required],
      campaignname: ["", Validators.required],
      product: [""],
      subproduct: [""],
      state: [""],
      city: ["",Validators.required],
      remark: [""],
      startdate: [""],
      starttime: [""],
      utm_source: [""],
      amountperday: [""]
    });




   











    this.RequestData = this.fb.group({
      Request_type: [""],
      SearchVal: [""],
    });

    this.RejectForm = this.fb.group({
      rejectremark: [""],
    });

    this.CompleteForm = this.fb.group({
      totalamountspent: [""],
      campaignendate: [""],
      completeremark: [""],
      totalleads: [""],
      totalconvertedleads: [""],
    });

    this.CampaignFor = [
      { Id: "POS", Name: "POS" },
      { Id: "Product", Name: "Product" },
    ];

    // this.StatusVal = [
    //   { Id: "0", Name: "Pending" },
    //   { Id: "1", Name: "Live" },
    // ];

    this.Request_Type = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];

    this.ProductList = [
      { Id: "Motor", Name: "Motor" },
      { Id: "Non-Motor", Name: "Non-Motor" },
      { Id: "Health", Name: "Health" },
      { Id: "Life", Name: "Life" },
    ];

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      limitSelection: 5,
    };

    // if(this.url_segment == 'travel-desk'){
    //   this.TravelForm.addControl('HotelDocs', this.fb.control('',[Validators.required])); // Add control
    //   this.TravelForm.addControl('TravelDocs', this.fb.control('',[Validators.required])); // Add control
    // }else{
    //   this.TravelForm.removeControl('HotelDocs');
    //   this.TravelForm.removeControl('TravelDocs');
    // }
  }

  ngOnInit() {
    this.Get();
    this.UserAgent_Filter();
  }

  GetId(id: any, type: any) {
    this.PrimaryKey = id;
    this.type = type;

    if (type == "approve") {
      this.getEditdata(this.PrimaryKey);
    }
    if (type == "edit") {
      this.getEditdata(this.PrimaryKey);
    }
    if (type == "reject") {
    }
    if (type == "complete") {
    }
  }

  get FormC() {
    return this.CampaignForm.controls;
  }

  get FormC1() {
    return this.RejectForm.controls;
  }
  get FormC2() {
    return this.CompleteForm.controls;
  }

  onClose() {
    document.getElementById("logs").click();
    document.getElementById("exampleModal").click();
  }

  ClearSearch() {
    this.dataAr = [];
    // this.RequestData.reset();
    this.ResetDT();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  SearchData() {
    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var fields = this.RequestData.value;

      var Quote_Type = fields["Request_type"];
      var Search = fields["SearchVal"];

      if (Quote_Type != "" && Quote_Type != null) {
        Quote_Type = fields["Request_type"][0]["Id"];
      }

      var query = {
        QuoteType: trim(Quote_Type),
        Search: trim(Search),
      };

      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
      this.Get();
    });
  }

  UserAgent_Filter() {
    this.api.HttpGetType("MyPos/GetAllFilter").then(
      (result) => {
        //this.api.HideLoading();
        if (result["Status"] == true) {
          this.State_Ar = result["Data"]["State"];
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
        //this.api.ErrorMsg('Network Error :- ' + err.message);
      }
    );
  }

  onItemSelect(item: any, Type: any) {
    //   //   //   console.log(item.Id);
    if (this.url_segment != "campaign-manager") {
      this.CampaignForm.get("city").setValue("");
    }
    if (Type == "State") {
      // this.ItemLOBSelection = item.Id;
      this.ItemLOBSelection.push(item.Id);
      this.GetCItyFilter();
    }
  }

  onItemDeSelect(item: any, Type) {
    this.CampaignForm.get("city").setValue("");
    if (Type == "State") {
      // var index = (this.ItemLOBSelection = item.Id);
      // if (index > -1) {
      //   this.ItemLOBSelection.splice(index, 1);
      // }

      var index = this.ItemLOBSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemLOBSelection.splice(index, 1);
      }
      this.GetCItyFilter();
    }
  }

  onSelectAll(items: any) {
    var Ar = [];
    for (var i = 0; i < items.length; i++) {
      Ar.push(items[i]["Id"]);
    }
    var AllItems = Ar; //Ar.join();
    this.ItemLOBSelection = AllItems;
  }

  OnCampaignSelect(e) {
    this.CampaignForVAl = e["Id"];

    if (this.CampaignForVAl == "Product") {
      this.ShowProductInput = 1;
    } else {
      this.ShowProductInput = 0;
      this.CampaignForm.get("product").setValue("");
    }
  }

  GetCItyFilter() {
    var fields = this.ItemLOBSelection;

    const formData = new FormData();

    formData.append("StateId", this.ItemLOBSelection);
    // console.log(formData);
    this.api.IsLoading();
    this.api.HttpPostType("MyPos/CityFilter", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.City_Ar = result["Data"]["City"];
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

  Get() {
    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/Campaign/View_request?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url_segment=" +
                this.url_segment
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrl)
          )
          .subscribe((res: any) => {
            this.api.HideLoading();
            var resp = JSON.parse(this.api.decryptText(res.response));

            that.dataAr = resp.data;
            //   //   //   console.log(that.dataAr);
            // console.log(that.dataAr[0]['hotelDocument']);
            if (this.url_segment == "campaign-manager") {
              // that.Default_Request = resp['Quote_Type'];
              // that.Quote_Data = resp['Quote_Type'][0].Id;
            }
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

  CampaignSubmit() {

    const utmSource = this.CampaignForm.get('utm_source');

    if(this.url_segment == 'campaign-manager'){
      utmSource.setValidators(Validators.required);
    } else {
      utmSource.setValidators(null);
    }



    this.isSubmitted = true;
    if (this.CampaignForm.invalid) {
      return;
    } else {
      var fields = this.CampaignForm.value;
      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());
      formData.append("campaign", JSON.stringify(fields["campaign"]));
      formData.append("product", JSON.stringify(fields["product"]));
      formData.append("subproduct", fields["subproduct"]);
      formData.append("state", JSON.stringify(fields["state"]));
      formData.append("city", JSON.stringify(fields["city"]));
      formData.append("remark", fields["remark"]);
      formData.append("campaignname", fields["campaignname"]);

      if (this.url_segment == "campaign-manager") {
        formData.append("startdate", fields["startdate"]);
        formData.append("starttime", fields["starttime"]);
        formData.append("amountperday", fields["amountperday"]);
        formData.append("utm_source", fields["utm_source"]);
      }

      if (
        this.url_segment == "campaign-manager" ||
        (this.url_segment == "campaign" && this.type == "edit")
      ) {
        this.url = "Campaign/UpdateCampaign";
        formData.append("id", this.PrimaryKey);
        formData.append("edit", this.type);
      } else {
        this.url = "Campaign/AddCampaign";
      }

      this.api.IsLoading();
      this.api.HttpPostType(this.url, formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            $("#CloseModel1").click();
            this.Reload();
            this.CampaignForm.reset();
            // this.router.navigate(["Mypos/View-Docs"]);
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }

  Accept(Id: any) {
    this.isSubmitted = true;
    const formdata = new FormData();
    formdata.append("url_segment", this.url_segment);
    formdata.append("LogsId", Id);
    formdata.append("UserName", this.api.GetUserData("Name"));
    formdata.append("UserCode", this.api.GetUserData("Code"));
    formdata.append("UserId", this.api.GetUserData("Id"));

    this.api.HttpPostType("Campaign/AcceptRequest", formdata).then(
      (result: any) => {
        if (result["status"] == true) {
          this.api.Toast("Success", result["msg"]);
          this.ResetDT();
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  getEditdata(id: any) {
    this.isSubmitted = true;
    const formdata = new FormData();

    formdata.append("url_segment", this.url_segment);
    formdata.append("primaryKey", id);

    this.api.HttpPostType("Campaign/GetDataUpdate", formdata).then(
      (result: any) => {
        if (result["status"] == true) {
          this.CampaignVal = result["campaignFor"];

          if (this.CampaignVal[0]["Id"] == "Product") {
            this.ShowProductInput = 1;
          }
          // this.stateVal = result["stateName"];
          // this.cityVal = result["cityName"];

          // console.log(result["data"]);

          this.CampaignForm.patchValue({
            campaignname: result["data"]["campaignname"],
            amountperday: result["data"]["amountperday"],
            startdate: result["data"]["startdate"],
            starttime: result["data"]["starttime"],
            remark: result["data"]["remark"],
            subproduct: result["data"]["sub_product"],
          });

          this.Lob = result["lob"];

          const stateData = result["stateName"]; // Example: [[{ "Id": "22", "Name": "Maharashtra" }]]

          if (Array.isArray(stateData) && stateData.length > 0) {
            this.stateVal = stateData[0]; // Assuming single selection for now
          } else {
            this.stateVal = [];
          }

          const cityData = result["cityName"];
          if (Array.isArray(cityData) && cityData.length > 0) {
            this.cityVal = cityData[0]; // Assuming single selection for now
          } else {
            this.cityVal = [];
          }

          this.onSelectAll(stateData[0]);
          this.GetCItyFilter();
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  RejectSubmit() {
    this.isSubmitted = true;
    if (this.RejectForm.invalid) {
      return;
    } else {
      var fields = this.RejectForm.value;
      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());
      formData.append("remark", fields["rejectremark"]);
      formData.append("id", this.PrimaryKey);

      // if(this.url_segment == 'campaign-manager'){
      //     this.url = 'Campaign/UpdateCampaign';
      //     formData.append("id", this.PrimaryKey);
      // }else{
      //   this.url = 'Campaign/AddCampaign';
      // }

      this.api.IsLoading();
      this.api.HttpPostType("Campaign/RejectCampaign", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            $("#RejectModelClose").click();
            this.Reload();
            // this.router.navigate(["Mypos/View-Docs"]);
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }

  CompleteSubmit() {
    this.isSubmitted = true;
    if (this.CompleteForm.invalid) {
      return;
    } else {
      var fields = this.CompleteForm.value;
      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());
      formData.append("totalamountspent", fields["totalamountspent"]);
      formData.append("campaignendate", fields["campaignendate"]);
      formData.append("completeremark", fields["completeremark"]);
      formData.append("totalleads", fields["totalleads"]);
      formData.append("totalconvertedleads", fields["totalconvertedleads"]);
      formData.append("id", this.PrimaryKey);

      // if(this.url_segment == 'campaign-manager'){
      //     this.url = 'Campaign/UpdateCampaign';
      //     formData.append("id", this.PrimaryKey);
      // }else{
      //   this.url = 'Campaign/AddCampaign';
      // }

      this.api.IsLoading();
      this.api.HttpPostType("Campaign/CompleteCampaign", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            $("#CompleteCloseModel").click();
            this.Reload();
            // this.router.navigate(["Mypos/View-Docs"]);
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }

  Details(id: any) {
    const formdata = new FormData();

    formdata.append("url_segment", this.url_segment);
    formdata.append("primaryKey", id);

    this.api.HttpPostType("Campaign/GetAllDetails", formdata).then(
      (result: any) => {
        if (result["status"] == true) {
          this.CampaignVal = result["campaignFor"];
          // this.stateVal = result["stateName"];
          // this.cityVal = result["cityName"];
          // console.log(result["data"]);
          this.allDetails = result["data"];
          // this.CampaignForm.patchValue({
          //   campaignname: result["data"]['campaignname']
          // });

          this.Lob = result["lob"];
          const stateData = result["stateName"]; // Example: [[{ "Id": "22", "Name": "Maharashtra" }]]
          if (Array.isArray(stateData) && stateData.length > 0) {
            this.stateVal = stateData[0]; // Assuming single selection for now
          } else {
            this.stateVal = [];
          }

          const cityData = result["cityName"];
          if (Array.isArray(cityData) && cityData.length > 0) {
            this.cityVal = cityData[0]; // Assuming single selection for now
          } else {
            this.cityVal = [];
          }

          this.onSelectAll(stateData[0]);
          this.GetCItyFilter();
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }
}
