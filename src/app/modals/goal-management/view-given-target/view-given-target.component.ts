import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditGivenTargetComponent } from "../../../modals/goal-management/edit-given-target/edit-given-target.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  VerticalName: string;
  GivenTarget: string;

  Motor: string;
  Motor_String: string;
  Motor_Premium: string;
  Motor_Premium_String: string;
  Motor_Percent: string;

  Non_Motor: string;
  Non_Motor_String: string;

  Health_Retail: string;
  Health_Retail_String: string;

  Health_Group: string;
  Health_Group_String: string;

  Life_Retail: string;
  Life_Retail_String: string;

  Life_Group: string;
  Life_Group_String: string;

  Others: string;
  Others_String: string;

  Total_Target: string;
  Total_Target_String: string;

  Net_Premium: string;
  Net_Premium_String: string;
  Achievement_Percent: string;
  Revenue: string;
  Revenue_String: string;

  InsertDate: string;
  Action: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  is_edit: string;
}

@Component({
  selector: "app-view-given-target",
  templateUrl: "./view-given-target.component.html",
  styleUrls: ["./view-given-target.component.css"],
})
export class ViewGivenTargetComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  isSubmitted = false;
  Id: any;
  row: any;
  User_Rights: any = [];

  is_edit: string;
  target_type: string;
  financial_year: any = "";
  vertical_id: any = "";
  selected_month: any = "";
  function_name: any = "";

  constructor(
    public dialogRef: MatDialogRef<ViewGivenTargetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.financial_year = this.data.financial_year;
    this.vertical_id = this.data.vertical_id;
    this.target_type = this.data.target_type;
    this.selected_month = this.data.selected_month;

    if (this.target_type == "Given") {
      this.function_name = "GetGivenTargetsData";
    } else if (this.target_type == "Profile") {
      this.function_name = "GetProfileTargetsData";
    } else {
      this.function_name = "GetAllocatedTargetsData";
    }

    this.Get();
  }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  //===== GET DATATABLE DATA =====//
  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [10, 25, 50, 100],
      pageLength: 10,
      serverSide: true,
      processing: true,
      //dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/goal-management-system/VerticalTargetsData/" +
                this.function_name +
                "?&User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&financial_year=" +
                this.financial_year +
                "&vertical_id=" +
                this.vertical_id +
                "&selected_month=" +
                this.selected_month
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            that.is_edit = resp.is_edit;
            this.GetYTDChanks();

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },

      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {
    var fields = this.SearchForm.value;

    var query = {
      Financial_Year: fields["Financial_Year"],
      Vertical_Id: fields["Vertical_Id"],
    };

    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
    });
  }

  //===== GET YTD DATA IN CHUNKS =====//
  async GetYTDChanks() {
    for (let i = 0; i < this.dataAr.length; i++) {
      var vertical_id = this.dataAr[i]["Id"];
      var financial_year = this.financial_year;
      var selected_month = this.selected_month;
      var target_array = JSON.stringify(this.dataAr[i]);

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("vertical_id", vertical_id);
      formData.append("financial_year", financial_year);
      formData.append("selected_month", selected_month);
      formData.append("target_array", target_array);

      var url =
        environment.apiUrlBmsBase +
        "/goal-management-system/VerticalTargetsData/GetBusinessData";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          this.dataAr[i]["Motor_Premium"] = data.motor_premium;
          this.dataAr[i]["Motor_Premium_String"] = data.motor_premium_string;
          this.dataAr[i]["Motor_Percent"] = data.motor_percent;

          this.dataAr[i]["Non_Motor_Premium"] = data.non_motor_premium;
          this.dataAr[i]["Non_Motor_Premium_String"] =
            data.non_motor_premium_string;
          this.dataAr[i]["Non_Motor_Percent"] = data.non_motor_percent;

          this.dataAr[i]["Health_Retail_Premium"] = data.health_retail_premium;
          this.dataAr[i]["Health_Retail_Premium_String"] =
            data.health_retail_premium_string;
          this.dataAr[i]["Health_Retail_Percent"] = data.health_retail_percent;

          this.dataAr[i]["Health_Group_Premium"] = data.health_group_premium;
          this.dataAr[i]["Health_Group_Premium_String"] =
            data.health_group_premium_string;
          this.dataAr[i]["Health_Group_Percent"] = data.health_group_percent;

          this.dataAr[i]["Life_Retail_Premium"] = data.life_retail_premium;
          this.dataAr[i]["Life_Retail_Premium_String"] =
            data.life_retail_premium_string;
          this.dataAr[i]["Life_Retail_Percent"] = data.life_retail_percent;

          this.dataAr[i]["Life_Group_Premium"] = data.life_group_premium;
          this.dataAr[i]["Life_Group_Premium_String"] =
            data.life_group_premium_string;
          this.dataAr[i]["Life_Group_Percent"] = data.life_group_percent;

          this.dataAr[i]["Others_Premium"] = data.others_premium;
          this.dataAr[i]["Others_Premium_String"] = data.others_premium_string;
          this.dataAr[i]["Others_Percent"] = data.others_percent;

          this.dataAr[i]["Total_Premium"] = data.total_premium;
          this.dataAr[i]["Total_Premium_String"] = data.total_premium_string;
          this.dataAr[i]["Total_Percent"] = data.total_percent;

          this.dataAr[i]["Revenue"] = data.revenue;
          this.dataAr[i]["Revenue_String"] = data.revenue_string;
        });
    }
  }

  //===== GET EMPLOYEE POS TARGET =====//
  GetSingleVerticalTarget(vertical_id: any, row_data: any, index: any) {
    const formData = new FormData();

    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("Portal", "CRM");
    formData.append("vertical_id", vertical_id);
    formData.append("row_data", JSON.stringify(row_data));

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "goal-management-system/VerticalTargetsData/GetSingleVerticalTarget",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            // if (this.UrlSegment == 'EmployeeTarget') {
            //   this.AllocatedPosData = result['TotalTarget'];
            //   this.Is_Edit = result['Is_Edit'];
            //   this.Is_Edit_RM = result['Is_Edit_RM'];
            //   this.AllocatedPosTotal = result['TotalPosTarget'];
            //   this.AllocatedPosYTD = result['TotalPosYTD'];
            //   this.AllocatedPosYTDPercent = result['TotalPosYTDPercent'];
            //   this.ActivePosTotal = result['TotalActivePosTarget'];
            //   this.ActivePosYTD = result['TotalActivePosYTD'];
            //   this.ActivePosYTDPercent = result['TotalActivePosYTDPercent'];
            // }
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast("Warning", err.message);
        }
      );
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //===== INDIVIDUAL TARGET DETAILS =====//
  UpdateGivenTargetModal(row_Id: any, col_name: any): void {
    const dialogRef = this.dialog.open(EditGivenTargetComponent, {
      width: "25%",
      height: "45%",
      disableClose: true,
      data: { Id: row_Id, col_name: col_name },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);

      if (result.Is_Refresh == "yes") {
        //  this.GetSingleVerticalTarget(row_Id, row_data, index);
        this.Reload();
      }
    });
  }
}
