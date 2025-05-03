import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";


@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.css']
})
export class GenerateInvoiceComponent implements OnInit {

  addInvoice: FormGroup;
  generateInvoice: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;

  Month: { Id: string; Name: string }[];


  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettingsMultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
    closeDropDownOnSelection: boolean;
    showSelectedItemsAtTop: boolean;
    defaultOpen: boolean;
    limitSelection: number;
  };

  item: any;
  quantity: any;
  id: any;
  selectedItems: any;
  dataArr: any;
  totalamount: number;
  StatusVal: any;
  subtotalval: number;
  subtotalAmount: number;
  monthData: string;
  Monthval: { Id: string; Name: string; }[];
  Year: { Id: string; Name: string; }[];
  currentYear: number = new Date().getFullYear();
  years: { Id: string; Name: string; }[];
  currentMonth: number = new Date().getMonth() + 1;

  yearData: string;
  months: any[];
  selectedYear: any = 2023-2024;
  TotalPO: any;
  setsubtotal: number;
  selectedFinancialVal: string; // To hold the selected financial year
  selectedFinancialYear:  { Id: string; Name: string; }[];
  isSubmitButtonClicked: boolean = false;
  isDivVisible: boolean = true;
  checkboxvalue: boolean = true;

  
  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<GenerateInvoiceComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.id = this.data.id;

    // console.log(this.id);
    

    this.addInvoice = this.formBuilder.group({
      month: ["", Validators.required],
      year: ["", Validators.required],
    });


    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      limitSelection: -1,
    };

    this.Year = [
      { Id: "2023-2024", Name: "2023-2024" },
      { Id: "2024-2025", Name: "2024-2025" },
      { Id: "2025-2026", Name: "2025-2026" },
      { Id: "2026-2027", Name: "2026-2027" },
      { Id: "2027-2028", Name: "2027-2028" },
      { Id: "2028-2029", Name: "2028-2029" },
      { Id: "2029-2030", Name: "2029-2030" },
    ];


    this.Month = [
      { Id: "April", Name: "April" },
      { Id: "May", Name: "May" },
      { Id: "June", Name: "June" },
      { Id: "July", Name: "July" },
      { Id: "August", Name: "August" },
      { Id: "September", Name: "September" },
      { Id: "October", Name: "October" },
      { Id: "November", Name: "November" },
      { Id: "December", Name: "December" },
      { Id: "January", Name: "January" },
      { Id: "February", Name: "February" },
      { Id: "March", Name: "March" },
    ];


    const currentYear = new Date().getFullYear();
    
    // Filter the financial years array to include only the current financial year and the ones preceding it
    // this.Year = this.Year.filter(year => parseInt(year.Id.split('-')[0]) <= currentYear);

    this.Year = this.Year.filter(year => parseInt(year.Id.split('-')[0]) >= currentYear - 1 && parseInt(year.Id.split('-')[0]) <= currentYear);

    // Set the initial value of selectedFinancialYear to the current financial year
    this.selectedFinancialVal = currentYear + '-' + (currentYear + 1);
    this.selectedFinancialYear = [{ Id: this.selectedFinancialVal, Name:this.selectedFinancialVal}];

    // const currentMonthIndex = new Date().getMonth();

    // // Filter the months array to include only months before the current month
    // this.Month = this.Month.filter((this.MonthVal, index) => index < currentMonthIndex);

    this.generateInvoice = this.formBuilder.group({
      subtotal : [''],
      amountNoGst : [''],
      quantities: this.formBuilder.array([]),
    });


  }

  removeAllQuantities() {
    const quantitiesArray = this.generateInvoice.get('quantities') as FormArray;
    while (quantitiesArray.length !== 0) {
      quantitiesArray.removeAt(0);
    }
  }

  
  quantities(): FormArray {
    return this.generateInvoice.get("quantities") as FormArray;
  }


  ngOnInit() {
  }
  
  Reset(){
    this.addInvoice.reset();
    this.isSubmitButtonClicked = false;
    this.isDivVisible = false;
    this.StatusVal = 0;
  }


  SetGST(e:any){
    this.checkboxvalue = e.target.checked;

    if(e.target.checked == false){
      this.generateInvoice.get('subtotal').setValue('');
    }else{
      this.generateInvoice.get('subtotal').setValue(this.subtotalAmount);
    }

  }

  // Function to convert month number to month name
  updateSubtotal() {

    let subtotal = 0;

    this.quantities().controls.forEach((control, index) => {
      subtotal += this.calculateTotal(index);
    });

    this.setsubtotal = subtotal;


    const GST_RATE = 0.18;
    // this.subtotal = subtotal * GST_RATE;
    this.subtotalval = subtotal * GST_RATE;
    this.subtotalAmount = this.subtotalval + subtotal;
    this.generateInvoice.get('amountNoGst').setValue(this.setsubtotal);

    this.generateInvoice.get('subtotal').setValue(this.subtotalAmount);

  }


  onSearchChange(index: number) {
    const amount = this.quantities().at(index).get('amount').value;
    const count = this.dataArr[index]['count'];  


    console.log(this.TotalPO);
    console.log(this.setsubtotal);
    console.log(this.subtotalAmount);

    this.updateSubtotal();



  if(this.setsubtotal > this.TotalPO){
  // if(this.subtotalAmount > this.TotalPO){
    //     this.generateInvoice.get('amount').setValue('');
    // this.generateInvoice.get('totalamount').setValue('');

    // this.generateInvoice.get('amountNoGst').setValue('');

    // this.generateInvoice.get('subtotal').setValue('');

    const msg = "Amount should not be greater than Total Payout.";
    this.api.Toast("Warning", msg);

    
    return; // Stop submission
  }


    if (amount) {
      const totalAmount = count * amount;
      this.quantities().at(index).get('totalamount').setValue(totalAmount);
      this.updateSubtotal(); // Update subtotal whenever amount changes
    }
    if(amount == ''){
      this.generateInvoice.get('subtotal').setValue('');
    }
  }


  calculateTotal(index: number): number {
    const amount = this.quantities().at(index).get('amount').value;
    const count = this.dataArr[index]['count'];
    if (amount) {
      return count * amount;
    }
    return 0;
  }


  // onSearchChange() {
  //   const countvalue = this.generateInvoice.value["countvalue"];

  //   const amount = this.generateInvoice.value["amount"];
  //   console.log(countvalue);
  //   console.log(amount);

  //   this.totalamount = countvalue * amount;

  //   console.log( this.totalamount );

  //   this.generateInvoice.get("totalamount").setValue(this.totalamount);
  // }

  onSelectChange() {
    this.isSubmitButtonClicked = false;
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  get formControls() {
    return this.addInvoice.controls;
  }


  submit() {
    this.isSubmitted = true;
    if (this.addInvoice.invalid) {
      return;
    } else {
      this.isSubmitButtonClicked = true;
      this.removeAllQuantities();
      this.dataArr = [];

      var fields = this.addInvoice.value;
      const formData = new FormData();

      formData.append("id", this.id);
      formData.append("month", JSON.stringify(fields["month"]));
      formData.append("year", JSON.stringify(fields["year"]));

      this.monthData = JSON.stringify(fields["month"]);
      this.yearData = JSON.stringify(fields["year"]);
      this.api.IsLoading();
      this.api.HttpPostType("Url_Redirection/AddInvoice", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.isDivVisible = true;
            this.dataArr = result['data'];
            this.StatusVal = result['status'];
            this.TotalPO = result['TotalPO'];
            console.log(this.TotalPO);
            for (let data of this.dataArr) {
                this.quantities().push(
                  this.formBuilder.group({
                    productName: [data.ProductName],
                    countvalue: [data.count],
                    Id: [data.Sr_Id],
                    amount: [""],
                    totalamount: [""],
                  })
                );
              }

              
              this.api.Toast("Success", result["msg"]);

          } else {
            this.isDivVisible = false;
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
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
  }


  get formControls1() {
    return this.generateInvoice.value;
  }


  invoiceSubmit() {
    this.updateSubtotal();

    var fields = this.generateInvoice.value;

    // var fields1 = this.generateInvoice.controls;
    // console.log(fields);

    // if(this.setsubtotal > this.TotalPO){
      // 
      console.log(this.TotalPO);
      console.log(this.setsubtotal);
    if(this.setsubtotal > this.TotalPO){
      const msg = "Amount should not be greater than Total Payout.";
      this.api.Toast("Warning", msg);
      return; // Stop submission
    }

    const formData = new FormData();

    this.isSubmitted = true;
    if (this.generateInvoice.invalid) {
      return;
    } else {
      var fields = this.generateInvoice.value;
      const formData = new FormData();
      // // console.log(formData);
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      formData.append("id", this.id);

      if(this.checkboxvalue == true){
        formData.append("subtotal", fields["subtotal"]);
      }else{
        formData.append("subtotal", '');

      }
      formData.append("months", this.monthData);
      formData.append("yeardata", this.yearData);
      formData.append("amountWithoutGst", fields["amountNoGst"]);
      formData.append("quantities", JSON.stringify(fields["quantities"]));

      this.api.IsLoading();
      this.api.HttpPostType("Url_Redirection/CreateInvoice", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
            // this.router.navigate(["Assets/Action"]);
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
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
  }


}
