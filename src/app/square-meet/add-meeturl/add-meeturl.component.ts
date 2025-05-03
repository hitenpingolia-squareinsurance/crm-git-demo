import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { trim } from "jquery";
import { DatePipe } from "@angular/common";
import { SquaremeetDetailComponent } from "../squaremeet-detail/squaremeet-detail.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  contacttype: string;
  name: string;
  email: string;
  mobile: string;
  remark: string;
  date: string;
  Status: string;
  delete_status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-add-meeturl",
  templateUrl: "./add-meeturl.component.html",
  styleUrls: ["./add-meeturl.component.css"],
})
export class AddMeeturlComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  empType: any;
  Requester: any;

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

  // dataAr: any;

  addMeetUrl: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;
  // dataAr2: any;
  dtElements: any;
  SearchForm: FormGroup;
  Is_Export: number;

  selectedFiles: File;
  policywording: File;
  proposal: File;
  claim: File;
  brochure: File;
  hospitallist: File;

  ActionType: any = "";

  showTable: any = 1;

  Company: any;
  Type: any;

  SubProducts: { Id: number; Name: string }[];
  productvalue: any;
  id: any;
  type: any;
  dataArr: any;
  url: string;
  company: any[];
  product: any;
  sub_product: any;
  types: any;
  file: File;
  pipe: any;
  changedDate: any;
  minDate: Date;
  CurrentUrl: string;
  Id: string;
  meeting_topic: any;
  loginType: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.CurrentUrl = window.location.pathname;

    //   //   //   console.log(this.CurrentUrl);
    var splitted = this.CurrentUrl.split("/");
    //   if(typeof splitted[2] != 'undefined') {
    // 		this.urlSegment = splitted[2];
    //  }
    if (typeof splitted[3] != "undefined") {
      this.Id = splitted[3];
    }
    //   if(typeof splitted[3] != 'undefined') {
    // 		this.urlSegment1 = splitted[3];
    //  }

    //   //   //   console.log(this.Id);
    if (this.Id != undefined) {
      this.addMeetUrl = this.formBuilder.group({
        requestby: ["", [Validators.required]],
        meetingFor: [""],
        meetingTopic: ["", [Validators.required]],
        meetingUrl: ["", [Validators.required]],
        meetingDate: ["", [Validators.required]],
        meetingTime: ["", [Validators.required]],
      });
    } else {
      this.addMeetUrl = this.formBuilder.group({
        meetingFor: ["", [Validators.required]],
        meetingTopic: ["", [Validators.required]],
        meetingUrl: ["", [Validators.required]],
        meetingDate: ["", [Validators.required]],
        meetingTime: ["", [Validators.required]],
      });
    }

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
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      limitSelection: 5,
    };

    this.empType = [
      { Id: "employee", Name: "Employee" },
      { Id: "sp", Name: "SP" },
      { Id: "agent", Name: "POS" },
      { Id: "all", Name: "All" },
    ];
  }

  ngOnInit() {
    this.Get();
    if (this.Id != undefined) {
      this.getData();
    }
  }

  get formControls() {
    return this.addMeetUrl.controls;
  }

  getData() {
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", this.Id);

    this.api.IsLoading();
    this.api.HttpPostType("Meeting_request/GetValues", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = result["data"];
          this.Requester = result["Requester"];
          this.meeting_topic = result["meeting_topic"];
          this.loginType = this.dataArr.loginType;
          this.addMeetUrl.patchValue(this.dataArr);
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
    this.isSubmitted = true;
    if (this.addMeetUrl.invalid) {
      return;
    } else {
      var fields = this.addMeetUrl.value;

      // if (trim(fields['mobile']) == '' && trim(fields['email']) == '') {
      //   this.api.Toast('Warning', 'Please enter mobile or email.');
      //   return;
      // }

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      if (this.Id != undefined) {
        formData.append("requester", fields["requestby"][0]["Id"]);
        formData.append("requester_type", this.loginType);
        formData.append("id", this.Id);
      }

      formData.append("meetingFor", JSON.stringify(fields["meetingFor"]));
      formData.append("meetingTopic", fields["meetingTopic"]);
      formData.append("meetingUrl", fields["meetingUrl"]);
      formData.append("meetingDate", fields["meetingDate"]);
      formData.append("meetingTime", fields["meetingTime"]);
      // console.log(formData);

      // // console.log('formData');
      this.api.IsLoading();
      this.api.HttpPostType("MeetingUrl/addmeetingUrl", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.addMeetUrl.reset();
            this.ResetDT();

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

  MeetingStatusUpdate(Id: any, status: any) {
    // console.log(Id);
    // console.log(status);

    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("id", Id);
      formData.append("status", status);

      formData.append("Login_User_Id", this.api.GetUserData("Id"));
      formData.append("Login_User_Type", this.api.GetUserType());

      this.api.IsLoading();
      this.api.HttpPostType("MeetingUrl/MettingStatus", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.ResetDT();
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

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== SEARCH DATATABLE DATA =====//

  SearchData(event: any) {
    this.Is_Export = 0;
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

  Get() {
    // alert(this.api.GetUserData("type"));
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
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/MeetingUrl/MeetingFetchaddurl?Login_User_Id=" +
                this.api.GetUserData("Id") +
                "&Login_User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.CurrentUrl
            ),
            dataTablesParameters,
            httpOptions
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

  SendNotification(id: any, meetingId: any) {
    const dialogRef = this.dialog.open(SquaremeetDetailComponent, {
      width: "60%",
      height: "60%",
      disableClose: true,
      data: { id: id, meetingId: meetingId },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.Get();
      this.ResetDT();
    });
  }

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
    // navigator.clipboard.writeText(inputElement);
  }
}
