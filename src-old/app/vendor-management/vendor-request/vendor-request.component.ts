import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, UrlSegment } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/providers/api.service";
import { DataTableDirective } from "angular-datatables";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

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
  selector: "app-vendor-request",
  templateUrl: "./vendor-request.component.html",
  styleUrls: ["./vendor-request.component.css"],
})
export class VendorRequestComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dropdownMultiSelectSettingsType: any = {};
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

  vendorRequestEditAgreementForm: FormGroup;
  currentVendorAgreement: any;

  Search: FormGroup;

  // dropdownMultiSelectSettingsType: {
  //   singleSelection: boolean;
  //   idField: string;
  //   textField: string;
  //   itemsShowLimit: number;
  //   enableCheckAll: boolean;
  //   allowSearchFilter: boolean;
  // };

  dropdownVendorMultiSelectSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownVendorServiceMultiSelectSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  currentView: string = "";
  modalAction: "add" | "edit" = "add";
  currentVendor: any = {}; // Store vendor being edited[[]]
  vendors: any = {};

  vendorFormData: any = {};

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

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private http: HttpClient,
    private FormBuilder: FormBuilder
  ) {
    this.Search = this.FormBuilder.group({
      SearchVal: [""],
    });

    this.dropdownMultiSelectSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownVendorMultiSelectSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownVendorServiceMultiSelectSettingsType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.vendorRequestForm = this.FormBuilder.group({
      requestType: ["", Validators.required],
      vendorType: ["", Validators.required],
      vendorName: ["", Validators.required],
      city: [""],
      vendorAddress: [""],
      logo: [""],
      gst_no: [""],
      pan_no: [""],
      director_name: [""],
      vendorServices: [[], Validators.required],
    });

    // Initialize form
    this.vendorRequestAgreementForm = this.FormBuilder.group({
      req_id: [""],
      vendorType: ["", Validators.required], // Added validation
      vendorServices: [[], Validators.required],
      spokespersonName: ["", Validators.required],
      spokespersonEmail: ["", [Validators.required, Validators.email]],
      spokespersonMobile: [
        "",
        [Validators.required, Validators.pattern("^[0-9]{10}$")],
      ],
      squareSpokesperson: ["", Validators.required],
      sealSignedBy: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      sealSignedDate: ["", Validators.required],
      renewableReminder: ["", Validators.required],
      renewableReminderTo: [""],
    });

    // Listen for changes in renewableReminder
    this.vendorRequestAgreementForm
      .get("renewableReminder")
      .valueChanges.subscribe((value) => {
        if (value !== null && value !== undefined) {
          this.showRenewableReminderTo = value === "1"; // Show only if "Yes" (1) is selected
        }
      });

    this.vendorRequestEditAgreementForm = this.FormBuilder.group({
      req_id: [""],
      vendorType: [""],
      vendorServices: [[]],
      spokespersonName: [""],
      spokespersonEmail: ["", [Validators.required, Validators.email]],
      spokespersonMobile: [
        "",
        [Validators.required, Validators.pattern("^[0-9]{10}$")],
      ],
      squareSpokesperson: [""],
      sealSignedBy: [""],
      startDate: [""],
      endDate: [""],
      sealSignedDate: [""],
      renewableReminder: [""],
      renewableReminderTo: [""],
      UpdateId: [""],
    });

    this.vendorRequestEditAgreementForm
      .get("renewableReminder")
      .valueChanges.subscribe((value) => {
        if (value !== null && value !== undefined) {
          this.showRenewableReminderTo = value === "1"; // Show only if "Yes" (1) is selected
        }
      });

    this.VendorTypeForm = this.FormBuilder.group({
      Name: ["", Validators.required],
    });

    //   //   console.log("vendorRequestAgreementForm :", this.vendorRequestForm);
  }

  onFileSelect(event: any) {
    this.fileError = null;
    const file = event.target.files[0];

    const extension = file.name.split(".").pop().toLowerCase();
    if (!this.validImageExtensions.includes(extension)) {
      this.fileError = `Invalid file type for ${file.name}. Please upload an image with a valid extension (jpg, jpeg, png, gif).`;
      return;
    }
    this.FileNames = file;
  }

  onAgreementFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.vendorFormData.uploadAgreement = event.target.files[0];
    }
  }

  ngOnInit(): void {
    this.route.url.subscribe((segments: UrlSegment[]) => {
      const path = segments.length > 0 ? segments[0].path : "";

      switch (path) {
        case "vendor-type-view":
          this.currentView = "vendor-type";
          this.Get();
          break;

        case "vendor-service-view":
          this.currentView = "vendor-service";
          this.Get();
          break;

        case "vendor-request":
          this.currentView = "vendor-request";
          this.vendors = this.GetReqData("kt_datatable");

          this.loadVendorTypes("", 0);
          this.loadVendorServices();
          this.fetchCities("", 0);
          this.loadEmployees("", 0);
          // this.fetchCities('');

          break;

        default:
          this.currentView = "";
      }
    });
  }

  loadVendorTypes(e, Type): void {
    let searchQuery = "";

    if (Type === 1) {
      searchQuery = e.target.value; // Get the input value when user types
    }

    let formData = new FormData();
    formData.append("val", searchQuery); // Pass search query

    this.api.IsLoading(); // Show loading indicator

    // API call to fetch vendor types based on user input
    this.api.HttpPostType("vendor/get_vendor_types", formData).then(
      (resp: any) => {
        this.api.HideLoading(); // Hide loading indicator

        if (resp && resp.data && resp.data.length > 0) {
          this.vendorTypes = resp.data; // Store vendor types
          //   //   //   console.log('Fetched Vendor Types:', this.vendorTypes);
        } else {
          // console.warn('No vendor types found');
        }
      },
      (err) => {
        this.api.HideLoading();
        console.error("Error fetching vendor types:", err);
      }
    );
  }

  loadEmployees(e, Type): void {
    let searchQuery = "";

    if (Type === 1) {
      searchQuery = e.target.value; // Get the input value when user types
    }

    let formData = new FormData();
    formData.append("val", searchQuery); // Pass search query

    this.api.IsLoading(); // Show loading indicator

    // API call to fetch vendor types based on user input
    this.api.HttpPostType("vendor/get_employees", formData).then(
      (resp: any) => {
        this.api.HideLoading(); // Hide loading indicator

        if (resp && resp.data && resp.data.length > 0) {
          this.Employee = resp.data; // Store vendor types
          //   //   //   console.log('Fetched Vendor Types:', this.Employee);
        } else {
          // console.warn('No vendor types found');
        }
      },
      (err) => {
        this.api.HideLoading();
        console.error("Error fetching vendor types:", err);
      }
    );
  }

  fetchCities(e, Type): void {
    var Quote = "";

    if (Type == 1) {
      Quote = e.target.value;
    }

    let formData = new FormData();
    formData.append("val", Quote);
    this.api.IsLoading(); // Show loading indicator (assuming you're using your custom API service)

    // Adjust the API endpoint URL to fetch the cities
    this.api.HttpPostType("vendor/get_cities", formData).then(
      (resp: any) => {
        this.api.HideLoading(); // Hide loading indicator after the response

        if (resp && resp.data && resp.data.length > 0) {
          this.cities = resp.data; // Store cities in the `cities` variable
          //   //   //   console.log('Fetched Cities:', this.cities);
        } else {
          // console.warn('No cities found');
        }

        // Show any success or failure message
      },
      (err) => {
        this.api.HideLoading();
        console.error("Error fetching cities:", err); // Handle any errors
      }
    );
  }

  //   fetchCities(e, Type): void {

  //       var Quote = "";

  //     let formData = new FormData();
  //     formData.append('val',  e.target.value);
  //     this.api.IsLoading();

  //     this.api.HttpPostType('vendor/get_cities', formData).then(
  //       (resp: any) => {
  //         this.api.HideLoading();

  //         if (resp && resp.data && resp.data.length > 0) {
  //           this.cities = resp.data;
  //        //   //   //   console.log('Fetched Cities:', this.cities);
  //         } else {
  //           // console.warn('No cities found');
  //         }

  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //         console.error('Error fetching cities:', err);
  //       }
  //     );
  // }

  loadVendorServices(): void {
    let formData = new FormData(); // If you need to append anything like with `getDatabyID`

    this.api.IsLoading(); // Show loading indicator (assuming you're using your custom API service)

    // Adjust this API endpoint for fetching vendor types, replacing it with the correct URL for your case
    this.api.HttpPostType("vendor/get_vendor_services", formData).then(
      (resp: any) => {
        //   //   //   console.log('Vendor Types Response:', resp);
        this.api.HideLoading(); // Hide loading indicator after the response

        if (resp && resp.data && resp.data.length > 0) {
          this.vendorServices = resp.data; // Assuming you're storing vendor types in `vendorTypes`
          //   //   //   console.log('Fetched Vendor Services:', this.vendorServices);
        } else {
          // console.warn('No vendor types found');
        }

        // // alert(resp.message);
      },
      (err) => {
        this.api.HideLoading();
        console.error("Error fetching vendor types:", err); // Handle any errors
      }
    );
  }

  // SearchData(event: any) {
  //   this.datatableElement.dtInstance.then((dtInstance: any) => {
  //     const TablesNumber = `${dtInstance.table().node().id}`;
  //     const searchTerm = event.target.value.trim(); // Get the search term from the input

  //     if (TablesNumber == "example2") {
  //       // Apply search term to the DataTables search function
  //       dtInstance.search(searchTerm).draw();  // This will trigger the server-side filtering
  //     } else if (TablesNumber == "kt_datatable") {
  //       dtInstance.search(searchTerm).draw();
  //     }
  //   });
  // }

  // SearchData() {
  //   const searchTerm = this.Search.value;
  ////   //   //   console.log(searchTerm);
  //   this.datatableElement.dtInstance.then((dtInstance: any) => {
  //     const TablesNumber = `${dtInstance.table().node().id}`;
  //       dtInstance.search(searchTerm).draw();

  //   });
  // }

  // SearchData() {
  //   const fields = this.Search.value;
  ////   //   //   console.log(fields);
  //   this.dataAr = [];
  //   this.datatableElement.dtInstance.then((dtInstance: any) => {

  //       dtInstance.column(0).search(JSON.stringify(fields)).draw();
  //   });
  // }

  SearchData(event: any) {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      const TablesNumber = `${dtInstance.table().node().id}`;
      const searchTerm = event.target.value.trim(); // Get the search term from the input

      if (TablesNumber == "example2") {
        // Apply search term to the DataTables search function
        dtInstance.search(searchTerm).draw(); // This will trigger the server-side filtering
      } else if (TablesNumber == "kt_datatable") {
        dtInstance.search(searchTerm).draw();
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
        const type = this.currentView === "vendor-type" ? 1 : 2; // Set the type here based on your view

        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/vendor/get_vendors_by_type?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Url=" +
                type
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

  getDatabyID(vendorId: number) {
    let formData = new FormData();
    formData.append("id", String(vendorId));

    this.api.IsLoading();
    this.api.HttpPostType(`vendor/get_vendor_by_id`, formData).then(
      (resp: any) => {
        //   //   //   console.log('Response:', resp);
        this.api.HideLoading();
        if (resp["status"] == true) {
          if (resp && resp.data && resp.data.length > 0) {
            this.currentVendor = resp.data[0].name; // Extract the first vendor objec
            //   //   //   console.log(this.currentVendor);
            this.VendorTypeForm.get("Name").setValue(this.currentVendor);
            //   //   //   console.log('Fetched Vendor:', this.currentVendor);
          }
        } else {
          this.api.ToastBeforeLogin("Warning", resp["message"]);
          this.api.HideLoading();
        }
        // // alert(resp.message);
      },
      (err) => {
        this.api.HideLoading();
        console.error("Error fetching vendor:", err);
      }
    );
  }

  getReqDatabyID(vendorId: number) {
    let formData = new FormData();

    this.UpdateId = vendorId;
    const FileName = this.vendorRequestForm.get("logo");
    if (this.UpdateId != "") {
      FileName.setValidators(null);
    }

    FileName.updateValueAndValidity();

    formData.append("id", String(vendorId));

    this.api.IsLoading();
    this.api.HttpPostType("vendor/get_req_by_id", formData).then(
      (resp: any) => {
        this.api.HideLoading();
        //   //   //   console.log(resp.data);
        //   //   //   console.log(resp.data.length);
        if (resp.data) {
          this.vendor_req_data = resp.data; // Extract the first vendor object
          //   //   //   console.log(this.vendor_req_data.name);

          this.vendorRequestForm.patchValue({
            requestType: this.vendor_req_data.vendor_req[0].Id,
            vendorName: this.vendor_req_data.name,
            // city : this.vendor_req_data.city[0].Name,
            vendorAddress: this.vendor_req_data.address,
            gst_no: this.vendor_req_data.gst_no,
            pan_no: this.vendor_req_data.pan_no,
            director_name: this.vendor_req_data.director_name,
            vendorServices: this.vendor_req_data.services,
            vendorType: this.vendor_req_data.vendor_type,
            city: this.vendor_req_data.city,
          });
        } else {
          // console.warn("No vendor data found");
        }

        // // alert(resp.message);
      },
      (err) => {
        this.api.HideLoading();
        console.error("Error fetching request:", err);
      }
    );
  }

  getReqAgreementDatabyID(vendor_Id: number) {
    let formData = new FormData();
    formData.append("id", String(vendor_Id));

    this.api.IsLoading();
    this.api.HttpPostType(`vendor/get_req_agreement_by_id`, formData).then(
      (resp: any) => {
        //   //   //   console.log('Response:', resp);
        this.api.HideLoading();

        if (resp.data) {
          this.currentVendorAgreement = resp.data; // Extract the first vendor object

          //   //   //   console.log(this.currentVendorAgreement);

          // this.selectedServices = this.currentVendorAgreement.vendor_service.split(",");

          this.vendorRequestEditAgreementForm.patchValue({
            req_id: this.currentVendorAgreement.vendor_req_id,
            vendorType: this.currentVendorAgreement.vendor_req,
            vendorServices: this.currentVendorAgreement.vendor_service, // Ensure it's an array
            spokespersonName: this.currentVendorAgreement.spokesperson_name,
            spokespersonEmail: this.currentVendorAgreement.spokesperson_email,
            spokespersonMobile: this.currentVendorAgreement.spokesperson_mobile,
            squareSpokesperson: this.currentVendorAgreement.square_spokesperson,
            sealSignedBy: this.currentVendorAgreement.seal_signed_by,
            startDate: this.currentVendorAgreement.start_date.split(" ")[0],
            endDate: this.currentVendorAgreement.end_date.split(" ")[0],
            sealSignedDate:
              this.currentVendorAgreement.seal_signed_date.split(" ")[0],
            renewableReminder: this.currentVendorAgreement.renewable_reminder,
            renewableReminderTo:
              this.currentVendorAgreement.renewable_reminder_to,
            UpdateId: this.currentVendorAgreement.id,
          });
        } else {
          // console.warn("No vendor data found");
        }
      },
      (err) => {
        this.api.HideLoading();
        console.error("Error fetching request:", err);
      }
    );
  }

  openAddModal() {
    this.modalAction = "add";
    this.VendorTypeForm.get("Name").setValue("");
    // this.currentVendor = {};
  }
  // Open modal in "Edit" mode and pass the vendor to edit
  openEditModal(vendorId: number) {
    this.modalAction = "edit";
    this.getDatabyID(vendorId);
    this.vendorId = vendorId;
    //   //   //   console.log('Editing Vendor:', vendorId);
  }

  openEditReqModal(vendorId: number) {
    this.modalAction = "edit";
    this.getReqDatabyID(vendorId);
    this.vendorId = vendorId;
  }

  openEditReqAgreementModal(vendor_Id: number) {
    // var Id = this.Vendor_Id
    this.Vendor_Id = vendor_Id;
    // // alert(vendor_Id);

    this.getReqAgreementDatabyID(vendor_Id);
    setTimeout(() => {
      ($("#vendorReqAgreementEditModal") as any).modal("show");
    }, 500);
  }

  openAgreementReqModal(Req_Id: number) {
    this.Req_Id = Req_Id;
    // // alert(this.Req_Id);
    this.GetReqAgreementData(this.Req_Id);

    const reqIdInput = document.querySelector(
      'input[formControlName="req_id"]'
    );
    if (reqIdInput) {
      reqIdInput.setAttribute("value", this.Req_Id.toString());
    }
  }

  get formcontrolsVendorTypeForm() {
    return this.VendorTypeForm.controls;
  }
  get formcontrolsVendorAgreementForm() {
    return this.vendorRequestAgreementForm.controls;
  }
  get formcontrolsVendorRequestForm() {
    return this.vendorRequestForm.controls;
  }

  get formcontrolsVendorRequestEditAgreementForm() {
    return this.vendorRequestEditAgreementForm.controls;
  }
  // Handle form submission for adding or editing a vendor
  submitForm() {
    const typeValue = this.currentView === "vendor-type" ? 1 : 2;

    let formData = new FormData();
    var fields = this.VendorTypeForm.value;

    this.SubmitVendorType = true;

    if (this.VendorTypeForm.invalid) {
      return;
    } else {
      if (this.modalAction === "add") {
        const newVendor = {
          name: this.currentVendor.name,
          type: typeValue,
          status: 1,
        };

        const formData = new FormData();

        formData.append("name", fields["Name"]);
        formData.append("type", String(newVendor.type));
        formData.append("status", String(newVendor.status));

        this.api.IsLoading();
        this.api.HttpPostType("vendor/store", formData).then(
          (resp: any) => {
            if (!resp.status) {
              this.api.Toast("Warning", resp.msg);
              this.api.HideLoading();
            } else {
              this.api.Toast("Success", resp.msg);
              this.Reload();
              this.Get();
              this.api.HideLoading();

              let filterContainer = document.getElementById("close1");

              if (filterContainer) {
                document.getElementById("close1").click();
              } else {
              }
            }
          },
          (err) => {
            this.api.HideLoading();
            console.error("Error adding vendor:", err);
          }
        );
      } else if (this.modalAction === "edit") {
        if (!this.vendorId || !this.vendorId) {
          console.error("Error: No vendor selected for update!");
          return;
        }

        //   //   //   console.log('Current Vendor:', this.currentVendor); // Debugging

        const updatedVendor = {
          id: this.vendorId, // Ensure this is correct
          name: this.currentVendor.name,
          type: typeValue,
        };

        const formData = new FormData();
        formData.append("id", this.vendorId);
        formData.append("name", fields["Name"]);
        formData.append("type", String(updatedVendor.type));

        //   //   //   console.log('Final API URL:', `vendor/update_vendor/${updatedVendor.id}`);
        this.api.IsLoading();
        // API call to update the vendor
        this.api.HttpPostType(`vendor/update_vendor`, formData).then(
          (resp: any) => {
            if (!resp.status) {
              this.api.Toast("Warning", resp.msg);
              this.api.HideLoading();
            } else {
              this.api.Toast("Success", resp.msg);
              this.Reload();
              this.Get();
              this.api.HideLoading();

              let filterContainer = document.getElementById("close1");

              if (filterContainer) {
                document.getElementById("close1").click();
              }
            }
          },
          (err) => {
            this.api.HideLoading();
            console.error("Error updating vendor:", err);
            // alert('Failed to update vendor. Check console for errors.');
          }
        );
      }
    }
  }

  // Submit Form
  submitVendorReqForm() {
    //   //   console.log("Submit function called!");

    this.SubmitRequestType = true;

    if (this.vendorRequestForm.invalid) {
      //   //   //   console.log('Form is invalid:', this.vendorRequestForm);
      // // alert('Form is invalid! Please fill in all required fields.');
      return;
    } else {
      const Fields = this.vendorRequestForm.value;
      let formData = new FormData();
      formData.append("req_type", Fields["requestType"]);
      formData.append("name", Fields["vendorName"]);
      formData.append("type", JSON.stringify(Fields["vendorType"]));
      formData.append("city", JSON.stringify(Fields["city"]));
      formData.append("address", Fields["vendorAddress"]);
      formData.append("gst_no", Fields["gst_no"]);
      formData.append("pan_no", Fields["pan_no"]);
      formData.append("director_name", Fields["director_name"]);
      formData.append("status", "1");
      formData.append("services", JSON.stringify(Fields["vendorServices"]));

      if (this.FileNames) {
        formData.append("logo", this.FileNames);
      }

      this.api.IsLoading();

      if (this.modalAction === "add") {
        //   //   //   console.log('Adding new vendor request...');
        this.api.HttpPostType("vendor/req_store", formData).then(
          (resp: any) => {
            this.api.HideLoading();
            if (!resp.status) {
              this.api.Toast("Warning", resp.msg);
            } else {
              this.api.Toast("Success", resp.msg);

              this.vendorRequestForm.reset();

              this.Reload();
              this.Get();

              // Close modal if exists
              let filterContainer = document.getElementById("close1");
              if (filterContainer) {
                document.getElementById("close2").click();
              }
            }
          },
          (err) => {
            this.api.HideLoading();
            console.error("Error adding vendor:", err);
          }
        );
      } else if (this.modalAction === "edit") {
        // 🟡 **EDIT VENDOR REQUEST**
        //   //   //   console.log('Updating vendor request...');

        if (!this.vendorId) {
          console.error("Error: No vendor selected for update!");
          return;
        }

        formData.append("UpdateId", this.vendorId);

        this.api.HttpPostType(`vendor/req_store`, formData).then(
          (resp: any) => {
            this.api.HideLoading();
            if (!resp.status) {
              this.api.Toast("Warning", resp.msg);
            } else {
              this.api.Toast("Success", resp.msg);
              this.Reload();
              this.Get();

              // Close modal if exists
              let filterContainer = document.getElementById("close1");
              if (filterContainer) {
                document.getElementById("close2").click();
              }
            }
          },
          (err) => {
            this.api.HideLoading();
            console.error("Error updating vendor:", err);
            // alert('Failed to update vendor request. Check console for errors.');
          }
        );
      }
    }
  }

  onAgreementSubmit() {
    // // alert('dfgdfd');
    //   //   //   console.log('Submit function called!');
    this.SubmitAgreementType = true;
    if (this.vendorRequestAgreementForm.invalid) {
      //   //   //   console.log('Form is invalid:', this.vendorRequestAgreementForm);
      // alert('Form is invalid! Please fill in all required fields.');
      return;
    } else {
      const reqIdControl = this.vendorRequestAgreementForm.get("req_id");
      if (reqIdControl && !reqIdControl.value) {
        reqIdControl.setValue(this.Req_Id);
      }

      let formData = new FormData();

      const Fields = this.vendorRequestAgreementForm.value;
      formData.append("req_id", Fields["req_id"]);

      formData.append("vendor_type", JSON.stringify(Fields["vendorType"]));
      formData.append("services", JSON.stringify(Fields["vendorServices"]));

      formData.append("spokesperson_name", Fields["spokespersonName"]);
      formData.append("spokesperson_email", Fields["spokespersonEmail"]);
      formData.append("spokesperson_mobile", Fields["spokespersonMobile"]);
      formData.append(
        "square_spokesperson",
        JSON.stringify(Fields["squareSpokesperson"])
      );
      formData.append("seal_signed_by", JSON.stringify(Fields["sealSignedBy"]));
      formData.append("start_date", Fields["startDate"]);
      formData.append("end_date", Fields["endDate"]);
      formData.append("seal_signed_date", Fields["sealSignedDate"]);
      formData.append("renewable_reminder", Fields["renewableReminder"]);
      formData.append("renewable_reminder_to", Fields["renewableReminderTo"]);
      formData.append("upload_agreement", this.FileNames);
      formData.append("status", "1");

      // Show loading indicator
      this.api.IsLoading();

      // Send POST request to the API
      this.api.HttpPostType("vendor/req_agreement_store", formData).then(
        (resp: any) => {
          if (!resp.status) {
            this.api.Toast("Warning", resp.msg);
            this.api.HideLoading();
          } else {
            this.api.Toast("Success", resp.msg);
            this.Reload();
            this.api.HideLoading();
            // Close modal if exists
            let filterContainer = document.getElementById("close1");
            if (filterContainer) {
              document.getElementById("close2").click();
            }
          }
        },
        (err) => {
          this.api.HideLoading();
          console.error("Error submitting vendor request:", err);
          // alert('An error occurred. Please try again.');
        }
      );
    }
  }

  onAgreementUpdate() {
    // const vendor_Id = this.Vendor_Id;

    //   //   console.log("Submit function called!");
    this.UpdateAgreementType = true;
    if (this.vendorRequestEditAgreementForm.invalid) {
      //   //   //   console.log('Form is invalid:', this.vendorRequestEditAgreementForm);
      // alert('Form is invalid! Please fill in all required fields.');
      return;
    } else {
      let formData = new FormData();

      const Fields = this.vendorRequestEditAgreementForm.value;
      formData.append("req_id", Fields["req_id"]);

      formData.append("vendor_type", JSON.stringify(Fields["vendorType"]));
      formData.append("services", JSON.stringify(Fields["vendorServices"]));

      formData.append("spokesperson_name", Fields["spokespersonName"]);
      formData.append("spokesperson_email", Fields["spokespersonEmail"]);
      formData.append("spokesperson_mobile", Fields["spokespersonMobile"]);
      formData.append(
        "square_spokesperson",
        JSON.stringify(Fields["squareSpokesperson"])
      );
      formData.append("seal_signed_by", JSON.stringify(Fields["sealSignedBy"]));
      formData.append("start_date", Fields["startDate"]);
      formData.append("end_date", Fields["endDate"]);
      formData.append("seal_signed_date", Fields["sealSignedDate"]);
      formData.append("upload_agreement", this.FileNames);
      formData.append("renewable_reminder", Fields["renewableReminder"]);
      formData.append("renewable_reminder_to", Fields["renewableReminderTo"]);
      formData.append("status", "1");
      formData.append("UpdateId", Fields["UpdateId"]);

      // Show loading indicator
      this.api.IsLoading();

      // Send POST request to the API
      this.api.HttpPostType("vendor/req_agreement_store", formData).then(
        (resp: any) => {
          if (!resp.status) {
            this.api.Toast("Warning", resp.msg);
            this.api.HideLoading();
          } else {
            this.api.Toast("Success", resp.msg);
            this.Reload();
            this.api.HideLoading();
            let filterContainer = document.getElementById("close1");
            if (filterContainer) {
              document.getElementById("close3").click();
            }
          }
        },
        (err) => {
          this.api.HideLoading();
          console.error("Error submitting vendor request:", err);
          // alert('An error occurred. Please try again.');
        }
      );
    }
  }

  ViewDocument(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  // Delete Vendor
  deleteVendor(vendorId: number) {
    if (confirm("Are you sure you want to delete this vendor?")) {
      let formData = new FormData();
      formData.append("id", String(vendorId));

      this.api.IsLoading();
      this.api.HttpPostType(`vendor/delete_vendor`, formData).then(
        (resp: any) => {
          if (!resp.status) {
            this.api.Toast("Warning", resp.msg); // Show warning if backend validation fails
          } else {
            this.api.Toast("Success", resp.msg);
            this.Reload();
            this.api.HideLoading();
          }
          // this.vendors = this.vendors.filter((vendor) => vendor.id !== vendorId);
        },
        (err) => {
          this.api.HideLoading();
          console.error("Error deleting vendor:", err);
        }
      );
    }
  }

  deleteReqVendor(vendorId: number) {
    if (confirm("Are you sure you want to delete this vendor?")) {
      let formData = new FormData();
      formData.append("id", String(vendorId));

      this.api.IsLoading();
      this.api.HttpPostType(`vendor/delete_req/${vendorId}`, formData).then(
        (resp: any) => {
          if (!resp.status) {
            this.api.Toast("Warning", resp.msg);
            this.api.HideLoading();
          } else {
            this.api.Toast("Success", resp.msg);
            this.Reload();
            this.api.HideLoading();
          }
          // this.vendors = this.vendors.filter((vendor) => vendor.id !== vendorId);
        },
        (err) => {
          this.api.HideLoading();
          console.error("Error deleting request:", err);
        }
      );
    }
  }

  deleteReqAgreementVendor(vendorId: number) {
    if (confirm("Are you sure you want to delete this vendor?")) {
      let formData = new FormData();
      formData.append("id", String(vendorId));
      // // alert(vendorId);

      this.api.IsLoading();
      this.api
        .HttpPostType(`vendor/delete_req_agreement/${vendorId}`, formData)
        .then(
          (resp: any) => {
            if (!resp.status) {
              this.api.Toast("Warning", resp.msg);
              this.api.HideLoading();
            } else {
              this.api.Toast("Success", resp.msg);
              this.Reload();
              this.api.HideLoading();
            }

            // this.vendors = this.vendors.filter((vendor) => vendor.id !== vendorId);
          },
          (err) => {
            this.api.HideLoading();
            console.error("Error deleting request:", err);
          }
        );
    }
  }

  toggleStatus(vendor: any): void {
    // Toggle the status between 0 and 1
    const newStatus = vendor.status == 1 ? 0 : 1;

    // Prepare form data to send to the backend
    let formData = new FormData();
    formData.append("id", String(vendor.Id));
    formData.append("status", String(newStatus));

    this.api.IsLoading(); // Show loading indicator

    // Send the request to update the status
    this.api.HttpPostType(`vendor/updateStatus`, formData).then(
      (resp) => {
        //   //   //   console.log('Response:', resp);
        this.api.HideLoading(); // Hide loading indicator

        if (resp) {
          // Update the status locally if the update is successful
          vendor.status = newStatus;
        } else {
          // Handle failure (e.g., show an error message)
          // alert('Failed to update status');
        }
      },
      (err) => {
        this.api.HideLoading(); // Hide loading indicator
        console.error("Error updating status:", err);
        // alert('Error updating status');
      }
    );
  }

  toggleReqStatus(vendor: any): void {
    // Toggle the status between 0 and 1
    const newStatus = vendor.status == 1 ? 0 : 1;

    // Prepare form data to send to the backend
    let formData = new FormData();
    formData.append("id", String(vendor.Id));
    formData.append("status", String(newStatus));

    this.api.IsLoading(); // Show loading indicator

    // Send the request to update the status
    this.api.HttpPostType(`vendor/updateReqStatus/${vendor.Id}`, formData).then(
      (resp) => {
        //   //   //   console.log('Response:', resp);
        this.api.HideLoading(); // Hide loading indicator

        if (resp) {
          // Update the status locally if the update is successful
          vendor.status = newStatus;
        } else {
          // Handle failure (e.g., show an error message)
          // alert('Failed to update status');
        }
      },
      (err) => {
        this.api.HideLoading(); // Hide loading indicator
        console.error("Error updating status:", err);
        // alert('Error updating status');
      }
    );
  }

  toggleReqAgreementStatus(vendorId: number, vendor: any): void {
    // // alert(vendor);
    // Toggle the status between 0 and 1
    const newStatus = vendor.status == 1 ? 0 : 1;

    // Prepare form data to send to the backend
    let formData = new FormData();
    formData.append("id", String(vendorId)); // Use vendorId instead of vendor.Id
    formData.append("status", String(newStatus));

    this.api.IsLoading(); // Show loading indicator

    // Send the request to update the status
    this.api
      .HttpPostType(`vendor/toggleReqAgreementStatus/${vendor.Id}`, formData)
      .then(
        (resp) => {
          //   //   //   console.log('Response:', resp);
          this.api.HideLoading(); // Hide loading indicator

          if (resp) {
            // Update the status locally if the update is successful
            vendor.status = newStatus;
          } else {
            // Handle failure (e.g., show an error message)
            // alert('Failed to update status');
          }
        },
        (err) => {
          this.api.HideLoading(); // Hide loading indicator
          console.error("Error updating status:", err);
          // alert('Error updating status');
        }
      );
  }

  GetReqData(tableId: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    const that = this;

    // Create a new DataTable instance based on the passed `tableId`
    this.otOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<ReqDataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/vendor/get_vendors_req?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType()
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe(
            (res: any) => {
              var resp = JSON.parse(this.api.decryptText(res.response));
              that.dataArr = resp.data;

              if (that.dataArr.length > 0) {
                // Perform any logic if data is received (if needed)
              }

              // Callback to update DataTable with fetched data
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            },
            (error) => {
              console.error("API Error:", error);
            }
          );
      },
    };

    // If you want to apply this `dtOptions` to a specific table dynamically,
    // you can initialize the DataTable instance based on the passed `tableId`
    const tableElement = document.getElementById(tableId);
    if (tableElement) {
      // Initialize DataTable for the specific table
      $(tableElement).DataTable(this.otOptions);
    }
  }

  GetReqAgreementData(tableId: any) {
    let formData = new FormData();
    formData.append("Req_Id", tableId);

    // Show loading indicator
    this.api.IsLoading();

    // Send POST request to the API
    this.api.HttpPostType("vendor/get_req_agreement", formData).then(
      (resp: any) => {
        if (!resp.status) {
          this.api.HideLoading();

          this.agreementDataArr = resp.data;

          // this.api.Toast("Warning", resp.msg);
        } else {
          // this.api.Toast("Success", resp.msg);
          this.Reload();
          this.api.HideLoading();
          this.agreementDataArr = resp.data;
        }
      },
      (err) => {
        this.api.HideLoading();
        console.error("Error submitting vendor request:", err);
        // alert('An error occurred. Please try again.');
      }
    );
  }

  ResetDTNew() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }
}
