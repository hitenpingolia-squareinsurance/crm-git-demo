import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";
//import swal from 'sweetalert';
//import { MatDialog } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

class ColumnsObj {
  Id: string;
  SR_No: string;
  LOB_Name: string;
  File_Type: string;
  Customer_Name: string;
  RM_Name: string;
  Estimated_Gross_Premium: string;
  Add_Stamp: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-add-payin-agent-wise",
  templateUrl: "./add-payin-agent-wise.component.html",
  styleUrls: ["./add-payin-agent-wise.component.css"],
})
export class AddPayinAgentWiseComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  PayInForm: FormGroup;
  isSubmitted = false;

  dropdownSettings: any = {};
  LOB_dropdownSettings: any = {};
  ins_Company_dropdownSettings: any = {};
  cities: any = [];
  selectedItems: any = [];

  value: any;
  selected: any;

  User_Rights: any = [];

  Brokers_Ar: any = [];
  RM_Ar: any = [];
  Agents_Ar: any = [];
  Agent_Type_Ar: any = [];
  Ins_Companies_Ar: any = [];
  States_Ar: any = [];
  RTO_Ar: any = [];
  LOB_Ar: any = [];

  File_Type_Ar: any = [];
  Body_Type_Ar: any = [];
  Products_Ar: any = [];
  SubProducts_Ar: any = [];

  Segment_Ar: any = [];
  Classes_Ar: any = [];
  Sub_Classes_Ar: any = [];

  ItemSelection: any = [];
  ItemSelectionState: any = [];
  ItemSelectionProducts: any = [];
  ItemSelectionSubProducts: any = [];
  ItemSelectionSegment: any = [];
  ItemSelectionClass: any = [];

  ItemSelectionNMSegment: any = [];
  ItemSelectionNMClass: any = [];
  ItemSelectionNMProducts: any = [];

  Agents_Placeholder: string = "Select Agents (0)";

  isCheckedAllAgents: any = true;

  isChecked_Motor: any = false;
  isChecked_Health: any = false;
  isChecked_NonMotor: any = false;

  EnableTwoWheelerBodyType: any = 0;

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.LOB_dropdownSettings = {
      singleSelection: false,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };

    this.ins_Company_dropdownSettings = {
      allowSearchFilter: true,
      singleSelection: true,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };

    this.PayInForm = this.fb.group({
      //Agent_Ids: [''],

      Ins_Compaines_Ids: ["", [Validators.required]],
      LOB_Ids: ["", [Validators.required]],

      Product_Ids: ["", [Validators.required]],
      SubProduct_Ids: ["", [Validators.required]],
      Segment_Ids: ["", [Validators.required]],

      DateOrDateRange: [""],
    });

    this.LOB_Ar = [
      { Id: "Motor", Name: "Motor" },
      { Id: "Health", Name: "Health" },
    ];
  }

  ngOnInit(): void {
    this.Get();
    this.SearchComponentsData();
  }

  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "reports/BussinessReport/SearchComponentsData?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Ins_Companies_Ar = result["Data"]["Ins_Compaines"];
          } else {
            //alert(result['Message']);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();

          //alert(err.message);
        }
      );
  }

  onItemSelect(item: any, Type: any) {
    // console.log('Type : '+ Type);
    // console.log('onItemSelect', item);

    if (Type == "LOB") {
      this.PayInForm.get("Product_Ids").setValue(null);
      this.PayInForm.get("SubProduct_Ids").setValue(null);
      this.PayInForm.get("Segment_Ids").setValue(null);

      this.GetProducts("OneByOneSelect");
    }
    if (Type == "Product") {
      this.GetSubProducts("OneByOneSelect");
    }
    if (Type == "SubProduct") {
      this.GetSegments("OneByOneSelect");
    }
  }

  onItemDeSelect(item: any, Type: any) {
    // console.log('Type : '+ Type);
    // console.log('onDeSelect', item);

    if (Type == "Product") {
      this.GetSubProducts("OneByOneDeSelect");
    }
    if (Type == "SubProduct") {
      this.GetSegments("OneByOneDeSelect");
    }
  }

  onSelectAll(item: any, Type: any) {
    // console.log('Type : '+ Type);
    // console.log('SelectAll', item);
    if (Type == "Product") {
      this.GetSubProducts("SelectAll");
    }
    if (Type == "SubProduct") {
      this.GetSegments("SelectAll");
    }
  }
  onDeSelectAll(item: any, Type: any) {
    // console.log('Type : '+ Type);
    // console.log('DeSelectAll', item);
    if (Type == "Product") {
      //this.GetSubProducts('DeSelectAll');
      this.PayInForm.get("SubProduct_Ids").setValue(null);
      this.PayInForm.get("Segment_Ids").setValue(null);
      this.SubProducts_Ar = [];
      this.Segment_Ar = [];
    }
    if (Type == "SubProduct") {
      //this.GetSegments('DeSelectAll');
      this.PayInForm.get("Segment_Ids").setValue(null);
      this.Segment_Ar = [];
    }
  }

  GetProducts(Type) {
    this.Products_Ar = [];
    this.SubProducts_Ar = [];
    this.Segment_Ar = [];

    this.PayInForm.get("Product_Ids").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", JSON.stringify(this.PayInForm.value["LOB_Ids"]));
    this.api.HttpPostType("reports/BussinessReport/GetProducts", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Products_Ar = result["Data"];
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast(
          "Warning",
          "Network Error, Please try again ! " + err.message
        );
      }
    );
  }

  GetSubProducts(Type) {
    this.SubProducts_Ar = [];
    this.Segment_Ar = [];

    this.PayInForm.get("SubProduct_Ids").setValue(null);
    this.PayInForm.get("Segment_Ids").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", JSON.stringify(this.PayInForm.value["LOB_Ids"]));
    formData.append(
      "Product_Ids",
      JSON.stringify(this.PayInForm.value["Product_Ids"])
    );

    this.api
      .HttpPostType("reports/BussinessReport/GetSubProducts", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.SubProducts_Ar = result["Data"];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again ! " + err.message
          );
        }
      );
  }

  GetSegments(Type) {
    this.Segment_Ar = [];

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", JSON.stringify(this.PayInForm.value["LOB_Ids"]));
    formData.append(
      "Product_Ids",
      JSON.stringify(this.PayInForm.value["Product_Ids"])
    );
    formData.append(
      "SubProduct_Ids",
      JSON.stringify(this.PayInForm.value["SubProduct_Ids"])
    );

    this.api.HttpPostType("reports/BussinessReport/GetSegments", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Segment_Ar = result["Data"];
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast(
          "Warning",
          "Network Error, Please try again ! " + err.message
        );
      }
    );
  }

  SearchBtn() {
    //// console.log(this.PayInForm.value);
    var ToDate, FromDate;

    var fields = this.PayInForm.value;

    var DateOrDateRange = fields["DateOrDateRange"];

    if (DateOrDateRange) {
      ToDate = DateOrDateRange[0];
      FromDate = DateOrDateRange[1];
    }

    var query = {
      Ins_Compaines_Ids: fields["Ins_Compaines_Ids"],

      LOB_Ids: fields["LOB_Ids"],

      Product_Ids: fields["Product_Ids"],
      SubProduct_Ids: fields["SubProduct_Ids"],

      Segment_Ids: fields["Segment_Ids"],

      To_Date: this.api.StandrdToDDMMYYY(ToDate),
      From_Date: this.api.StandrdToDDMMYYY(FromDate),
    };

    // console.log(query);

    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
    });
  }

  ClearSearch() {
    var fields = this.PayInForm.reset();
    //this.Agents_Ar = [];

    this.Products_Ar = [];
    this.SubProducts_Ar = [];

    this.Segment_Ar = [];

    this.ResetDT();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
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
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/reports/PayIn/GridData?Type=Agent&User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&User_Type=" +
                this.api.GetUserType()
            ),
            dataTablesParameters,
            {}
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
        { data: "SR_No" },
        { data: "LOB_Name" },
        { data: "File_Type" },
        { data: "Customer_Name" },
        { data: "RM_Name" },
        { data: "Estimated_Gross_Premium" },
        { data: "Add_Stamp" },
      ],
    };
  }

  ViewPayIn(Id) {}
  DeletePayIn(Id) {
    if (confirm("Are you sure ?") === true) {
      const formData = new FormData();
      formData.append("Id", Id);

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("User_Type", this.api.GetUserType());

      this.api.HttpPostType("reports/PayIn/DeletePayIn", formData).then(
        (result) => {
          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.Reload();
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again ! " + err.message
          );
        }
      );
    }
  }
}
