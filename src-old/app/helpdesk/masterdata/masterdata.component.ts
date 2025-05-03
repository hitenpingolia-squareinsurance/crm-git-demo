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
  // dataArr: any;
  // dataArray:any;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MasterdataComponent>,
    private http: HttpClient,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.Id;
    this.company = this.data.company;
    this.type = this.data.type;

    // console.log(this.type);

    this.SearchForm = this.formBuilder.group({
      make: [""],
      model: [""],
      variant: [""],
      fuel: [""],
      cc: [""],
      seating: [""],
    });

    this.SearchForm.setValue({
      make: [""],
      model: [""],
      variant: [""],
      fuel: [""],
      cc: [""],
      seating: [""],
    });
  }

  ngOnInit() {
    this.Get();
    this.getdata();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  SearchData() {}

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

  // SearchBtn(Type){

  //   var query = {
  // 	  User_Id : this.api.GetUserData('Id'),
  // 	  User_Type : this.api.GetUserType(),
  // 	  Tab_Type : Type,
  //   }

  //    // console.log(query);

  // this.Is_Export = 0;
  // this.dataAr = [];
  // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
  // 	dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
  // 	//this.Is_Export = 1;
  // });

  // }

  // CloseModel(): void {
  //   this.dialogRef.close({
  //     Status: 'Model Close'
  //   });
  // }

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
        "SquareMaster/ShowData?id=" +
          this.id +
          "&User_Id=" +
          this.api.GetUserData("Id") +
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

            this.SearchForm.patchValue({
              make: this.dataArr.make,
              model: this.dataArr.modal,
              variant: this.dataArr.variant,
              fuel: this.dataArr.fule_type,
              cc: this.dataArr.cubic_capacity,
              seating: this.dataArr.seating_capacity,
            });
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

  // get formControls() { return this.SearchForm.controls; }

  UpdateStatus(id) {
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
            "&masterid=" +
            this.id +
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

  ResetRow(id) {
    // console.log(this.id);
    // console.log(this.company);

    const ids = id;

    // console.log(ids);

    var r = confirm("Are You sure you want to Reset!");

    if (r == true) {
      this.api.IsLoading();

      this.api
        .HttpGetType(
          "SquareMaster/ResetRow?id=" +
            ids +
            "&masterid=" +
            this.id +
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
}
