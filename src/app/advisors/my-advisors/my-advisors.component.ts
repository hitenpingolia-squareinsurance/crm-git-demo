import { FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

class ColumnsObj {
  SrNo: string;
  Id: string;
  type: string;
  policyno: string;
  vehicleno: string;
  engineno: string;
  clientname: string;
  clientcontact: string;
  expirydate: string;
  delete_status: string;
  selected: boolean;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-my-advisors",
  templateUrl: "./my-advisors.component.html",
  styleUrls: ["./my-advisors.component.css"],
})
export class MyAdvisorsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;

  ActionType: any = "";
  SearchForm: FormGroup;
  // isSubmitted = false;

  dtElements: any;
  selectedItems: any[] = [];
  isSubmitted = false;
  Is_Export: number;
  selectAll: boolean = false;
  City: any;
  CityData: any;
  dropdownMultiSelectSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  CityName: any;
  selectedIds: any;
  SelectedName: any;
  SelectedCode: any;
  Selectedtype: any;
  Selectedexperience: any;
  Add_stamp: any;
  Type: { Id: number; Name: string }[];
  type: any;

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
      City: [""],
      type: [""],
    });

    this.Type = [
      { Id: 0, Name: "Employee" },
      { Id: 1, Name: "Agent" },
    ];
  }

  ngOnInit() {
    this.FilterCity("", 0);
    this.Get();
  }

  selectAllRows() {
    this.dataAr.forEach((row) => {
      row.selected = this.selectAll;
    });
    if (!this.selectAll) {
      // If "Select All" is unchecked, uncheck the header checkbox
      this.selectAll = false;
    }
  }

  // Function to select a single row
  selectRow(row: any) {
    if (!row.selected) {
      // If the row's checkbox is unchecked, uncheck the "Select All" checkbox
      this.selectAll = false;
    } else {
      // Check if all rows are selected
      if (this.dataAr.every((r) => r.selected)) {
        this.selectAll = true;
      }
    }
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  // Function to get the selected items

  getSelectedItems() {
    this.selectedItems = this.dataAr.filter((row) => row.selected);
    this.selectedIds = this.selectedItems.map((item) => item.Id);
    this.SelectedName = this.selectedItems.map((item) => item.name);
    this.SelectedCode = this.selectedItems.map((item) => item.code);
    this.Selectedtype = this.selectedItems.map((item) => item.type);
    this.Selectedexperience = this.selectedItems.map((item) => item.Experiance);
    this.Add_stamp = this.selectedItems.map((item) => item.Add_stamp);

    var fields = this.SearchForm.value;
    var City = fields["City"];

    if (City != "" && City != null) {
      this.CityName = fields["City"][0]["Name"];
    }

    const formData = new FormData();

    formData.append("SelectedIds", this.selectedIds);
    formData.append("SelectedName", this.SelectedName);
    formData.append("SelectedCode", this.SelectedCode);
    formData.append("Selectedtype", this.Selectedtype);
    formData.append("Selectedexperience", this.Selectedexperience);
    formData.append("city", this.CityName);
    formData.append("Add_stamp", this.Add_stamp);

    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));

    this.api.IsLoading();

    this.api.HttpPostType("Advisor/AddAdvisors", formData).then(
      (result: any) => {
        this.api.HideLoading();
        //   //   //   console.log(result);

        if (result["status"] == 1) {
          this.api.Toast("Success", result["msg"]);
          this.selectAll = false;
          this.Reload();
        } else {
          const msg = "msg";
          //alert(result['message']);
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        // Error log
        // console.log(err);

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

  // console.log('Selected Items:', this.selectedItems);

  headerClick(event: Event) {
    event.stopPropagation();
  }

  ClearSearch() {
    this.selectAll = false;
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
    this.Reload();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        var fields = this.SearchForm.value;

        var City = fields["City"];
        var type = fields["type"];

        // vechileType

        if (City != "" && City != null) {
          City = fields["City"][0]["Name"];
        }

        if (type != "" && type != null) {
          type = fields["type"][0]["Id"];
        }

        var query = {
          SearchValue: fields["SearchValue"],
          city: City,
          type: type,
        };
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
        this.selectAll = false;
      }
    });
  }

  FilterCity(e, Type) {
    var Quote = "";

    if (Type == 1) {
      Quote = e.target.value;
    }

    this.api
      .HttpGetType(
        "Advisor/City?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&citysearch=" +
          Quote
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.CityData = result["Data"];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );

    // this.api.HttpGetType("Dropdown/get_make?make="+Quote ).then(

    //   (result) => {
    //     // this.api.HideLoading();

    //     // console.log(result);
    //     if (result["Status"] == true) {
    //       if (result["Data"] != "") {
    //         this.CityData = result["Data"];

    //       }

    //     } else {
    //       const Message = "Message";
    //       // this.api.Toast("Warning", result["Message"]);
    //     }
    //   },
    //   (err) => {

    //     // this.api.HideLoading();

    //     const newLocal = "Warning";
    //     // // this.api.Toast(
    //     //   newLocal,
    //     //   "Network Error : " + err.name + "(" + err.statusText + ")"
    //     // );
    //   }
    // );
  }

  // FilterCity() {
  //   this.api.IsLoading();
  //   this.api
  //     .HttpGetType(
  //       "Advisor/City?User_Id=" +
  //         this.api.GetUserData("Id") +
  //         "&User_Type=" +
  //         this.api.GetUserType()
  //     )
  //     .then(
  //       (result) => {
  //         this.api.HideLoading();
  //         if (result["Status"] == true) {
  //           this.CityData = result["Data"];
  //         } else {
  //           this.api.Toast("Warning", result["Message"]);
  //         }
  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //         this.api.Toast(
  //           "Warning",
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //       }
  //     );
  // }

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
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/Advisor/ViewAdvisors?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType()
            ),

            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            //   //   //   console.log(that.dataAr);
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
}
