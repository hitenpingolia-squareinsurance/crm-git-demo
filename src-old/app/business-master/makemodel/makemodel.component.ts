import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { HttpHeaders, HttpClient, HttpResponse } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { AddModelComponent } from "./add-model/add-model.component";
import { EditModelComponent } from "./edit-model/edit-model.component";

import swal from "sweetalert";

import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { stringify } from "querystring";

// class ColumnsObj {
//   Id: string;
//   Make: string;
//   Model: string;
//   Variant: string;
//   Fuel_Type: string;
//   Cubic_Capacity: string;
//   Seating_Capacity: string;
//   Body_Type: string;
//   Vehicle_Type_Id: string;
//   Status: string;
// }
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-makemodel",
  templateUrl: "./makemodel.component.html",
  styleUrls: ["./makemodel.component.css"],
})
export class MakemodelComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[];
  hasAccess: boolean = true;
  errorMessage: string = "";

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
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
    this.api.IsLoading();
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ordering: false,
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

            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;

            that.dataAr = resp.data;
            this.api.HideLoading();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      // columns: [
      //   { data: "Id" },
      //   { data: "Make" },
      //   { data: "Model" },
      //   { data: "Variant" },
      //   { data: "Fuel_Type" },
      //   { data: "Cubic_Capacity" },
      //   { data: "Seating_Capacity" },
      //   { data: "Body_Type" },
      //   { data: "Vehicle_Type_Id" },
      //   { data: "Status" },
      // ],
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

  dailog() {
    const dialogRef = this.dialog.open(AddModelComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.Reload();
    });
  }

  onClose() {
    document.getElementById("close").click();
  }

  // update(id: any) {
  //   const dialogRef = this.dialog.open(EditModelComponent, {

  //     width: "50%",
  //     height: "80%",
  //     disableClose: true,
  //     data: {
  //       id: id,
  //     },
  //   })

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.Reload();
  //   });
  // }

}
