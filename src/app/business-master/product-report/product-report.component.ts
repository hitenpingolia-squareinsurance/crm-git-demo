import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from 'angular-datatables';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.css']
})
export class ProductReportComponent implements OnInit {

  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];
  currentUrl: string;
  ActionType: any = "";
  AddFieldForm: FormGroup;
  LOBdata: any[];
  product: any[];
  company: any[];
  irdia: any[];
  pro: any;
  plan: any;
  addLOB: number = 1;
  policyType: any[];
  planType: any[];
  subPro: any[];
  ClassN: any[];
  SubC: any[];
  isSubmitted = false;
  checkBox: any[];

  comp: any;
  policy: any;
  plann: any;
  subProduct: any;
  classNa: any;
  hasAccess: boolean = true;
  errorMessage: string = "";

  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownLOB: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.dropdownLOB = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.AddFieldForm = this.formBuilder.group({
      LOB: ['', Validators.required],
      product: [''],
      company: [''],
      policyType: [''],
      planType: [''],
      subProduct: [''],
      class: [''],
      subclass: [''],
      checkbox: [''],
      irdia: [''],
    });

    this.checkBox = [
      { Id: 1, Name: 'New' },
      { Id: 2, Name: 'Renewal' },
      { Id: 3, Name: 'Used' },
      { Id: 4, Name: 'Rollover' },
    ];
  }

  ngOnInit() {
    this.Get();
    this.GetData();
    this.currentUrl = this.router.url;
  }

  Get() {
    this.api.IsLoading();

   
    const that = this;
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      ordering: false,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrlBmsBase + "/../v2/business_master/ProductMaster/product?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&User_Code=" +
            this.api.GetUserData("Code")),
            dataTablesParameters,this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res:any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;

            that.dataAr = resp.data;
            this.api.HideLoading();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  

  Change(num: any) {
    this.addLOB = num;
    const lob = this.AddFieldForm.get('LOB');
  }


  GetData() {
    const formData = new FormData();
    formData.append("id", '0');

    this.api
      .HttpPostTypeBms('../v2/business_master/ProductMaster/getlob1', formData)
      .then(
        (resp:any) => {
          this.LOBdata = resp['data'].map(item => ({ Id: item.LOB, Name: item.LOB }));
          this.irdia = resp['irdia'].map(item => ({ Id: item.irdia, Name: item.irdia }));
        },
        (err) => {
          console.error('HTTP error:', err);
        }
      );
  }

  onLOBChange(selectedLOB: any) {

    if (selectedLOB !== null && selectedLOB !== undefined && selectedLOB.length > 0) {
      const product = selectedLOB[0]['Name'] ? selectedLOB[0]['Name'] : selectedLOB;
      this.pro = product;
    }
    this.AddFieldForm.get('product').reset();
    this.AddFieldForm.get('company').reset();
    this.AddFieldForm.get('policyType').reset();
    this.AddFieldForm.get('planType').reset();
    this.AddFieldForm.get('subProduct').reset();
    this.AddFieldForm.get('class').reset();
    this.AddFieldForm.get('subclass').reset();
    this.AddFieldForm.get('checkbox').reset();
    this.AddFieldForm.get('irdia').reset();
    this.plan = '';
    this.comp = '';
    this.policy = '';
    this.plann = '';

    this.getProduct();
  }

  getProduct() {
    const field = new FormData();
    field.append('lob', this.pro);
    this.api
      .HttpPostTypeBms('../v2/business_master/ProductMaster/getProduct1', field)
      .then(
        (resp:any) => {
          this.product = resp['data'].map(item => ({ Id: item.Id, Name: item.Name }));
          // this.LOBdata = resp['data'];
        },
        (err) => {
          console.error('HTTP error:', err);
        }
      );
  }

  oncomp(com: any) {
    if (com !== null && com !== undefined && com.length > 0) {
      this.comp = com[0]['Id'] ? com[0]['Id'] : com;
      this.AddFieldForm.get('policyType').reset();
      this.AddFieldForm.get('planType').reset();
      this.AddFieldForm.get('subProduct').reset();
      this.AddFieldForm.get('class').reset();
      this.AddFieldForm.get('subclass').reset();
      this.AddFieldForm.get('checkbox').reset();
      this.AddFieldForm.get('irdia').reset();
      this.getPolicy();
    }
  }

  getCompany() {
    const field = new FormData();
    field.append('lob', this.pro);
    field.append('product', this.plan);

    this.api
      .HttpPostTypeBms('../v2/business_master/ProductMaster/getcompany1', field)
      .then(
        (resp) => {
          this.company = resp['data'].map(item => ({ Id: item.com, Name: item.com }));
          // this.LOBdata = resp['data'];
        },
        (err) => {
          console.error('HTTP error:', err);
        }
      );
  }


  onProduct(selProduct: any) {
    if (selProduct !== null && selProduct !== undefined && selProduct.length > 0) {

      this.plan = selProduct[0]['Id'] ? selProduct[0]['Id'] : selProduct;
      if (this.plan) {
        if (this.pro == 'Motor') {
          this.AddFieldForm.get('company').reset();
          this.AddFieldForm.get('policyType').reset();
          this.AddFieldForm.get('planType').reset();
          this.AddFieldForm.get('subProduct').reset();
          this.AddFieldForm.get('class').reset();
          this.AddFieldForm.get('subclass').reset();
          this.AddFieldForm.get('checkbox').reset();
          this.AddFieldForm.get('irdia').reset();
          this.getPolicy();
        } else {
          this.AddFieldForm.get('company').reset();
          this.AddFieldForm.get('policyType').reset();
          this.AddFieldForm.get('planType').reset();
          this.AddFieldForm.get('subProduct').reset();
          this.AddFieldForm.get('class').reset();
          this.AddFieldForm.get('subclass').reset();
          this.AddFieldForm.get('checkbox').reset();
          this.AddFieldForm.get('irdia').reset();
          this.getCompany();
        }
      }
    }
  }

  getPolicy() {
    if (this.comp || this.plan) {
      const field = new FormData();
      field.append('lob', this.pro);
      field.append('product', this.plan);
      if (this.comp) {
        field.append('company', this.comp);
      }
      this.api
        .HttpPostTypeBms('../v2/business_master/ProductMaster/getPolicy', field)
        .then(
          (resp) => {
            this.policyType = resp['policy'].map(item => ({ Id: item.Id, Name: item.Name }));
          },
          (err) => {
            console.error('HTTP error:', err);
          }
        );
    }
  }

  onPolicy(pol: any) {
    if (pol !== null && pol !== undefined && pol.length > 0) {
      this.policy = pol[0]['Id'] ? pol[0]['Id'] : pol;
    }
    this.AddFieldForm.get('planType').reset();
    this.AddFieldForm.get('subProduct').reset();
    this.AddFieldForm.get('class').reset();
    this.AddFieldForm.get('subclass').reset();
    this.AddFieldForm.get('checkbox').reset();
    this.AddFieldForm.get('irdia').reset();
    this.getPlan();
  }

  getPlan() {
    if (this.policy) {
      const field = new FormData();
      field.append('lob', this.pro);
      field.append('product', this.plan);
      field.append('policy', this.policy);
      if (this.comp) {
        field.append('company', this.comp);
      }
      this.api
        .HttpPostTypeBms('../v2/business_master/ProductMaster/getPlan', field)
        .then(
          (resp) => {
            this.planType = resp['plan'].map(item => ({ Id: item.Name, Name: item.Name }));
          },
          (err) => {
            console.error('HTTP error:', err);
          }
        );
    }
  }

  onPlan(plan: any) {
    if (plan !== null && plan !== undefined && plan.length > 0) {
      this.plann = plan[0]['Id'] ? plan[0]['Id'] : plan;
    }
    // this.plann = plan[0]['Id'];
    this.AddFieldForm.get('subProduct').reset();
    this.AddFieldForm.get('class').reset();
    this.AddFieldForm.get('subclass').reset();
    this.AddFieldForm.get('checkbox').reset();
    this.AddFieldForm.get('irdia').reset();

    this.classNa = '';
    this.subProduct = '';
    this.getSubProduct();
    this.getsubclass();
  }

  getSubProduct() {
    if (this.plann) {
      if (this.plan == 'GCV' || this.plan == 'PCV' || this.plan == 'Misc D') {
        const field = new FormData();
        field.append('lob', this.pro);
        field.append('product', this.plan);
        field.append('policy', this.policy);
        field.append('plan', this.plann);
        this.api
          .HttpPostTypeBms('../v2/business_master/ProductMaster/getsubProduct', field)
          .then(
            (resp) => {
              this.subPro = resp['SubP'].map(item => ({ Id: item.Name, Name: item.Name }));
            },
            (err) => {
              console.error('HTTP error:', err);
            }
          );
      }
    }
  }

  onSubPro(subPro: any) {
    if (subPro !== null && subPro !== undefined && subPro.length > 0) {
      this.subProduct = subPro[0]['Id'] ? subPro[0]['Id'] : subPro;
    }
    // this.plann = plan[0]['Id'];
    this.AddFieldForm.get('class').reset();
    this.AddFieldForm.get('subclass').reset();
    this.AddFieldForm.get('checkbox').reset();
    this.AddFieldForm.get('irdia').reset();
    this.classNa = '';
    this.getsubclass();
    this.getClass();
  }

  getClass() {
    if (this.subProduct) {
      if (this.plan == 'GCV' || this.plan == 'Misc D') {
        const field = new FormData();
        field.append('lob', this.pro);
        field.append('product', this.plan);
        field.append('policy', this.policy);
        field.append('plan', this.plann);
        field.append('subPro', this.subProduct);
        this.api
          .HttpPostTypeBms('../v2/business_master/ProductMaster/getClass', field)
          .then(
            (resp) => {
              this.ClassN = resp['class'].map(item => ({ Id: item.Name, Name: item.Name }));
            },
            (err) => {
              console.error('HTTP error:', err);
            }
          );
      }
    }
  }

  onClass(classN: any) {
    if (classN !== null && classN !== undefined && classN.length > 0) {
      this.classNa = classN[0]['Id'] ? classN[0]['Id'] : classN;
    }
    this.AddFieldForm.get('subclass').reset();
    this.AddFieldForm.get('checkbox').reset();
    this.AddFieldForm.get('irdia').reset();
    this.getsubclass();
  }

  getsubclass() {
    if (this.classNa || this.plann) {
      if (this.pro == 'Motor') {
        const field = new FormData();
        field.append('lob', this.pro);
        field.append('product', this.plan);
        field.append('policy', this.policy);
        field.append('plan', this.plann);
        field.append('subPro', this.subProduct);
        field.append('class', this.classNa);
        this.api
          .HttpPostTypeBms('../v2/business_master/ProductMaster/getsubClass', field)
          .then(
            (resp) => {
              this.SubC = resp['subclass'].map(item => ({ Id: item.Name, Name: item.Name }));
            },
            (err) => {
              console.error('HTTP error:', err);
            }
          );
      }
    }
  }



  SearchData() {
    this.isSubmitted = true;
    var field = this.AddFieldForm.value;
    if (this.AddFieldForm.valid) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(field))).draw();
        //this.Is_Export = 1;
      });
    }
  }

  ClearSearch() {
    this.isSubmitted = false;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().search('').draw();
    });

    this.AddFieldForm.reset();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  dailog() {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });
  }

  update(id: any) {
    const dialogRef = this.dialog.open(ProductUpdateComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { id: id }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });
  }

}
