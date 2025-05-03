import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import swal from "sweetalert";

class ColumnsObj {
  Id: string;
  Make: string;
  Model: string;
  Variant: string;
  Fuel_Type: string;
  Cubic_Capacity: string;
  Seating_Capacity: string;
  Body_Type: string;
  Vehicle_Type_Id: string;
  Status: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: "app-vehicle",
  templateUrl: "./vehicle.component.html",
  styleUrls: ["./vehicle.component.css"],
})
export class VehicleComponent implements OnInit {
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
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/data/VehicleDataNew/GridData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&User_Code=" +
                this.api.GetUserData("Code")
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
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
        { data: "Make" },
        { data: "Model" },
        { data: "Variant" },
        { data: "Fuel_Type" },
        { data: "Cubic_Capacity" },
        { data: "Seating_Capacity" },
        { data: "Body_Type" },
        { data: "Vehicle_Type_Id" },
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
        .HttpForSR(
          "get",
          "../data/VehicleDataNew/UpdateStatusById?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Id=" +
            Id +
            "&Status=" +
            Status,
          ""
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
      this.api
        .HttpForSR(
          "get",
          "../data/VehicleDataNew/DeleteById?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Id=" +
            Id +
            "&User_Code=" +
            this.api.GetUserData("Code"),
          ""
        )
        .then(
          (result) => {
            this.api.HideLoading();
            swal(
              "Deleted!",
              "Your imaginary data has been deleted!",
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
}
