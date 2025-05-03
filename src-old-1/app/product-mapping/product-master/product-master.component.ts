import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-product-master",
  templateUrl: "./product-master.component.html",
  styleUrls: ["./product-master.component.css"],
})
export class ProductMasterComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  Lob_Form: FormGroup;
  dropdownSettingsType: any = {};

  dtOptions: DataTables.Settings = {};
  dataAr: [];
  DataAr: [];
  LobID: any = "";
  isSubmitted = false;
  LOBdata: [];

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public FormBuilder: FormBuilder
  ) {
    this.Lob_Form = this.FormBuilder.group({
      lob: ["", [Validators.required]],
    });

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Name",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.Get();
  }
  get formControls() {
    return this.Lob_Form.controls;
  }

  Get(): void {
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
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/ProductMapping/lob?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType()
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((resp: any) => {
            //   //   //   console.log(resp);

            this.dataAr = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  UpdateLOB(ID) {
    this.LobID = ID;
    const formdata = new FormData();
    formdata.append("ID", this.LobID);

    this.api.HttpPostType("ProductMapping/lob", formdata).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.DataAr = result.data;
          this.LOBdata = result.LOB;
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  SubmitLob() {
    this.isSubmitted = true;

    const field = this.Lob_Form.value;
    const formdata = new FormData();

    formdata.append("LobID", this.LobID);
    formdata.append("LOB", field.lob[0].Name);

    this.api.HttpPostType("ProductMapping/lobupdate", formdata).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.Get();
          this.api.Toast("Success", result["msg"]);
          // $('#exampleModal').modal('hide');
          const Closebutton = document.getElementById("CloseModel");
          Closebutton.click();
        } else {
          this.api.Toast("Warning", result["msg"]);
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
}
