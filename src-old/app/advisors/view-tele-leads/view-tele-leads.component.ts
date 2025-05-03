import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  NgZone,
} from "@angular/core";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { map, pairwise, filter, throttleTime } from "rxjs/operators";
import { timer } from "rxjs";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { ApiService } from "../../providers/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import swal from "sweetalert";

class ColumnsObj {
  SrNo: string;
  Id: string;
  name: string;
  email: string;
  city: string;
  valueObuild: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  where_str: string;
  last_id: string;
}

@Component({
  selector: "app-view-tele-leads",
  templateUrl: "./view-tele-leads.component.html",
  styleUrls: ["./view-tele-leads.component.css"],
})
export class ViewTeleLeadsComponent implements OnInit {
  TransferForm: FormGroup;
  selectedCheckboxValues: string[] = [];
  searchFilterData: {};

  @ViewChild("scroller", { static: false }) scroller: CdkVirtualScrollViewport;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  dropdownSettingsmultiselect: any = {};

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  totalCount: number;
  currentUrl: string;
  Is_Export: number;
  assignedEmployeeData: any[];
  isSubmitted: boolean;

  totalRecordsfiltered: number;
  TotalRow: number;
  filterData: string;
  loading = false;

  post: Array<any> = [];
  responseData: any;
  pageNo: any = 1;

  AgentId: string;
  ShowProspectBtn: string = "Yes";
  active_tab: any = "Pending";
  recordsTotal: any;

  FieldFetch: any = [];
  logData: any;
  countdata: any;
  loginEmpid: any;

  UpdateFollowForm: FormGroup;
  statusOptions: any[];
  today = new Date();
  Nextes: Date;
  SrTableId: any;
  Status: any;
  DateTimesShow: boolean = false;
  EmployeShow: boolean = false;
  Status2: any;
  ActionUser: any;
  dataArr: any;
  Id: any;
  buttonDisable = false;
  selectedStatus: any[];
  showFollowUpForm: boolean = false;
  selectedDate: string;
  selectedTime: string;

  dropdownSettingsSingleselect: any = {};
  date: any;
  re_hit: any = "yes";
  new_lead: any = "0";
  where_str: any = "";
  last_id: any = "0";
  leadIndex: any;

  isMobileMaskedMap: { [key: number]: boolean } = {};

  //calling Api variables
  call_id: any = "0";
  row_id: any = "0";
  unique_id: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    private fb: FormBuilder,
    private ngZone: NgZone
  ) {
    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsSingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
    };
  }

  ngOnInit() {
    this.loginEmpid = this.api.GetUserData("Id");
    this.Get();
    // this.GetCount();
    this.SetActiveTab("Pending");
    this.pageNo = 1;

    this.UpdateFollowForm = this.fb.group({
      Status: [this.Status, Validators.required],
      Dates: ["", Validators.required],
      Times: ["", Validators.required],
      Remarks: ["", Validators.required],
    });

    this.UpdateFollowForm.get("Dates").valueChanges.subscribe(() => {
      // Reset the "Time" value when the "Date" changes
      this.UpdateFollowForm.get("Times").setValue("");
    });

    // follow up form
    this.statusOptions = [
      { Id: "1", Name: "Pending" },
      { Id: "2", Name: "Follow Up" },
      { Id: "4", Name: "Lost" },
      { Id: "6", Name: "Close" },
    ];

    this.Nextes = new Date();
    this.Nextes.setDate(this.Nextes.getDate() + 365);
    const Datess = this.UpdateFollowForm.get("Dates");
    const Timess = this.UpdateFollowForm.get("Times");

    if (this.Status == "1" && this.Status == "4" && this.Status == "6") {
      Datess.disable();
      Timess.disable();
      this.DateTimesShow = false;
    } else {
      Datess.enable();
      Timess.enable();
      this.DateTimesShow = true;
    }
  }

  ngAfterViewInit(): void {
    this.api.data1$.subscribe((data) => {
      this.post = [];
      this.pageNo = 1;
      this.scroller
        .elementScrolled()
        .pipe(
          map(() => this.scroller.measureScrollOffset("bottom")),
          pairwise(),
          filter(([y1, y2]) => y2 < y1 && y2 < 140),
          throttleTime(900)
        )
        .subscribe(() => {
          this.ngZone.run(() => {
            if (this.re_hit == "yes") {
              this.Get();
            }
          });
        });
    });
  }

  onTimeChange(newTime: string) {
    const selectedTime = newTime;
    const currentTime = this.formatTime(
      new Date().toLocaleTimeString("en-US", { hour12: false })
    );

    const currentDate = new Date().toLocaleDateString("en-US");
    let fields = this.UpdateFollowForm.value;
    const selectedDate = fields["Dates"];
    const formatDate = new Date(selectedDate).toLocaleDateString("en-US");

    if (formatDate == currentDate) {
      if (selectedTime >= currentTime) {
        this.UpdateFollowForm.get("Times").setErrors(null);
      } else {
        this.UpdateFollowForm.get("Times").setErrors({ timeInvalid: true });
      }
    } else {
      return null; // No validation for dates other than the current date
    }
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(":").slice(0, 2);
    return `${hours}:${minutes}`;
  }

  //===== SET ACTIVE TAB =====//
  SetActiveTab(tab_value: any) {
    if (this.re_hit == "yes") {
      this.api.SetActiveTabModuleWise(tab_value, "lms-manage-request");
      this.active_tab = tab_value;
      this.post = [];
      this.pageNo = 1;
    }
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.filterData = JSON.stringify(event);
    this.post = [];
    this.pageNo = 1;
    this.Get();
    this.Is_Export = 0;
    this.dataAr = [];
    let filterContainer = document.getElementById("collapseOne");
    if (filterContainer.classList.contains("in")) {
      document.getElementById("headingOne").click();
    } else {
    }
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.post = [];
    this.pageNo = 1;
  }

  //===== RELOAD DATATABLE =====//
  Reload() {
    this.post = [];
    this.pageNo = 1;
    this.Get();
  }

  //===== GET DATATABLE DATA =====//
  Get() {
    this.re_hit = "no";
    const formData = new FormData();
    formData.append("datas", this.filterData);

    this.api
      .HttpPostType(
        "Advisor/GridData?User_Id=" +
          this.api.GetUserData("Id") +
          "&user_code=" +
          this.api.GetUserData("Code") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Page=" +
          this.pageNo,
        formData
      )
      .then(
        (result: any) => {
          this.re_hit = "yes";
          this.loading = true;
          if (result["status"] == true) {
            // this.GetCount();
            this.dataAr = result["data"];

            this.countdata = result["lead_count"];

            if (this.dataAr.length == 0 || this.dataAr.length > 0) {
              this.loading = false;
            }

            this.where_str = result["where_str"];
            this.last_id = result["last_id"];

            if (this.pageNo <= 1) {
              this.totalRecordsfiltered = result["recordsFiltered"];
              this.TotalRow = result["recordsFiltered"];
              this.recordsTotal = result["recordsTotal"];
            }

            this.responseData = result["data"];
            this.post = this.post.concat(this.responseData);

            this.post.forEach((posts, index) => {
              this.isMobileMaskedMap[index] = true;
            });
            this.pageNo++;
            var keyss = 0;

            this.post = this.post.map((item) => {
              keyss++;
              item.SrNo = keyss;
              return item;
            });

            // this.GetNewLeadCount();
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

  //===== GET NEW LEAD COUNTS =====//
  GetNewLeadCount() {
    const formData = new FormData();

    formData.append("where_str", this.where_str);
    formData.append("last_id", this.last_id);

    this.api.HttpPostTypeBms("lms/LmsCommon/GetNewLeadCount", formData).then(
      (result: any) => {
        if (result["status"] == true) {
          this.new_lead = result["new_lead_count"];
        } else {
          this.api.Toast("Warning", result["msg"]);
        }

        setTimeout(() => {
          // this.GetNewLeadCount();
        }, 30000);
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

  getDetails(Id: any) {
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("lead_id", Id);

    this.api.HttpPostTypeBms("lms/LmsCommon/getDetails", formData).then(
      (result: any) => {
        if (result["status"] == true) {
          this.FieldFetch = result["data"];

          this.logData = this.FieldFetch.log;
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

  async updateQuottionStatus(quotationId: any, leadId: any, type: any) {
    const Is_Confirm = await swal({
      title: "Are you sure?",
      text: "",
      icon: "warning",
      buttons: ["No", "Yes"],
    });

    // var Confirms = confirm("Are You Sure ?");
    if (Is_Confirm == true) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("QuotationId", quotationId);
      formData.append("Lead_id", leadId);
      formData.append("type", type);

      this.api.HttpPostTypeBms("lms/LmsCommon/updateQuotion", formData).then(
        (result: any) => {
          this.api.HideLoading();

          if (result["type"] == "Motor") {
            if (result["quoteStatus"] === "1") {
              window.open(
                `https://www.squareinsurance.in/quotes/index/${result["quoteId"]}`,
                "_blank"
              );
            } else if (result["quoteStatus"] === "2") {
              window.open(
                `https://www.squareinsurance.in/proposal/${result["company"]}/${result["quoteId"]}`,
                "_blank"
              );
            } else if (result["quoteStatus"] === "3") {
              window.open(
                `https://www.squareinsurance.in/review_pay/index/${result["quoteId"]}`,
                "_blank"
              );
            }
          } else if (result["type"] == "Health") {
            if (result["quoteStatus"] === "1") {
              // window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/prequotes//health-quote/?quote=${result['quoteId']}`, '_blank');
              window.open(
                `https://www.squareinsurance.in/prequotes/health-quote/?quote=${result["quoteId"]}`,
                "_blank"
              );
            } else if (result["quoteStatus"] === "2") {
              // window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/health_proposal/proposal?quote=${result['quoteId']}`, '_blank');
              window.open(
                `https://www.squareinsurance.in/health_proposal/proposal?quote=${result["quoteId"]}`,
                "_blank"
              );
            } else if (result["quoteStatus"] === "3") {
              window.open(
                `https://www.squareinsurance.in/health_review/index/?quote=${result["quoteId"]}`,
                "_blank"
              );
            }
          } else if (result["type"] == "Nonmotor") {
            if (result["quoteStatus"] === "1") {
              //  window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/marine-quote/?quote=${result['quoteId']}`, '_blank');
              window.open(
                `https://www.squareinsurance.in/marine-quote/?quote=${result["quoteId"]}`,
                "_blank"
              );
            } else if (result["quoteStatus"] === "2") {
              window.open(
                `https://www.squareinsurance.in/nonmotor_proposal/proposal?quote=${result["quoteId"]}`,
                "_blank"
              );
              // window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/nonmotor_proposal/proposal?quote=${result['quoteId']}`, '_blank');
            } else if (result["quoteStatus"] === "3") {
              window.open(
                `https://www.squareinsurance.in/health_review/index/?quote=${result["quoteId"]}`,
                "_blank"
              );
            }
          } else if (result["type"] == "Pa") {
            if (result["quoteStatus"] === "1") {
              //  window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/marine-quote/?quote=${result['quoteId']}`, '_blank');
              window.open(
                `https://www.squareinsurance.in/personal-accident-quote?quote=${result["quoteId"]}`,
                "_blank"
              );
            } else if (result["quoteStatus"] === "2") {
              window.open(
                `https://www.squareinsurance.in/pa_proposal/proposal?quote=${result["quoteId"]}`,
                "_blank"
              );
              // window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/nonmotor_proposal/proposal?quote=${result['quoteId']}`, '_blank');
            } else if (result["quoteStatus"] === "3") {
              window.open(
                `https://www.squareinsurance.in/pa_review/index/?quote=${result["quoteId"]}`,
                "_blank"
              );
            }
          } else if (result["type"] == "Travel") {
            if (result["quoteStatus"] === "1") {
              //  window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/prequotes/life-quote?quote=${result['quoteId']}`, '_blank');
              window.open(
                `https://www.squareinsurance.in/prequotes/travel-quote?quote=${result["quoteId"]}`,
                "_blank"
              );
            } else if (result["quoteStatus"] === "2") {
              window.open(
                `https://www.squareinsurance.in/travel_proposal/proposal?quote=${result["quoteId"]}`,
                "_blank"
              );
              // window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/nonmotor_proposal/proposal?quote=${result['quoteId']}`, '_blank');
            }
          } else if (result["type"] == "Life") {
            if (result["quoteStatus"] === "1") {
              //  window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/prequotes/life-quote?quote=${result['quoteId']}`, '_blank');
              window.open(
                `https://www.squareinsurance.in/prequotes/life-quote?quote=${result["quoteId"]}`,
                "_blank"
              );
            }
          }
        },
        (err) => {
          this.api.HideLoading();
          //   //   //   console.log(err);
        }
      );
    }
  }

  GetCount() {
    const formData = new FormData();

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("window", "rm");
    formData.append("user_code", this.api.GetUserData("Code"));

    this.api.HttpPostTypeBms("lms/LmsCommon/getCountLeads", formData).then(
      (result: any) => {
        if (result["status"] == true) {
          // this.countdata = result;
        }
      },
      (err) => {}
    );
  }

  // follow up popup functions

  FollowUpPopup_open(
    e: any,
    Id: number,
    Action: string,
    EmpID: any,
    leadAge: any,
    indexs: any
  ) {
    this.getdata(Id);
    this.leadIndex = indexs;
    document.getElementById("ageSpan").innerHTML = leadAge;

    this.showFollowUpForm = true;

    var Values = e;
    this.Status = Values;

    this.Id = Id;

    if (this.Status == 1) {
      this.selectedStatus = [{ Id: "1", Name: "Pending" }];
    } else if (this.Status == 2) {
      this.selectedStatus = [{ Id: "2", Name: "Follow Up" }];
    } else if (this.Status == 3) {
      this.selectedStatus = [{ Id: "3", Name: "Converted" }];
    } else if (this.Status == 4) {
      this.selectedStatus = [{ Id: "4", Name: "Lost" }];
    } else if (this.Status == 6) {
      this.selectedStatus = [{ Id: "6", Name: "Close" }];
    }
  }

  UpdateStatusValue(Value: any) {
    this.Status = Value;
    const selectedValue = Value["Id"];
    const Datess = this.UpdateFollowForm.get("Dates");
    const Timess = this.UpdateFollowForm.get("Times");

    if (selectedValue === "1") {
      this.buttonDisable = true;
    } else {
      this.buttonDisable = false;
    }

    if (
      selectedValue === "1" ||
      selectedValue === "4" ||
      selectedValue === "6"
    ) {
      Datess.disable();
      Timess.disable();
      this.DateTimesShow = false;
    } else {
      Datess.enable();
      Timess.enable();
      this.DateTimesShow = true;
    }
  }

  get Followup_control() {
    return this.UpdateFollowForm.controls;
  }

  UpdateFollowFormS() {
    this.isSubmitted = true;

    if (this.UpdateFollowForm.invalid) {
      //   //   //   console.log("something went wrong");
      return;
    } else {
      this.buttonDisable = false;

      var fields = this.UpdateFollowForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("Id", this.Id);
      formData.append("Status", JSON.stringify(fields["Status"]));
      formData.append("Date", fields["Dates"]);
      formData.append("Time", fields["Times"]);
      formData.append("Remark", fields["Remarks"]);
      let statusLable = fields["Status"][0]["Name"];

      var Confirms = confirm("Are You Sure To Change Status?");
      if (Confirms == true) {
        this.api.IsLoading();

        this.api
          .HttpPostTypeBms("lms/LmsCommon/InsuranceLeadsLogsCreate", formData)
          .then(
            (result: any) => {
              this.api.HideLoading();
              if (result["status"] == true) {
                this.buttonDisable = false;
                // this.GetCount();
                this.getdata(this.Id);

                if (this.active_tab == statusLable) {
                } else {
                  const keysToRemove = [this.leadIndex];
                  // Use filter to remove the specified keys
                  this.post = this.post.filter(
                    (value, index) => !keysToRemove.includes(index)
                  );
                  //reset the indexing
                  this.post = this.post.map((value, index) => ({
                    ...value,
                    newIndex: index,
                  }));
                }

                this.UpdateFollowForm.reset("");
                this.api.Toast("Success", result["msg"]);
              } else {
                this.buttonDisable = false;

                this.api.Toast("Warning", result["msg"]);
              }
            },
            (err) => {
              this.buttonDisable = false;

              this.api.HideLoading();
              this.api.Toast(
                "Warning",
                "Network Error : " + err.name + "(" + err.statusText + ")"
              );
            }
          );
      }
    }
  }

  //===== GET LEADS FOLLOWUP TRACK =====//
  getdata(id: any) {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());

    formData.append("Id", id);

    this.api.HttpPostTypeBms("lms/LmsCommon/InsuranceLeadsLogs", formData).then(
      (result) => {
        this.dataArr = result;
      },
      (err) => {
        this.dataArr = err["error"]["text"];
      }
    );
  }

  onScroll(event: Event) {
    let filterContainer = document.getElementById("collapseOne");

    if (filterContainer.classList.contains("in")) {
      document.getElementById("headingOne").click();
    } else {
    }
  }

  async CallApi(number: any, LeadId: any) {
    const Is_Confirm = await swal({
      title: "Are you sure?",
      text: "Do you want to Call On this Number?",
      icon: "warning",
      buttons: ["No", "Yes"],
    });

    if (Is_Confirm == true) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("number", number);
      formData.append("Lead_id", LeadId);

      var call_id = "0";
      let unique_id = "0";
      this.api.HttpPostTypeBms("lms/LmsCommon/callApi", formData).then(
        (result: any) => {
          this.api.HideLoading();
          // this.Reload();
          if (result["status"] == "success") {
            this.Get();
            // this.GetCount();
            call_id = result["call_id"];
            unique_id = result["uid"];
            this.CheckWebHookResponse(call_id, LeadId, unique_id);
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.CheckWebHookResponse(call_id, LeadId, unique_id);
        }
      );
    }
  }

  //===== SALARY REMARKS TRACK DETAILS =====//
  CheckWebHookResponse(call_id: any, row_id: any, unique_id: any): void {
    this.row_id = row_id;
    this.call_id = call_id;
    this.unique_id = unique_id;

    const popElm = document.getElementById("callProcess");
    popElm.style.display = "flex";

    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("row_id", this.row_id);
    formData.append("call_id", this.call_id);
    formData.append("unique_id", this.unique_id);

    this.api
      .HttpPostTypeBms("lms/LmsCommon/CheckWebHookResponse", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            popElm.style.display = "none";
          } else {
            this.CheckWebHookResponse(
              this.row_id,
              this.call_id,
              this.unique_id
            );
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }
  // Masking Mobile Numbers

  maskMobileNumber(mobile: string): string {
    if (mobile != null) {
      const firstTwoDigits = mobile.slice(0, 2);
      const lastTwoDigits = mobile.slice(-1);

      return `${firstTwoDigits}*******${lastTwoDigits}`;
    } else {
      return mobile;
    }
  }
  toggleMobileDisplay(index: number, call_permmision: any): void {
    if (call_permmision !== true) {
      this.isMobileMaskedMap[index] = !this.isMobileMaskedMap[index];
    } else {
      return;
    }
  }

  docdownload(file) {
    const link = document.createElement("a");
    link.href = file;
    link.target = "_blank";
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
    link.download = "insurance_audit_" + formattedDate;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
