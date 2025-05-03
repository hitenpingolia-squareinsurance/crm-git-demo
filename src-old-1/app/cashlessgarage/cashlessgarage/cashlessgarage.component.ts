import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, UrlSegment } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/providers/api.service";
import { DataTableDirective } from "angular-datatables";
import { FormGroup, Validators, FormBuilder, FormArray } from "@angular/forms";

class ColumnsObj {
  Id: any;
  name: any;
  type: any;
  status: any;
  created_at: any;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}

class staticVendors {
  id: any;
  type: any;
  name: any;
  city: any;
  address: any;
  logo: any;
  gst_no: any;
  pan_no: any;
  director_name: any;
  services: [];
  status: any;
}

class ReqDataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}

class requestAgreement {
  req_id: any;
  vendor_type: any;
  vendor_services: any;
  spokesperson_name: any;
  spokesperson_email: any;
  spokesperson_mobile: any;
  square_spokesperson: any;
  seal_signed_by: any;
  start_date: any;
  end_date: any;
  seal_signed_date: any;
  upload_agreement: any;
  renewable_reminder: any;
  renewable_reminder_to: any;
  status: any;
}

class ReqAgreementDataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}

@Component({
  selector: "app-cashlessgarage",
  templateUrl: "./cashlessgarage.component.html",
  styleUrls: ["./cashlessgarage.component.css"],
})
export class CashlessgarageComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dropdownMultiSelectSettingsType: any = {};
  dropdownSingleSelectSettingsType: any = {};
  selectedVendorType: any[];
  selectedEmployee: any[];
  selectedEmployeeSealSignedBy: any[];
  selectedVendorTypeId: any = ""; // Store selected vendor type
  selectedCity: any[]; // Store selected city
  selectedServices: any[] = [];
  selectedServicesId: any[] = []; // Store selected services (array for multiple selection)
  vendorLogo: File | null = null;

  vendorTypes: any[] = [];
  Employee: any[] = [];
  vendorServices: any[] = [];
  vendorType: any[] = [];
  cities: any[] = []; // to store cities data
  vendorRequestForm: FormGroup;
  vendorRequestAgreementForm: FormGroup;
  showRenewableReminderTo: boolean = false; // Control visibility
  SubmitFormMaster: boolean = false; // Control visibility
  SubmitFormGarage: boolean = false; // Control visibility
  SubmitFormAddVisit: boolean = false; // Control visibility
  vendorRequestEditAgreementForm: FormGroup;
  currentVendorAgreement: any;

  Search: FormGroup;

  currentView: string = "";
  modalAction: "add" | "edit" = "add";
  currentVendor: any = {}; // Store vendor being edited[[]]
  vendors: any = {};

  CompanyData: any = {};

  dtOptions: DataTables.Settings = {};
  otOptions: DataTables.Settings = {};
  RtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  dataArr: staticVendors[];
  agreementDataArr: requestAgreement[];
  FilterData: ColumnsObj[];
  ActivePage: string = "Default";
  filterFormData: any = [];

  SearchForm: any;
  Vendor_Id: number;
  Req_Id: number;

  vendorId: any; // Declare a variable to store the vendor ID
  fileError: any;
  FileNames: any;
  validImageExtensions: string[] = ["jpg", "jpeg", "png", "gif"];
  vendor_req_data: any;
  VendorTypeForm: any;
  SubmitVendorType: any = false;
  SubmitRequestType: any = false;
  SubmitAgreementType: any = false;
  UpdateAgreementType: any = false;
  UpdateId: any = "";
  ModelType: any = "";
  ModelId: any = "";
  ModelAction: any = "";
  FormMaster: FormGroup;
  GarageForm: FormGroup;
  selectedCompanyType: { Id: string; Name: string }[];
  StateData: any;
  PincodeData: any;
  CityData: any;
  ItemLOBSelection: any;
  FormAddVisit: FormGroup;
  garagevisitordata: { Id: string; Name: string }[];
  // SelectedVisitorType: "Insurer" | "Square" = "Insurer";
  SelectedVisitorType: any;
  EmployeeData: any;
  dataArra: any;
  QuoteTypes: { Id: string; Name: string }[];
  QuoteTypeVal: { Id: string; Name: string }[];
  LoginId: any;
  LoginType: any;
  RequestStatusData: { Id: number; Name: string }[];
  UpdateStatus: FormGroup;
  SubmitUpdateGarageRequest: boolean;
  GarageId: any;
  selectedRequestType: { Id: number; Name: string }[];
  fileErrorLocal: string;
  fileStorage: any;
  file_Error: boolean;
  FetchCompanyWiseDocuments: any;
  DocumentAr: any;
  AgentData: any;
  UpdatedFileValue: any;
  selectedFiles: any;
  InsurerId: any;
  vendorData: any;

  hasAccess: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private http: HttpClient,
    private FormBuilder: FormBuilder
  ) {
    this.LoginId = this.api.GetUserData("Id");
    this.LoginType = this.api.GetUserType();

    this.Search = this.FormBuilder.group({
      SearchVal: [""],
      QuoteType: [""],
    });

    this.UpdateStatus = this.FormBuilder.group({
      RequestStatus: [""],
      Remark: [""],
    });
    this.FormMaster = this.FormBuilder.group({
      company: [""],
      name: [""],
    });

    this.FormAddVisit = this.FormBuilder.group({
      garage_visitor: [""],
      insurer_name: [""],
      insurer_contact: [""],
      square_employee: [""],
      visit_date: [""],
      visit_remark: [""],
    });

    this.GarageForm = this.FormBuilder.group({
      company: [""],
      state: [""],
      agent_mapping: [""],
      city: [""],
      pincode: [""],
      garage_name: [""],
      garage_spokesperson_name: [""],
      garage_spokesperson_contact: [""],
      CompanyFileDocument: this.FormBuilder.array([]),
    });

    this.dropdownMultiSelectSettingsType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.dropdownSingleSelectSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.GetInsurer();
    this.QuoteTypes = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];
    this.RequestStatusData = [
      { Id: 1, Name: "Pending" },
      { Id: 2, Name: "In Progress" },
      { Id: 3, Name: "Rejected" },
      { Id: 4, Name: "Completed" },
    ];

    this.QuoteTypeVal = [{ Id: "Raise Request", Name: "Raise Request" }];
  }

  get formcontrolsFormMaster() {
    return this.FormMaster.controls;
  }
  get formcontrolsGarageForm() {
    return this.GarageForm.controls;
  }
  get formcontrolsFormAddVisit() {
    return this.FormAddVisit.controls;
  }

  get formcontrolsUpdateStatus() {
    return this.UpdateStatus.controls;
  }
  ngOnInit(): void {
    this.route.url.subscribe((segments: UrlSegment[]) => {
      const path = segments.length > 0 ? segments[0].path : "";

      switch (path) {
        case "request":
          this.currentView = "request";
          this.Get();
          this.GetStateData();

          break;
        case "manager":
          this.currentView = "manager";
          this.Get();
          this.GetStateData();
          this.GetAgentData();

          break;
        case "master":
          this.currentView = "master";
          this.Get();

          break;
        default:
          this.currentView = "";
      }
    });
    this.garagevisitordata = [
      { Id: "Square", Name: "Square" },
      { Id: "Insurer", Name: "Insurer" },
    ];
  }

  createArray(): FormGroup {
    return this.FormBuilder.group({
      File: [""],
    });
  }

  openModal(Type, action, id) {
    this.ModelType = Type;
    this.ModelAction = action;
    this.ModelId = id;

    this.FormAddVisit.reset();
    this.FormMaster.reset();
    this.GarageForm.reset();
    this.UpdateStatus.reset();

    if (this.ModelAction == "Edit") {
      this.FetchEditData(this.ModelId, this.currentView);
    }

    if (this.ModelAction == "Add" && Type == "Visit") {
      this.FetchEmployeeData();
    }

    //   //   //   console.log(this.ModelType);
    //   //   //   console.log(this.ModelAction);
    //   //   //   console.log(this.ModelId);
  }

  FetchEditData(Id, view) {
    const formData = new FormData();
    formData.append("id", Id);
    formData.append("view", view);

    this.api.IsLoading();
    this.api.HttpPostType("Garage/FetchEditData", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          if (view == "master") {
            //   //   //   console.log(result["data"]);

            this.FormMaster.patchValue({
              name: result["data"].name,
            });

            this.selectedCompanyType = result["data"].company;
          }
          if (view == "manager") {
            //   //   //   console.log(result["data"]);

            this.StateData = result["data"].StateData;
            this.CityData = result["data"].CityData;
            this.PincodeData = result["data"].pincodeData;

            this.FetchCompanyWiseDocument(result["data"].InsurerId);
            this.PincodeData = result["data"].pincodeData;

            this.GarageForm.patchValue(result["data"]);
            // this.selectedCompanyType = result["data"].company;
          }

          //   //   //   console.log(this.selectedCompanyType);

          // this.CompanyData = result["data"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  ManagerAcceptQuote(Id) {
    const formData = new FormData();
    formData.append("id", Id);
    this.api.IsLoading();
    this.api.HttpPostType("Garage/AcceptGarageLead", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.ResetDT();
          // this.CompanyData = result["data"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  downloadFile(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  getdata(id) {
    const formData = new FormData();
    formData.append("garageId", id);
    this.api.IsLoading();
    this.api.HttpPostType("Garage/FetchGarageData", formData).then(
      (result: any) => {
        this.dataArra = result;
        this.api.HideLoading();
      },
      (err) => {
        this.dataArra = err["error"]["text"];

        this.api.HideLoading();
      }
    );
  }

  GetAgentData() {
    const formData = new FormData();
    this.api.IsLoading();
    this.api.HttpPostType("Garage/FetchAgentData", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.AgentData = result["data"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  GetInsurer() {
    const formData = new FormData();
    this.api.IsLoading();
    this.api.HttpPostType("Garage/FetchInsurerData", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.CompanyData = result["data"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  FetchEmployeeData() {
    const formData = new FormData();
    this.api.IsLoading();
    this.api.HttpPostType("Garage/FetchEmployeeData", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.EmployeeData = result["data"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  onFileChangeLocal(event: any, index: number) {
    //   //   //   console.log(event, index);

    this.fileErrorLocal = "";

    index = Number(index);

    if (!this.fileStorage) {
      this.fileStorage = {};
    }

    if (!this.fileStorage[index]) {
      this.fileStorage[index] = [];
    }

    this.fileStorage[index] = [];

    if (event.target.files.length > 0) {
      const files = Array.from(event.target.files) as File[];
      const validFiles = [];
      for (let file of files) {
        const extension = file.name.split(".").pop().toLowerCase();

        if (!this.validImageExtensions.includes(extension)) {
          this.fileErrorLocal = `Invalid file type for ${file.name}. Please upload an image with a valid extension (jpg, jpeg, png, gif).`;
          return;
        }
        validFiles.push(file);
      }

      if (validFiles.length > 5) {
        this.fileErrorLocal = "You can only upload up to 5 images at a time.";
        this.api.Toast(
          "Warning",
          "You can only upload up to 5 images at a time."
        );
        this.file_Error = true;
        return;
      } else {
        this.file_Error = false;
      }
      this.fileStorage[index] = validFiles;
    }
  }

  // onFileChangeLocalUpdate(event: any, index: number) {
  ////   //   //   console.log(event, index);

  //   this.fileErrorLocal = "";

  //   index = Number(index);

  //   if (!this.fileStorage) {
  //     this.fileStorage = {};
  //   }

  //   if (!this.fileStorage[index]) {
  //     this.fileStorage[index] = [];
  //   }

  //   this.fileStorage[index] = [];

  //   if (event.target.files.length > 0) {
  //     const files = Array.from(event.target.files) as File[];
  //     const validFiles = [];

  //     for (let file of files) {
  //       const extension = file.name.split(".").pop().toLowerCase();

  //       if (!this.validImageExtensions.includes(extension)) {
  //         this.fileErrorLocal = `Invalid file type for ${file.name}. Please upload an image with a valid extension (jpg, jpeg, png, gif).`;
  //         return;
  //       }
  //       validFiles.push(file);
  //     }

  //     this.UpdatedFileValue = validFiles;

  //     this.updateDocument(this.UpdatedFileValue, index);
  //   }
  // }

  UploadDocs(event, Id) {
    this.UpdatedFileValue = "";
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      //   //   //   console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      //   //   //   console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        //   //   //   console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);
        // alert(Total_Size);
        //   //   //   console.log(Total_Size + " kb");

        this.UpdatedFileValue = this.selectedFiles;
        this.updateDocument(Id);
      } else {
        //   //   //   console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }

  updateDocument(Id) {
    if (confirm("Are you sure that you want Update Document?") === true) {
      const formData = new FormData();
      formData.append("file", this.UpdatedFileValue);
      formData.append("id", Id);
      formData.append("insurer_id", this.InsurerId);
      formData.append("garage_id", this.GarageId);
      this.api.IsLoading();
      this.api.HttpPostType("Garage/UpdateDocument", formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.DocumentAr = result["document"];

            this.vendorData.Document = result["document"];
          } else {
            this.api.Toast("Warning", result["msg"]);
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
  }

  clearCompanyFileDocument() {
    while (this.CompanyFileDocument.length !== 0) {
      this.CompanyFileDocument.removeAt(0);
    }
  }

  get CompanyFileDocument() {
    return this.GarageForm.get("CompanyFileDocument") as FormArray;
  }
  FetchCompanyWiseDocument(item) {
    const formData = new FormData();
    formData.append("company_id", item);
    this.clearCompanyFileDocument();
    this.api.IsLoading();
    this.api.HttpPostType("Garage/FetchCompanyWiseDocument", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.FetchCompanyWiseDocuments = result["data"];

          //   //   //   console.log(result["data"].length);
          for (let i = 0; i < result["data"].length; i++) {
            this.CompanyFileDocument.push(this.createArray());
            //   //   //   console.log(i);
          }
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  GetStateData() {
    const formData = new FormData();
    this.api.IsLoading();
    this.api.HttpPostType("Garage/FetchStateData", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.StateData = result["data"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      const TablesNumber = `${dtInstance.table().node().id}`;

      var fields = this.Search.value;
      var query = {
        User_Id: this.api.GetUserData("Id"),
        User_Type: this.api.GetUserType(),
        SearchValue: fields["SearchVal"],
        QuoteType: fields["QuoteType"],
      };
      // console.log(query);

      if (TablesNumber == "example2") {
        // Apply search term to the DataTables search function
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
      } else if (TablesNumber == "kt_datatable") {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
      }
    });
  }

  //CLEAR SEARCH
  ClearSearch() {
    var fields = this.Search.reset();
    this.dataAr = [];
    this.ResetDT();
    // this.Is_Export = 0;
  }

  //RELAOD
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //RESET DT
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  toggleStatus(Id: any, status, type): void {
    // Toggle the status between 0 and 1

    const newStatus = status == 1 ? 0 : 1;

    // Prepare form data to send to the backend
    let formData = new FormData();
    formData.append("id", String(Id));
    formData.append("status", String(newStatus));
    formData.append("currentview", this.currentView);
    formData.append("type", type);

    this.api.IsLoading(); // Show loading indicator

    // Send the request to update the status
    this.api.HttpPostType(`Garage/updateStatus`, formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.api.Toast("Success", result["msg"]);
          this.ResetDT();
        } else {
          this.api.Toast("Warning", result["msg"]);
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
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/Garage/FetchData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Url=" +
                this.currentView
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((resp: any) => {
            var resp = JSON.parse(this.api.decryptText(resp.response));
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;
            that.dataAr = resp.data;

         
          
            // console.log(that.dataAr);
            // if (that.dataAr.length > 0) {
            // }
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  FormMasterSubmit() {
    this.SubmitFormMaster = true;

    if (this.FormMaster.invalid) {
      return;
    } else {
      var fields = this.FormMaster.value;

      const formData = new FormData();
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      // formData.append("Effective_Date", fields["Effective_Date"]);

      formData.append("ModelType", this.ModelType);
      formData.append("ModelAction", this.ModelAction);
      formData.append("ModelId", this.ModelId);
      formData.append("currentView", this.currentView);

      formData.append("form", JSON.stringify(fields));

      this.api.IsLoading();
      this.api.HttpPostType("Garage/ActionData", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);

            let filterContainer = document.getElementById("close1");

            if (filterContainer) {
              document.getElementById("close1").click();
            }

            this.ResetDT();
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

  FormAddVisitSubmit() {
    this.SubmitFormAddVisit = true;

    //   //   //   console.log(this.FormAddVisit);

    if (this.FormAddVisit.invalid) {
      return;
    } else {
      var fields = this.FormAddVisit.value;

      const formData = new FormData();
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());
      // formData.append("Effective_Date", fields["Effective_Date"]);
      formData.append("ModelType", this.ModelType);
      formData.append("ModelAction", this.ModelAction);
      formData.append("ModelId", this.ModelId);
      formData.append("currentView", "Add Visit");
      formData.append("form", JSON.stringify(fields));

      this.api.IsLoading();
      this.api.HttpPostType("Garage/ActionData", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);

            let filterContainer = document.getElementById(
              "closeFormModelAddVisits"
            );

            if (filterContainer) {
              document.getElementById("closeFormModelAddVisits").click();
            }
            this.SearchData();
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
  DocumetSetView(DocumentAr: any, GarageId, InsurerId, vendorData) {
    this.DocumentAr = DocumentAr;
    this.InsurerId = InsurerId;
    this.GarageId = GarageId;
    this.vendorData = vendorData;
    //   //   //   console.log(this.DocumentAr);
  }

  GarageFormSubmit() {
    this.SubmitFormGarage = true;
    if (this.GarageForm.invalid) {
      return;
    } else {
      var fields = this.GarageForm.value;

      const formData = new FormData();
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());
      // formData.append("Effective_Date", fields["Effective_Date"]);
      formData.append("ModelType", this.ModelType);
      formData.append("ModelAction", this.ModelAction);
      formData.append("GarageId", this.ModelId);
      formData.append("currentView", this.currentView);
      formData.append("form", JSON.stringify(fields));
      // formData.append("fileStorage", JSON.stringify(this.fileStorage));

      for (const id in this.fileStorage) {
        this.fileStorage[id].forEach((file, index) => {
          formData.append(`files[${id}]`, file, file.name);
        });
      }

      this.api.IsLoading();
      this.api.HttpPostType("Garage/ActionData", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            let filterContainer = document.getElementById(
              "closeFormModelRequest"
            );

            if (filterContainer) {
              document.getElementById("closeFormModelRequest").click();
            }
            this.SearchData();
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

  SetGarageId(Id, actionStatus) {
    this.GarageId = Id;
    this.UpdateStatus.reset();

    if (actionStatus == 1) {
      this.selectedRequestType = [{ Id: 1, Name: "Pending" }];
    }
    if (actionStatus == 2) {
      this.RequestStatusData = [
        { Id: 2, Name: "In Progress" },
        { Id: 3, Name: "Rejected" },
        { Id: 4, Name: "Completed" },
      ];

      this.selectedRequestType = [{ Id: 2, Name: "In Progress" }];
    }

    //   //   //   console.log(actionStatus);
    //   //   //   console.log(Id);
  }

  UpdateGarageRequest() {
    this.SubmitUpdateGarageRequest = true;
    if (this.UpdateStatus.invalid) {
      return;
    } else {
      var fields = this.UpdateStatus.value;

      const formData = new FormData();
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());
      // formData.append("Effective_Date", fields["Effective_Date"]);
      formData.append("Garage_Id", this.GarageId);
      formData.append("currentView", this.currentView);
      formData.append("form", JSON.stringify(fields));

      this.api.IsLoading();
      this.api.HttpPostType("Garage/UpdateStatusGarage", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            let filterContainer = document.getElementById(
              "closeUpdateRequestStatus"
            );

            if (filterContainer) {
              document.getElementById("closeUpdateRequestStatus").click();
            }

            this.ResetDT();
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

  GetCItyFilter(e) {
    var fields = this.ItemLOBSelection;
    const formData = new FormData();
    formData.append("StateId", this.ItemLOBSelection);

    this.api.IsLoading();
    this.api.HttpPostType("Garage/FetchCityData", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.CityData = result["data"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  GetPincodeData(e) {
    var fields = this.ItemLOBSelection;
    const formData = new FormData();
    formData.append("CityId", this.ItemLOBSelection);

    this.api.IsLoading();
    this.api.HttpPostType("Garage/FetchPincodeData", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.PincodeData = result["data"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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
  onItemSelect1(item: any, Type: any) {
    if (Type == "State") {
      this.ItemLOBSelection = item.Id;
      // console.log(this.ItemLOBSelection);
      this.GetCItyFilter("OneByOneSelect");
    }
    if (Type == "City") {
      this.ItemLOBSelection = item.Id;
      // console.log(this.ItemLOBSelection);
      this.GetPincodeData("OneByOneSelect");
    }

    if (Type == "Visitor Type") {
      this.SelectedVisitorType = item.Id;
    }

    if (Type == "CompanyGarage") {
      this.SelectedVisitorType = item.Id;
      this.FetchCompanyWiseDocument(item.Id);
    }
  }

  onItemDeSelect1(item: any, Type) {
    if (Type == "State") {
      var index = (this.ItemLOBSelection = item.Id);
      if (index > -1) {
        this.ItemLOBSelection.splice(index, 1);
      }
      this.GetCItyFilter("OneByOneDeSelect");
    }
    if (Type == "City") {
      var index = (this.ItemLOBSelection = item.Id);
      if (index > -1) {
        this.ItemLOBSelection.splice(index, 1);
      }
      this.ItemLOBSelection = item.Id;
      // console.log(this.ItemLOBSelection);
      this.GetPincodeData("OneByOneDeSelect");
    }

    if (Type == "CompanyGarage") {
      this.clearCompanyFileDocument();
    }

    if (Type == "Visitor Type") {
      this.SelectedVisitorType = item.Id;
    }
  }
}
