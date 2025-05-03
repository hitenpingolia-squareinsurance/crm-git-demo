import {
  Component,
  OnInit,
  ViewChild,
  Inject,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/providers/api.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";

import { QcReportComponent } from '../qc-report.component';
import { fi } from "date-fns/locale";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  totalSRandBussinessCount: any[];
  totalPremium: any[];
  SQL_Where: any;
  where: any;
  DateRangeValue: any;
}

@Component({
  selector: 'app-view-qc-report',
  templateUrl: './view-qc-report.component.html',
  styleUrls: ['./view-qc-report.component.css']
})
export class ViewQcReportComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  dataAr: any[];
  selectedFiles : File;
  id: any;
  Bulk_Id: any = 0;
  Is_Complete: any = 0;
  type: any;
  AddFieldForm: FormGroup;
  UploadDocs:FormGroup;
  Product: FormGroup;
  Segment: FormGroup;
  Company: FormGroup;
  fileType: FormGroup;
  isSubmitted = false;
  productAr: any[];
  segmentAr: any[];
  companyAr: any[];
  fileAr: any[];

  dropdownSettingsSingleSelect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  records: any;
  Mode_Of_Payment: FormGroup;
  payment_type: any;
  selectedCheque: File;
  isflag: boolean;
  paymentMode: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<QcReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Bulk_Id = data.bulk_id

    this.AddFieldForm = this.fb.group({
      date: ['', Validators.required],
    });

    this.Mode_Of_Payment = this.fb.group({
      // Mode_Of_Payment: ['', Validators.required],
      chequeCopy: [''], 
    });
    this.UploadDocs = this.fb.group({
        UploadPDF:['',Validators.required],
        UploadCheque :[''],

    });
  

    this.Product = this.fb.group({
      product: ['', Validators.required],
    });

    this.Segment = this.fb.group({
      segment: ['', Validators.required],
    });
    this.Company = this.fb.group({
      company: ['', Validators.required],
    });
    this.fileType = this.fb.group({
      fileType: ['', Validators.required],
    });

    this.dropdownSettingsSingleSelect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.type = this.api.GetUserData('Type');
    this.Get();
    // this.getProduct();
    this.getCompany();
    this.getFileType();
  }

  get FC1() {
    return this.AddFieldForm.controls;
  }

  get FC2() {
    return this.Product.controls;
  }
  get FC3() {
    return this.Segment.controls;
  }
  get FC4() {
    return this.Company.controls;
  }
  get FC5() {
    return this.Mode_Of_Payment.controls;
  }
  get FC6() {
    return this.UploadDocs.controls;
  }
  

  FormValid(Id: any) {

    // this.dataAr.forEach(item => {
    //   if (item.Id == Id) {

    //     if (item.fileCheck) {
    //       if (item.productCheck) {
    //         if (item.segmentCheck) {
    //           if (item.companyCheck) {
    //             if (item.isCheck) {

    //             } else {
    //               alert('Please Choose Policy_Start_Date_OD');
    //             }
    //           } else {
    //             alert('Please Choose Company');
    //           }
    //         } else {
    //           alert('Please Choose Policy Type');
    //         }
    //       } else {
    //         alert('Please Choose Product');
    //       }
    //     } else {
    //       alert('Please Choose File Type');
    //     }

    //   }
    // });

    this.dataAr.forEach(item => {
      if (item.Id == Id) {
        if (item.companyCheck == false) {
          alert('Please Choose Company');
        }

      }
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
            this.api.additionParmsEnc(environment.apiUrlBmsBase +
            "/../v2/sr/Offline_Booking/BulkGridData?User_Id=" +
            this.api.GetUserId() +
            "&source=crm&bulk_id=" + this.Bulk_Id),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res:any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            // this.paymentMode = this.dataAr['Mode_Of_Payment'];
            
                console.log(this.paymentMode);
            for(let i =0;i<that.dataAr.length;i++){
             this.records =  that.dataAr[i];
             
            }
            // this.Mode_Of_Payment = this.records.Mode_Of_Payment;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  // UploadPDF(event, id: any, start_date: any, product: any, segment: any, company: any, fileType: any,modeOfPayments: any) {
    
  //   this.payment_type = modeOfPayments;
  //   this.id = id;

  //   if (this.payment_type == 'Cheque') {
  //     this.selectedCheque = event.target.files[0];
  //     this.Mode_Of_Payment.get("chequeCopy").setValidators([Validators.required]);
  //   } else {
  //     this.Mode_Of_Payment.get("chequeCopy").clearValidators();
  //   this.Mode_Of_Payment.get("chequeCopy").updateValueAndValidity();
  //   this.selectedFiles = event.target.files[0];
  // }


  //   this.isSubmitted = true;
  //   if (this.AddFieldForm.invalid) {
  //     this.AddFieldForm.patchValue({
  //       date: start_date,
  //     })
  //   }
  //   if (this.Product.invalid) {
  //     this.Product.patchValue({
  //       product: product,
  //     })
  //   }
  //   if (this.Segment.invalid) {
  //     this.Segment.patchValue({
  //       segment: segment,
  //     })
  //   }

  //   if (this.Company.invalid) {
  //     this.Company.patchValue({
  //       company: company,
  //     })
  //   }

  //   if (this.fileType.invalid) {
  //     this.fileType.patchValue({
  //       fileType: fileType,
  //     })
  //   }



  //   if (this.AddFieldForm.valid && this.payment_type == "") {
  //     if (event.target.files && event.target.files[0]) {
  //       var str = this.selectedFiles.name;
  //       var ar = str.split(".");
  //       var ext;
  //       for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
  //     // /if(this.payment_type !== 'Cheque' || this.payment_type !== 'cheque' || this.payment_type !== 'CHEQUE'){
        
  //       if (ext == 'pdf') {
  //         var file_size = event.target.files[0]['size'];
  //         const Total_Size = Math.round((file_size / 1024));

  //         if (Total_Size >= 1024 * 5) {
  //           this.api.Toast('Warning', 'File size is greater than 5 mb');
  //         } else {
  //           this.Upload();
  //           this.isSubmitted = false;
  //         }
  //       } 
  //       else {
  //         this.api.Toast('Warning', 'Please choose vaild file ! Example :- pdf');
  //       }
  //     // }
     
  //     }
  //   }
  //   else if (this.Mode_Of_Payment.valid && this.payment_type == "Cheque" && this.payment_type != ""){
  //     alert(987654);
    
  //     if (event.target.files && event.target.files[0]) {
  //       var str = this.selectedCheque.name;
  //       var ar = str.split(".");
  //       var ext;
  //       for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
  //     // /if(this.payment_type !== 'Cheque' || this.payment_type !== 'cheque' || this.payment_type !== 'CHEQUE'){
        
  //       if (ext == 'png' ||ext == 'jpg') {
  //         var file_size = event.target.files[0]['size'];
  //         const Total_Size = Math.round((file_size / 1024));

  //         if (Total_Size >= 1024 * 5) {
  //           this.api.Toast('Warning', 'File size is greater than 5 mb');
  //         } else {
  //           this.Upload();
  //           this.isSubmitted = false;
  //         }
  //       } 
  //       else {
  //         this.api.Toast('Warning', 'Please choose vaild file ! Example :- png ,jpg');
  //       }
  //     // }
     
  //     }
  //   }
  // }

  UploadPDF(event, id: any, start_date: any, product: any, segment: any, company: any, fileType: any, modeOfPayments: any) {
    this.payment_type = modeOfPayments;
    this.id = id;
  
    const file = event.target.files[0];
    if (!file) return;
  
    const ext = file.name.split('.').pop().toLowerCase() || '';
    const fileSizeKB = Math.round(file.size / 1024);
  
    if (this.payment_type === 'Cheque') {
      this.selectedCheque = file;
  
      if (ext === 'png' || ext === 'jpg') {
        if (fileSizeKB <= 1024 * 5) {
          this.uploadOnlyCheque(); // Separate function
        } else {
          this.api.Toast('Warning', 'File size is greater than 5 MB');
        }
      } else {
        this.api.Toast('Warning', 'Please choose valid file format: png or jpg');
      }
  
    } else {
      this.selectedFiles = file;
      
      if (ext === 'pdf') {
        if (fileSizeKB <= 1024 * 5) {
          this.uploadOnlyPDF(); // Separate function
        } else {
          this.api.Toast('Warning', 'File size is greater than 5 MB');
        }
      } else {
        this.api.Toast('Warning', 'Please choose valid file format: pdf');
      }
    }
  }
  uploadOnlyCheque() {
    // this.api.IsLoading();
  
    const formData = new FormData();
    formData.append('Id', this.id);
    formData.append('UploadCheque', this.selectedCheque);
    formData.append('Type', this.type);
    formData.append('modeOfPayment', this.payment_type);

    this.api.HttpPostTypeBms('../v3/sr/OfflineBookingExcelUpload/Final_Upload', formData).then((result) => {
    ;

     if (result['Status'] == true) {

      //  this.AddFieldForm.reset();
       this.api.Toast('Success', result['Message']);
    

      
     } else {
       this.api.Toast('Warning', result['Message']);
     }
    });
  }



  uploadOnlyPDF() {

    this.api.IsLoading();
  
    const formData = new FormData();
    formData.append('Id', this.id);
    formData.append('UploadFile', this.selectedFiles);
    formData.append('Type', this.type);
    formData.append('date', JSON.stringify(this.AddFieldForm.value['date']));
    formData.append('product', this.Product.value['product']);
    formData.append('segment', this.Segment.value['segment']);
    // formData.append('company', this.Company.value['company']);
    var company = this.Company.value;
    
    formData.append('company', (company['company']));

    formData.append('fileType', this.fileType.value['fileType']);
    formData.append('modeOfPayment', this.payment_type);

   
  
    this.api.HttpPostTypeBms('../v3/sr/OfflineBookingExcelUpload/Final_Upload', formData).then((result) => {
      this.api.HideLoading();


      this.Reload();
      if (result['Status'] == true) {

        this.AddFieldForm.reset();
        this.api.Toast('Success', result['Message']);
        this.productAr = [];
        this.segmentAr = [];

       
      } else {
        this.api.Toast('Warning', result['Message']);
      }
      console.log(result);
      // this.handleUploadResponse(result);
    }, (err) => {
          if (this.type != 'employee') {
            this.api.HideLoading();
          }
          this.api.Toast('Warning', err.message);
        });
  }


  onPDFSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      const fileSizeKB = Math.round(file.size / 1024);
  
      if (ext === 'pdf') {
        if (fileSizeKB <= 1024 * 5) {
          this.selectedFiles = file;
        } else {
          this.api.Toast('Warning', 'PDF file size must be less than 5 MB');
        }
      } else {
        this.api.Toast('Warning', 'Only PDF files are allowed');
      }
    }
  }
  
  onChequeSelect(event: any) {
    const file = event.target.files[0];
   
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      const fileSizeKB = Math.round(file.size / 1024);
  
      if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
        if (fileSizeKB <= 1024 * 5) {
          this.selectedCheque = file;
        } else {
          this.api.Toast('Warning', 'Cheque file size must be less than 5 MB');
        }
      } else {
        this.api.Toast('Warning', 'Only PNG or JPG files are allowed');
      }
    }
  }


  submitFiles(row: any) {


    if(row.Mode_Of_Payment.toLowerCase() === 'cheque'){
      this.UploadDocs.get('UploadCheque').setValidators([Validators.required]);
      this.UploadDocs.get('UploadCheque').updateValueAndValidity();
    }else{
      this.UploadDocs.get('UploadCheque').setValidators(null);
      this.UploadDocs.get('UploadCheque').updateValueAndValidity();
    }
    if (this.UploadDocs.invalid) {
      this.isflag = true;  
      return;

    }else{

    const formData = new FormData();
    formData.append('Id', row.Id);
    formData.append('Type', this.type);
    formData.append('date', JSON.stringify(row.Policy_Start_Date_OD));
    formData.append('product', row.Pt);
    formData.append('segment', row.St);

    var company = this.Company.value;
    formData.append('company', (company['company']));
    // formData.append('company', row.Insurance_Company);
    formData.append('fileType', row.File_Type);
    formData.append('modeOfPayment', row.Mode_Of_Payment);
  
    if (this.selectedFiles) {
      formData.append('UploadFile', this.selectedFiles);
    }
   
    if (row.Mode_Of_Payment.toLowerCase() === 'cheque' && this.selectedCheque) {
      formData.append('UploadCheque', this.selectedCheque);
    }

    
    this.api.IsLoading();
    this.api.HttpPostTypeBms('../v3/sr/OfflineBookingExcelUpload/Final_Upload', formData).then((result) => {
    
      this.api.HideLoading();
      if (result['Status'] == true) {
        this.api.Toast('Success', result['Message']);
        this.selectedFiles = null;
        this.selectedCheque = null;
        this.UploadDocs.reset(); // Reset the form
        this.isflag = false;
        this.Reload();
      } else {
        this.api.Toast('Warning', result['Message']);
      }
    }).catch((err) => {
      this.api.HideLoading();
      this.api.Toast('Warning', err.message);
      });
    }
  }
  


  async StartValidationChecking() {

    var url = environment.apiUrlBmsBase + "/../v2/sr/Offline_Booking/StartValidationChecking?User_Id="
      + this.api.GetUserId() + "&Bulk_Id=" + this.Bulk_Id + '&id=' + this.id;

    await this.http
      .get<any>(this.api.additionParmsEnc(url),this.api.getHeader(environment.apiUrlBmsBase))
      .toPromise()
      .then((res:any) => {
        var data = JSON.parse(this.api.decryptText(res.response));

        if (data.Is_Complete == 1) {
          this.Is_Complete = data.Is_Complete;
        }
      });

    if (this.Is_Complete) {
      this.SR_Move();
    } else {
      this.api.HideLoading();
    }
  }

  async SR_Move() {
    this.Is_Complete = 0;
    var url = environment.apiUrlBmsBase + "/../v2/sr/Offline_Booking/temp_move_sr_in_sr_master?User_Id="
      + this.api.GetUserId() + "&Bulk_Id=" + this.Bulk_Id + '&id=' + this.id;
    await this.http
      .get<any>(this.api.additionParmsEnc(url),this.api.getHeader(environment.apiUrlBmsBase))
      .toPromise()
      .then((res:any) => {
        var data = JSON.parse(this.api.decryptText(res.response));

        if (data.Is_Complete == 1) {
          this.Is_Complete = data.Is_Complete;
        }
      });
    if (this.Is_Complete) {
      this.SR_No_Assign();
    } else {
      this.api.HideLoading();
    }
  }

  async SR_No_Assign() {
    this.Is_Complete = 0;
    var url = environment.apiUrlBmsBase + "/../v2/sr/Offline_Booking/SR_No_Assign?User_Id=" + this.api.GetUserId()
      + "&Bulk_Id=" + this.Bulk_Id + '&id=' + this.id;
    await this.http
      .get<any>(this.api.additionParmsEnc(url),this.api.getHeader(environment.apiUrlBmsBase))
      .toPromise()
      .then((res:any) => {
        var data = JSON.parse(this.api.decryptText(res.response));

        if (data.Is_Complete == 1) {
          // this.Reload();
        }
        if (data.Status == true) {
          this.api.Toast('Success', data.Message);
        } else {
          this.api.Toast('Warning', data.Message);
        }
        this.api.HideLoading();
        this.Reload();
      });
  }

  viewReport(link: any) {
    window.open(link);
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  getProduct() {
    let fileType = this.fileType.get('fileType').value;
    const formData = new FormData();
    formData.append('LOB', 'Motor');
    formData.append('fileType', fileType);
    this.api.HttpPostTypeBms('../v2/sr/Offline_Booking/getProduct', formData).then((result) => {
      if (result['Status'] == true) {
        this.productAr = result['product']
      } else {
        this.api.Toast('Warning', result['Message']);
      }
    }, (err) => {

      this.api.Toast('Warning', err.message);
    });
  }

  getPolicy(Id: any) {
    let product = this.Product.get('product').value
    if (product == '') {
      this.dataAr.forEach(item => {
        if (item.Id == Id) {
          item.productCheck = false;
        }
      });
      this.segmentAr = [];
      return;
    } else {
      this.dataAr.forEach(item => {
        if (item.Id == Id) {
          item.productCheck = true;
        }
      });
    }

    let fileType = this.fileType.get('fileType').value;
    const formData = new FormData();
    formData.append('LOB', 'Motor');
    formData.append('fileType', fileType);
    formData.append('product', product)
    this.api.HttpPostTypeBms('../v2/sr/Offline_Booking/getSegment', formData).then((result) => {
      if (result['Status'] == true) {
        this.segmentAr = result['segment']
      } else {
        this.api.Toast('Warning', result['Message']);
      }
    }, (err) => {

      this.api.Toast('Warning', err.message);
    });
  }

  UploadValidation(Id: any) {
    if (this.AddFieldForm.valid) {
      this.dataAr.forEach(item => {
        if (item.Id == Id) {
          item.isCheck = true;
        }
      });
    }
  }

  segmentValidate(Id: any) {
    let segment = this.Segment.get('segment').value;
    if (segment != '') {
      this.dataAr.forEach(item => {
        if (item.Id == Id) {
          item.segmentCheck = true;
        }
      });
    } else {
      this.dataAr.forEach(item => {
        if (item.Id == Id) {
          item.segmentCheck = false;
        }
      });
    }
  }

  CompanyValidation(Id: any) {
    let company = this.Company.get('company').value;
    if (company != '') {
      this.dataAr.forEach(item => {
        if (item.Id == Id) {
          item.companyCheck = true;
        }
      });
    } else {
      this.dataAr.forEach(item => {
        if (item.Id == Id) {
          item.companyCheck = false;
        }
      });
    }
  }

  fileValidation(Id: any) {
    let fileType = this.fileType.get('fileType').value;
    if (fileType != '') {
      this.dataAr.forEach(item => {
        if (item.Id == Id) {
          item.fileCheck = true;
        }
      });

      this.getProduct();
    } else {
      this.dataAr.forEach(item => {
        if (item.Id == Id) {
          item.fileCheck = false;
        }
      });
    }
  }

  getCompany() {
    const formData = new FormData();
    formData.append('LOB', 'Motor');
    this.api.HttpPostTypeBms('../v2/sr/Offline_Booking/getCompany', formData).then((result) => {
      if (result['Status'] == true) {
        this.companyAr = result['company']
      } else {
        this.api.Toast('Warning', result['Message']);
      }
    }, (err) => {

      this.api.Toast('Warning', err.message);
    });
  }

  getFileType() {
    const formData = new FormData();
    this.api.HttpPostTypeBms('../v2/sr/Offline_Booking/getFileType', formData).then((result) => {
      if (result['Status'] == true) {
        this.fileAr = result['FileType']
      } else {
        this.api.Toast('Warning', result['Message']);
      }
    }, (err) => {

      this.api.Toast('Warning', err.message);
    });
  }
}
