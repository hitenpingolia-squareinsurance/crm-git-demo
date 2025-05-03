import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ApiService } from "../../../app/providers/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { DataTableDirective } from "angular-datatables";
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';


class ColumnsObj {
  SrNo: string;
  Id: any;
  LobType: any;
  Name: any;
  Mobile: any;
  Email: any;
  State: any;
  City: any;
  Pincode: any;
  Source: any;
  Campaign: any;
  StartDate: any;
  ExpiryDate: any;
  Insurer: any;
  Premium: any;
  FamilyGroup: any;
  MotorType: any;
  RegistrationNo: any;
  Make: any;
  Model: any;
  Variant: any;
  PrevPolicyInsurer: any;
  Claim: any;
  EmployeeName: any;
  EmployeeID: any;
  Status: any;
  Remarks: any;

  UploadedBy: any;
  AssignerName: any;
  AssignerEmployeeId: any;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}


@Component({
  selector: 'app-view-data-list',
  templateUrl: './view-data-list.component.html',
  styleUrls: ['./view-data-list.component.css']
})
export class ViewDataListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false }) datatableElement: DataTableDirective;


  uniqueId: string = '';
  searchForm: FormGroup;
  DataLeadForm: FormGroup;
  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  currentEditId: string = '';

  showMotorFields: boolean = false;
  showHealthFields: boolean = false;

  lobTypesData: any[] = [];
  LeadStatusData: any[] = [];
  MotorTypesData: any[] = [];
  ClaimData: any[] = [];
  StausData: any[] = [];

  SubmitDataLeadForm: boolean = false;


  dropdownMultiSelectSettingsType: any;

  modalMode: 'add' | 'edit' = 'add';

  hasAccess: boolean = true;
  errorMessage: string = "";


  showReassignButton = false;
  showAssignButton = false;
  reassignForm: FormGroup;
  employees = []; // Populate this with your employee data
  searchPerformed = false;

  SubmitReassignForm: boolean = false;
  employeeData: any[] = [];
  where: any;

  currentUrl: string;


  constructor(private formBuilder: FormBuilder, private api: ApiService, private http: HttpClient, private router: Router, private route: ActivatedRoute) {

    this.loadDropdownData();
    

    this.searchForm = this.formBuilder.group({
      SearchValue: [""],
      StatusFilter: [[]],
      LobFilter: [[]],
      LeadStatusFilter: [[]],
      EmployeeFilter: [[]],
    });

    this.DataLeadForm = this.formBuilder.group({
      LobType: [[], Validators.required],
      Name: ['', Validators.required],
      Mobile: ['', Validators.required],
      Email: [''],
      State: [''],
      City: [''],
      Pincode: [''],
      Source: [''],
      Campaign: [''],
      StartDate: [''],
      ExpiryDate: ['', Validators.required],
      Insurer: [''],
      Premium: [''],
      FamilyGroup: [''],
      MotorType: [[]],
      RegistrationNo: [''],
      Make: [''],
      Model: [''],
      Variant: [''],
      PrevPolicyInsurer: [''],
      Claim: [[]]
    });


    this.dropdownMultiSelectSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.reassignForm = this.formBuilder.group({
      Employee: [''] // Add this control
    });

   }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.GetEmployees("", 0);
    this.route.paramMap.subscribe((params) => {
      this.uniqueId = params.get('id') || '';
      this.Get();
      
    });

    this.initializeReassignForm();
    // this.setupLeadStatusListener();
    
  }

  initializeReassignForm() {
    this.reassignForm = this.formBuilder.group({
      selectedEmployee: [[], Validators.required]
    });
  }
  


  ClearSearch() {
    this.searchForm.reset({
      SearchValue: '',
      StatusFilter: '', // Reset status filter too
      LobFilter: '',
      LeadStatusFilter: '',
      EmployeeFilter: '',
    });
    this.showReassignButton = false;
    this.showAssignButton = false;
    this.Get();
    this.ResetDT();
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

  SearchData() {
    this.searchPerformed = true;

    const fields = this.searchForm.value;
    this.dataAr = [];

    const lobFilterString = fields.LobFilter 
    ? fields.LobFilter.map((item: any) => item.Name).join(',') 
    : '';

    const LeadStatusFilterString = fields.LeadStatusFilter 
    ? fields.LeadStatusFilter.map((item: any) => item.Name).join(',') 
    : '';

    const StatusFilterString = fields.StatusFilter 
    ? fields.StatusFilter.map((item: any) => item.Id).join(',') 
    : '';

    const EmployeeFilterString = fields.EmployeeFilter 
    ? fields.EmployeeFilter.map((item: any) => item.Id).join(',') 
    : '';


    
    // Create filter object with both search and status
    const filters = {
      SearchValue: fields.SearchValue || '',
      StatusFilter: StatusFilterString,
      LobFilter: lobFilterString,
      LeadStatusFilter: LeadStatusFilterString,
      EmployeeFilter: EmployeeFilterString
    };
  
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(filters)))
        .draw();
    });

    if(LeadStatusFilterString === 'Assigned') {
      const leadStatusValue = this.searchForm.get('LeadStatusFilter').value;
      const hasAssigned = leadStatusValue && leadStatusValue.some((item: any) => item.Name === 'Assigned');
      this.showReassignButton = hasAssigned;
      this.showAssignButton = false;
    }else if(LeadStatusFilterString === 'Not Assigned'){
      const leadStatusValue = this.searchForm.get('LeadStatusFilter').value;
      const hasAssigned = leadStatusValue && leadStatusValue.some((item: any) => item.Name === 'Not Assigned');
      this.showReassignButton = false;
      this.showAssignButton = hasAssigned;
    }
    
    this.GetEmployees("", 0);
  }

  get formcontrolsDataLeadForm() {
    return this.DataLeadForm.controls;
  }

  get formcontrolsSubmitReassignForm() {
    return this.reassignForm.controls;
  }

  // Add these new methods
openReassignModal() {
  // Reset form and open modal
  this.reassignForm.reset();
  
}

openAssignModal() {
  // Reset form and open modal
  this.reassignForm.reset();
  
}

confirmReassign() {
  
  if (this.reassignForm.valid) {
    const selectedEmployee = this.reassignForm.value.selectedEmployee[0];
    
    // Safely get form values
    const getMultiSelectValue = (controlName: string) => {
      const control = this.searchForm.get(controlName);
      return control && control.value ? 
        (Array.isArray(control.value) ? control.value.map(x => x.Name).join(',') : control.value) : 
        '';
    };

    const fields = this.searchForm.value;

    // Get the current search parameters
    const searchParams = {
      SearchValue: this.searchForm.get('SearchValue').value || '',
      StatusFilter: getMultiSelectValue('StatusFilter'),
      LobFilter: getMultiSelectValue('LobFilter'),
      LeadStatusFilter: getMultiSelectValue('LeadStatusFilter'),
      EmployeeFilter: fields.EmployeeFilter ? fields.EmployeeFilter.map((item: any) => item.Id).join(',') : '',
      Unique_Id: this.uniqueId ? this.uniqueId : ''
    };

    const formData = new FormData();
    formData.append('new_assignee_id', selectedEmployee.Id);
    formData.append('search_params', JSON.stringify(searchParams));

    this.api.IsLoading();
    
    this.api.HttpPostType('/DataDictionary/updateAssignedData', formData).then(
      (resp: any) => {
        if (resp.status == false) {
          this.api.Toast("Warning", resp.msg);
        } else {
          this.api.Toast("Success", resp.msg);
          this.Get();
          this.Reload();
          document.getElementById('close2').click();
          this.ClearSearch();
        }
        this.api.HideLoading();
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast("Error", "Failed to reassign records");
      }
    );
  }
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
      ajax: (dataTablesParameters: any, callback) => {
        // Get current filter values
        const searchValue = that.searchForm.get('SearchValue').value;
        const statusFilter = that.searchForm.get('StatusFilter').value;
        const LobFilter = that.searchForm.get('LobFilter').value;
        const LeadStatusFilter = that.searchForm.get('LeadStatusFilter').value;
        const EmployeeFilter = that.searchForm.get('EmployeeFilter').value;
        
        // Add filters to the request URL
        let url = environment.apiUrl +
          "/DataDictionary/FetchAllData?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Unique_Id=" +
          this.uniqueId + 
          "&url=" + 
          this.currentUrl;
        
        if (searchValue) {
          url += "&SearchValue=" + encodeURIComponent(searchValue);
        }
        if (statusFilter) {
          url += "&StatusFilter=" + encodeURIComponent(statusFilter);
        }
        if (LobFilter) {
          url += "&LobFilter=" + encodeURIComponent(LobFilter);
        }
        if (LeadStatusFilter) {
          url += "&LeadStatusFilter=" + encodeURIComponent(LeadStatusFilter);
        }
        if (EmployeeFilter) {
          url += "&EmployeeFilter=" + encodeURIComponent(EmployeeFilter);
        }
  
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(url),
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
            that.dataAr = resp.data;
            that.where = resp.where;
            
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  loadDropdownData() {
    this.lobTypesData = [
      { Id: 'Motor', Name: 'Motor' },
      { Id: 'Health', Name: 'Health' },
      { Id: 'PA', Name: 'PA' },
      { Id: 'Life', Name: 'Life' },
      { Id: 'Other', Name: 'Other' },
    ];

    this.LeadStatusData = [
      { Id: 'All', Name: 'All' },
      { Id: 'Assigned', Name: 'Assigned' },
      { Id: 'Not Assigned', Name: 'Not Assigned' },
      
    ];

    this.MotorTypesData = [
      { Id: 'Private Car', Name: 'Private Car' },
      { Id: 'Two Wheeler', Name: 'Two Wheeler' },
      { Id: 'PCV', Name: 'PCV' },
      { Id: 'GCV', Name: 'GCV' },
      { Id: 'MISCD', Name: 'MISCD' },
    ];

    this.ClaimData = [
      { Id: 'Yes', Name: 'Yes' },
      { Id: 'No', Name: 'No' },
    ];

    this.StausData = [
      { Id: '1', Name: 'Uploaded' },
      { Id: '0', Name: 'Failed' },
    ];
  }

  setupLobTypeListener() {

    // console.log('Data Lead Form Data in edit Form : ',this.DataLeadForm.value);
    this.DataLeadForm.get('LobType').valueChanges.subscribe((selectedArray) => {
      const selectedLob = selectedArray.length ? selectedArray[0] : null;
      this.updateFieldVisibility(selectedLob.Name);
      // alert(selectedLob.Name);
      if (selectedLob.Name === 'Health') {
        this.showHealthFields = true;
        this.showMotorFields = false;
        this.setMotorValidators(false);
      }else if(selectedLob.Name === 'PA') {
        this.showHealthFields = true;
        this.showMotorFields = false;
        this.setMotorValidators(false);
      }else if(selectedLob.Name === 'Life') {
        this.showHealthFields = true;
        this.showMotorFields = false;
        this.setMotorValidators(false);
      }else if(selectedLob.Name === 'Other') {
        this.showHealthFields = true;
        this.showMotorFields = false;
        this.setMotorValidators(false);
      }
      else if (selectedLob.Name === 'Motor') {
        this.showHealthFields = false;
        this.showMotorFields = true;
        this.setMotorValidators(true);
      }
      else {
        this.showHealthFields = false;
        this.showMotorFields = false;
        this.setMotorValidators(false);
      }
    });
  }

  setMotorValidators(isRequired: boolean) {
      const motorFields = [
        'MotorType', 
        'RegistrationNo', 
        'Make', 
        'Model', 
        'Variant', 
        'PrevPolicyInsurer', 
        'Claim'
      ];
      
      motorFields.forEach(field => {
        const control = this.DataLeadForm.get(field);
        if (isRequired) {
          control.setValidators(Validators.required);
        } else {
          control.clearValidators();
        }
        control.updateValueAndValidity();
      });
    }

    // Method to open modal in edit mode
    openEditModal(rowId: string) {

      this.modalMode = 'edit';
      
      this.currentEditId = rowId;
    
      const formData = new FormData();
      formData.append("Edit_id", rowId);
      
      this.api.HttpPostType("/DataDictionary/EditData", formData).then(
        (resp: any) => {
          if (resp.status) {
            const rowData = resp.data;
            
            // Reset form and visibility flags
            this.ResetForm();

            
            
            
            // Patch the values to the form
            this.DataLeadForm.patchValue({
              LobType: rowData.LobType ? [{ Id: rowData.LobType, Name: rowData.LobType }] : [],
              Name: rowData.Name || '',
              Mobile: rowData.Mobile || '',
              Email: rowData.Email || '',
              State: rowData.State || '',
              City: rowData.City || '',
              Pincode: rowData.Pincode || '',
              Source: rowData.Source || '',
              Campaign: rowData.Campaign || '',
              StartDate: rowData.StartDate || '',
              ExpiryDate: rowData.ExpiryDate || '',
              Insurer: rowData.Insurer || '',
              Premium: rowData.Premium || '',
              FamilyGroup: rowData.FamilyGroup || '',
              MotorType: rowData.MotorType ? [{ Id: rowData.MotorType, Name: rowData.MotorType }] : [],
              RegistrationNo: rowData.RegistrationNo || '',
              Make: rowData.Make || '',
              Model: rowData.Model || '',
              Variant: rowData.Variant || '',
              PrevPolicyInsurer: rowData.PrevPolicyInsurer || '',
              Claim: rowData.Claim ? [{ Id: rowData.Claim, Name: rowData.Claim }] : []
            });
    
            // Show/hide fields based on LobType
            this.showMotorFields = rowData.LobType === 'Motor';
            this.showHealthFields = rowData.LobType === 'Health';
            
            // Common fields will always be visible

            this.updateFieldVisibility(rowData.LobType);

            this.setupLobTypeListener();
            
            // $('#openmodal').click;
            document.getElementById('openmodal').click();
            
            

            
            
          } else {
            this.api.Toast("Error", "Failed to load data");
          }
          this.api.HideLoading();
        },
        (err) => {
          this.api.HideLoading();
          console.error("Error fetching data:", err);
          this.api.Toast("Error", "Failed to load data");
        }
      );
    }

    updateFieldVisibility(lobType: string) {
      switch(lobType) {
        case 'Health':
        case 'PA':
        case 'Life':
        case 'Other':
          this.showHealthFields = true;
          this.showMotorFields = false;
          this.setMotorValidators(false);
          break;
        case 'Motor':
          this.showHealthFields = false;
          this.showMotorFields = true;
          this.setMotorValidators(true);
          break;
        default:
          this.showHealthFields = false;
          this.showMotorFields = false;
          this.setMotorValidators(false);
      }
    }
    
    ResetForm() {
      this.DataLeadForm.reset();
      this.showMotorFields = false;
      this.showHealthFields = false;
    }


    onSubmit() {

      this.SubmitDataLeadForm = true;
      
      if (this.DataLeadForm.invalid) {
        return;
      }
    
      const formValues = this.DataLeadForm.value;
      const formData = new FormData();

      formData.append("Edit_Id", this.currentEditId);
      formData.append("unique_id", this.uniqueId);
    
      // Append user data
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
    
      // Append common fields
      formData.append("LobType", formValues.LobType[0].Name);
      formData.append("Name", formValues.Name);
      formData.append("Mobile", formValues.Mobile);
      formData.append("Email", formValues.Email || '');
      formData.append("State", formValues.State || '');
      formData.append("City", formValues.City || '');
      formData.append("Pincode", formValues.Pincode || '');
      formData.append("Source", formValues.Source || '');
      formData.append("Campaign", formValues.Campaign || '');
      formData.append("StartDate", formValues.StartDate || '');
      formData.append("ExpiryDate", formValues.ExpiryDate);
    
      // Append Motor specific fields if Motor is selected
      if (this.showMotorFields) {
        formData.append("MotorType", formValues.MotorType[0].Name || '');
        formData.append("RegistrationNo", formValues.RegistrationNo);
        formData.append("Make", formValues.Make);
        formData.append("Model", formValues.Model);
        formData.append("Variant", formValues.Variant);
        formData.append("PrevPolicyInsurer", formValues.PrevPolicyInsurer);
        formData.append("Claim", formValues.Claim[0].Name || '');
      }
    
      // Append Health specific fields if Health is selected
      if (this.showHealthFields) {
        formData.append("Insurer", formValues.Insurer || '');
        formData.append("Premium", formValues.Premium || '');
        formData.append("FamilyGroup", formValues.FamilyGroup || '');
      }
    
      this.api.IsLoading();
      

      
      // Determine the API endpoint based on mode
      const endpoint = '/DataDictionary/update';
    
      this.api.HttpPostType(endpoint, formData).then(
        (resp: any) => {
          if (resp.status == false) {
            this.api.Toast("Warning", resp.msg);
          } else {
            this.api.Toast("Success", resp.msg);
            this.Reload();
            this.Get();
            // Close the modal and reset
            
            // $('#addDataLead').modal('hide');
            document.getElementById('close1').click();
          }
          this.api.HideLoading();
        },
        (err) => {
          this.api.HideLoading();
          console.error("Error submitting data:", err);
          this.api.Toast("Error", "Failed to submit data");
        }
      );
    }

    addForm() {
      

      this.modalMode = 'add';
      this.currentEditId = '';

      this.setupLobTypeListener();
      
      // $('#addDataLead').modal('show');

      document.getElementById('openmodal').click();
    }

    






}
