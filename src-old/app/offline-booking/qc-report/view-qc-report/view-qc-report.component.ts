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
  selectedFiles: File;
  id: any;
  Bulk_Id: any = 0;
  Is_Complete: any = 0;
  type: any;
  AddFieldForm: FormGroup;
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

  UploadPDF(event, id: any, start_date: any, product: any, segment: any, company: any, fileType: any) {
    this.id = id;
    this.selectedFiles = event.target.files[0];
    this.isSubmitted = true;
    if (this.AddFieldForm.invalid) {
      this.AddFieldForm.patchValue({
        date: start_date,
      })
    }
    if (this.Product.invalid) {
      this.Product.patchValue({
        product: product,
      })
    }
    if (this.Segment.invalid) {
      this.Segment.patchValue({
        segment: segment,
      })
    }

    if (this.Company.invalid) {
      this.Company.patchValue({
        company: company,
      })
    }

    if (this.fileType.invalid) {
      this.fileType.patchValue({
        fileType: fileType,
      })
    }

    if (this.AddFieldForm.valid) {
      if (event.target.files && event.target.files[0]) {
        var str = this.selectedFiles.name;
        var ar = str.split(".");
        var ext;
        for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();

        if (ext == 'pdf') {
          var file_size = event.target.files[0]['size'];
          const Total_Size = Math.round((file_size / 1024));

          if (Total_Size >= 1024 * 5) {
            this.api.Toast('Warning', 'File size is greater than 5 mb');
          } else {
            this.Upload();
            this.isSubmitted = false;
          }
        } else {
          this.api.Toast('Warning', 'Please choose vaild file ! Example :- pdf');
        }
      }
    }
  }

  Upload() {
    this.api.IsLoading();
    var field = this.AddFieldForm.value;
    var product = this.Product.value;
    var segment = this.Segment.value;
    var company = this.Company.value;
    var fileType = this.fileType.value;
    const formData = new FormData();
    formData.append('Id', this.id);
    formData.append('UploadFile', this.selectedFiles);
    formData.append('Type', this.type);
    formData.append('date', JSON.stringify(field['date']));
    formData.append('product', (product['product']));
    formData.append('segment', (segment['segment']));
    formData.append('company', (company['company']));
    formData.append('fileType', (fileType['fileType']));

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
    }, (err) => {
      if (this.type != 'employee') {
        this.api.HideLoading();
      }
      this.api.Toast('Warning', err.message);
    });
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
