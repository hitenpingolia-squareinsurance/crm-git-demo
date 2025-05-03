import { Component, OnInit, ViewChild, NgZone } from "@angular/core";

import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { map, pairwise, filter, throttleTime } from "rxjs/operators";
import { timer } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
  selector: "app-extra-leads",
  templateUrl: "./extra-leads.component.html",
  styleUrls: ["./extra-leads.component.css"],
})
export class ExtraLeadsComponent implements OnInit {
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
  currentUrl: any;
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
  active_tab: any = "Untouched";
  FieldFetch: any = [];
  logData: any;
  recordsTotal: any;
  isMobileMaskedMap: { [key: number]: boolean } = {};
  // follow up pop up variables

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
  selectedTime: any;
  dropdownSettingsSingleselect: any = {};
  re_hit: any = "yes";
  indexes: any;
  where_str: any = "";
  last_id: any = "0";

  call_id: any = "0";
  row_id: any = "0";
  unique_id: any;
  RemarksOptions: any[];
  isOtherSelected: boolean;
  activeCheck: string = "1";
  uniqueid: any;
  SelectedStatusVal: any;
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
    this.RemarksOptions = [
      { Id: "Payout Issue", Name: "Payout Issue" },
      { Id: "Call Not Picked", Name: "Call Not Picked" },
      { Id: "Call Not Reachable", Name: "Call Not Reachable" },
      { Id: "Call Disconnect ", Name: "Call Disconnect " },
      {
        Id: "Don't Have Another Document",
        Name: "Don't Have Another Document",
      },
      { Id: "Not Interested", Name: "Not Interested" },
      { Id: "Just Made a Random Query", Name: "Just Made a Random Query" },
      { Id: "Already POS", Name: "Already POS" },
      {
        Id: "Other Campaign Leads - Emitra and E Partners ",
        Name: "Other Campaign Leads - Emitra and E Partners ",
      },
      { Id: "Duplicate Leads", Name: "Duplicate Leads" },
      { Id: "Incorrect Contact Number", Name: "Incorrect Contact Number" },
      { Id: "Premium is Higher", Name: "Premium is Higher" },
      { Id: "Testing", Name: "Testing" },
      { Id: "Square Agent / Employee", Name: "Square Agent / Employee" },
      {
        Id: "Fake Leads - Random Continue checking",
        Name: "Fake Leads - Random Continue checking",
      },
      { Id: "Details Shared", Name: "Details Shared" },
      { Id: "Waiting for Document", Name: "Waiting for Document" },
      { Id: "Switch Off ", Name: "Switch Off " },
      { Id: "Busy On Another Call", Name: "Busy On Another Call" },
      { Id: "Other", Name: "Other" },
    ];
  }

  ngOnInit() {
    this.SetActiveTab("Untouched");
    this.currentUrl = this.router.url;

    var splitted = this.currentUrl.split("/");
    if (typeof splitted[3] != "undefined" && splitted[3] != "") {
      this.uniqueid = splitted[3];
    }

    //   //   //   console.log(this.currentUrl);
    this.pageNo = 1;
    this.UpdateFollowForm = this.fb.group({
      Status: [this.Status, Validators.required],
      Dates: ["", Validators.required],
      Times: ["", Validators.required],
      Remarks: ["", Validators.required],
      OtherRemark: [""],
      breif: [""]
    });

    this.UpdateFollowForm.get("Dates").valueChanges.subscribe(() => {
      this.UpdateFollowForm.get("Times").setValue("");
    });

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
  get FC() {
    return this.TransferForm.controls;
  }
  get Followup_control() {
    return this.UpdateFollowForm.controls;
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
      return null;
    }
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(":").slice(0, 2);
    return `${hours}:${minutes}`;
  }

  //===== SET ACTIVE TAB =====//
  SetActiveTab(tab_value: any) {
    this.loading = false;
    this.api.SetActiveTabModuleWise(tab_value, "lms-manage-request");
    this.active_tab = tab_value;
    this.Get();
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
      formData.append("Lead_id", LeadId);
      formData.append("url", this.currentUrl);

      this.api
        .HttpPostTypeBms("lms/LmsManagerRelated/AcceptLeadRequest", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              const keysToRemove = [indexs];
              //   //   //   console.log(keysToRemove);
              this.post = this.post.filter(
                (value, index) => !keysToRemove.includes(index)
              );
              this.post = this.post.map((value, index) => ({
                ...value,
                newIndex: index,
              }));
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
                `https://www.squareinsurance.in/prequotes/travel-quote ${this.encodeToBase64(
                  result["quoteId"]
                )}`,
                "_blank"
              );
            } else if (result["quoteStatus"] === "2") {
              window.open(
                `https://www.squareinsurance.in/travel_proposal/proposal ${this.encodeToBase64(
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
  // async updateQuottionStatus(quotationId: any, leadId: any, type: any) {
  //   const Is_Confirm = await swal({
  //     title: "Are you sure?",
  //     text: "",
  //     icon: "warning",
  //     buttons: ["No", "Yes"],
  //   });

  //   if (Is_Confirm == true) {
  //     const formData = new FormData();

  //     formData.append("User_Id", this.api.GetUserData("Id"));
  //     formData.append("User_Type", this.api.GetUserType());

  //     formData.append("QuotationId", quotationId);
  //     formData.append("Lead_id", leadId);
  //     formData.append("type", type);

  //     this.api.HttpPostTypeBms("lms/LmsCommon/updateQuotion", formData).then(
  //       (result) => {
  //         this.api.HideLoading();

  //         if (result["type"] == "Motor") {
  //           if (result["quoteStatus"] === "1") {
  //             window.open(
  //               `https://www.squareinsurance.in/quotes/index/${result["quoteId"]}`
  //             );
  //           } else if (result["quoteStatus"] === "2") {
  //             window.open(
  //               `https://www.squareinsurance.in/proposal/${result["company"]}/${result["quoteId"]}`,
  //               "_blank"
  //             );
  //           }
  //         } else if (result["type"] == "Health") {
  //           if (result["quoteStatus"] === "1") {
  //             window.open(
  //               `https://www.squareinsurance.in/prequotes/health-quote/?quote=${result["quoteId"]}`,
  //               "_blank"
  //             );
  //           } else if (result["quoteStatus"] === "2") {
  //             window.open(
  //               `https://www.squareinsurance.in/health_proposal/proposal?quote=${result["quoteId"]}`,
  //               "_blank"
  //             );
  //           }
  //         } else if (result["type"] == "Nonmotor") {
  //           if (result["quoteStatus"] === "1") {
  //             window.open(
  //               `https://www.squareinsurance.in/marine-quote/?quote=${result["quoteId"]}`,
  //               "_blank"
  //             );
  //           } else if (result["quoteStatus"] === "2") {
  //             window.open(
  //               `https://www.squareinsurance.in/nonmotor_proposal/proposal?quote=${result["quoteId"]}`,
  //               "_blank"
  //             );
  //           }
  //         } else if (result["type"] == "Pa") {
  //           if (result["quoteStatus"] === "1") {
  //             window.open(
  //               `https://www.squareinsurance.in/prequotes/personal-accident-quote?quote=${result["quoteId"]}`,
  //               "_blank"
  //             );
  //           } else if (result["quoteStatus"] === "2") {
  //             window.open(
  //               `https://www.squareinsurance.in/pa_proposal/proposal?quote=${result["quoteId"]}`,
  //               "_blank"
  //             );
  //           } else if (result["quoteStatus"] === "3") {
  //             window.open(
  //               `https://www.squareinsurance.in/pa_review/index/?quote=${result["quoteId"]}`,
  //               "_blank"
  //             );
  //           }
  //         } else if (result["type"] == "Travel") {
  //           if (result["quoteStatus"] === "1") {
  //             window.open(
  //               `https://www.squareinsurance.in/prequotes/travel-quote?quote=${result["quoteId"]}`,
  //               "_blank"
  //             );
  //           } else if (result["quoteStatus"] === "2") {
  //             window.open(
  //               `https://www.squareinsurance.in/travel_proposal/proposal?quote=${result["quoteId"]}`,
  //               "_blank"
  //             );
  //           }
  //         } else if (result["type"] == "Life") {
  //           if (result["quoteStatus"] === "1") {
  //             window.open(
  //               `https://www.squareinsurance.in/prequotes/life-quote?quote=${result["quoteId"]}`,
  //               "_blank"
  //             );
  //           }
  //         }
  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //      //   //   //   console.log(err);
  //       }
  //     );
  //   }
  // }

  LeadCheckChange(leadId: string) {
    if (this.selectedCheckboxValues.includes(leadId)) {
      this.selectedCheckboxValues = this.selectedCheckboxValues.filter(
        (id) => id !== leadId
      );
    } else {
      this.selectedCheckboxValues.push(leadId);
    }
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
        }, 500);
      });
    }
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

    this.api.HttpPostTypeBms("lms/LmsCommon/InsuranceLeadsLogs", formData).then(
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
      }, 500);
    });
  }
  //....new Leads ../
  // Add_leads_excel() {
  //   const dialogRef = this.dialog.open(AddExcelLeadaComponent, {
  //     width: "90%",
  //     height: "80%",
  //     disableClose: true,
  //     data: {},
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     setTimeout(() => {
  //     }, 500);
  //   });
  // }

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
          "/lms/LmsManagerRelated/NewGridData?User_Id=" +
          this.api.GetUserData("Id") +
          "&activeCheck=" +
          this.activeCheck +
          "&User_Type=" +
          this.api.GetUserType() +
          "&user_code=" +
          this.api.GetUserData("Code") +
          "&uniqueid=" +
          this.uniqueid;
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

  async updatePospStatus(Mobile: any) {
    window.open(
      `https://crm.squareinsurance.in/Mypos/Add-pos?leadnumber=${Mobile}`,
      "_blank"
    );
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
      }, 500);
    });
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
} //end
