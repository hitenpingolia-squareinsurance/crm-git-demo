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
import { DataTableDirective } from "angular-datatables";
import { AddAdvisorComponent } from "../../modals/add-advisor/add-advisor.component";

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
  selector: "app-remove-advisor",
  templateUrl: "./remove-advisor.component.html",
  styleUrls: ["./remove-advisor.component.css"],
})
export class RemoveAdvisorComponent implements OnInit {
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
  Type: { Id: string; Name: string }[];
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

    this.Type = [
      { Id: "employee", Name: "Employee" },
      { Id: "agent", Name: "Agent" },
    ];

    this.SearchForm = this.formBuilder.group({
      SearchValue: [""],
      City: [""],
      type: [""],
    });
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
  removeAdviosrs() {
    this.selectedItems = this.dataAr.filter((row) => row.selected);
    this.selectedIds = this.selectedItems.map((item) => item.Id);
    //   //   //   console.log(this.selectedIds);
    var fields = this.SearchForm.value;

    var City = fields["City"];
    if (City != "" && City != null) {
      this.CityName = fields["City"][0]["Name"];
    }

    const formData = new FormData();

    formData.append("SelectedIds", this.selectedIds);
    formData.append("city", this.CityName);

    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));

    this.api.IsLoading();

    this.api.HttpPostType("Advisor/RemoveAdvisor", formData).then(
      (result: any) => {
        this.api.HideLoading();
        //   //   //   console.log(result);

        if (result["status"] == 1) {
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
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
    this.selectAll = false;
    this.Reload();
    this.ResetDT();
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
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/Advisor/RemoveAdvisorsShow?User_Id=" +
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

  AddAdvisor(Id: any, AgentId: any, Type: any, UserType: any) {
    const dialogRef = this.dialog.open(AddAdvisorComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { Id: Id, AgentId: AgentId, Type: Type, UserType: UserType },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
