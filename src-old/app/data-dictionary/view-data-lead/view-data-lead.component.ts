import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ApiService } from "src/app/providers/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { DataTableDirective } from "angular-datatables";
import { Router } from '@angular/router';


// class ColumnsObj {
//   SrNo: string;
//   Id: any;
//   LobType: any;
//   Name: any;
//   Mobile: any;
//   Email: any;
//   State: any;
//   City: any;
//   Pincode: any;
//   Source: any;
//   Campaign: any;
//   StartDate: any;
//   ExpiryDate: any;
//   Insurer: any;
//   Premium: any;
//   FamilyGroup: any;
//   MotorType: any;
//   RegistrationNo: any;
//   Make: any;
//   Model: any;
//   Variant: any;
//   PrevPolicyInsurer: any;
//   Claim: any;
//   EmployeeName: any;
//   EmployeeID: any;
// }

class ColumnsObj {
  SrNo: string;
  TotalCount: any;
  ActiveCount: any;
  InactiveCount: any;
  UniqueId: any;
  EmployeeName: any;
  EmployeeID: any;
  CreatedAt: any;
  FilePath: any;

}

class BatchDataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}



@Component({
  selector: 'app-view-data-lead',
  templateUrl: './view-data-lead.component.html',
  styleUrls: ['./view-data-lead.component.css']
})


export class ViewDataLeadComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild(DataTableDirective, { static: false }) datatableElement: DataTableDirective;


  // DataLeadForm: FormGroup;
  bulkUploadForm: FormGroup;
  selectedFiles: File;
  file: File;


  SubmitbulkUploadForm: boolean = false;


  UserTypesData: any[] = [];
  employeeData: any[] = [];

  dropdownMultiSelectSettingsType: any;

  otOptions: DataTables.Settings = {};


  dataArr: ColumnsObj[];

  showEmployeeDropdown: boolean = false;

  hasAccess: boolean = true;
  errorMessage: string = "";


  constructor(private formBuilder: FormBuilder, private api: ApiService, private http: HttpClient,private router: Router) {

    this.bulkUploadForm = this.formBuilder.group({
      file: ["", Validators.required],
      UploadedBy: ["", Validators.required],
      Employee: [''] // Add this control
    });

    this.dropdownMultiSelectSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.UserTypesData = [
      { Id: 'Assigned', Name: 'Assigned' },
      { Id: 'Not Assigned', Name: 'Not Assigned' },
    ];
    
  }

  ngOnInit() {
    this.GetRecords();
  }

  downloadFile(filePath: string) {
    const link = document.createElement('a');
    link.href = filePath;
    link.setAttribute('download', ''); // Let the browser use the filename from the server
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  onUserTypeSelect(selectedItem: any) {
    if (!selectedItem) {
        
        this.showEmployeeDropdown = false;
        return;
    }

    // Check selection
    const isUserSelected = selectedItem.Id === 'Assigned';

    this.GetEmployees("", 0);
    
    this.showEmployeeDropdown = isUserSelected;
    
    // Handle form control updates
    const employeeControl = this.bulkUploadForm.get('Employee');
    if (isUserSelected) {
        employeeControl.setValidators([Validators.required]);
    } else {
        employeeControl.reset();
        employeeControl.clearValidators();
    }
    employeeControl.updateValueAndValidity();
  }

  downloadCSV() {
    const link = document.createElement("a");
    link.href = "assets/dd_csv_format/Csv_Format.csv"; // Path inside `src/assets`
    link.download = "Csv_Format.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  resetbulkUploadForm(){
    this.bulkUploadForm.reset();

  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }


  get formcontrolsbulkUploadForm() {
    return this.bulkUploadForm.controls;
  }

  GetEmployees(e, Type): void {
    let searchQuery = "";

    if (Type === 1) {
      searchQuery = e.target.value; // Get the input value when user types
    }

    let formData = new FormData();
    formData.append("val", searchQuery); // Pass search query

    this.api.IsLoading(); // Show loading indicator

    // API call to fetch vendor types based on user input
    this.api.HttpPostType("/DataDictionary/get_employees", formData).then(
      (resp: any) => {
        this.api.HideLoading(); 
        if (resp && resp.data && resp.data.length > 0) {
          this.employeeData = resp.data; 
          
        }
      },
      (err) => {
        this.api.HideLoading();
        console.error("Error fetching Employees:", err);
      }
    );
  }

  GetRecords() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };
    const that = this;
    this.otOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {

        that.http
          .post<BatchDataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/DataDictionary/FetchFileData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType()
            ),

            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;
            that.dataArr = resp.data;
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

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      var ext;

      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      

      if (ext == "csv") {
        
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        if (Total_Size >= 1024 * 2) {
          
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "file") {
            this.bulkUploadForm.get("file").setValue("");
          }
        } else {
          if (Type == "file") {
            this.file = this.selectedFiles;
          }
        }
      } else {
        this.api.Toast("Warning", "Please choose vaild file ! Example :- csv");

        if (Type == "file") {
          this.bulkUploadForm.get("file").setValue("");
        }
      }
    }
  }


  onSubmitBulkUploadForm(){
    this.SubmitbulkUploadForm = true;
    if (this.bulkUploadForm.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("image", this.file);
    formData.append("file", 'file');
    const userTypeArray = this.bulkUploadForm.get('UploadedBy').value;
    
    // Extract the first (and only) object from the array
    const userType = userTypeArray[0] || {};
    formData.append("UploadedBy_Name", userType.Name || '');

    // Handle Employee data (also an array with single object)
    const employeeArray = this.bulkUploadForm.get('Employee').value;
    if (employeeArray && employeeArray.length > 0) {
      const employee = employeeArray[0];
      formData.append("Assign_User_Id", employee.Id || '');
    }


    this.api.IsLoading();
    this.api.HttpPostType("/DataDictionary/BulkUpload", formData).then(
      (resp: any) => {
        if (resp.status == false) {
          this.api.Toast("Warning", resp.msg);
          this.bulkUploadForm.reset();
          this.file = null; // Clear the file reference
          this.SubmitbulkUploadForm = false; // Reset submission flag
          // If you have a file input element reference, reset it
          if (this.fileInput) {
              this.fileInput.nativeElement.value = '';
          }
          
        } else {
          this.api.Toast("Success", resp.msg);
          this.bulkUploadForm.reset();
          this.file = null; // Clear the file reference
          this.SubmitbulkUploadForm = false; // Reset submission flag
          // If you have a file input element reference, reset it
          if (this.fileInput) {
              this.fileInput.nativeElement.value = '';
          }
          document.getElementById('close2').click();

        }
        this.Reload();
        this.api.HideLoading();
      },
      (err) => {
        this.api.HideLoading();
        console.error("Error submitting data:", err);
        this.api.Toast("Error", "Failed to submit data");
        this.bulkUploadForm.reset();
          this.file = null;
          this.SubmitbulkUploadForm = false;
          if (this.fileInput) {
              this.fileInput.nativeElement.value = '';
          }
      }
    );
      
  }

  navigateToView(uniqueId: string) {
    this.router.navigate(['/view-data-list'], { queryParams: { id: uniqueId } });
  }

    
}