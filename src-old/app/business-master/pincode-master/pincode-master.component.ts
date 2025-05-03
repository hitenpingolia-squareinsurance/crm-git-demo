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
import { ActivatedRoute, Router } from "@angular/router";
import { stringify } from "querystring";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AddPincodeComponent } from "./add-pincode/add-pincode.component";
import { UpdatePincodeComponent } from "./update-pincode/update-pincode.component";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-pincode-master",
  templateUrl: "./pincode-master.component.html",
  styleUrls: ["./pincode-master.component.css"],
})
export class PincodeMasterComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];
  AddFieldForm: FormGroup;
  active: any[];
  stateAr: any[];
  districtAr: any[];
  cityAr: any[];
  areaAr: any[];
  pincodeAr: any[];
  isSubmitted = false;
  hasAccess: boolean = true;
  errorMessage: string = "";
  
  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.dropdownSettingsmultiselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.AddFieldForm = this.formBuilder.group({
      area: [""],
      pincode: [""],
      state: [""],
      district: [""],
      city: [""],
    });
  }

  ngOnInit() {
    this.Get();
    this.getState();
  }

  Get() {
    this.api.IsLoading();

    const that = this;
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      ordering: false,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/../v2/business_master/PincodeMaster/GridData?User_Id=" +
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
    };
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  SearchData() {
    var field = this.AddFieldForm.value;

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(field))).draw();
    });
  }

  ClearSearch() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().search("").draw();
    });

    this.AddFieldForm.reset();
  }

  dailog() {
    const dialogRef = this.dialog.open(AddPincodeComponent, {
      width: "60%",
      height: "60%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.Reload();
      // this.getCompany();
    });
  }

  getState() {
    var area = this.AddFieldForm.get("area");
    area.reset();
    var pincode = this.AddFieldForm.get("pincode");
    pincode.reset();
    var city = this.AddFieldForm.get("city");
    city.reset();
    var district = this.AddFieldForm.get("district");
    district.reset();

    const field = new FormData();
    this.api
      .HttpPostTypeBms("../v2/business_master/PincodeMaster/getState", field)
      .then(
        (resp) => {
          this.stateAr = resp["stateAr"];
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  getDistrict(state: any) {
    var area = this.AddFieldForm.get("area");
    area.reset();
    var pincode = this.AddFieldForm.get("pincode");
    pincode.reset();
    var city = this.AddFieldForm.get("city");
    city.reset();

    const field = new FormData();
    field.append("state", JSON.stringify(state));
    this.api
      .HttpPostTypeBms("../v2/business_master/PincodeMaster/getDistrict", field)
      .then(
        (resp) => {
          this.districtAr = resp["districtAr"];
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  getCity(district: any) {
    var area = this.AddFieldForm.get("area");
    area.reset();
    var pincode = this.AddFieldForm.get("pincode");
    pincode.reset();

    const field = new FormData();
    field.append("district", JSON.stringify(district));
    this.api
      .HttpPostTypeBms("../v2/business_master/PincodeMaster/getCity", field)
      .then(
        (resp) => {
          this.cityAr = resp["cityAr"];
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  getArea(city: any) {
    var pincode = this.AddFieldForm.get("pincode");
    pincode.reset();
    const field = new FormData();
    field.append("city", JSON.stringify(city));
    this.api
      .HttpPostTypeBms("../v2/business_master/PincodeMaster/getArea", field)
      .then(
        (resp) => {
          this.areaAr = resp["areaAr"].map((item) => ({
            Id: item.Id,
            Name: item.Name,
          }));

          //   //   //   console.log(resp["areaAr"]);
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  update(id: any) {
    const dialogRef = this.dialog.open(UpdatePincodeComponent, {
      width: "60%",
      height: "60%",
      disableClose: true,
      data: {
        id: id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.Reload();
    });
  }

  deleteItem(id: any) {
    if (window.confirm("Are you sure for want to delete..?")) {
      const formdata = new FormData();
      formdata.append("id", id);
      this.api
        .HttpPostTypeBms(
          "../v2/business_master/PincodeMaster/deleteItem",
          formdata
        )
        .then(
          (resp) => {
            if (resp["status"] == true) {
              this.api.Toast("Success", resp["msg"]);
              this.Reload();
            }
          },
          (err) => {
            console.error("HTTP error:", err);
          }
        );
    }
  }

  onlyAllowNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
