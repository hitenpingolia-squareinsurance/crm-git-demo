import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { BmsapiService } from "../../../providers/bmsapi.service";

class ColumnsObj {
  id: string;
  isSelected: any;
  SrNo: string;
  status: any;

  request_id: string;
  request_amt: string;
  remark: string;
  add_stamp: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
  table_row: any;
  is_accounts_manager: any;
}

@Component({
  selector: "app-early-payout-files",
  templateUrl: "./early-payout-files.component.html",
  styleUrls: ["./early-payout-files.component.css"],
})
export class EarlyPayoutFilesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  tablerow: any;
  isAccounts_manager: any = 0;

  Type: any;
  Id: any;

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  search_status: any = "0";
  status: any;

  constructor(
    public api: BmsapiService,
    public dialogRef: MatDialogRef<EarlyPayoutFilesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {
    this.Id = this.data.id;
    this.Type = this.data.type;
  }

  ngOnInit() {
    this.Get();

    //this.Search();
  }

  checkUncheckAll() {
    for (var i = 0; i < this.dataAr.length; i++) {
      this.dataAr[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }
  isAllSelected() {
    this.masterSelected = this.dataAr.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.dataAr.length; i++) {
      if (this.dataAr[i].isSelected && this.dataAr[i].status == 0) {
        this.checkedList.push({
          id: this.dataAr[i].id,
          //remark: this.dataAr[i].remark,
        });
      }
    }
    //this.checkedList = JSON.stringify(this.checkedList);
    this.checkedList = this.checkedList;
    //   //   //   console.log(this.checkedList);
  }

  updateRemark(id: any, index: any, e: any) {
    //   //   //   console.log(e.target.value);
    this.dataAr[index]["remark"] = e.target.value;
  }

  Transfer() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());

    formData.append("status", this.status);

    //formData.append("checkedList", JSON.stringify(this.checkedList));

    // for (var i = 0; i < this.checkedList.length; i++) {
    //   formData.append("ids[]", this.checkedList[i]["id"]);
    //   formData.append("remarks[]", this.checkedList[i]["remark"]);
    // }

    for (var j = 0; j < this.dataAr.length; j++) {
      if (this.dataAr[j]["isSelected"] == true) {
        if (this.dataAr[j]["remark"] != "") {
          // formData.append("ids[]", this.checkedList[j]["id"]);
          // formData.append("remarks[]", this.dataAr[j]["remark"]);
          formData.append(
            "data[]",
            JSON.stringify({
              id: this.dataAr[j]["id"],
              remark: this.dataAr[j]["remark"],
              status: this.dataAr[j]["status"],
            })
          );
        } else {
          alert("Please enter remark.");
          return true;
        }
      }
    }

    if (
      confirm("Are you sure that you want to change status this data?") === true
    ) {
      this.api.IsLoading();
      this.api
        .HttpPostType("../v3/pay-in/EarlyPayout/UpdateFilesStatus", formData)
        .then(
          (result: any) => {
            this.api.HideLoading();

            if (result["status"] == true) {
              this.Reload();
              this.masterSelected = false;
              this.checkedList = [];
            } else {
              //this.api.ErrorMsg(result["Message"]);
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            //// console.log(err.message);
            //this.api.ErrorMsg(err.message);
          }
        );
    } else {
    }
  }

  CancelTransfer() {
    this.Reload();
    this.masterSelected = false;
    this.checkedList = [];
  }

  Search() {
    var query = {
      search_status: this.search_status,
    };

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
    });
  }

  ClearSearch() {
    //this.search_status = '';
    this.ResetDT();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
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
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/../v3/pay-in/EarlyPayout/GridData_ViewRequestsFiles?User_Id=" +
                this.api.GetUserId() +
                "&source=crm&Id=" +
                this.Id +
                "&Type=" +
                this.Type
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            that.tablerow = resp.table_row;
            that.isAccounts_manager = resp.is_accounts_manager;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      // columns: [
      //   { data: "Id" },
      //   { data: "Status" },
      //   { data: "Request_Amount" },
      //   { data: "Request_Date_Time" },
      // ],

      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }

  SrPopup(type, row_Id): void {
    //var baseurl = 'http://localhost:4300/';
    var baseurl = "https://crm.squareinsurance.in/";
    var url =
      baseurl +
      "business-login/form/general-insurance/" +
      type +
      "/bms/" +
      this.api.GetUserId() +
      "/" +
      row_Id +
      "/web";
    window.open(url, "", "fullscreen=yes");
  }
}
