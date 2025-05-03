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
import { ApiService } from "src/app/providers/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TransferLeadComponent } from "../transfer-lead/transfer-lead.component";
import swal from "sweetalert";
import { AddLeadsComponent } from "../add-leads/add-leads.component";
import { AddExcelLeadaComponent } from "../add-excel-leada/add-excel-leada.component";
import { PosDetailsComponent } from "src/app/modals/pos-details/pos-details.component";

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
  selector: "app-view-manager-leads",
  templateUrl: "./view-manager-leads.component.html",
  styleUrls: ["./view-manager-leads.component.css"],
})
export class ViewManagerLeadsComponent implements OnInit {
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
  SelectedStatusVal: any;

  totalRecordsfiltered: number;
  TotalRow: number;
  filterData: string;
  loading = false;
  businessdata: any = [];

  post: Array<any> = [];
  responseData: any;
  pageNo: any = 1;

  AgentId: string;
  ShowProspectBtn: string = "Yes";
  active_tab: any = "Untouched";
  FieldFetch: any = [];
  logData: any;
  recordsTotal: any;
  countdata: any;
  isMobileMaskedMap: { [key: number]: boolean } = {};

  // follow up pop up variables

  UpdateFollowForm: FormGroup;

  statusOptions: any[];
  RemarksOptions: any[];

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
  selectedTime: any;
  dropdownSettingsSingleselect: any = {};
  re_hit: any = "yes";
  indexes: any;
  new_lead: any = "0";
  where_str: any = "";
  last_id: any = "0";

  //calling Api variables

  call_id: any = "0";
  row_id: any = "0";
  unique_id: any;
  isOtherSelected: boolean;
  activeCheck: string = "1";
  leadRevievedate: any;
  leadId: any;

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

    this.TransferForm = this.fb.group({
      Emp_Id: ["", Validators.required],
      Remarks: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.CheckManagerRightresponse();
    // this.GetCount();
    this.SetActiveTab("Untouched");
    this.pageNo = 1;

    //follow up form
    this.UpdateFollowForm = this.fb.group({
      Status: [this.Status, Validators.required],
      Dates: ["", Validators.required],
      Times: ["", Validators.required],
      Remarks: ["", Validators.required],
      OtherRemark: [""],
      breif: [""]
    });

    this.UpdateFollowForm.get("Dates").valueChanges.subscribe(() => {
      // Reset the "Time" value when the "Date" changes
      this.UpdateFollowForm.get("Times").setValue("");
    });

    this.statusOptions = [
      { Id: "1", Name: "Pending" },
      { Id: "2", Name: "Follow Up" },
      { Id: "4", Name: "Lost" },
      { Id: "6", Name: "Close" },
    ];

    this.RemarksOptions = [
      { Id: "Payout related issues", Name: "Payout related issues" },
      { Id: "Call not picked", Name: "Call not picked" },
      { Id: "Number Not Reachable", Name: "Number Not Reachable" },
      { Id: "Call disconnected", Name: "Call disconnected" },
      {
        Id: "Don't have documents",
        Name: "Don't have documents",
      },
      { Id: "Marked random query", Name: "Marked random query" },
      { Id: "Already POSP with Square Insurance", Name: "Already POSP with Square Insurance" },
      {
        Id: "Duplicate lead ", Name: "Duplicate lead " },

      { Id: "Testing by square team", Name: "Testing by square team" },
      { Id: "Premium is Higher", Name: "Premium is Higher" },

      { Id: "Quote Shared", Name: "Quote Shared" },
      { Id: "Waiting for documents", Name: "Waiting for documents" },
      {
        Id: "Phone switched off", Name: "Phone switched off" },

      { Id: "Getting number busy", Name: "Getting number busy" },
      { Id: "Payment URL Shared", Name: "Payment URL Shared" },
      { Id: "Proposal pending", Name: "Proposal pending" },
      { Id: "Other", Name: "Other" },
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

  get FC() {
    return this.TransferForm.controls;
  }

  get Followup_control() {
    return this.UpdateFollowForm.controls;
  }

  onTimeChange(newTime: string) {
    const selectedTime = newTime; // Format selected time
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
    this.loading = false;
    // if (this.re_hit == "yes") {
    this.api.SetActiveTabModuleWise(tab_value, "lms-manage-request");
    this.active_tab = tab_value;
    //   this.post = [];
    //   this.pageNo = 1;
    // }
    this.Get();
  }

  //===== SEARCH DATATABLE DATA =====//
  // SearchData(event: any) {
  //   this.filterData = JSON.stringify(event);

  //   this.post = [];
  //   this.pageNo = 1;

  //   this.Get();
  //   this.Is_Export = 0;
  //   this.dataAr = [];
  //   let filterContainer = document.getElementById("collapseOne");

  //   if (filterContainer.classList.contains("in")) {
  //     document.getElementById("headingOne").click();
  //   } else {
  //   }
  // }

  // //===== RESET DATATABLE =====//
  // ResetDT() {
  //   this.post = [];
  //   this.pageNo = 1;
  // }

  // //===== RELOAD DATATABLE =====//
  // Reload() {
  //   this.post = [];
  //   this.pageNo = 1;
  // }

  // //===== GET DATATABLE DATA =====//
  // Get() {
  //   this.re_hit = "no";
  //   const formData = new FormData();
  //   formData.append("datas", this.filterData);

  //   $(".spinner-item").css("display", "block");

  //   this.api
  //     .HttpPostTypeBms(
  //       "lms/LmsManagerRelated/GridData?User_Id=" +
  //         this.api.GetUserData("Id") +
  //         "&user_code=" +
  //         this.api.GetUserData("Code") +
  //         "&User_Type=" +
  //         this.api.GetUserType() +
  //         "&Page=" +
  //         this.pageNo,
  //       formData
  //     )
  //     .then(
  //       (result) => {
  //         this.re_hit = "yes";
  //         if (result["status"] == true) {
  //           // this.GetCount();
  //           $(".spinner-item").css("display", "none");

  //           this.dataAr = result["data"];

  //           this.countdata = result["lead_count"];

  //           if (this.dataAr.length == 0 && this.pageNo == 1) {
  //             this.loading = true;
  //           }

  //           this.where_str = result["where_str"];
  //           this.last_id = result["last_id"];

  //           if (this.pageNo <= 1) {
  //             this.totalRecordsfiltered = result["recordsFiltered"];
  //             this.TotalRow = result["recordsFiltered"];
  //             this.recordsTotal = result["recordsTotal"];
  //           }

  //           this.responseData = result["data"];
  //           this.post = this.post.concat(this.responseData);

  //           this.post.forEach((posts, index) => {
  //             this.isMobileMaskedMap[index] = true;
  //           });

  //           this.pageNo++;
  //           var keyss = 0;

  //           this.post = this.post.map((item) => {
  //             keyss++;
  //             item.SrNo = keyss;
  //             return item;
  //           });
  //           // this.GetNewLeadCount();
  //         }
  //       },
  //       (err) => {
  //         this.api.Toast(
  //           "Warning",
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //       }
  //     );
  // }

  //===== GET NEW LEAD COUNTS =====//
  GetNewLeadCount() {
    const formData = new FormData();

    formData.append("where_str", this.where_str);
    formData.append("last_id", this.last_id);

    this.api.HttpPostTypeBms("lms/LmsCommon/GetNewLeadCount", formData).then(
      (result) => {
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

  async AcceptRequest(LeadId: any, indexs: any) {
    const Is_Confirm = await swal({
      title: "Are you sure?",
      text: "Do you want to accept this request?",
      icon: "warning",
      buttons: ["No", "Yes"],
    });
    if (Is_Confirm == true) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());

      // formData.append("tempid", tempid);
      formData.append("Lead_id", LeadId);

      this.api
        .HttpPostTypeBms("lms/LmsManagerRelated/AcceptLeadRequest", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            // this.Reload();
            if (result["status"] == true) {
              //follow up form
              const keysToRemove = [indexs];
              //   //   //   console.log(keysToRemove);
              // Use filter to remove the specified keys
              this.post = this.post.filter(
                (value, index) => !keysToRemove.includes(index)
              );
              //reset the indexing
              this.post = this.post.map((value, index) => ({
                ...value,
                newIndex: index,
              }));

              // this.GetCount();
            }
          },
          (err) => {
            this.api.HideLoading();
          }
        );
    }
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
        (result) => {
          this.api.HideLoading();

          if (result["type"] == "Motor") {
            if (result["quoteStatus"] === "1") {
              window.open(
                `https://www.squareinsurance.in/quotes/${this.encodeToBase64(
                  result["quoteId"]
                )}`
              );
            } else if (result["quoteStatus"] === "2") {
              window.open(
                `https://www.squareinsurance.in/proposal/${this.encodeToBase64(
                  result["quoteId"]
                )}`,
                "_blank"
              );
            }
          } else if (result["type"] == "Health") {
            if (result["quoteStatus"] === "1") {
              // https://www.squareinsurance.in/prequotes/health-quote?quote=SQHL2023081602560883123
              // window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/prequotes//health-quote/ ${result['quoteId']}`, '_blank');

              window.open(
                `https://www.squareinsurance.in/quote-healthe/${this.encodeToBase64(
                  result["quoteId"]
                )}`,
                "_blank"
              );
            } else if (result["quoteStatus"] === "2") {
              // window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/health_proposal/proposal ${result['quoteId']}`, '_blank');
              window.open(
                `https://www.squareinsurance.in/health/proposal/${this.encodeToBase64(
                  result["quoteId"]
                )}`,
                "_blank"
              );
            }
          } else if (result["type"] == "Nonmotor") {
            if (result["quoteStatus"] === "1") {
              //  window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/marine-quote/ ${result['quoteId']}`, '_blank');
              window.open(
                `https://www.squareinsurance.in/marine-quote/${this.encodeToBase64(
                  result["quoteId"]
                )}`,
                "_blank"
              );
            } else if (result["quoteStatus"] === "2") {
              window.open(
                `https://www.squareinsurance.in/marine/proposal/${this.encodeToBase64(
                  result["quoteId"]
                )}`,
                "_blank"
              );
              // window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/nonmotor_proposal/proposal ${result['quoteId']}`, '_blank');
            }
          } else if (result["type"] == "Pa") {
            if (result["quoteStatus"] === "1") {
              //  window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/marine-quote/ ${result['quoteId']}`, '_blank');
              window.open(
                `https://www.squareinsurance.in/quotes-pa/${this.encodeToBase64(
                  result["quoteId"]
                )}`,
                "_blank"
              );
            } else if (result["quoteStatus"] === "2") {
              window.open(
                `https://www.squareinsurance.in/pa/proposal/${this.encodeToBase64(
                  result["quoteId"]
                )}`,
                "_blank"
              );
              // window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/nonmotor_proposal/proposal ${result['quoteId']}`, '_blank');
            } else if (result["quoteStatus"] === "3") {
              window.open(
                `https://www.squareinsurance.in/pa/review/${this.encodeToBase64(
                  result["quoteId"]
                )}`,
                "_blank"
              );
            }
          } else if (result["type"] == "Travel") {
            if (result["quoteStatus"] === "1") {
              //  window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/prequotes/life-quote ${result['quoteId']}`, '_blank');
              window.open(
                `https://www.squareinsurance.in/prequotes/travel-quote/${this.encodeToBase64(
                  result["quoteId"]
                )}`,
                "_blank"
              );
            } else if (result["quoteStatus"] === "2") {
              window.open(
                `https://www.squareinsurance.in/travel_proposal/proposal/${this.encodeToBase64(
                  result["quoteId"]
                )}`,
                "_blank"
              );
              // window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/nonmotor_proposal/proposal ${result['quoteId']}`, '_blank');
            }
          } else if (result["type"] == "Life") {
            if (result["quoteStatus"] === "1") {
              //  window.open(`http://13.127.142.101/sanity/ci/tarun_designer/compare/prequotes/life-quote ${result['quoteId']}`, '_blank');
              window.open(
                `https://www.squareinsurance.in/life-quote/${this.encodeToBase64(
                  result["quoteId"]
                )}`,
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

  async updatePospStatus(Mobile: any) {
    // const Is_Confirm = await swal({
    //   title: "Are you sure?",
    //   text: "",
    //   icon: "warning",
    //   buttons: ["No", "Yes"],
    // });
    // if (Is_Confirm == true) {
    window.open(
      `https://crm.squareinsurance.in/Mypos/Add-pos?leadnumber=${Mobile}`,
      "_blank"
    );
    // }
  }

  LeadCheckChange(leadId: string) {
    if (this.selectedCheckboxValues.includes(leadId)) {
      this.selectedCheckboxValues = this.selectedCheckboxValues.filter(
        (id) => id !== leadId
      );
    } else {
      this.selectedCheckboxValues.push(leadId);
    }

    // console.log(this.selectedCheckboxValues);
  }

  transferLead(type: any, singleleadId: any) {
    let leadIdArr = [];

    if (type == "single") {
      leadIdArr.push(singleleadId);
    } else {
      leadIdArr = this.selectedCheckboxValues;
    }

    if (leadIdArr.length == 0) {
      this.api.Toast("Warning", "Please Select a lead");
    } else {
      const dialogRef = this.dialog.open(TransferLeadComponent, {
        width: "25%",
        height: "42%",
        data: { Id: leadIdArr, type },
      });

      dialogRef.afterClosed().subscribe((result) => {
        setTimeout(() => {
          // this.Reload();
          // this.GetCount();
        }, 500);
      });
    }
  }

  GetCount() {
    const formData = new FormData();

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("window", "manager");

    this.api.HttpPostTypeBms("lms/LmsCommon/getCountLeads", formData).then(
      (result) => {
        if (result["status"] == true) {
          // this.countdata = result;
        }
      },
      (err) => {}
    );
  }

  getDetails(Id: any) {
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("lead_id", Id);

    this.api.HttpPostTypeBms("lms/LmsCommon/getDetails", formData).then(
      (result) => {
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

  // follow up popup functions

  FollowUpPopup_open(
    e: any,
    Id: number,
    Action: string,
    leadAge: any,
    indexs: any,
    leaddate: any,
    leadId: any
  ) {

    this.leadRevievedate = leaddate;
    this.leadId = leadId;

    this.getdata(Id);
    document.getElementById("ageSpan").innerHTML = leadAge;
    this.indexes = indexs;
    var Values = e;
    this.Status = Values;

    this.Id = Id;

    if (this.Status == 1) {
      this.selectedStatus = [{ Id: "1", Name: "Pending" }];
      this.UpdateStatusValue(this.selectedStatus[0]);
    } else if (this.Status == 2) {
      this.selectedStatus = [{ Id: "2", Name: "Follow Up" }];
      this.UpdateStatusValue(this.selectedStatus[0]);
    } else if (this.Status == 3) {
      this.selectedStatus = [{ Id: "3", Name: "Converted" }];
      this.UpdateStatusValue(this.selectedStatus[0]);
    } else if (this.Status == 4) {
      this.selectedStatus = [{ Id: "4", Name: "Lost" }];
      this.UpdateStatusValue(this.selectedStatus[0]);
    } else if (this.Status == 6) {
      this.selectedStatus = [{ Id: "6", Name: "Close" }];
      this.UpdateStatusValue(this.selectedStatus[0]);
    }
  }

  UpdateStatusValue(Value: any) {
    this.Status = Value;
    const selectedValue = Value["Id"];
    this.SelectedStatusVal = Value["Id"];

    const breif = this.UpdateFollowForm.get("breif");

    if(this.SelectedStatusVal == 4 || this.SelectedStatusVal == 6){
      breif.setValidators(Validators.required);
    }else{
      breif.setValidators(null);
    }

    breif.updateValueAndValidity();


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

  UpdateFollowFormS() {
    this.isSubmitted = true;
    if (this.UpdateFollowForm.invalid) {
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
      formData.append("breif", fields["breif"]);

      if (fields["Remarks"][0]["Id"] == "Other") {
        formData.append("Remark", fields["OtherRemark"]);
      } else {
        formData.append("Remark", fields["Remarks"][0]["Id"]);
      }

      let statusLable = fields["Status"][0]["Name"];
      //   //   //   console.log(statusLable);

      var Confirms = confirm("Are You Sure To Change Status?");
      if (Confirms == true) {
        this.api.IsLoading();

        this.api
          .HttpPostTypeBms("lms/LmsCommon/InsuranceLeadsLogsCreate", formData)
          .then(
            (result) => {
              this.api.HideLoading();
              if (result["status"] == true) {
                this.buttonDisable = false;
                // this.GetCount();

                this.api.Toast("Success", result["msg"]);
                this.getdata(this.Id);

                if (this.active_tab == statusLable) {
                } else {
                  const keysToRemove = [this.indexes];
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

                this.UpdateFollowForm.reset();
              } else {
                this.buttonDisable = false;

                this.api.Toast("Warning", result["msg"]);
              }
            },
            (err) => {
              this.buttonDisable = false;

              this.api.Toast(
                "Warning",
                "Network Error : " + err.name + "(" + err.statusText + ")"
              );
            }
          );
      }
    }
  }

  getdata(id: any) {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());

    formData.append("Id", id);

    this.api
      .HttpPostTypeBms("lms/LmsCommon/InsuranceLeadsLogs2", formData)
      .then(
        (result) => {
          this.dataArr = result;
        },
        (err) => {
          this.dataArr = err["error"]["text"];
          // console.log(this.dataArr);
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
      formData.append("user_code", this.api.GetUserData("Code"));

      formData.append("number", number);
      formData.append("Lead_id", LeadId);

      var call_id = "0";
      let unique_id = "0";

      this.api.HttpPostTypeBms("lms/LmsCommon/callApi", formData).then(
        (result) => {
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

  //===== CHECK WEB HOOK RESPONSE =====//
  async CheckWebHookResponse(call_id: any, row_id: any, unique_id: any) {
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
        (result) => {
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

  // Add leads

  Add_leads() {
    const dialogRef = this.dialog.open(AddLeadsComponent, {
      width: "90%",
      height: "80%",
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      setTimeout(() => {
        // this.Reload();
        // this.GetCount();
      }, 500);
    });
  }
  //....new Leads ../
  Add_leads_excel() {
    const dialogRef = this.dialog.open(AddExcelLeadaComponent, {
      width: "90%",
      height: "80%",
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      setTimeout(() => {
        // this.Reload();
        // this.GetCount();
      }, 500);
    });
  }

  CheckManagerRightresponse() {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    this.api.HttpPostTypeBms("lms/LmsCommon/CheckManagerRight", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
        } else {
          window.location.href = "https://crm.squareinsurance.in/dashboard";
        }
      },
      (err) => {
        this.api.HideLoading();
      }
    );
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

  // new
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

  SearchData(event: any) {
    this.Is_Export = 0;
    this.post = [];
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        // if (TablesNumber == "kt_datatable") {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
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
        const baseUrl =
          environment.apiUrlBmsBase +
          "/lms/LmsManagerRelated/GridData?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&activeCheck=" +
          this.activeCheck +
          "&user_code=" +
          this.api.GetUserData("Code");
        const params = dataTablesParameters;
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(baseUrl),
            params,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.post = resp.data;
            this.countdata = resp["lead_count"];
            this.where_str = resp.where_str;
            this.last_id = resp.last_id;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  // new
  onSelectRemarks(event: any) {
    if (event.Id == "Other") {
      this.isOtherSelected = true;
      this.UpdateFollowForm.get("OtherRemark").setValidators([
        Validators.required,
      ]);
    } else {
      this.isOtherSelected = false;
      // Clear the 'OtherRemark' field and remove the validators
      this.UpdateFollowForm.get("OtherRemark").clearValidators();
      this.UpdateFollowForm.get("OtherRemark").setValue("");
    }
    this.UpdateFollowForm.get("OtherRemark").updateValueAndValidity();
  }
  encodeToBase64(input: string): string {
    return btoa(input);
  }
  onButtonChange(event) {
    this.activeCheck = event;
    this.Get();
    this.api.SetActiveTabModuleWise(this.active_tab, "lms-manage-request");
  }

  PospDetails(Id: any, Type: any) {
    const dialogRef = this.dialog.open(PosDetailsComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { Id: Id, type: Type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  PospBusiness(posId: any, primary: any) {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("posId", posId);
    formData.append("primary", primary);
    this.api.IsLoading();
    this.api.HttpPostType("LmsReport/PosBusiness", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.businessdata = result["Data"];
        } else {
          this.api.Toast("Warning", result["Message"]);
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
} //end
