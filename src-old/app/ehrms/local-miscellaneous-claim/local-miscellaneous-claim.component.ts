import { Component, OnInit, ViewChild, Optional, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../providers/api.service";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { LocalMiscellaneousDetailsComponent } from "../local-miscellaneous-details/local-miscellaneous-details.component";
import { trim } from "jquery";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-local-miscellaneous-claim",
  templateUrl: "./local-miscellaneous-claim.component.html",
  styleUrls: ["./local-miscellaneous-claim.component.css"],
})
export class LocalMiscellaneousClaimComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataAr: any[];
  dropdownSettingsType: any = {};

  sendRequest: FormGroup;
  ProfileForm: FormGroup;
  sendLocalRequest: FormGroup;
  Action: FormGroup;
  UrlSegment: any;
  updateID: any = "";
  EmployeeData: any[];
  selectedDate1: any;
  selectedDate2: any;
  is_Submit = false;
  selectedFiles: File[] = [];
  fileError: any = "";
  fileErrorLocal: any = "";
  validImageExtensions: string[] = ["jpg", "jpeg", "png", "gif", "pdf"];
  FileNames: any;
  LocalSubmit = false;
  fileStorage: any;
  travelmode_data: any[];
  visit_data: any[];
  FormData1: any;
  FairAmount: any;
  DistanceFair: number = 0;
  Year_Ar: any[];
  Month_Ar: any[];

  MaxAmount: number = 0;
  limit = false;
  ModalShow = false;
  RequestData: FormGroup;
  Request_Type: any[];
  Default_Request: any[];
  ModalAction: any;
  ActionSubmit = false;
  miscellaneousId: any;

  totalAmount: number = 0;
  Id: any;
  Year: any;
  Month: any;
  MiscellaneousSave : boolean = false;
  LocalSave = false;
  dateInvalid = false;
  SavedId: any;

  JourneyAmountTotal: number;
  TotalFareAmount: any;
  TotalFareAmountMisc: any;
  apiUrl1: any;
  file_Error = false;
  dateInvalid_Misc = false;
  miscellaneousAmount: any;
  miscellaneousAmountManager: any;
  miscellaneousAmountHOD: any;
  miscellaneousAmountClaim: any;
  hasAccess: boolean = true;
  errorMessage: string = "";

  minDate: Date;
  maxDate: Date;
  isYearSelected = true;
  YearSaved: any;
  MonthSaved: any;

  constructor(
    private router: Router,
    private api: ApiService,
    private FormBuilder: FormBuilder,
    private http: HttpClient,
    public dialog: MatDialog,
    @Optional()
    private dialogRef: MatDialogRef<LocalMiscellaneousDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.UrlSegment = router.url.split("/")[2];
    this.updateID = router.url.split("/")[3];

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.ProfileForm = this.FormBuilder.group({
      ID: ["", Validators.required],
      Employee_Name: ["", Validators.required],
      Employee_ID: ["", Validators.required],
      Employee_Designation: ["", Validators.required],
      Employee_Profile: ["", Validators.required],
      Employee_Department: ["", Validators.required],
      Employee_ReportingManager: ["", Validators.required],
    });

    this.sendRequest = this.FormBuilder.group({
      fromDate: ["", Validators.required],
      toDate: ["", Validators.required],
      file_Misc: [""],
      amount: ["", Validators.required],
      remark: ["", Validators.required],
    });

    this.sendLocalRequest = this.FormBuilder.group({
      Year: ["", Validators.required],
      Month: ["", Validators.required],
      JourneyDetails_formArrays: this.FormBuilder.array([]),
    });

    this.Action = this.FormBuilder.group({
      AmountVal: [""],
      RemarkVal: ["", Validators.required],
    });


    
    this.Month_Ar = [
      { Id: "04", Name: "April" },
      { Id: "05", Name: "May" },
      { Id: "06", Name: "June" },
      { Id: "07", Name: "July" },
      { Id: "08", Name: "August" },
      { Id: "09", Name: "September" },
      { Id: "10", Name: "October" },
      { Id: "11", Name: "November" },
      { Id: "12", Name: "December" },
      { Id: "01", Name: "January" },
      { Id: "02", Name: "February" },
      { Id: "03", Name: "March" },
    ];

    this.Year_Ar = [
      { Id: "2025-26", Name: "2025-26" },
      { Id: "2024-25", Name: "2024-25" },
      { Id: "2023-24", Name: "2023-24" },
      { Id: "2022-23", Name: "2022-23" },
      { Id: "2021-22", Name: "2021-22" },
      { Id: "2020-21", Name: "2020-21" },
      { Id: "2019-20", Name: "2019-20" },
      { Id: "2018-19", Name: "2018-19" },
    ];

    this.RequestData = this.FormBuilder.group({
      Request_type: [this.Default_Request],
      SearchVal: [""],
    });

    this.Request_Type = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];
    this.Default_Request = [{ Id: "Raise Request", Name: "Raise Request" }];
  }

  get FC() {

    return this.sendRequest.controls;
  }
  get JourneyDetails_formArrays() {
    return this.sendLocalRequest.get("JourneyDetails_formArrays") as FormArray;
  }

  createArray(): FormGroup {
    return this.FormBuilder.group({
      Id: ["", Validators.required],
      DepartureDate: ["", Validators.required],
      ArrivalDate: ["", Validators.required],
      DepartureTime: ["", Validators.required],
      ArrivalTime: ["", Validators.required],
      DepartureStartPoint: ["", Validators.required],
      ArrivalStartPoint: ["", Validators.required],
      Travelmode: ["", Validators.required],
      PurposeOfVisit: ["", Validators.required],
      Distance: ["", Validators.required],
      EmployeeAmount: ["", Validators.required],
      Remark: ["", Validators.required],
      JourneyFile: [""],
    });
  }

  removeArray(index: number) {
    var idControl;

    if (this.UrlSegment == "localClaimUpdate") {
      idControl = this.JourneyDetails_formArrays.at(index).get("Id").value;
    }
    this.JourneyDetails_formArrays.removeAt(index);
  }

  AddMore() {
    this.LocalSubmit = false;
    const journeyDetailsLength = this.JourneyDetails_formArrays.length;
    let IndexValue = 0;
    if (journeyDetailsLength > 0) {
      this.GetFair("", "");
      this.LocalSubmit = true;
    }

    if (this.JourneyDetails_formArrays.invalid) {
      return;
    }

    for (let i = 0; i < journeyDetailsLength; i++) {
      const JourneyDetailGroup = this.JourneyDetails_formArrays.at(
        i
      ) as FormGroup;

      if (JourneyDetailGroup) {
        const selectedDate1 = JourneyDetailGroup.value["DepartureDate"];
        const selectedDate2 = JourneyDetailGroup.value["ArrivalDate"];

        if (selectedDate2 && selectedDate1 && selectedDate2 < selectedDate1) {
          this.api.Toast(
            "Warning",
            "Arrival Date cannot be earlier than Departure Date"
          );
          this.dateInvalid = true;
        } else {
          this.dateInvalid = false;
        }
      }
      IndexValue = i + 1;
    }

    if (this.fileErrorLocal && Object.keys(this.fileErrorLocal).length > 5) {
      this.file_Error = true;
      this.api.Toast(
        "Warning",
        "You can only upload up to 5 images at a time."
      );
    }

    const year = this.sendLocalRequest.get("Year").value;
    const month = this.sendLocalRequest.get("Month").value;
    if (
      this.dateInvalid ||
      this.file_Error ||
      (this.LocalSubmit && (year == "" || year == undefined)) ||
      (this.LocalSubmit && (month == "" || month == undefined))
    ) {
      return;
    }

    this.JourneyDetails_formArrays.push(this.createArray());
    this.JourneyDetails_formArrays.at(IndexValue)
      .get("Id")
      .setValue(IndexValue);
  }

  ngOnInit() {
    this.GetEmployeedata();
    if (this.UrlSegment == "localClaimAdd") {
      this.checkSaved();
      this.GetTravelMaster();
      this.CheckAmount(4);
    } else if (this.UrlSegment == "localClaimUpdate") {
      this.checkSaved();
      this.GetTravelMaster();
      this.CheckAmount(4);
    } else if (
      this.UrlSegment == "miscellaneousClaimAdd" ||
      this.UrlSegment == "miscellaneousClaimUpdate"
    ) {
      this.CheckAmount(5);
      this.checkSaved();
    }

    if (
      this.UrlSegment != "miscellaneousClaimAdd" ||
      this.UrlSegment != "localClaimAdd" ||
      this.UrlSegment != "miscellaneousClaimUpdate" ||
      this.UrlSegment != "localClaimUpdate"
    ) {
      this.Get();
    }

    if (
      this.UrlSegment == "miscellaneousClaimUpdate" ||
      this.UrlSegment == "localClaimUpdate"
    ) {
      this.Edit_request(this.updateID);
    }

    
    console.log(this.MiscellaneousSave);
    const FileName = this.sendRequest.get("file_Misc");
    
    if ((this.updateID != "" && this.updateID != undefined) || this.MiscellaneousSave) {
      // FileName.setValidators(null);
      
      // FileName.updateValueAndValidity();

    } else {
      FileName.setValidators([Validators.required]);
      
      FileName.updateValueAndValidity();
    }

  }

  checkSaved() {
   
    const formdata = new FormData();
    formdata.append("userId", this.api.GetUserData("Id"));
    formdata.append("userType", this.api.GetUserData("Type"));
    formdata.append("urlSegment", this.UrlSegment);
    formdata.append("updateId", this.updateID);
    this.api.HttpPostType("ehrms/checkSaved", formdata).then(
      (result: any) => {
        if (result["status"] == true) {
          if (result.data.length > 0) {
            if (confirm("Do You Want to Edit Previous Form!") == true) {
              if (
                this.UrlSegment == "miscellaneousClaimAdd" ||
                this.UrlSegment == "miscellaneousClaimUpdate"
              ) {
                this.MiscellaneousSave = true;
                this.LocalSave = false;
                const FileName = this.sendRequest.get("file_Misc");

                FileName.setValidators(null);
      
                FileName.updateValueAndValidity();
          
                
              } else if (
                this.UrlSegment == "localClaimAdd" ||
                this.UrlSegment == "localClaimUpdate"
              ) {
                
                this.MiscellaneousSave = false;
                this.LocalSave = true;
                // this.MonthSelect(this.MonthSaved);
              }
              this.SavedId = result.data[0].id;
              // if(this.SavedId != ''){
              this.Edit_request(result.data[0].id, "saveForm");

              // }
            } else {
           
              if (this.UrlSegment == "localClaimAdd") {
                this.AddMore();
              }
            }
          } else {
            
            this.MiscellaneousSave = false;
            this.LocalSave = false;
          }
        } else {
          if (this.UrlSegment == "localClaimAdd") {
            this.AddMore();
          }
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

  Cancelrequest() {
    if (
      this.UrlSegment == "localClaimAdd" ||
      this.UrlSegment == "localClaimUpdate"
    ) {
      this.router.navigate(["/ehrms/localClaim"]);
      // this.ResetDT();
    } else if (
      this.UrlSegment == "miscellaneousClaimAdd" ||
      this.UrlSegment == "miscellaneousClaimUpdate"
    ) {
      this.router.navigate(["/ehrms/miscellaneousClaim"]);
      // this.ResetDT();
    }
  }


  MonthSelect(event) {
    // const selectedYear = this.sendLocalRequest.get("Year").value;

    const selectedMonth = event.Id;
    if (this.YearSaved != '' && this.YearSaved != undefined) {
      var selectedYear = this.YearSaved;

    } else {
      var selectedYear = this.sendLocalRequest.get("Year").value;
    }
    console.log(selectedYear);

    const journeyDetailsLength = this.JourneyDetails_formArrays.length;
    for (let i = 0; i < journeyDetailsLength; i++) {
      const JourneyDetailGroup = this.JourneyDetails_formArrays.at(
        i
      ) as FormGroup;

      if (JourneyDetailGroup) {
        const departureDateControl = JourneyDetailGroup.get("DepartureDate");
        const ArrivalDateControl = JourneyDetailGroup.get("ArrivalDate");

        if (departureDateControl) {
          departureDateControl.setValue("");
        }
        if (ArrivalDateControl) {
          ArrivalDateControl.setValue("");
        }
      }
    }

    if (selectedYear && selectedMonth) {
      this.setMinMaxDates(selectedYear[0].Id, selectedMonth);
    }
  }

  setMinMaxDates(year: string | number, month: number) {

    console.log(year);
    console.log(month);
    if (typeof year === "string" && year.includes("-")) {
      year = parseInt(year.split("-")[0], 10);
    }
    year = Number(year);

    if (month >= 1 && month <= 3) {
      year += 1;
    }

    if (month < 1 || month > 12) {
      return;
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    this.minDate = startDate;
    this.maxDate = endDate;
  }

  RaiseClaim() {
    if (this.UrlSegment == "localClaim") {
      this.router.navigate(["/ehrms/localClaimAdd"]);
    } else if (this.UrlSegment == "miscellaneousClaim") {
      this.router.navigate(["/ehrms/miscellaneousClaimAdd"]);
    }
  }

  GetTravelMaster() {
    this.api.HttpGetType("TravelRequest/GetTravelMaster").then(
      (result: any) => {
        if (result["status"] == true) {
          this.travelmode_data = result.travelmode_data;
          this.visit_data = result.purpose_of_visitData;
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

  GetEmployeedata() {
    this.api.HttpGetType("TravelRequest/getemployeedata").then(
      (result: any) => {
        if (result["status"] == true) {
          this.EmployeeData = result.data[0];
          this.ProfileForm.patchValue(this.EmployeeData);
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

  ClearSearch() {
    this.dataAr = [];
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

      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
      this.Get();
    });
  }

  Get() {
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
      ajax: (dataTablesParameters: any, callback) => {
        let apiUrl = "";
        if (
          this.UrlSegment == "miscellaneousClaim" ||
          this.UrlSegment == "miscellaneousClaim-manager" ||
          this.UrlSegment == "miscellaneousClaim-hod" ||
          this.UrlSegment == "miscellaneousClaim-claim" ||
          this.UrlSegment == "miscellaneousClaim-account"
        ) {
          apiUrl =
            environment.apiUrl +
            "/ehrms/ViewRequest?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&urlSegment=" +
            this.UrlSegment;
        } else if (
          this.UrlSegment == "localClaim" ||
          this.UrlSegment == "localClaim-manager" ||
          this.UrlSegment == "localClaim-hod" ||
          this.UrlSegment == "localClaim-claim" ||
          this.UrlSegment == "localClaim-account"
        ) {
          apiUrl =
            environment.apiUrl +
            "/ehrms/ViewLocalRequest?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&urlSegment=" +
            this.UrlSegment;
        }
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(apiUrl),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrl)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
           
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;

            that.dataAr = resp.data;

            if (that.dataAr.length >= 0) {
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

  GetRequest_Details(row_Id): void {
    this.ModalShow = true;
    const dialogRef = this.dialog.open(LocalMiscellaneousDetailsComponent, {
      data: { Id: row_Id },
      disableClose: true,
      panelClass: "custom-dialog-container",
      backdropClass: "custom-backdrop-travel", // Custom CSS class for styling the backdrop
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.Get();
      // this.ResetDT();
      this.ModalShow = false;
    });
  }

  onFileChange(event: any) {
    this.fileError = "";
    this.selectedFiles = [];

    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const extension = file.name.split(".").pop().toLowerCase();
        if (!this.validImageExtensions.includes(extension)) {
          this.fileError = `Invalid file type for ${file.name}. Please upload an image with a valid extension (jpg, jpeg, png, gif).`;
          return;
        }
        this.selectedFiles.push(file);
      }
    }

    if (this.selectedFiles.length > 5) {
      this.sendRequest.get("file_Misc").setValue("");
      this.fileError = "You can only upload up to 5 images at a time.";
      return;
    }
    this.FileNames = this.selectedFiles[0].name;
  }

  onFileChangeLocal(event: any, index: number) {
    this.fileErrorLocal = "";

    if (!this.fileStorage) {
      this.fileStorage = {};
    }

    if (!this.fileStorage[index]) {
      this.fileStorage[index] = [];
    }

    this.fileStorage[index] = [];

    if (event.target.files.length > 0) {
      const files = Array.from(event.target.files) as File[];
      const validFiles = [];
      for (let file of files) {
        const extension = file.name.split(".").pop().toLowerCase();
        if (!this.validImageExtensions.includes(extension)) {
          this.fileErrorLocal = `Invalid file type for ${file.name}. Please upload an image with a valid extension (jpg, jpeg, png, gif).`;
          return;
        }
        validFiles.push(file);
      }

      if (validFiles.length > 5) {
        this.fileErrorLocal = "You can only upload up to 5 images at a time.";
        this.api.Toast(
          "Warning",
          "You can only upload up to 5 images at a time."
        );
        this.file_Error = true;
        return;
      } else {
        this.file_Error = false;
      }

      this.fileStorage[index] = validFiles;
    }
  }

  TotalFare() {
    if (
      this.UrlSegment == "miscellaneousClaimAdd" ||
      this.UrlSegment == "miscellaneousClaimUpdate"
    ) {
      this.TotalFareAmountMisc = this.sendRequest.get("amount").value;
    }
    const journeyDetailsLength = this.JourneyDetails_formArrays.length;

    this.JourneyAmountTotal = 0;
    for (let i = 0; i < journeyDetailsLength; i++) {
      const JourneyDetailGroup = this.JourneyDetails_formArrays.at(
        i
      ) as FormGroup;
      if (JourneyDetailGroup) {
        const journeyAmount = JourneyDetailGroup.value["EmployeeAmount"];
        if (!isNaN(journeyAmount) && journeyAmount !== null) {
          this.JourneyAmountTotal += journeyAmount;
        }
      }
    }

    this.TotalFareAmount = this.JourneyAmountTotal;
  }

  CheckAmount(type) {
    this.api.HttpGetType("Ehrms/GetFair?type=" + type).then(
      (result: any) => {
        if (result["status"] == true) {
          this.MaxAmount = result.MaxAmount;
        } else {
          this.MaxAmount = 0;
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

  claimRequest(type?: string) {
    this.is_Submit = true;

    var FormType = "";
    if (type) {
      if (type === "saveForm") {
        FormType = type;
      } else {
        FormType = "";
      }
    }

    const selectedDate1 = this.sendRequest.get("fromDate").value;
    const selectedDate2 = this.sendRequest.get("toDate").value;

    if (selectedDate1 > selectedDate2) {
      this.dateInvalid_Misc = true;

      return;
    } else {
      this.dateInvalid_Misc = false;

      if (this.sendRequest.invalid || this.fileError != "") {
        //   //   //   console.log(this.sendRequest);
        return;
      } else {
        const formdata = new FormData();
        const fields = this.ProfileForm.value;
        const fieldData = this.sendRequest.value;

        if (Number(this.sendRequest.get("amount").value) > Number(this.MaxAmount)) {
          this.FC.amount.setErrors({ limit: true });
          return;
        } else {
          this.FC.amount.setErrors(null);
        }

        const miscellaneousFormData = {
          Id: fields["ID"],
          employeeId: fields["Employee_ID"],
          employeeName: fields["Employee_Name"],
          employeeDesignation: fields["Employee_Designation"],
          employeeProfile: fields["Employee_Profile"],
          employeeDepartment: fields["Employee_Department"],
          employeeRM: fields["Employee_ReportingManager"],
        };

        if (this.UrlSegment == "miscellaneousClaimUpdate") {
          formdata.append("updateId", this.updateID);
        }
        if (
          this.UrlSegment == "miscellaneousClaimAdd" &&
          this.MiscellaneousSave
        ) {
          formdata.append("saveId", this.SavedId);
        }

        formdata.append(
          "miscellaneousForm",
          JSON.stringify(miscellaneousFormData)
        );
        formdata.append("fromDate", fieldData["fromDate"]);
        formdata.append("toDate", fieldData["toDate"]);
        formdata.append("amount", fieldData["amount"]);
        formdata.append("remark", fieldData["remark"]);
        formdata.append("ID", fields["ID"]);
        formdata.append("FormType", "Miscellaneous");
        formdata.append("saveStatus", FormType);

        if (this.selectedFiles) {
          if (this.selectedFiles.length > 0 && this.selectedFiles.length < 6) {
            for (let i = 0; i < this.selectedFiles.length; i++) {
              formdata.append(
                "Documents[]",
                this.selectedFiles[i],
                this.selectedFiles[i].name
              );
            }
          }
        }

        this.api.HttpPostType("Ehrms/Save_Claim_Request", formdata).then(
          (result: any) => {
            if (result["status"] == true) {
              // Reset  form
              this.is_Submit = false;
              this.sendRequest.reset();
              this.api.Toast("Success", result["msg"]);
              this.router.navigate(["/ehrms/miscellaneousClaim"]);
            } else {
              this.api.Toast("Warning", result["msg"]);
              if (result["msg"] == "Request Already Raised") {
                this.router.navigate(["/ehrms/miscellaneousClaim"]);
              }
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
  }

  claimRequestLocal(type?: string) {
    var FormType = "";
    if (type) {
      if (type === "saveForm") {
        FormType = type;
      } else {
        FormType = "";
      }
    }

    this.LocalSubmit = true;
    this.totalAmount = 0;

    const journeyDetailsLength = this.JourneyDetails_formArrays.length;
    for (let i = 0; i < journeyDetailsLength; i++) {
      const JourneyDetailGroup = this.JourneyDetails_formArrays.at(
        i
      ) as FormGroup;

      if (JourneyDetailGroup) {
        const selectedDate1 = JourneyDetailGroup.value["DepartureDate"];
        const selectedDate2 = JourneyDetailGroup.value["ArrivalDate"];

        if (selectedDate2 && selectedDate1) {

          if (selectedDate2 < selectedDate1) {
            this.api.Toast(
              "Warning",
              "Arrival Date cannot be earlier than Departure Date"
            );

            this.dateInvalid = true;
          } else {
            this.dateInvalid = false;
          }

        } else {
          this.dateInvalid = false;
        }

      }
    }

    if (this.file_Error) {
      this.api.Toast(
        "Warning",
        "You can only upload up to 5 images at a time."
      );
      return;
    }
    if (this.sendLocalRequest.invalid || this.dateInvalid || this.file_Error) {
      //   //   //   console.log(this.sendLocalRequest);
      return;
    } else {
      const journeyDetailsLength = this.JourneyDetails_formArrays.length;
      for (let i = 0; i < journeyDetailsLength; i++) {
        const JourneyDetailGroup = this.JourneyDetails_formArrays.at(
          i
        ) as FormGroup;

        if (JourneyDetailGroup) {
          const EmployeeAmount = JourneyDetailGroup.value["EmployeeAmount"];
          this.totalAmount += EmployeeAmount;
        }
      }

      if (Number(this.totalAmount) > Number(this.MaxAmount)) {
        this.api.Toast(
          "Warning",
          "Total Amount is greater than" + this.MaxAmount
        );
      } else {
        const formdata = new FormData();
        const fields = this.ProfileForm.value;
        const Year_month = this.sendLocalRequest.value;
        this.FormData1 = this.JourneyDetails_formArrays.value;

        const localFormData = {
          Id: fields["ID"],
          employeeId: fields["Employee_ID"],
          employeeName: fields["Employee_Name"],
          employeeDesignation: fields["Employee_Designation"],
          employeeProfile: fields["Employee_Profile"],
          employeeDepartment: fields["Employee_Department"],
          employeeRM: fields["Employee_ReportingManager"],
          LocalForm: this.FormData1,
        };


        formdata.append("LocalForm", JSON.stringify(localFormData));
        formdata.append("ID", fields["ID"]);
        formdata.append("FormType", "Local Conveyance");
        formdata.append("year", JSON.stringify(Year_month["Year"]));
        formdata.append("month", JSON.stringify(Year_month["Month"]));
        formdata.append("saveStatus", FormType);
        formdata.append("totalFareAmount", this.TotalFareAmount);

        if (this.UrlSegment == "localClaimUpdate") {
          formdata.append("updateId", this.updateID);
        }
        if (this.UrlSegment == "localClaimAdd" && this.LocalSave) {
          formdata.append("saveId", this.SavedId);
        }

        if (this.fileStorage) {
          Object.keys(this.fileStorage).forEach((key) => {
            const fileArray = this.fileStorage[key];
            if (Array.isArray(fileArray)) {
              fileArray.forEach((file: File, index: number) => {
                formdata.append(`File[${key}][${index}]`, file, file.name);
              });
            }
          });
        }

        this.api.HttpPostType("Ehrms/Save_Local_Request", formdata).then(
          (result: any) => {
            if (result["status"] == true) {
              // Reset  form
              this.LocalSubmit = false;
              this.sendRequest.reset();
              this.api.Toast("Success", result["msg"]);
              this.router.navigate(["/ehrms/localClaim"]);
            } else {
              this.api.Toast("Warning", result["msg"]);
              if (result["msg"] == "Request Already Raised") {
                this.router.navigate(["/ehrms/localClaim"]);
              }
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
  }

  AmountCalculate(e, i) {

    this.DistanceFair = e.target.value * this.FairAmount;
    const JourneyDetailGroup = this.JourneyDetails_formArrays.at(
      i
    ) as FormGroup;

    if (JourneyDetailGroup) {
      JourneyDetailGroup.get("EmployeeAmount").setValue(this.DistanceFair);

      this.TotalFare();
    }
  }

  Accept(Id: any, RequestType: string) {
    const formdata = new FormData();

    formdata.append("Accept", RequestType);
    formdata.append("urlSegment", this.UrlSegment);

    formdata.append("userName", this.api.GetUserData("Name"));
    formdata.append("userCode", this.api.GetUserData("Code"));
    formdata.append("Login_User_Id", this.api.GetUserData("Id"));
    formdata.append("Login_User_Type", this.api.GetUserData("Type"));

    let apiUrl = "";
    if (
      this.UrlSegment == "miscellaneousClaim-hod" ||
      this.UrlSegment == "miscellaneousClaim-claim" ||
      this.UrlSegment == "miscellaneousClaim-account"
    ) {
      formdata.append("miscellaneousClaimId", Id);
      apiUrl = "ehrms/SaveLogs";
    } else if (
      this.UrlSegment == "localClaim-hod" ||
      this.UrlSegment == "localClaim-claim" ||
      this.UrlSegment == "localClaim-account"
    ) {
      formdata.append("localClaimId", Id);
      apiUrl = "ehrms/SaveLogsLocal";
    }

    this.api.HttpPostType(apiUrl, formdata).then(
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

  GetAction(ID: any, Type: any) {
    this.ModalAction = Type;
    this.miscellaneousId = ID;

    if (this.ModalAction == "Approve") {
      const formdata = new FormData();
      formdata.append("claimId", this.miscellaneousId);
      formdata.append("urlSegment", this.UrlSegment);
      this.api.HttpPostType("ehrms/GetAmount", formdata).then((result: any) => {
        if (result["status"] == true) {
          this.miscellaneousAmount = result.claimAmount;
          this.miscellaneousAmountManager = result.journeyDetails.managerAmount;
          this.miscellaneousAmountHOD = result.journeyDetails.hodAmount;
          this.miscellaneousAmountClaim = result.journeyDetails.claimAmount;

          if (
            this.UrlSegment == "localClaim-manager" ||
            this.UrlSegment == "miscellaneousClaim-manager"
          ) {
            this.Action.get("AmountVal").setValue(this.miscellaneousAmount);
          } else if (
            this.UrlSegment == "localClaim-hod" ||
            this.UrlSegment == "miscellaneousClaim-hod"
          ) {
            this.Action.get("AmountVal").setValue(
              this.miscellaneousAmountManager
            );
          } else if (
            this.UrlSegment == "localClaim-claim" ||
            this.UrlSegment == "miscellaneousClaim-claim"
          ) {
            this.Action.get("AmountVal").setValue(this.miscellaneousAmountHOD);
          } else if (
            this.UrlSegment == "localClaim-account" ||
            this.UrlSegment == "miscellaneousClaim-account"
          ) {
            this.Action.get("AmountVal").setValue(
              this.miscellaneousAmountClaim
            );
          }

          if (
            this.UrlSegment == "localClaim-manager" ||
            this.UrlSegment == "localClaim-hod" ||
            this.UrlSegment == "localClaim-claim" ||
            this.UrlSegment == "localClaim-account"
          ) {

            this.CheckAmount(4);
          } else if (
            this.UrlSegment == "miscellaneousClaim-manager" ||
            this.UrlSegment == "miscellaneousClaim-hod" ||
            this.UrlSegment == "miscellaneousClaim-claim" ||
            this.UrlSegment == "miscellaneousClaim-account"
          ) {
            this.CheckAmount(5);
          }
        } else {
          this.miscellaneousAmount = "";
        }
      });

      this.Action.get("AmountVal").setValidators(Validators.required);
      this.Action.get("AmountVal").updateValueAndValidity();
    }
  }

  ActionData() {
    this.ActionSubmit = true;

    if (Number(this.Action.get("AmountVal").value) > Number(this.MaxAmount)) {
      this.api.Toast(
        "Warning",
        "Amount cannot be greater than " + this.MaxAmount
      );
      return false;
    } else {
      this.Action.get("AmountVal").setErrors(null);
    }

    if (this.Action.invalid) {
      return;
    } else {
      const Fields = this.Action.value;
      const formdata = new FormData();

      formdata.append("actionTaken", this.ModalAction);
      formdata.append("urlSegment", this.UrlSegment);

      let apiUrl = "";
      if (
        this.UrlSegment == "miscellaneousClaim-manager" ||
        this.UrlSegment == "miscellaneousClaim-hod" ||
        this.UrlSegment == "miscellaneousClaim-claim" ||
        this.UrlSegment == "miscellaneousClaim-account"
      ) {
        formdata.append("miscellaneousClaimId", this.miscellaneousId);
        formdata.append("miscellaneousAmount", Fields["AmountVal"]);
        formdata.append("miscellaneousRemark", Fields["RemarkVal"]);

        apiUrl = "ehrms/SaveLogs";
      } else if (
        this.UrlSegment == "localClaim-manager" ||
        this.UrlSegment == "localClaim-hod" ||
        this.UrlSegment == "localClaim-claim" ||
        this.UrlSegment == "localClaim-account"
      ) {
        formdata.append("localClaimId", this.miscellaneousId);
        formdata.append("localAmount", Fields["AmountVal"]);
        formdata.append("localRemark", Fields["RemarkVal"]);

        apiUrl = "ehrms/SaveLogsLocal";
      }

      this.api.HttpPostType(apiUrl, formdata).then(
        (result: any) => {
          if (result["status"] == true) {

            this.api.Toast("Success", result["msg"]);

            // this.Get;
            this.CloseModel();
            // this.ResetDT();
            this.SearchData();

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

  CloseModel() {
    this.ResetDT();
    const closeButton = document.getElementById("CloseModel");
    if (closeButton) {
      closeButton.click();
    }
  }

  parseDate(dateStr: string) {
    const parts = dateStr.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  Edit_request(Id: any, type?: any) {

    const formdata = new FormData();

    var FormType = "";
    if (type) {
      if (type === "saveForm") {
        FormType = type;
      } else {
        FormType = "";
      }
    }
   
    // let apiUrl = '';

    if (
      this.UrlSegment == "miscellaneousClaimUpdate" ||
      this.UrlSegment == "miscellaneousClaim" ||
      this.MiscellaneousSave
    ) {
    
      this.apiUrl1 = "ehrms/ViewRequest?User_Id=" +
        this.api.GetUserData("Id") +
        "&User_Type=" +
        this.api.GetUserType() +
        "&urlSegment=" +
        this.UrlSegment
    } else if (
      this.UrlSegment == "localClaimUpdate" ||
      this.UrlSegment == "localClaim" ||
      this.LocalSave
    ) {
      this.apiUrl1 = "ehrms/ViewLocalRequest?User_Id=" +
        this.api.GetUserData("Id") +
        "&User_Type=" +
        this.api.GetUserType() +
        "&urlSegment=" +
        this.UrlSegment
    }

    this.Id = Id;
    formdata.append("claimId", this.Id);
    formdata.append("urlSegment", this.UrlSegment);
    formdata.append("saveStatus", FormType);


    this.api.HttpPostType(this.apiUrl1, formdata).then(
      (result: any) => {
        if (result["status"] == true) {
          this.dataAr = result.data;
          this.TotalFareAmount = result.data[0].claimAmountLocal;
          this.TotalFareAmountMisc = result.data[0].claimAmount;

          if (
            this.UrlSegment == "miscellaneousClaimUpdate" ||
            this.MiscellaneousSave
          ) {
            this.sendRequest.patchValue({
              fromDate: this.parseDate(this.dataAr[0].claimFromDate),
              toDate: this.parseDate(this.dataAr[0].claimToDate),
              amount: this.dataAr[0].claimAmount,
              remark: this.dataAr[0].remark,
            });
          } else if (this.UrlSegment == "localClaimUpdate" || this.LocalSave) {
            this.YearSaved = this.dataAr[0].claimFor[0],
              this.MonthSaved = this.dataAr[0].claimFor[1][0],
              this.MonthSelect(this.MonthSaved);

            this.sendLocalRequest.patchValue({
              Year: this.dataAr[0].claimFor[0],
              Month: this.dataAr[0].claimFor[1],
            });
            this.dataAr[0].localForm.forEach((item) => {
              this.GetFair(item.Travelmode, "item.id");
              const formGroup = this.createArray();
              formGroup.patchValue({
                Id: item.Id,
                EmployeeAmount: item.EmployeeAmount,
                DepartureDate: this.parseDate(item.DepartureDate),
                DepartureTime: item.DepartureTime,
                DepartureStartPoint: item.DepartureStartPoint,
                ArrivalDate: this.parseDate(item.ArrivalDate),
                ArrivalTime: item.ArrivalTime,
                ArrivalStartPoint: item.ArrivalStartPoint,
                Travelmode: item.Travelmode,
                PurposeOfVisit: item.PurposeOfVisit,
                Remark: item.Remark,
                Distance: item.Distance,
              });

              this.JourneyDetails_formArrays.push(formGroup);
            });
          }
        } else {
          this.dataAr = [];
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

  GetFair(e, i) {

    if (this.UrlSegment == "localClaimAdd") {
      var ev = e.Id;
    }

    if (this.UrlSegment == "localClaimUpdate") {

      if (Array.isArray(e) && e.length > 0) {
        ev = e[0].Id ? e[0].Id : e[0].Id;
      }

    }

    if (this.LocalSave) {
      if (typeof e === "string" && e !== "") {
        ev = [e];
      }

      if (Array.isArray(e) && e.length > 0) {
        ev = e[0].Id ? e[0].Id : e[0].Id;
      }
    }

    const JourneyDetailGroup = this.JourneyDetails_formArrays.at(
      i
    ) as FormGroup;

    if (JourneyDetailGroup) {
      JourneyDetailGroup.get("EmployeeAmount").setValue("");
    }
    this.api.HttpGetType("Ehrms/GetFair?ModeId=" + ev).then(
      (result: any) => {
        if (result["status"] == true) {
          this.FairAmount = result.MaxAmount;
        } else {
          this.FairAmount = 0;
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
