import { HostListener, Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { AddNewHolidayComponent } from "../../modals/projection-target/add-new-holiday/add-new-holiday.component";
import { HolidayLocationsListComponent } from "../../modals/projection-target/holiday-locations-list/holiday-locations-list.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  HolidayDate: string;
  HolidayRemark: string;
  IsAction: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
}

@Component({
  selector: "app-holidays-list",
  templateUrl: "./holidays-list.component.html",
  styleUrls: ["./holidays-list.component.css"],
})
export class HolidaysListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  dropdownSettings: any = {};

  SearchForm: FormGroup;
  isSubmitted = false;
  SQL_Where_STR: any = "";

  UserRights: any = [];

  dropdownSettingMultipleSelect: {};
  saturdayOptions: any[] = [];
  showDropdown: boolean = false;
  saturdayForm: FormGroup;
  Is_Refresh: any = "No";

  holidayData: any = [];

  hasAccess: boolean = true;
  errorMessage: string = '';

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Business_Line_Id: [""],
      Vertical_Id: [""],
      Region_Id: [""],
      Sub_Region_Id: [""],
      Emp_Id: [""],
      Report_Type: [""],
      SearchValue: [""],
    });
    this.saturdayForm = this.fb.group({});
  }

  // saturdayModels = [];
  // ngOnInit(): void {
  //   this.Get();
  //   this.saturdayOptions = [
  //     { id: 1, Name: 'First Saturday', working: 0, notWorking: 1 },
  //     { id: 2, Name: 'Second Saturday', working: 0, notWorking: 1 },
  //     { id: 3, Name: 'Third Saturday', working: 0, notWorking: 1 },
  //     { id: 4, Name: 'Fourth Saturday', working: 0, notWorking: 1 },
  //     { id: 5, Name: 'Fifth Saturday', working: 0, notWorking: 1 }
  //   ];

  //   this.saturdayOptions.forEach(option => {
  //     this.saturdayForm.addControl(`${option.Name}_working`, this.fb.control(false));
  //     this.saturdayForm.addControl(`${option.Name}_notWorking`, this.fb.control(false));

  //   });
  // }

  // AddSaturday() {
  //   const selectedSaturdays = this.saturdayOptions
  //   .map((option) => {
  //       return {
  //           Name: option.Name,
  //           Working: this.saturdayForm.value[`${option.Name}_working`],
  //           NotWorking: this.saturdayForm.value[`${option.Name}_notWorking`],
  //       };
  //   })
  //   .filter(option => option.Working || option.NotWorking);

  //     const formData = new FormData();
  //   selectedSaturdays.forEach((saturday) => {
  //       formData.append('User_Id', this.api.GetUserData('Id'));
  //       formData.append('User_Code', this.api.GetUserData('Code'));
  //       formData.append('Holiday_Date', '');
  //       formData.append('Holiday_Remark', saturday.Name);
  //       formData.append('Service_Location', '');
  //       formData.append('Portal', 'CRM');
  //       if (saturday.Working) {
  //         formData.append('Working_status', 'Working');
  //     } else if (saturday.NotWorking) {
  //         formData.append('Working_status', 'Not Working');
  //     }

  //       this.api.IsLoading();
  //       this.api.HttpPostTypeBms('projection-target/HolidaysRelated/AddSaturday', formData).then((result: any) => {
  //         this.api.HideLoading();

  //         if (result['Status'] === true) {
  //           this.Is_Refresh = 'Yes';
  //           this.api.Toast('Success', result['Message']);
  //           this.saturdayForm.reset();
  //           this.Reload();
  //         } else {
  //           this.api.Toast('Error', result['Message']);
  //         }
  //       });
  //   });
  // }

  ngOnInit(): void {
    this.Get();
    this.saturdayOptions = [
      { id: 1, Name: "First Saturday" },
      { id: 2, Name: "Second Saturday" },
      { id: 3, Name: "Third Saturday" },
      { id: 4, Name: "Fourth Saturday" },
      { id: 5, Name: "Fifth Saturday" },
    ];

    // Initialize the form
    this.saturdayForm = this.fb.group({});

    // Add a single form control per Saturday option to handle both "Working" and "Not Working"
    this.saturdayOptions.forEach((option) => {
      this.saturdayForm.addControl(
        `${option.Name}_status`,
        this.fb.control("")
      );
    });
  }

  AddSaturday() {
    const selectedSaturdays = this.saturdayOptions
      .map((option) => {
        const status = this.saturdayForm.value[`${option.Name}_status`];
        return {
          Name: option.Name,
          Working: status === "working",
          NotWorking: status === "notWorking",
        };
      })
      .filter((option) => option.Working || option.NotWorking);

    const formData = new FormData();
    selectedSaturdays.forEach((saturday) => {
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("Holiday_Date", "");
      formData.append("Holiday_Remark", saturday.Name);
      formData.append("Service_Location", "");
      formData.append("Portal", "CRM");
      formData.append(
        "Working_status",
        saturday.Working ? "Working" : "Not Working"
      );

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms(
          "projection-target/HolidaysRelated/AddSaturday",
          formData
        )
        .then((result: any) => {
          this.api.HideLoading();
          if (result["Status"] === true) {
            this.api.Toast("Success", result["Message"]);
            this.saturdayForm.reset();
            // this.Reload();
            this.ResetDT();
          } else {
            this.api.Toast("Error", result["Message"]);
          }
        });
    });
  }

  GetDetails() {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "projection-target/HolidaysRelated/GetHolidaysVal",
        formData
      )
      .then((result: any) => {
        this.api.HideLoading();
        if (result["Status"] === true) {
          this.holidayData = result["data"];
          //   //   //   console.log(this.holidayData);

          // Check status for each Saturday option
          this.saturdayOptions.forEach((option) => {
            const holidayRemark = this.holidayData.find(
              (holiday) => holiday.Holiday_Remark === option.Name
            );
            // If found and status is '1', set form control to 'notWorking', else to 'working'
            if (holidayRemark && holidayRemark.Status === "1") {
              this.saturdayForm
                .get(`${option.Name}_status`)
                .setValue("notWorking"); // Match the radio value
            } else {
              this.saturdayForm
                .get(`${option.Name}_status`)
                .setValue("working"); // Match the radio value
            }
          });
        }
      });
  }

  //===== GET VALIDATION FROM CONTROLS =====//
  get formControls() {
    return this.SearchForm.controls;
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;
      var RM_Id_value, Franchisee_Id_value, ToDate, FromDate;
      var DateOrDateRange = fields["DateOrDateRange"];

      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      var query = {
        Business_Line: fields["Business_Line_Id"],
        Vertical_Id: fields["Vertical_Id"],
        Region_Id: fields["Region_Id"],
        Emp_Id: fields["Emp_Id"],
        Report_Type: fields["Report_Type"],
        SearchValue: fields["SearchValue"],
      };

      this.dataAr = [];
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
      });
    }
  }

  //===== CLEAR SEARCH DATA =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.SearchForm.get("Business_Line_Id").setValue("");
    this.SearchForm.get("Vertical_Id").setValue("");
    this.SearchForm.get("Region_Id").setValue("");
    this.SearchForm.get("Emp_Id").setValue(null);

    this.dataAr = [];
    this.ResetDT();
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== RELOAD DATATABLE =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
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
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/projection-target/HolidaysRelated/GridData?User_Code=" +
                this.api.GetUserData("Code") +
                "&Portal=CRM"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((resp: any) => {
            
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            var resp = JSON.parse(this.api.decryptText(resp.response));
            that.hasAccess = true;
            that.dataAr = resp.data;
            that.SQL_Where_STR = resp.SQL_Where;
          // .subscribe((res: any) => {
          //   var resp = JSON.parse(this.api.decryptText(res.response));
          //   that.dataAr = resp.data;
          //   that.SQL_Where_STR = resp.SQL_Where;

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

  //===== DELETE HOLIDAY =====//
  DeleteHoliday(Id: any) {
    const formData = new FormData();
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("TableId", Id);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "projection-target/HolidaysRelated/DeleteHoliday",
        formData
      )
      .then(
        (result: any) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.Reload();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Error",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  //===== ADD NEW HOLIDAY MODAL =====//
  AddNewHoliday(): void {
    const dialogRef = this.dialog.open(AddNewHolidayComponent, {
      width: "30%",
      height: "42%",
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.Is_Refresh == "Yes") {
        this.Reload();
      }
    });
  }

  //===== VIEW HOLIDAY LOCATIONS LIST MODAL =====//
  ViewLocationList(Id: any, IsAction: any): void {
    const dialogRef = this.dialog.open(HolidayLocationsListComponent, {
      width: "45%",
      height: "75%",
      disableClose: true,
      data: { Holiday_Id: Id, Is_Action: IsAction },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
