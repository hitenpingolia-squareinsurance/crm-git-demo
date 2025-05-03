import { Component, OnInit, ViewChild, Inject, Optional } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}


@Component({
  selector: 'app-faqs-veiw',
  templateUrl: './faqs-veiw.component.html',
  styleUrls: ['./faqs-veiw.component.css']
})
export class FAQsVeiwComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[];
  Id: any;
  type: string;
  answer: string;
  Is_Export: number;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient
  ) {

  }

  ngOnInit() {
    this.Get();
  }

  ClearSearch() {
    this.dataAr = [];
    this.ResetDT();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  // Get() {
  //   this.api.IsLoading();
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       Authorization: "Bearer " + this.api.GetToken(),
  //     }),
  //   };

  //   this.dtOptions = {
  //     pagingType: "full_numbers",
  //     pageLength: 10,
  //     serverSide: true,
  //     processing: true,
  //     ajax: (dataTablesParameters: any, callback) => {
  //       this.http.post<DataTablesResponse>(environment.apiUrl + "/Websitesection/FAQsveiw", dataTablesParameters, httpOptions)
  //         .subscribe((resp: any) => {
  //           this.api.HideLoading();
  //           this.dataAr = resp.data;
  //           callback({
  //             recordsTotal: resp.recordsTotal,
  //             recordsFiltered: resp.recordsFiltered,
  //             data: [],
  //           });
  //         });
  //     },
  //   };
  // }
  

  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "table1") {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
      }
    });
  }

  Get() {
    // alert(this.api.GetUserData("type"));
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
      dom: "ip",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
              "/WebsiteSection/FAQsveiw?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType()),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
            this.dataAr = resp.data;

            // console.log(that.dataAr);
            if (this.dataAr.length > 0) {
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


  Answer(id: any) {
    this.Id = id;

    this.api.HttpGetType("WebsiteSection/FAQsDetails?ID=" + this.Id)
      .then(
        (result: any) => {
          if (result['status'] == true) {
            this.dataAr = result.data;
            this.answer = result.data[0].answer;

          } else {
            this.api.Toast("Warning", result['msg']);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
          )
        }
      )
  }

  closeModal() {
    this.Get();
    this.ResetDT();
  }



  StatusChange(id: any, type: any) {
    this.Id = id;
    this.type = type;

    var Is_Confirm = "Are you sure that you want to change status?";

    if (confirm(Is_Confirm) == true) {
      const formdata = new FormData();
      formdata.append('type', this.type);
      formdata.append('ID', this.Id);
      this.api.HttpPostType("WebsiteSection/FAQs_status", formdata)
        .then(
          (result: any) => {
            if (result['status'] == true) {
              this.ResetDT();
              this.api.Toast("Success", result['Msg']);

            } else {
              this.api.Toast("Warning", result['Msg']);
            }
          },
          (err) => {
            this.api.Toast(
              "Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
            )
          }
        )
    } else {
      this.ResetDT();
    }
  }

}
