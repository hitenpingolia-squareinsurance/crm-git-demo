import { DataTableDirective } from "angular-datatables";
import {
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";


class ColumnsObj {
  SrNo: string;
  id: string;
  Name: string;
  Category: string;
  Item: string;
  Create_date: string;
  AssestId: string;
  status_check: string;
  ManegerId: string;
  DistributorId: string;
  Id: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: 'app-assest-view',
  templateUrl: './assest-view.component.html',
  styleUrls: ['./assest-view.component.css']
})
export class AssestViewComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;

  ActionType: any = "";
  searchform: FormGroup;
  isSubmitted = false;
  dtElements: any;
  currentUrl: string;
  urlSegment: string;
  urlSegmentRoot: string;
  urlSegmentSub: string;
  RequestedQuote: any;
  UpdateAssestActionForm: FormGroup;
  assest_id: any;
  item_id: any;

  ClaimData: any;
  row: any;
  ItemDetails: any;
  ItemSpecifications: any;
  ItemStatus: any;
  ResponseData: any = '';
  itemModalShow = false;
  UniqueId: any = '';
  ItemName: any = '';
  ModelName: any = '';
  id: any;
  Item: any;
  Category: any;
  remarkform: FormGroup;
  status_check: any;
  CatId: any;
  dataArr: any[];
  Status: any;
  Rm_Id: any;
  Hod_Id: any;
  Maneger_Id: any;
  Distributor_id: any;
  Dataresult: any;
  ProductId: { Id: any, Name: any };
  Loginid: any;
  StatusRequest: any;
  loginPerson: any;

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  eventdata: any;


  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.UpdateAssestActionForm = this.formBuilder.group({
      Remark: ["", Validators.required],
      IssueType: [""],
      AffetedWork: [""],
    });

    this.searchform = this.formBuilder.group({
      SearchValue: [""],
    });

    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }

    if (typeof splitted[3] != "undefined") {
      this.urlSegmentSub = splitted[3];
    }

    this.remarkform = this.formBuilder.group({
      quantities: this.formBuilder.array([]),
    });

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

    quantities(): FormArray {
      return this.remarkform.get("quantities") as FormArray;
    }
  
    removeQuantity(i: number) {
      this.quantities().removeAt(i);
    }

  ngOnInit() {
    this.Get();
  }

  get FC() {
    return this.UpdateAssestActionForm.controls;
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.eventdata = event;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "Table1") {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
    });
  }

  get formControls() {
    return this.searchform.controls;
  }

  ClearSearch() {
    var fields = this.searchform.reset();
    // this.dataAr = [];
    this.ResetDT();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Get() {
    // alert(this.api.GetUserData("type"));

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
                "/Assest/FetchDataAssestRequest?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Url=" +
                this.urlSegment
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrl)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            that.dataAr = resp.data;

            // console.log(that.dataAr);
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

  // ForApproval(type: any, status_check: any, CatId: any) {
   
  //   const dialogRef = this.dialog.open(RequestApprovalComponent, {
  //     width: "70%",
  //     height: "60%",
  //     disableClose: true,
  //     data: { Id: type, status_check: status_check, CatId: CatId },
  //   });
  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     // console.log(result);
  //     this.Get();
  //     // this.ResetDT();
      
  //     // this.SearchData('');
  //   });
  // }


  ForApproval(type: any, status_check: any, CatId: any) {

    this.status_check = status_check;
    this.CatId = CatId;
    this.id = type;
    this.loginPerson = this.api.GetUserData("Id");

    this.getdata();
    this.FilterProductId();
    this.GetAllRequests();

  }


  getdata() {
    
    // // console.log(this.id);
    // this.quantities().push(new FormControl(''));
    const quantitiesArray = this.quantities();
    quantitiesArray.clear(); 
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Assest/ApproveRequest?id=" +
          this.id +
          "&status_check=" +
          this.status_check +
          "&id=" +
          this.id
      )
      .then(
        (result : any) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == true) {
            this.dataArr = result["data"];
            
            for (let data of this.dataArr) {
            
              if ((this.currentUrl == "/assest-manegment/assest-distributor")) {
           
                this.quantities().push(
                  this.formBuilder.group({
                    assestid: [data.Id],
                    checkvalue: [""],
                    remarks: [""],
                    Products: [""],
                  })
                );
              } else {
                
            
                this.quantities().push(
                  this.formBuilder.group({
                    assestid: [data.Id],
                    checkvalue: [""],
                    remarks: [""],
                  })
                );
              }
            }

            // this.quantities().push(new FormControl(''));

            this.StatusRequest = result["Status"];
            this.Rm_Id = result["Rm_Id"];
            this.Hod_Id = result["Hod_Id"];
            this.Maneger_Id = result["Maneger_Id"];
            this.Distributor_id = result["Distributor_id"];
            this.Loginid = result["CreatorId"];

            // console.log(result);
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



  submit() {
    var fields = this.remarkform.value;

    // var fields1 = this.remarkform.controls;

    // console.log(fields);

    const formData = new FormData();

    if (this.remarkform.invalid) {
      return;
    } else {
      // alert();
      var fields = this.remarkform.value;
      const formData = new FormData();
      // // console.log(formData);
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      formData.append("id", this.id);
      formData.append("Status", this.StatusRequest);

      formData.append("quantities", JSON.stringify(fields["quantities"]));

      this.api.IsLoading();
      this.api.HttpPostType("Assest/Request", formData).then(
        (result:any) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModelRequest();
            this.Get();
            this.ResetDT();
            this.SearchData(this.eventdata);
            // this.router.navigate(["Assets/Action"]);
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

  FilterProductId() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("CatId", this.CatId);
    this.api.IsLoading();
    this.api.HttpPostType("Assest/ProvideRequestedItem", formData).then(
      (result : any) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["Status"] == 1) {
          this.ProductId = result["Data"];
          console.log(this.ProductId);
          // this.api.Toast("Success", result["msg"]);
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

  GetAllRequests() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Assest/GetRequestLog?id=" +
          this.id +
          "&status_check=" +
          this.status_check +
          "&id=" +
          this.id
      )
      .then(
        (result : any) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == true) {
            this.Dataresult = result["Data"];
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

  AcceptAssignQuote(Type: any) {
    var Quotation_Id = Type;

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "Maneger/AcceptAssignQuote?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Quotation=" +
            Quotation_Id +
            "&url=" +
            this.currentUrl
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              // this.SearchData(result);
              this.ResetDT();
            } else {
              this.api.Toast("Warning", result["msg"]);
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
  }

  // GetItemDetails(ItemId) {
  //   const dialogRef = this.dialog.open(ItemDetailsComponent, {
  //     width: "70%",
  //     height: "70%",
  //     disableClose: true,
  //     data: { Id: ItemId },
  //   });

  //   dialogRef.afterClosed().subscribe((result: any) => {});
  // }

  GetItemDetails(ItemId){
  this.itemModalShow = true;
    const formData = new FormData();
    formData.append("ItemId", ItemId);

    this.api.IsLoading();
    this.api.HttpPostType("Inventory/ItemDetails", formData).then(
      (result : any) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.ItemDetails = result["ItemDetails"];
         if(this.ItemDetails != null && this.ItemDetails != ''){

            this.UniqueId = result["ItemDetails"].UniqueId;
          this.ItemName = result["ItemDetails"].ItemName;
          this.ModelName = result["ItemDetails"].ModelName;
         }
        
          
          this.ItemSpecifications = result["ItemSpecifications"];
          this.ItemStatus = result["ItemStatus"];
          this.ResponseData = result;
          console.log(this.ResponseData);
         
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

  CloseModel() {
    this.itemModalShow = false;
   var close = document.getElementById('close_item_model');
   close.click();
  }

  CloseModelRequest() {
   
   var close = document.getElementById('close_request_model');
   close.click();
   
  //  this.quantities().push(new FormControl(''));
  }

  HandOverRequest(assest_id, ItemId, Action) {
    this.ActionType = Action;
    this.assest_id = assest_id;
    this.item_id = ItemId;
  }

  UpdateAssestRequest() {
    this.isSubmitted = true;
    this.api.IsLoading();
    if (this.UpdateAssestActionForm.invalid) {
      // this.api.HideLoading();
      return;
    }

    this.api.HideLoading();
    const formdata = new FormData();
    const fields = this.UpdateAssestActionForm.value;
    formdata.append("assest_id", this.assest_id);
    formdata.append("item_id", this.item_id);
    formdata.append("type", this.ActionType);

    formdata.append("remark", fields["Remark"]);
    formdata.append("IssueType", fields["IssueType"]);
    formdata.append("AffetedWork", fields["AffetedWork"]);

    this.api.HttpPostType("Inventory/UpdateHandoverRequest", formdata).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          this.isSubmitted = false;
          this.Get();
          this.ResetDT();
          this.api.Toast("Success", result["msg"]);
          document.getElementById("close_pop").click();
          this.UpdateAssestActionForm.reset();
        } else {
          this.api.Toast("Warning", result["msg"]);
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
}
