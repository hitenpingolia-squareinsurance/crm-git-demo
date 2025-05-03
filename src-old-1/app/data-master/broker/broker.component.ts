import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";

import { Router } from "@angular/router";
import swal from "sweetalert";

class ColumnsObj {
  Id: string;
  Name: string;
  Update_Stamp: string;
  Status: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: "app-broker",
  templateUrl: "./broker.component.html",
  styleUrls: ["./broker.component.css"],
})
export class BrokerComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.Get();
  }
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  Get() {
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
              environment.apiUrl + "/data/Broker/GridData"
            ),
            dataTablesParameters,
            {}
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: "Id" },
        { data: "Name" },
        { data: "Update_Stamp" },
        { data: "Status" },
      ],
    };
  }

  async Update(Id, Status) {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to change status this data?",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
    });

    if (willDelete) {
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "data/Broker/UpdateStatusById?Id=" + Id + "&Status=" + Status
        )
        .then(
          (result) => {
            this.api.HideLoading();

            swal(
              "Status!",
              "Your imaginary data has been status change!",
              "success"
            );
            if (result["Status"] == true) {
              this.Reload();
            } else {
              //alert(result['Message']);
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            //// console.log(err.message);
            //alert(err.message);
            swal("Error!", err.message, "warning");
          }
        );
    }
  }
  async Is_Delete(Id) {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this data?",
      icon: "warning",
      buttons: ["Cancel", "Yes, Delete it !"],
    });

    if (willDelete) {
      // console.log("Deleted!");

      this.api.IsLoading();
      this.api.HttpGetType("data/Broker/DeleteById?Id=" + Id).then(
        (result) => {
          this.api.HideLoading();

          swal("Deleted!", "Your imaginary data has been deleted!", "success");
          if (result["Status"] == true) {
            this.Reload();
          } else {
            //alert(result['Message']);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          //alert(err.message);
          swal("Error!", err.message, "warning");
        }
      );
    }
  }
}
