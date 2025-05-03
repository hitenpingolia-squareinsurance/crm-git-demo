import { DataTableDirective } from "angular-datatables";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MasterdataComponent } from "../masterdata/masterdata.component";
import { trim } from "jquery";

class ColumnsObj {
  SrNo: string;
  id: string;
  Name: string;
  Category: string;
  Item: string;
  Create_date: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-mastertable",
  templateUrl: "./mastertable.component.html",
  styleUrls: ["./mastertable.component.css"],
})
export class MastertableComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  ActivePage: string = "Default";

  loadAPI: Promise<any>;

  ActionType: any = "";
  SearchForm: FormGroup;
  isSubmitted = false;
  dtElements: any;
  Is_Export: number;

  filterFormData: any[];

  SquareMasterFuelTypeData: any[];
  SquareMasterModalData: any[];
  SquareMasterVariantData: any[];
  SquareMasterMakeData: any[];
  SquareMasterCCData: any[];
  dropdownMultiSelectSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  vehicletype: { Id: string; Name: string }[];

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.dropdownMultiSelectSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.SearchForm = this.formBuilder.group({
      SearchValue: [""],
      type: [""],
      make: [""],
      modal: [""],
      variant: [""],
      cubic_capicity: [""],
      fule_type: [""],
      vechileType: [""],
    });

    this.vehicletype = [
      { Id: "1", Name: "TW" },
      { Id: "2", Name: "PC" },
    ];
  }

  ngOnInit() {
    this.Get();
    this.FetchSquareData();
    this.DailylogSquare();
  }

  // get formControls() {
  //   return this.searchform.controls;
  // }

  // ClearSearch() {
  //   var fields = this.searchform.reset();
  //   // this.dataAr = [];
  //   this.ResetDT();
  // }

  // ResetDT() {
  //   this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.search("").column(0).search("").draw();
  //   });
  // }

  Get() {
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
                "/SquareMaster/Fetchdata?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            // console.log(that.dataAr);
            if (that.dataAr.length > 0) {
            }
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  FetchSquareData() {
    // this.api.IsLoading();
    const that = this;

    // console.log(this.SearchForm.invalid);
    var fields = this.SearchForm.value;
    // console.log(fields);

    var fields = this.SearchForm.value;
    const formData = new FormData();

    var make1 = fields["make"];
    var modal1 = fields["modal"];
    var variant1 = fields["variant"];
    var cubic_capicity1 = fields["cubic_capicity"];
    var fule_type1 = fields["fule_type"];

    if (make1 != "" && make1 != null) {
      make1 = fields["make"][0]["Id"];
    }
    if (modal1 != "" && modal1 != null) {
      modal1 = fields["modal"][0]["Id"];
    }
    if (variant1 != "" && variant1 != null) {
      variant1 = fields["variant"][0]["Id"];
    }
    if (cubic_capicity1 != "" && cubic_capicity1 != null) {
      cubic_capicity1 = fields["cubic_capicity"][0]["Id"];
    }
    if (fule_type1 != "" && fule_type1 != null) {
      fule_type1 = fields["fule_type"][0]["Id"];
    }

    formData.append("SearchMake", trim(make1));
    formData.append("SearchModel", trim(modal1));
    formData.append("SearchVariant", trim(variant1));
    formData.append("SearchCC", trim(cubic_capicity1));
    formData.append("SearchFuleType", trim(fule_type1));

    this.api
      .HttpPostType(
        "/SquareMaster/FetchSquareData?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType(),
        formData
      )
      .then(
        (result) => {
          // this.api.HideLoading();
          if (result["status"] == true) {
            // this.Companys = result['Companys'];

            that.SquareMasterFuelTypeData = result["SquareMasterFuelType"];
            that.SquareMasterModalData = result["SquareMasterModal"];
            that.SquareMasterVariantData = result["SquareMasterVariant"];
            that.SquareMasterMakeData = result["SquareMasterMake"];
            that.SquareMasterCCData = result["SquareMasterCC"];
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        var fields = this.SearchForm.value;
        // console.log(fields);
        var make1 = fields["make"];
        var modal1 = fields["modal"];
        var variant1 = fields["variant"];
        var cubic_capicity1 = fields["cubic_capicity"];
        var fule_type1 = fields["fule_type"];
        var vechileType1 = fields["vechileType"];
        // vechileType
        if (make1 != "" && make1 != null) {
          make1 = fields["make"][0]["Id"];
        }
        if (modal1 != "" && modal1 != null) {
          modal1 = fields["modal"][0]["Id"];
        }
        if (variant1 != "" && variant1 != null) {
          variant1 = fields["variant"][0]["Id"];
        }
        if (cubic_capicity1 != "" && cubic_capicity1 != null) {
          cubic_capicity1 = fields["cubic_capicity"][0]["Id"];
        }
        if (fule_type1 != "" && fule_type1 != null) {
          fule_type1 = fields["fule_type"][0]["Id"];
        }
        // if(vechileType1 !="" &&  vechileType1 != null){
        //   vechileType1 = fields['vechileType'];
        // }

        var query = {
          SearchValue: fields["SearchValue"],
          type: trim(fields["type"]),

          SearchMake: trim(make1),
          SearchModel: trim(modal1),
          SearchVariant: trim(variant1),
          SearchCC: trim(cubic_capicity1),
          SearchFuleType: trim(fule_type1),
          vechileType: trim(fields["vechileType"]),
        };

        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
        this.FetchSquareData();

        // var fields = this.searchForm.value;

        // var query = {
        //   SearchValue : fields['SearchValue'],
        // }
        // dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
      }
    });
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    // this.Get();
    this.Reload();

    this.FetchSquareData();
  }

  Availibilty(id: any, columnname: any, value: any) {
    // console.log(id);
    // console.log(columnname);
    // console.log(value);

    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("Id", id);
      formData.append("columnname", columnname);
      formData.append("value", value);

      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api.HttpPostType("SquareMaster/CheckAvailibilty", formData).then(
        (result: any) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.Reload();
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }

  ForApproval(
    Id: any,
    company: any,
    types: any,
    make: any,
    model: any,
    variant: any,
    cc: any,
    seating_capicity: any,
    fule_type: any,
    MasterId: any,
    Avilibilty: any,
    Value: any
  ) {
    const dialogRef = this.dialog.open(MasterdataComponent, {
      width: "60%",
      height: "65%",
      // disableClose: true,
      data: {
        Id: Id,
        company: company,
        type: types,
        make: make,
        model: model,
        variant: variant,
        cc: cc,
        seating_capicity: seating_capicity,
        fule_type: fule_type,
        MasterId: MasterId,
        Avilibilty: Avilibilty,
        Value: Value,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
      // console.log(result);

      // this.SearchBtn();
    });
  }

  // DailylogSquare(){

  // }

  //===== CLAIM-ASSISTANCE FILTER DATA ARRAY =====//
  DailylogSquare() {
    // alert();

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());

    this.api
      .HttpPostType("SquareMaster/DailylogSquare", formData)
      .then((result: any) => {
        // this.api.HideLoading();
        if (result["Status"] == true) {
          // console.log(result["data"]);
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      });
  }
}
