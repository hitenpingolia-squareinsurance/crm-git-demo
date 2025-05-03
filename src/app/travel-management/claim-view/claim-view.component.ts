import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import { Component, OnInit, ViewChild, Inject, Optional } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { trim } from "jquery";
import { DataTableDirective } from "angular-datatables";
import { TravelrequestDetailsComponent } from "../travelrequest-details/travelrequest-details.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-claim-view',
  templateUrl: './claim-view.component.html',
  styleUrls: ['./claim-view.component.css']
})
export class ClaimViewComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dropdownSettingsType: any = {};

  dtOptions: DataTables.Settings = {};
  dataAr: any[];
  ClaimDataAr: any[];
  ClaimForm: FormGroup;
  RequestData: FormGroup;
  url_segment: string;
  Request_Type: any[];
  Default_Request: any[];
  claimId: any;
  claimSubmit = false;
  claimType: any;
  Claim_data: any;
  ModalShowDetail = false;
  ModalShowClaim = false;
  ClaimUpdateForm: FormGroup;
  hasAccess: boolean = true;
  errorMessage: string = "";

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<TravelrequestDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.url_segment = router.url.split('/')[2];

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true
    };

    this.RequestData = this.fb.group({
      Request_type: [this.Default_Request],
      SearchVal: [""],
    });

    this.Request_Type = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];
    this.Default_Request = [{ Id: "Raise Request", Name: "Raise Request" }];


    this.ClaimForm = this.fb.group({
      Remark: ["", Validators.required],
    });

    this.ClaimUpdateForm = this.fb.group({});

  }

  ngOnInit() {
    this.Get();
  }

  get FormClaim() {
    return this.ClaimForm.controls;
  }

  ClearSearch() {
    this.dataAr = [];
    this.RequestData.reset();
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
        SearchValue: trim(Quote_Type),
        Search: trim(Search),
      };
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
      this.Get();
    });
  }

  Accept(Id: any, RequestType: string) {

    const formdata = new FormData();

    formdata.append('Accept', RequestType);
    formdata.append('url_segment', this.url_segment);
    formdata.append('LogsId', Id);
    formdata.append('UserName', this.api.GetUserData('Name'));
    formdata.append('UserCode', this.api.GetUserData('Code'));
    formdata.append('UserId', this.api.GetUserData('Id'));
    formdata.append('UserType', this.api.GetUserData('Type'));

    this.api.HttpPostType('TravelRequest/Save_Logs', formdata)
      .then(
        (result: any) => {
          if (result['status'] == true) {
            this.api.Toast('Success', result['msg']);
            this.ResetDT();

          } else {
            this.api.Toast('Warning', result['msg']);
          }
        },
        (err) => {
          this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        });

  }

  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.http.post<DataTablesResponse>(this.api.additionParmsEnc(environment.apiUrl + "/TravelRequest/view_request?User_Id=" + this.api.GetUserData("Id") + "&User_Type=" +
          this.api.GetUserType() +
          "&url_segment=" + this.url_segment),
          dataTablesParameters, this.api.getHeader(environment.apiUrl)
        ).subscribe((res: any) => {
          this.api.HideLoading();
          var resp = JSON.parse(this.api.decryptText(res.response));

          if (resp.status === "urlWrong") {
            this.hasAccess = false;
            this.errorMessage = resp.msg;
            return;
          }
          this.hasAccess = true;
          this.dataAr = resp.data;

          if (this.dataAr.length > 0) { }

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: [],
          });
        });
      },
    };
  }


  GetRequest_Details(row_Id, type: any, status: any): void {

    if (type == 'Details') {
      this.ModalShowDetail = true;
      this.ModalShowClaim = false
    } else if (type == 'Claim') {
      this.ModalShowDetail = false;
      this.ModalShowClaim = true
    } else {
      this.ModalShowDetail = false;
      this.ModalShowClaim = false
    }
    const dialogRef = this.dialog.open(TravelrequestDetailsComponent, {
      data: { Id: row_Id, Type: type, Status: status },
      disableClose: true,
      panelClass: "custom-dialog-container",
      backdropClass: "custom-backdrop-travel", // Custom CSS class for styling the backdrop
    });

    dialogRef.afterClosed().subscribe(result => {
      this.Get();
      this.SearchData();
      this.ModalShowDetail = false;
      this.ModalShowClaim = false
    });

  }


  GetClaimStatus(ClaimId: any, Type: any) {
    this.claimType = Type;
    this.Claim_data = ClaimId
  }

  claim_Form(): void {

    var fields = this.ClaimUpdateForm.value;
    var Remark = this.ClaimForm.value;

    this.claimSubmit = true;
    if (this.ClaimUpdateForm.invalid || this.ClaimForm.controls.Remark.invalid) {
      return;
    } else {

      const formdata = new FormData();
      formdata.append('Amount', JSON.stringify(fields));
      formdata.append('Remark', JSON.stringify(Remark));
      formdata.append('Url_segment', this.url_segment);
      formdata.append('User_Name', this.api.GetUserData('Name'));
      formdata.append('User_Id', this.api.GetUserData('Id'));
      formdata.append('User_Type', this.api.GetUserData('Type'));
      formdata.append('User_code', this.api.GetUserData('Code'));
      formdata.append('Claim_id', this.Claim_data);
      formdata.append('Claim_type', this.claimType);

      this.api.HttpPostType('TravelRequest/claim_status', formdata)
        .then(
          (result: any) => {
            if (result['status'] == true) {
              this.api.Toast("Success", result['msg']);

              const CloseModelRemark = document.getElementById('CloseModelRemark');
              CloseModelRemark.click();
              this.ResetDT();

            } else {
              this.api.Toast("Warning", result['msg']);
            }
          },
          (err) => {
            this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          });
    }
  }
}



