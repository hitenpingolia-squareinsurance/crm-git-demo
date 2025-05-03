import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, ViewChild, Inject, Optional } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { TravelrequestDetailsComponent } from "../travelrequest-details/travelrequest-details.component";
import { trim } from "jquery";


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-travel-view',
  templateUrl: './travel-view.component.html',
  styleUrls: ['./travel-view.component.css']
})
export class TravelViewComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dropdownSettingsType: any = {};

  dtOptions: DataTables.Settings = {};
  dataAr: any[];
  DataAr: any[];
  ClaimDataAr: any[];
  TravelForm: FormGroup;
  RequestData: FormGroup;
  ClaimForm: FormGroup;
  Logs_Id: any;
  url_segment: string;
  ApprovalStatus: any;
  isSubmitted = false;
  Id: any;
  Remark: any;
  status: any;
  UserName: any;
  Request_Type: any[];
  Default_Request: any[];
  Quote_Data: any;
  fileError: any;
  fileError2: any;
  HotelSelectedFiles: File[] = [];
  TravelSelectedFiles: File[] = [];
  validImageExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
  HotelFiles: any;
  TravelFiles: string;
  hotelDisabled: boolean = false;
  travelDisabled: boolean = false;
  hoteldocs: any;
  traveldocs: any;
  SetStatus: any;
  claimId: any;
  Images: any[];
  showRaiseClaim = false;
  ModalShowDetail = false;
  ModalShowClaim = false;
  AccountApprovedAmount: any;
  Account_Amount: string;
  hasAccess: boolean = true;
  errorMessage: string = "";

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<TravelrequestDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    this.url_segment = router.url.split('/')[2];
    const name = this.api.GetUserData('Name');
    const code = this.api.GetUserData('Code');
    this.UserName = `${name}-${code}`;

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

    this.TravelForm = this.fb.group({
      Remark: ["", Validators.required],
      HotelDocs: [""],
      TravelDocs: [""],
      AccountAmount: [""]
    });

    this.ClaimForm = this.fb.group({
      Remark: ["", Validators.required],
      Amount: [""],
    });

  }

  ngOnInit() {
    this.Get();
  }

  get FormC() {
    return this.TravelForm.controls;
  }

  get FormClaim() {
    return this.ClaimForm.controls;
  }

  onClose() {
    document.getElementById('logs').click();
    document.getElementById('exampleModal').click();
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

  Get() {


    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(this.api.additionParmsEnc(environment.apiUrl + "/TravelRequest/view_request?User_Id=" + this.api.GetUserData("Id") + "&User_Type=" +
          this.api.GetUserType() +
          "&url_segment=" + this.url_segment),
          dataTablesParameters, this.api.getHeader(environment.apiUrl))
          .subscribe((res: any) => {
            this.api.HideLoading();
            var resp = JSON.parse(this.api.decryptText(res.response));

            if (resp.status === "urlWrong") {
              this.hasAccess = false;
              this.errorMessage = resp.msg;
              return;
            }
            this.hasAccess = true;

            that.dataAr = resp.data;
            const currentDate = new Date();
            if (this.dataAr.length != 0) {
              const travelEndDate = new Date(this.dataAr ? this.dataAr[0].travel_end_date : '');

              if (travelEndDate < currentDate) {
                this.showRaiseClaim = true;
              } else {
                this.showRaiseClaim = false;
              }
            }

            if (that.dataAr.length >= 0) {
              this.api.HideLoading();
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

  Get_logs(Id: any, hoteldocs: any, traveldocs: any) {

    this.hoteldocs = hoteldocs;
    this.traveldocs = traveldocs;

    const formdata = new FormData();
    this.Id = Id;
    formdata.append('LogsId', Id);
    formdata.append('User_Name', this.api.GetUserData('Name'));
    formdata.append('User_type', this.api.GetUserData('Type'));
    formdata.append('User_code', this.api.GetUserData('Code'));
    formdata.append('url_segment', this.url_segment);

    this.api.HttpPostType('TravelRequest/view_logs', formdata)
      .then(
        (result: any) => {
          if (result['status'] == true) {
            this.DataAr = result.data;
            if (this.url_segment == 'account-desk') {
              this.AccountApprovedAmount = this.DataAr[0].advance_amount;
            }

          } else {
            this.DataAr = [];
          }
        },
        (err) => {
          this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        });
  }

  GetStatus(ApprovalStatus: any) {

    this.SetStatus = ApprovalStatus;

    if (ApprovalStatus == 'Approve') {

      this.hotelDisabled = false;
      this.travelDisabled = false;

      if (this.traveldocs != null || this.traveldocs != undefined) {
        this.hotelDisabled = true;
      }
      if (this.hoteldocs != null || this.hoteldocs != undefined) {
        this.travelDisabled = true;
      }

      const hoteldoc = this.TravelForm.get("HotelDocs");
      const traveldoc = this.TravelForm.get("TravelDocs");

      if (this.url_segment == 'travel-desk') {
        if (this.hotelDisabled == false) {
          hoteldoc.setValidators(Validators.required);
        } else {
          hoteldoc.setValidators(null);
        }
        if (this.travelDisabled == false) {
          traveldoc.setValidators(Validators.required);
        } else {
          traveldoc.setValidators(null);
        }
      } else if (this.url_segment == 'account-desk') {
        hoteldoc.setValidators(null);
        traveldoc.setValidators(null);
      }

      hoteldoc.updateValueAndValidity();
      traveldoc.updateValueAndValidity();
    }

    this.ApprovalStatus = ApprovalStatus;
  }

  travel_Form() {

    this.isSubmitted = true;
    if (this.TravelForm.invalid) {
      return;
    } else {
      this.api.IsLoading();

      const formdata = new FormData();
      this.Remark = this.TravelForm.get('Remark').value;


      if (this.ApprovalStatus == 'Approve') {
        if (this.TravelForm.get('AccountAmount').value != '') {

          this.Account_Amount = this.TravelForm.get('AccountAmount').value;

        } else {

          this.Account_Amount = this.AccountApprovedAmount
        }

      } else {
        this.Account_Amount = '';
      }


      formdata.append('ApprovalStatus', this.ApprovalStatus);
      formdata.append('url_segment', this.url_segment);
      formdata.append('LogsId', this.Id);
      formdata.append('UserName', this.api.GetUserData('Name'));
      formdata.append('UserCode', this.api.GetUserData('Code'));
      formdata.append('UserId', this.api.GetUserData('Id'));
      formdata.append('UserType', this.api.GetUserData('Type'));
      formdata.append('Remark', this.Remark);
      formdata.append('Account_Amount', this.Account_Amount);

      if (this.url_segment == 'travel-desk' && this.ApprovalStatus == 'Approve') {


        if (this.HotelSelectedFiles.length > 0 && this.HotelSelectedFiles.length < 6) {
          for (let i = 0; i < this.HotelSelectedFiles.length; i++) {
            formdata.append("HotelDocuments[]", this.HotelSelectedFiles[i], this.HotelSelectedFiles[i].name);
          }

        } else {
          this.api.HideLoading();
          this.fileError = 'You can only upload up to 5 images at a time.';

          return;
        }

        if (this.TravelSelectedFiles.length > 0 && this.TravelSelectedFiles.length < 6) {
          for (let i = 0; i < this.TravelSelectedFiles.length; i++) {
            formdata.append("TravelDocuments[]", this.TravelSelectedFiles[i], this.TravelSelectedFiles[i].name);

          }

        } else {
          this.api.HideLoading();
          this.fileError2 = 'You can only upload up to 5 images at a time.';

          return;
        }
      }


      this.api.HttpPostType('TravelRequest/Save_Logs', formdata)
        .then(
          (result: any) => {
            if (result['status'] == true) {
              this.api.HideLoading();
              this.api.Toast('Success', result['msg']);
              this.onClose();
              this.SearchData();

            } else {
              this.api.HideLoading();
              this.api.Toast('Warning', result['msg']);
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          });
    }
  }

  Edit_request(ID: any) {
    this.router.navigate(['/travel_request/request/' + ID]);
  }

  Edit_claimrequest(ID: any) {
    this.router.navigate(['/travel_request/edit_claim/' + ID]);
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
      this.ModalShowDetail = false;
      this.ModalShowClaim = false
    });

  }

  Accept(Id: any, RequestType: string) {

    this.isSubmitted = true;

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

  onFileChange(type: any, event: any) {

    this.fileError = null;
    this.fileError2 = null;
    if (type == 'Hotel') {
      this.HotelSelectedFiles = [];

      if (event.target.files.length > 0) {
        for (let i = 0; i < event.target.files.length; i++) {
          const file = event.target.files[i];
          const extension = file.name.split('.').pop().toLowerCase();
          if (!this.validImageExtensions.includes(extension)) {
            this.fileError = `Invalid file type for ${file.name}. Please upload an image with a valid extension (jpg, jpeg, png, gif).`;
            return;
          }
          this.HotelSelectedFiles.push(file);
        }
      }
      if (this.HotelSelectedFiles.length > 5) {
        this.fileError = 'You can only upload up to 5 images at a time.';
        return;
      }
      this.HotelFiles = this.HotelSelectedFiles[0].name;
    } else if (type == "Travel") {
      this.TravelSelectedFiles = [];

      if (event.target.files.length > 0) {
        for (let i = 0; i < event.target.files.length; i++) {
          const file = event.target.files[i];
          const extension = file.name.split('.').pop().toLowerCase();
          if (!this.validImageExtensions.includes(extension)) {
            this.fileError2 = `Invalid file type for ${file.name}. Please upload an image with a valid extension (jpg, jpeg, png, gif).`;
            return;
          }
          this.TravelSelectedFiles.push(file);
        }
      }

      if (this.TravelSelectedFiles.length > 5) {
        this.fileError2 = 'You can only upload up to 5 images at a time.';
        return;
      }
      this.TravelFiles = this.TravelSelectedFiles[0].name;
    }

  }




}
