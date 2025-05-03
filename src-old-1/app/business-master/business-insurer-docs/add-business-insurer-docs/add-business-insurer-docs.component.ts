import { Component, OnInit,Inject } from '@angular/core';
import { AbstractControl, ValidationErrors, FormControl, ValidatorFn } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../providers/api.service';
import { Router } from  '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BmsapiService } from 'src/app/providers/bmsapi.service';

@Component({
  selector: 'app-add-business-insurer-docs',
  templateUrl: './add-business-insurer-docs.component.html',
  styleUrls: ['./add-business-insurer-docs.component.css']
})


export class AddBusinessInsurerDocsComponent implements OnInit {

  currentUrl: string;
  urlSegment: any;
  Is_Refresh: any = 'No';
  CompanyArr:any = [];

  AddFieldForm: FormGroup;
  isSubmitted  = false;
  dropdownSettingsingleselect: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; noDataAvailablePlaceholderText: string; };

  dropdownSettingsingleselectLoop: any; 

  selectedFiles :any= [];
  excelData: any =[];
  loadData:boolean =false;
  dropdownOptions :any = [];
  sendMatchedData: any=[];
  fileUploadedName:any;
  filteredDropdownOptions: Array<{ key: string; value: string }> = [];
  qcMatchedKeyData: Array<{ key: string; value: string }> = [];
  qcUpdateKeyData: Array<{
    checked: any; key: string; value: string 
}> = [];

  constructor( 
    public dialogRef: MatDialogRef<AddBusinessInsurerDocsComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public api : ApiService, 
    public dialog: MatDialog, private router: Router, 
    private formBuilder: FormBuilder,
    public bmsApi: BmsapiService,
    private http: HttpClient,
   ) {

      this.currentUrl = this.router.url;
      var splitted = this.currentUrl.split("/");
      if (typeof splitted[2] != 'undefined') {
        this.urlSegment = splitted[2];
      }

      this.dropdownSettingsingleselect = {
        singleSelection: true,
        idField: 'Id',
        textField: 'Name',
        itemsShowLimit: 2,
        enableCheckAll: false,
        allowSearchFilter: true,
        noDataAvailablePlaceholderText: 'No records available'
      };

      this.dropdownSettingsingleselectLoop = { 
        singleSelection: true,
        idField: 'key',
        textField: 'value',
        enableCheckAll: false,
        allowSearchFilter: true,
        noDataAvailablePlaceholderText: 'No records available',
      };

  }
  
  ngOnInit() {
  
    this.CompanyArr = this.data.companyArr;
    this.AddFieldForm = this.formBuilder.group({
      company: ['', Validators.required],
      file: ['', Validators.required],
      qcMatchData: this.formBuilder.array([], this.atLeastOneCheckboxCheckedValidator()),
      qcUpdateData: this.formBuilder.array([]),
      excelMatchCol: this.formBuilder.array([], Validators.required),
    });
  
  }

  get excelMatchColArray(): FormArray {
    return this.AddFieldForm.get('excelMatchCol') as FormArray;
  }
  
  atLeastOneCheckboxCheckedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>  {
      const checkboxes = control.value as boolean[];
      const isChecked = checkboxes.some(checked => checked);
      return isChecked ? null : { atLeastOneRequired: true }; 
    };
  }

  get FC() {
    return this.AddFieldForm.controls;
  }
  
  CloseModel(): void {
    this.AddFieldForm.reset();
    this.isSubmitted = false;
    this.dialogRef.close({
      Status: 'Model Close',
      Is_Refresh: this.Is_Refresh,
      fileUploadedName: this.fileUploadedName
    });
  }
  
 
  initializeQcMatchData(qcKeys) {
    const qcMatchDataArray = this.AddFieldForm.get('qcMatchData') as FormArray;
    qcMatchDataArray.clear(); // Clear existing controls
    qcKeys.forEach(option => {
      // Set checked to false by default
      const isChecked = option.hasOwnProperty('checked') ? option.checked : false; 
      qcMatchDataArray.push(this.formBuilder.control(isChecked)); 
    });
  }

  // initializeQcUpdateData(qcKeys) {
  //   const qcUpdateDataArray = this.AddFieldForm.get('qcUpdateData') as FormArray;
  //   qcUpdateDataArray.clear(); // Clear existing controls
  //   qcKeys.forEach(option => {
  //     // Set checked to false by default
  //     const isChecked = option.hasOwnProperty('checked') ? option.checked : false; 
  //     qcUpdateDataArray.push(this.formBuilder.control(isChecked)); 
  //   });
  // }

  initializeQcUpdateData(qcKeys) {
    const qcUpdateDataArray = this.AddFieldForm.get('qcUpdateData') as FormArray;
    qcUpdateDataArray.clear(); // Clear existing controls
  
    this.qcUpdateKeyData = qcKeys.map(option => {
      return {
        ...option,
        checked: {
          fill: (option.checked && typeof option.checked.fill !== "undefined") ? option.checked.fill : false,
          overwrite: (option.checked && typeof option.checked.overwrite !== "undefined") ? option.checked.overwrite : false
        }
      };
    });
    
    // Push all checkboxes into the form array with default values
    this.qcUpdateKeyData.forEach(option => {
      const group = this.formBuilder.group({
        key: [option.key],
        fill: [option.checked.fill],
        overwrite: [option.checked.overwrite]
      });
  
      qcUpdateDataArray.push(group);
    });
  
    console.log("Initialized Form Data:", this.AddFieldForm.value);
  }
  
  


  // onCheckboxChange(event: any, key: string) {
  //   const qcMatchDataArray = this.AddFieldForm.get('qcMatchData') as FormArray;
  //   const index = qcMatchDataArray.controls.findIndex(control => control.value === key);
  //   if (event.target.checked) {
  //     if (index === -1) {
  //       qcMatchDataArray.push(this.formBuilder.control(key));
  //     }
  //   } else {
  //     if (index >= 0) {
  //       qcMatchDataArray.removeAt(index);
  //     }
  //   }

  //   // Validate that Policy_No is checked along with at least one other checkbox
  //   const policyNoChecked = qcMatchDataArray.controls.some(control => control.value === 'Policy_No' && control.value !== null);
  //   const atLeastOneChecked = qcMatchDataArray.controls.length > 0;

  //   // Check for validation errors
  //   if (!policyNoChecked || !atLeastOneChecked) {
  //       // Show validation error (you can set a form control error or a separate validation flag)
  //       this.AddFieldForm.get('qcMatchData').setErrors({ atLeastOneRequired: true });
  //   } else {
  //       // Clear validation error
  //       this.AddFieldForm.get('qcMatchData').setErrors(null);
  //   }
  // }

  // onQCUpdateChange(event: any, key: string) {
  //   const qcUpdateDataArray = this.AddFieldForm.get('qcUpdateData') as FormArray;
  //   const index = qcUpdateDataArray.controls.findIndex(control => control.value === key);
  //   if (event.target.checked) {
  //     if (index === -1) {
  //       qcUpdateDataArray.push(this.formBuilder.control(key));
  //     }
  //   } else {
  //     if (index >= 0) {
  //       qcUpdateDataArray.removeAt(index);
  //     }
  //   }
  // }

  onCheckboxChange(event: any, key: string) {
    const qcMatchDataArray = this.AddFieldForm.get('qcMatchData') as FormArray;
    const index = qcMatchDataArray.controls.findIndex(control => control.value === key);
  
    if (event.target.checked) {
      if (index === -1) {
        qcMatchDataArray.push(this.formBuilder.control(key));
      }
    } else {
      if (index >= 0) {
        qcMatchDataArray.removeAt(index);
      }
    }
  
    // Ensure "Policy_No" is always checked
    const policyIndex = this.qcMatchedKeyData.findIndex(option => option.key === 'Policy_No');
    // Check if "Policy_No" is selected
    const policyNoChecked = policyIndex !== -1 && qcMatchDataArray.controls[policyIndex].value == true;

    const atLeastOneChecked = qcMatchDataArray.controls
    .filter((_, index) => index !== policyIndex) // Exclude "Policy_No" index
    .some(control => control.value === true);
  
    console.log("policyNoChecked",policyNoChecked);
    console.log("atLeastOneChecked",atLeastOneChecked);

    // Apply or remove validation errors
    if (!policyNoChecked || !atLeastOneChecked) {
      qcMatchDataArray.setErrors({ atLeastOneRequired: true });
    } else {
      qcMatchDataArray.setErrors(null);
    }
  
    // Trigger form validation update
    this.AddFieldForm.updateValueAndValidity();
  }
  

  onQCUpdateChange(event: any, key: string, type: string) {
    const qcUpdateDataArray = this.AddFieldForm.get('qcUpdateData') as FormArray;
    const optionIndex = this.qcUpdateKeyData.findIndex(option => option.key === key);
  
    if (optionIndex !== -1) {
      // Update `qcUpdateKeyData` directly
      this.qcUpdateKeyData[optionIndex].checked[type] = event.target.checked;
  
      // Update the corresponding form control
      const formControl = qcUpdateDataArray.at(optionIndex);
      if (formControl) {
        formControl.get(type).setValue(event.target.checked);
      }
    }
  
    console.log("Updated Form Data:", this.AddFieldForm.value);
    console.log("Updated qcUpdateKeyData:", this.qcUpdateKeyData);
  }
  
  
  

  addExcelMatchCols(data: any[]) {
    const excelMatchColArray = this.AddFieldForm.get('excelMatchCol') as FormArray;
    excelMatchColArray.clear();
    data.forEach(file => {
      file.columns.forEach(column => {
        excelMatchColArray.push(this.formBuilder.control(column.value || '', Validators.required));
      });
    });
  }

  checkDuplicateValues(index: number) {
    const excelMatchColArray = this.AddFieldForm.get('excelMatchCol') as FormArray;
    const allValues = excelMatchColArray.value;
    const selectedValue = allValues[index];
    const control = excelMatchColArray.at(index);
    control.setErrors(null);
  
    // Skip duplicate check if value is blank, an empty array, or [{key: 'none', value: 'None'}]
    const isEmpty = !selectedValue || (Array.isArray(selectedValue) && selectedValue.length === 0);
    const isNone = JSON.stringify(selectedValue) === JSON.stringify([{ key: 'none', value: 'None' }]);

    if (isEmpty || isNone) {
      // Set required error if blank or empty array
      if (isEmpty) {
        control.setErrors({ required: true });
      }
      return;
    }
    // Check for duplicates only among non-blank values
    const hasDuplicate = allValues.some((value, i) => i !== index && JSON.stringify(value) === JSON.stringify(selectedValue));
    if (hasDuplicate) {
      control.setErrors({ duplicate: true });
    }
  }

  onCompanyChange(event: string) {
    this.selectedFiles = null; 
    this.dropdownOptions = []; 
    this.sendMatchedData = [];
    this.qcMatchedKeyData = []; 
    this.qcUpdateKeyData = []; 
    const fileInput = document.getElementById('excelFileInput') as HTMLInputElement; 
    if (fileInput) {
        fileInput.value = '';
    }
    const excelMatchColArray = this.AddFieldForm.get('excelMatchCol') as FormArray;
    if (excelMatchColArray) {
      excelMatchColArray.clear(); // Remove all existing form controls
    }

    const QCMatchArray = this.AddFieldForm.get('qcMatchData') as FormArray;
    if (QCMatchArray) {
      QCMatchArray.clear(); // Remove all existing form controls
    }

    const QCUpdateArray = this.AddFieldForm.get('qcUpdateData') as FormArray;
    if (QCUpdateArray) {
      QCUpdateArray.clear(); // Remove all existing form controls
    }

    this.AddFieldForm.get('file').reset(); // Reset the 'file' control
  }

  UploadMultipleExcel(event) {
   
    if (!this.AddFieldForm.value['company'] || 
      (Array.isArray(this.AddFieldForm.value['company']) && this.AddFieldForm.value['company'].length === 0)) {
      this.api.Toast('Error', 'Please select a company before uploading the file.');
      this.AddFieldForm.get('file').reset();
      event.target.value = ''; 
      return;
    }
    const files = Array.from(event.target.files); 
    this.selectedFiles = files; 
    const setUploadFileSize = 20;
    let validFiles = [];
    let invalidFiles = [];
    let totalValidSize = 0;

    let isAnyFileTooLarge = false;

    this.selectedFiles.forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext !== 'xlsx' && ext !== 'xls') {
        invalidFiles.push(file.name);
        return; 
      }
      const file_size = file.size; 
      const totalSizeInMB = Math.round(file_size / (1024 * 1024));

      if (totalSizeInMB > setUploadFileSize) {
        invalidFiles.push(file.name);
        isAnyFileTooLarge = true;
        return; 
      }

      totalValidSize += totalSizeInMB;
      validFiles.push(file);
    });

    // If any file exceeds the size limit, show a warning and reset the input
    if (isAnyFileTooLarge) {
        this.api.Toast('Warning', `One or more files exceed the maximum allowed size of ${setUploadFileSize}MB. Please upload valid Excel files.`);
        this.AddFieldForm.get('file').reset(); // Reset the form control
        event.target.value = ''; // Clear the input value
        return;
    }

    // If there are invalid files due to file type
    if (invalidFiles.length > 0) {
        this.api.Toast('Warning', `Invalid files: ${invalidFiles.join(', ')}. Please ensure all files are valid Excel files.`);
        this.AddFieldForm.get('file').reset(); // Reset the form control
        event.target.value = ''; // Clear the input value
        return;
    }
    
    // If there are valid files
    if (validFiles.length > 0) {
      this.loadData = true;
      //this.api.Toast('Warning', 'Please Wait Fetch Sheet Colums.');
      this.fetchExcelFileColumMatch();
      
    } else {
      this.api.Toast('Warning', 'No valid files selected. Please upload valid Excel files.');
    }
  }

  fetchExcelFileColumMatch(){
    const formData = new FormData();
    formData.append('User_Id', this.api.GetUserId());
    formData.append('User_Type', this.api.GetUserData('Type'));
    if(this.AddFieldForm.value['company']){
      formData.append('company', JSON.stringify(this.AddFieldForm.value['company']));
    }
   
    // Append each file to formData
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];
      console.log(`Appending file: ${file.name}, size: ${file.size}`);
      formData.append('Excel_Files[]', file);
    }
    this.api.IsLoading();
    this.bmsApi.
    HttpPostType('../v2/business_master/BusinessInsurerDocs/FetchExcelColumns', formData).then(
      (result) => {
        this.api.HideLoading();
  
        if (result['Status'] == true) {
          this.excelData = result['Data'];
          this.sendMatchedData = this.excelData[0]['columns'];
          if(this.sendMatchedData.length>0){
            this.dropdownOptions = result['TableKeys'];
            this.qcMatchedKeyData = result['QcMatchKeys'];
            this.qcUpdateKeyData = result['QcUpdateKeys'];

            this.initializeQcMatchData(this.qcMatchedKeyData);
            this.initializeQcUpdateData(this.qcUpdateKeyData);
            this.addExcelMatchCols(this.excelData);
            this.api.Toast('Success', result['Message']);
          }else{
            this.api.Toast('Error', 'Please upload only insurer sheets.');
          }

         
          this.loadData = false;
        } else {
          //this.selectedFiles = null;
          this.api.Toast('Warning', result['Message']);
        }
      },
      (err) => {
        this.api.HideLoading();
        console.error('Upload error:', err);
        this.api.Toast('Error', 'File upload failed. Please try again.');
      }
    );

  }


  Submit() {
    this.isSubmitted = true;
    console.log("this.AddFieldForm",this.AddFieldForm);
    if (this.AddFieldForm.valid) {
      console.log("this.AddFieldForm",this.AddFieldForm);
      this.UploadMultiple();
    }
  }

  excelMatchColNew(){
    return this.AddFieldForm.get('excelMatchCol') as FormArray;
  }


  UploadMultiple() {
    const field = this.AddFieldForm.value;
    const formData = new FormData();
    formData.append('User_Id', this.api.GetUserId());
    formData.append('User_Type', this.api.GetUserData('Type'));
    formData.append('company', JSON.stringify(field['company']));
    formData.append('Total_Rows',this.excelData[0]['total_rows']);
    formData.append('Total_colums',this.excelData[0]['total_columns']);

    //EXCEL COLUMS DATA FILTER
    // const combinedExcelMatchCol = this.sendMatchedData.map((column, index) => {
    //   let matchedValue = '';
    //   if (
    //     field &&
    //     field['excelMatchCol'] &&
    //     field['excelMatchCol'][index] &&
    //     field['excelMatchCol'][index][0] &&
    //     field['excelMatchCol'][index][0].key
    //   ) {
    //     matchedValue = field['excelMatchCol'][index][0].key;
    //   }
    //   return {
    //     "key": column.key,
    //     "value": matchedValue
    //   };
    // });
    // const jsonMatchCol = JSON.stringify(combinedExcelMatchCol);
    // formData.append('excelMatchCol', jsonMatchCol);
  
    // QC MATCH COLUMNS DATA FILTER
    // const qcMatchData = field['qcMatchData']; 
    // const combinedQcMatchCol = this.qcMatchedKeyData.map((option, index) => ({
    //   key: option.key, 
    //   value: qcMatchData[index] 
    // }));
    // const jsonQcMatchCol = JSON.stringify(combinedQcMatchCol);
    // formData.append('qcMatchCol', jsonQcMatchCol);

    // QC UPDATE COLUMNS DATA FILTER
    // const qcUpdateData = field['qcUpdateData']; 
    // const combinedQcUpdateCol = this.qcUpdateKeyData.map((option, index) => ({
    //   key: option.key, 
    //   value: {
    //     fill: qcUpdateData[index].fill, 
    //     overwrite: qcUpdateData[index].overwrite
    //   }
    // }));

    // const jsonQcUpdateCol = JSON.stringify(combinedQcUpdateCol);
    // formData.append('qcUpdateData', jsonQcUpdateCol);


  // Helper function to compress JSON (minify + base64 encode)
  const compressData = (data: any) => {
    const jsonString = JSON.stringify(data); // Minify JSON
    return btoa(jsonString); // Encode to Base64
  };

  // EXCEL COLUMNS DATA FILTER
  const combinedExcelMatchCol = this.sendMatchedData.map((column, index) => ({
      key: column.key,
      value: (field.excelMatchCol && field.excelMatchCol[index] && field.excelMatchCol[index][0]) 
          ? field.excelMatchCol[index][0].key 
          : ''
  }));
  formData.append('excelMatchCol', compressData(combinedExcelMatchCol));

  // QC MATCH COLUMNS DATA FILTER
  const combinedQcMatchCol = this.qcMatchedKeyData.map((option, index) => ({
      key: option.key,
      value: field.qcMatchData[index]
  }));
  formData.append('qcMatchCol', compressData(combinedQcMatchCol));

  // QC UPDATE COLUMNS DATA FILTER
  const combinedQcUpdateCol = this.qcUpdateKeyData.map((option, index) => ({
      key: option.key,
      value: {
          fill: field.qcUpdateData && field.qcUpdateData[index] 
              ? field.qcUpdateData[index].fill 
              : false,
          overwrite: field.qcUpdateData && field.qcUpdateData[index] 
              ? field.qcUpdateData[index].overwrite 
              : false
      }
  }));
  formData.append('qcUpdateData', compressData(combinedQcUpdateCol));

    // Append each file to formData
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];
      console.log(`Appending file: ${file.name}, size: ${file.size}`);
      formData.append('Excel_Files[]', file);
    }
    this.api.IsLoading();
    this.bmsApi.HttpPostType('../v2/business_master/BusinessInsurerDocs/uploadExcelDump', formData).then(
      (result) => {
        console.log("Result:", result);
        this.api.HideLoading();
  
        if (result['Status'] == true) {
          this.selectedFiles = null;
          this.api.Toast('Success', result['message']);
          this.Is_Refresh = 'Yes';
          this.fileUploadedName =result['Uploads'][0]['file'];
          this.CloseModel();
  
        } else {
          this.api.Toast('Warning', result['message']);
        }
      },
      (err) => {
        console.error('Upload error:', err);
        this.api.Toast('Error', 'File upload failed. Please try again.');
      }
    );
  }



}
