import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import {
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { trim } from "jquery";

class ColumnsObj {
  SrNo: string;
  id: string;
  Name: string;
  Category: string;
  Item: string;
  Create_date: string;
  company: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-masterdata",
  templateUrl: "./masterdata.component.html",
  styleUrls: ["./masterdata.component.css"],
})
export class MasterdataComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  loadAPI: Promise<any>;
  dtElements: any;
  SearchForm: FormGroup;

  id: any;
  masterdata: FormGroup;
  Is_Export: number;
  company: any;
  dataArr: any;
  type: any;
  make: any;
  modal: any;
  variant: any;
  seating_capacity: any;
  cubic_capacity: any;
  fule_type: any;
  SearchForm1: FormGroup;
  MasterId: any;
  AvailibiltyType: any;
  Value: any;
  companycolumnname: string;
  // dataArr: any;
  // dataArray:any;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MasterdataComponent>,
    private http: HttpClient,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.MasterId = this.data.MasterId;
    this.id = this.data.Id;
    this.company = this.data.company;
    this.type = this.data.type;
    this.AvailibiltyType = this.data.Avilibilty;
    this.Value = this.data.Value;

    if (this.company == "newindia_master") {
      this.companycolumnname = "newindia";
    } else if (this.company == "national_master") {
      this.companycolumnname = "national";
    } else if (this.company == "cholamandalam_master") {
      this.companycolumnname = "cholamandalam";
    } else if (this.company == "universalMaster") {
      this.companycolumnname = "universalMaster";
    } else if (this.company == "kotakMaster") {
      this.companycolumnname = "kotakMaster";
    } else if (this.company == "digit") {
      this.companycolumnname = "digit";
    } else if (this.company == "acko") {
      this.companycolumnname = "acko";
    } else if (this.company == "reliance") {
      this.companycolumnname = "reliance";
    } else if (this.company == "hdfc") {
      this.companycolumnname = "hdfc";
    } else if (this.company == "bajaj") {
      this.companycolumnname = "bajaj";
    } else if (this.company == "bhartiaxa") {
      this.companycolumnname = "bharti";
    } else if (this.company == "tata_v2") {
      this.companycolumnname = "tata";
    } else if (this.company == "shriram") {
      this.companycolumnname = "shriram";
    } else if (this.company == "icici") {
      this.companycolumnname = "icici";
    } else if (this.company == "iffco") {
      this.companycolumnname = "iffco";
    } else if (this.company == "sbiMaster") {
      this.companycolumnname = "sbi";
    } else if (this.company == "oriental") {
      this.companycolumnname = "oriental";
    } else if (this.company == "royal_sundaram") {
      this.companycolumnname = "royalSundaram";
    } else if (this.company == "future_varaint") {
      this.companycolumnname = "future";
    } else if (this.company == "united_variant") {
      this.companycolumnname = "united";
    } else if (this.company == "magmaMaster") {
      this.companycolumnname = "magmaMaster";
    } else if (this.company == "raheja") {
      this.companycolumnname = "raheja";
    } else if (this.company == "liberty") {
      this.companycolumnname = "digit";
    }

    // console.log(this.AvailibiltyType);
    // console.log(this.type);
    // console.log(this.id);

    this.SearchForm = this.formBuilder.group({
      make: [""],
      modal: [""],
      variant: [""],
      fuel: [""],
      cc: [""],
      seating: [""],
    });

    this.SearchForm1 = this.formBuilder.group({
      make1: [""],
      modal1: [""],
      variant1: [""],
      fuel1: [""],
      cc1: [""],
      seating1: [""],
    });

    this.SearchForm.setValue({
      make: [""],
      modal: [""],
      variant: [""],
      fuel: [""],
      cc: [""],
      seating: [""],
    });
  }

  ngOnInit() {
    this.Get();
    this.getdata();

    // this.SearchData();

    this.SearchForm1.patchValue({
      make1: this.data.make,
      modal1: this.data.model,
      variant1: this.data.variant,
      fuel1: this.data.fule_type,
      cc1: this.data.cc,
      seating1: this.data.seating_capicity,
    });
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //   FilterData(){
  //     this.api.IsLoading();
  //    //this.api.HttpGetType('Claim/FilterData?Page=ClaimAssistant&User_Id='+this.api.GetUserData('Id')+'&User_Type='+this.api.GetUserType()).then((result:any) => {
  //    this.api.HttpGetType("/SquareMaster/Showtable?User_Id=" +
  //    this.api.GetUserData("Id") +
  //    "&User_Type=" +
  //    this.api.GetUserType() +
  //    "&id=" +
  //    this.id).then((result:any) => {
  //    this.api.HideLoading();
  //      if(result['Status'] == true ){
  //        //this.api.Toast('Success',result['msg']);
  //        //this.Company_Ar = result['Company_Ar'];
  //        //this.LOB_Ar = result['LOB_Ar'];
  //        //this.Product_Ar = result['Product_Ar'];
  //        this.data_Ar = result['Data'];

  //      }else{
  //        //alert(result['message']);
  //        this.api.Toast('Warning',result['Message']);
  //      }

  //    }, (err) => {
  //      // Error log
  //      //// console.log(err);
  //      this.api.HideLoading();
  //      this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );
  //      //this.api.ErrorMsg('Network Error :- ' + err.message);
  //      });
  //  }

  // ResetDT() {
  //   this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.search('').column(0).search('').draw();
  //   });
  // }

  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        var fields = this.SearchForm.value;

        var query = {
          SearchMake: trim(fields["make"]),
          SearchModel: trim(fields["modal"]),
          SearchVariant: trim(fields["variant"]),
          SearchCC: trim(fields["cc1"]),
          SearchFuleType: trim(fields["fuel1"]),
        };

        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();

        // var fields = this.searchForm.value;

        // var query = {
        //   SearchValue : fields['SearchValue'],
        // }
        // dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
      }
    });
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    // this.Get();
    this.Reload();
  }

  //  get formControls() {
  //     return this.masterdata.controls;
  //   }

  Get() {
    const id = this.id;

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
                "/SquareMaster/Showtable?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Company=" +
                this.company +
                "&type=" +
                this.type +
                "&id=" +
                this.id
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

  getdata() {
    // console.log(this.id);

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "SquareMaster/CommancompanyData1?id=" +
          this.id +
          "&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&company=" +
          this.company +
          "&type=" +
          this.company
      )
      .then(
        (result) => {
          this.api.HideLoading();
          // this.dataArr = result["data"];
          // console.log(result);
          // // console.log(this.dataArr);

          if (result["status"] == true) {
            this.dataArr = result["data"];

            if (result["msg"] == 1) {
              this.SearchForm.patchValue({
                make: this.dataArr.make,
                modal: this.dataArr.modal,
                variant: this.dataArr.variant,
                fuel: this.dataArr.fule_type,
                cubic_capacity: this.dataArr.cubic_capacity,
                seating: this.dataArr.seating_capacity,
              });
            } else {
              this.SearchForm.patchValue({
                make: this.data.make,
                modal: this.data.modal,
                variant: this.data.variant,
                fuel: this.data.fule_type,
                cubic_capacity: this.data.cubic_capacity,
                seating: this.data.seating_capacity,
              });
            }
            this.SearchData();
          } else {
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

  // get formControls() { return this.SearchForm.controls; }

  UpdateStatus(id, UpdateType) {
    // console.log(this.id);
    // console.log(this.company);

    const ids = id;

    // console.log(ids);

    var r = confirm("Are You sure you want to update!");

    if (r == true) {
      this.api.IsLoading();

      this.api
        .HttpGetType(
          "SquareMaster/UpdateRow?id=" +
            ids +
            "&UpdateType=" +
            UpdateType +
            "&masterid=" +
            this.MasterId +
            "&company=" +
            this.company +
            "&User_Id=" +
            this.api.GetUserData("Id") +
            "&type=" +
            this.type +
            "&User_Type=" +
            this.api.GetUserType()
        )
        .then(
          (result) => {
            this.api.HideLoading();
            // this.dataArr = result["data"];
            // console.log(result);
            // // console.log(this.dataArr);

            if (result["status"] == 1) {
              this.dataArr = result["data"];
              // console.log(this.dataArr);
            } else {
              // alert(result['msg']);
              this.api.Toast("success", result["msg"]);
            }
            this.CloseModel();
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
    } else {
      status = "You pressed Cancel!";
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
