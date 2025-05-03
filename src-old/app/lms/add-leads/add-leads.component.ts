import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { empty } from "rxjs";
import { mixinDisabled } from "@angular/material";
// import { CKEditorComponent } from 'ckeditor4-angular';

@Component({
  selector: "app-add-leads",
  templateUrl: "./add-leads.component.html",
  styleUrls: ["./add-leads.component.css"],
})
export class AddLeadsComponent implements OnInit {
  // @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  // dtOptions: DataTables.Settings = {};

  // dataAr: any;

  LeadForm: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;
  8;
  // dataAr2: any;

  selectedFiles: File;
  kyc: File;
  other: File;
  invoice: File;
  rcfrontimage: File;
  rcbackimage: File;
  previouspolicydocuments: File;

  ActionType: any = "";

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

  SubProducts: { Id: number; Name: string }[];

  Mail: { Id: string; Name: string }[];

  attachement: File;
  currentUrl: string;
  pos: boolean;
  LeadType: { Id: string; Name: string }[];
  // Transaction: { Id: string; Name: string; }[];
  Addon: any[];
  Vehicle: { Id: string; Name: string }[];
  FileType: { Id: string; Name: string }[];
  PolicyExpiry: { Id: string; Name: string }[];
  RegistrationY: { Id: string; Name: string }[];
  PolicyType: { Id: string; Name: string }[];
  PAOwner: { Id: string; Name: string }[];
  NCB: { Id: string; Name: string }[];
  Company: any;
  Make: any;
  Modal: any;
  // lead: any;
  leader: any;
  FuleType: { Id: string; Name: string }[];
  // Transactions: any;
  HealthPolicyType: { Id: string; Name: string }[];
  InsuranceType: { Id: string; Name: string }[];
  SumInsure: { Id: string; Name: string }[];
  Age: { Id: string; Name: string }[];
  leads: any;
  Variant: any;
  QuotesCompany: any;
  Filetypes: any;
  vehicles: any;
  Policyexpiryselect: any;
  Pincode: any[];
  TotalQuantity: any;
  son: any;
  SmallAge: { Id: string; Name: string }[];
  FuleTypes: any;
  Addonsss: { Id: string; Name: string }[];
  limit = 0;
  limitdaughter = 0;
  individialhealth: any;

  // leaders: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddLeadsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.LeadForm = this.formBuilder.group({
      addSons: this.formBuilder.array([]),

      addDaughters: this.formBuilder.array([]),

      lead: ["", Validators.required],
      name: ["", Validators.required],
      mobile: ["", Validators.required],
      email: ["", Validators.required],

      // transaction: [''],
      vehicle: [""],

      filetype: [""],
      policyexpiry: [""],
      Registration_State_Code: [""],
      Registration_District_Code: [""],

      Registration_City_Code: [""],
      Registration_Code: [""],
      registrationyear: [""],
      policytype: [""],
      paowner: [""],
      ncb: [""],
      idv: [""],
      engineno: [""],
      chassisno: [""],
      newpolicyno: [""],
      insurer: [""],
      make: [""],
      modal: [""],
      fuletype: [""],
      variant: [""],

      previouspolicyno: [""],
      policyexpirydate: [""],
      previouspolicydocuments: [""],
      previousinsurer: [""],

      quotescompany: [""],
      addon: [""],

      healthpolicytype: [""],

      kyc: [""],
      other: [""],
      remarks: [""],
      check: [""],
      gender: [""],
      pincode: [""],
      individual: [""],
      suminsure: [""],
      insurancetype: [""],
      organisation: [""],
      // city:[''],
      nonmotorremarks: [""],
      invoice: [],
      rcfrontimage: [],
      rcbackimage: [],
      selectselfage: [""],
      ageself: [""],
      selectspouseage: [""],
      agespous: [""],
      sonage: this.formBuilder.array([]),
      daughterage: this.formBuilder.array([]),
      selectfatherage: [""],
      fatherage: [""],
      selectmotherage: [""],
      motherage: [""],
      pincodeNonmotor: [""],
      cityNonmotor: [""],
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
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      limitSelection: 5,
    };

    this.LeadType = [
      { Id: "1", Name: "Bike" },
      { Id: "2", Name: "Car" },
      { Id: "3", Name: "Health" },
      { Id: "4", Name: "Non Motor" },
    ];

    this.Addon = [
      { Id: "Emergency Cover", Name: "Emergency Cover" },
      { Id: "Zero Depriciation Cover", Name: "Zero Depriciation Cover" },
      { Id: "Consumables", Name: "Consumables" },
      { Id: "Tyre Cover", Name: "Tyre Cover" },
      { Id: "NCB Protection", Name: "NCB Protection" },
      { Id: "Engine Protector", Name: "Engine Protector" },
      { Id: "Return To Invoice", Name: "Return To Invoice" },
      { Id: "Loss Of Key", Name: "Loss Of Key" },
      { Id: "Road Side Assistance", Name: "Road Side Assistance" },
      { Id: "Passenger Assist cover", Name: "Passenger Assist cover" },
      { Id: "Loss Personal Belonging", Name: "Loss Personal Belonging" },
      { Id: "Hospital Cash Cover", Name: "Hospital Cash Cover" },
    ];

    this.Addonsss = [
      { Id: "Zero Depriciation Cover", Name: "Zero Depriciation Cover" },
      { Id: "Road Side Assistance", Name: "Road Side Assistance" },
    ];

    this.Vehicle = [
      { Id: "individual", Name: "Individual" },
      { Id: "organization", Name: "Organization" },
    ];

    this.FileType = [
      { Id: "New", Name: "New" },
      { Id: "Rollover", Name: "Rollover" },
    ];

    this.PolicyExpiry = [
      { Id: "not_expired", Name: "Not Expired" },
      { Id: "expired_within_90_days", Name: "Expired within 90 days" },
      { Id: "expired_more_than_90_days", Name: "Expired more than 90 days" },
      { Id: "dont_know", Name: "Don't know" },
    ];

    this.RegistrationY = [
      { Id: "2022", Name: "2022" },
      { Id: "2021", Name: "2021" },
      { Id: "2020", Name: "2020" },
      { Id: "2019", Name: "2019" },
      { Id: "2018", Name: "2018" },
      { Id: "2017", Name: "2017" },
      { Id: "2016", Name: "2016" },
      { Id: "2015", Name: "2015" },
      { Id: "2014", Name: "2014" },
      { Id: "2013", Name: "2013" },
      { Id: "2012", Name: "2012" },
      { Id: "2011", Name: "2011" },
      { Id: "2010", Name: "2010" },
      { Id: "2009", Name: "2009" },
      { Id: "2008", Name: "2008" },
      { Id: "2007", Name: "2007" },
      { Id: "2006", Name: "2006" },
      { Id: "2005", Name: "2005" },
      { Id: "2004", Name: "2004" },
      { Id: "2003", Name: "2003" },
      { Id: "2002", Name: "2002" },
      { Id: "2001", Name: "2001" },
      { Id: "2000", Name: "2000" },
      { Id: "1999", Name: "1999" },
      { Id: "1998", Name: "1998" },
      { Id: "1997", Name: "1997" },
      { Id: "1996", Name: "1996" },
      { Id: "1995", Name: "1995" },
      { Id: "1994", Name: "1994" },
      { Id: "1993", Name: "1993" },
      { Id: "1992", Name: "1992" },
      { Id: "1991", Name: "1991" },
      { Id: "1990", Name: "1990" },
      { Id: "1989", Name: "1989" },
      { Id: "1988", Name: "1988" },
      { Id: "1987", Name: "1987" },
      { Id: "1986", Name: "1986" },
      { Id: "1985", Name: "1985" },
      { Id: "1984", Name: "1984" },
      { Id: "1983", Name: "1983" },
    ];

    this.PolicyType = [
      { Id: "comprehensive", Name: "Comprehensive/Package" },
      { Id: "third_party", Name: "Third Party" },
      { Id: "saod", Name: "Saod" },
    ];

    this.PAOwner = [
      { Id: "yes", Name: "Yes" },
      { Id: "no", Name: "No" },
    ];

    this.NCB = [
      { Id: "0%", Name: "0%" },
      { Id: "20", Name: "20%" },
      { Id: "25", Name: "25%" },
      { Id: "35", Name: "35%" },
      { Id: "45", Name: "45%" },
      { Id: "50", Name: "50%" },
    ];

    // this.FuleType = [
    //   { Id: "PETROL", Name: "Petrol" },
    //   { Id: "DISEL", Name: "Diesel" },
    // ];

    this.HealthPolicyType = [
      { Id: "fresh", Name: "Fresh" },
      { Id: "portibility", Name: "Portibility" },
    ];

    this.InsuranceType = [
      { Id: "4", Name: "Marine Insurance" },
      { Id: "5", Name: "Contractor's Plant and Machinery" },
      { Id: "6", Name: "Package Policy" },
      { Id: "7", Name: "Professional Indemnity" },
      { Id: "8", Name: "Contractors All Risk" },
      { Id: "9", Name: "Erection All Risk" },
      { Id: "10", Name: "Public Liability" },
      { Id: "11", Name: "Standard Fire Perils Policy" },
    ];

    this.SumInsure = [
      { Id: "100000", Name: "1 Lac" },
      { Id: "200000", Name: "2 Lac" },
      { Id: "300000", Name: "3 Lacs" },
      { Id: "400000", Name: "4 Lacs" },
      { Id: "500000", Name: "5 Lacs" },
      { Id: "600000", Name: "6 Lacs" },
      { Id: "700000", Name: "7 Lacs" },
      { Id: "800000", Name: "8 Lacs" },
      { Id: "900000", Name: "9 Lacs" },
      { Id: "1000000", Name: "10 Lacs" },
      { Id: "1500000", Name: "15 Lacs" },
      { Id: "2000000", Name: "20 Lacs" },
      { Id: "2500000", Name: "25 Lacs" },
      { Id: "3000000", Name: "30 Lacs" },
      { Id: "4000000", Name: "40 Lacs" },
      { Id: "5000000", Name: "50 Lacs" },
      { Id: "6000000", Name: "60 Lacs" },
      { Id: "7500000", Name: "75 Lacs" },
      { Id: "10000000", Name: "1 Cr" },
      { Id: "15000000", Name: "1.5 Cr" },
    ];
  }

  ngOnInit() {
    // this.FileType_Status();
    this.leader;
    this.vehicles;
    this.Filetypes;
    this.Policyexpiryselect;
    // console.log(this.vehicles);

    this.FilterDatacompany();
    this.FilterQuotesCompany();
    this.FilterPincode();

    var i = 3;

    this.TotalQuantity = "3";

    // for (i = 1; i < this.TotalQuantity; i++) {
    // console.log(this.TotalQuantity);
    this.addSonsage();
    // }

    // for (i = 1; i < this.TotalQuantity; i++) {
    this.addDaughtersage();
    // }
  }

  addSons(): FormArray {
    return this.LeadForm.get("addSons") as FormArray;
  }

  addDaughters(): FormArray {
    return this.LeadForm.get("addDaughters") as FormArray;
  }

  newQuantityson(): FormGroup {
    return this.formBuilder.group({
      sonage: "",
      // selectson1age: [""],
    });
  }

  newQuantitydaught(): FormGroup {
    return this.formBuilder.group({
      daughterage: "",
    });
  }

  addSonsage() {
    this.limit = +this.limit + +1;

    if (this.limit <= 3) {
      this.addSons().push(this.newQuantityson());
      // console.log(this.newQuantityson());
    }
    // console.log(this.limit);
  }

  addDaughtersage() {
    this.limitdaughter = +this.limitdaughter + +1;

    if (this.limitdaughter <= 3) {
      // console.log(this.limitdaughter);
      this.addDaughters().push(this.newQuantitydaught());
    }
  }

  removedaughterQuantity(i: number) {
    this.limitdaughter = +this.limitdaughter - +1;

    if (this.limitdaughter >= 0) {
      // console.log(this.limitdaughter);
      this.addDaughters().removeAt(i);
    }
  }

  removeQuantity(i: number) {
    this.limit = +this.limit - +1;

    if (this.limit >= 0) {
      // console.log(this.limit);

      this.addSons().removeAt(i);
    }
  }

  FileType_Status(leader, vehicles, Filetypes, Policyexpiryselect) {
    // alert(file);
    // this.leader = this.LeadForm.value['lead'][0]['Id'];
    // // console.log(this.leader);

    //  this.leaders = this.LeadForm.get['lead'].value['lead'][0]['Id'];
    //  // console.log(this.leaders);

    // this.leader = this.LeadForm.value['lead'][0]['Id'];

    // this.vehicles = this.LeadForm.get('vehicle').value;

    // this.Filetypes = this.LeadForm.get('filetype').value;

    // if(empty(this.vehicles)){

    //   this.vehicles = this.LeadForm.value['vehicle'][0]['Id'];

    // }
    // // console.log(this.vehicles);
    // if(empty(this.Filetypes)){

    //     this.Filetypes = this.LeadForm.value['filetype'][0]['Id'];

    // }

    // this.leader = this.LeadForm.get('lead').value;

    // if(empty(this.leader)){

    // this.leader = this.LeadForm.value['lead'][0]['Id'];

    // }
    // // console.log(this.leader);

    //  if(!empty(this.leader)){

    //  }

    // const transaction = this.LeadForm.get('transaction');

    const vehicle = this.LeadForm.get("vehicle");
    const filetype = this.LeadForm.get("filetype");
    const policyexpiry = this.LeadForm.get("policyexpiry");
    const Registration_State_Code = this.LeadForm.get(
      "Registration_State_Code"
    );
    const Registration_District_Code = this.LeadForm.get(
      "Registration_District_Code"
    );
    const Registration_City_Code = this.LeadForm.get("Registration_City_Code");
    const Registration_Code = this.LeadForm.get("Registration_Code");

    const registrationyear = this.LeadForm.get("registrationyear");
    const policytype = this.LeadForm.get("policytype");
    const paowner = this.LeadForm.get("paowner");
    const ncb = this.LeadForm.get("ncb");
    const idv = this.LeadForm.get("idv");
    const engineno = this.LeadForm.get("engineno");

    const chassisno = this.LeadForm.get("chassisno");
    const newpolicyno = this.LeadForm.get("newpolicyno");
    const insurer = this.LeadForm.get("insurer");
    const make = this.LeadForm.get("make");
    const modal = this.LeadForm.get("modal");
    const fuletype = this.LeadForm.get("fuletype");
    const variant = this.LeadForm.get("variant");

    const previouspolicyno = this.LeadForm.get("previouspolicyno");
    const policyexpirydate = this.LeadForm.get("policyexpirydate");
    const previouspolicydocuments = this.LeadForm.get(
      "previouspolicydocuments"
    );
    const previousinsurer = this.LeadForm.get("previousinsurer");

    const quotescompany = this.LeadForm.get("quotescompany");
    const addon = this.LeadForm.get("addon");
    const healthpolicytype = this.LeadForm.get("healthpolicytype");
    const kyc = this.LeadForm.get("kyc");
    const other = this.LeadForm.get("other");
    const invoice = this.LeadForm.get("invoice");
    const rcfrontimage = this.LeadForm.get("rcfrontimage");
    const rcbackimage = this.LeadForm.get("rcbackimage");

    const remarks = this.LeadForm.get("remarks");
    const check = this.LeadForm.get("check");

    const gender = this.LeadForm.get("gender");
    const pincode = this.LeadForm.get("pincode");
    const individual = this.LeadForm.get("individual");
    const suminsure = this.LeadForm.get("suminsure");

    const selectselfage = this.LeadForm.get("selectselfage");
    const ageself = this.LeadForm.get("ageself");
    const selectspouseage = this.LeadForm.get("selectspouseage");
    const agespous = this.LeadForm.get("agespous");
    // const selectson1age = this.LeadForm.get('selectson1age');
    const sonage = this.LeadForm.get("addSons");
    // const selectdaughter1age = this.LeadForm.get('selectdaughter1age');
    const daughter1age = this.LeadForm.get("addDaughters");
    const selectfatherage = this.LeadForm.get("selectfatherage");
    const fatherage = this.LeadForm.get("fatherage");
    const selectmotherage = this.LeadForm.get("selectmotherage");
    const motherage = this.LeadForm.get("motherage");

    const insurancetype = this.LeadForm.get("insurancetype");
    const organisation = this.LeadForm.get("organisation");
    // const city = this.LeadForm.get('city');
    const nonmotorremarks = this.LeadForm.get("nonmotorremarks");
    const pincodeNonmotor = this.LeadForm.get("pincodeNonmotor");
    const cityNonmotor = this.LeadForm.get("cityNonmotor");

    if (leader == "1" || leader == "2") {
      vehicle.setValidators([Validators.required]);
      filetype.setValidators([Validators.required]);
      policyexpiry.setValidators(null);
      Registration_State_Code.setValidators(null);
      Registration_City_Code.setValidators(null);
      Registration_District_Code.setValidators(null);
      Registration_Code.setValidators(null);
      registrationyear.setValidators([Validators.required]);
      policytype.setValidators(null);
      pincodeNonmotor.setValidators(null);
      paowner.setValidators(null);
      ncb.setValidators(null);
      idv.setValidators([Validators.required]);
      engineno.setValidators([Validators.required]);
      chassisno.setValidators([Validators.required]);
      newpolicyno.setValidators([Validators.required]);
      insurer.setValidators([Validators.required]);
      make.setValidators([Validators.required]);
      modal.setValidators([Validators.required]);
      fuletype.setValidators([Validators.required]);
      variant.setValidators([Validators.required]);
      previouspolicyno.setValidators(null);
      policyexpirydate.setValidators(null);
      previouspolicydocuments.setValidators(null);
      previousinsurer.setValidators(null);
      invoice.setValidators(null);
      rcfrontimage.setValidators(null);
      rcbackimage.setValidators(null);
      quotescompany.setValidators([Validators.required]);
      addon.setValidators([Validators.required]);
      cityNonmotor.setValidators(null);

      healthpolicytype.setValidators(null);
      kyc.setValidators(null);
      other.setValidators(null);
      remarks.setValidators(null);
      check.setValidators(null);

      gender.setValidators(null);
      pincode.setValidators(null);
      individual.setValidators(null);
      suminsure.setValidators(null);
      insurancetype.setValidators(null);
      organisation.setValidators(null);
      // city.setValidators(null);
      nonmotorremarks.setValidators(null);

      selectselfage.setValidators(null);
      ageself.setValidators(null);
      selectspouseage.setValidators(null);
      agespous.setValidators(null);
      // selectson1age.setValidators(null);
      sonage.setValidators(null);
      // selectdaughter1age.setValidators(null);
      daughter1age.setValidators(null);
      selectfatherage.setValidators(null);
      fatherage.setValidators(null);
      selectmotherage.setValidators(null);
      motherage.setValidators(null);

      if (vehicles == "individual") {
        paowner.setValidators([Validators.required]);
      }

      if (Filetypes == "New") {
        invoice.setValidators([Validators.required]);
        Registration_State_Code.setValidators([Validators.required]);
        Registration_City_Code.setValidators([Validators.required]);
        Registration_District_Code.setValidators(null);
        Registration_Code.setValidators(null);
      } else if (Filetypes == "Rollover") {
        ncb.setValidators([Validators.required]);
        policyexpiry.setValidators([Validators.required]);
        rcfrontimage.setValidators([Validators.required]);
        rcbackimage.setValidators([Validators.required]);
        policytype.setValidators([Validators.required]);
        Registration_State_Code.setValidators([Validators.required]);
        Registration_City_Code.setValidators([Validators.required]);
        Registration_District_Code.setValidators([Validators.required]);
        Registration_Code.setValidators([Validators.required]);
      }

      if (
        Policyexpiryselect == "not_expired" ||
        Policyexpiryselect == "expired_within_90_days" ||
        Policyexpiryselect == "expired_more_than_90_days"
      ) {
        previouspolicyno.setValidators([Validators.required]);
        policyexpirydate.setValidators([Validators.required]);
        previouspolicydocuments.setValidators([Validators.required]);
        previousinsurer.setValidators([Validators.required]);
      }
    }

    if (leader == "3") {
      // transaction.setValidators(null);
      vehicle.setValidators(null);
      filetype.setValidators(null);
      policyexpiry.setValidators(null);
      Registration_State_Code.setValidators(null);
      Registration_District_Code.setValidators(null);
      Registration_City_Code.setValidators(null);
      Registration_Code.setValidators(null);
      registrationyear.setValidators(null);
      policytype.setValidators(null);
      paowner.setValidators(null);
      ncb.setValidators(null);
      idv.setValidators(null);
      engineno.setValidators(null);
      previouspolicyno.setValidators(null);
      policyexpirydate.setValidators(null);
      previouspolicydocuments.setValidators(null);
      previousinsurer.setValidators(null);
      chassisno.setValidators(null);
      newpolicyno.setValidators(null);
      insurer.setValidators(null);
      make.setValidators(null);
      modal.setValidators(null);
      fuletype.setValidators(null);
      variant.setValidators(null);
      quotescompany.setValidators(null);
      addon.setValidators(null);
      invoice.setValidators(null);
      rcfrontimage.setValidators(null);
      rcbackimage.setValidators(null);
      pincodeNonmotor.setValidators(null);
      cityNonmotor.setValidators(null);
      healthpolicytype.setValidators([Validators.required]);
      kyc.setValidators([Validators.required]);
      other.setValidators([Validators.required]);
      remarks.setValidators([Validators.required]);
      check.setValidators([Validators.required]);
      gender.setValidators([Validators.required]);
      pincode.setValidators([Validators.required]);
      individual.setValidators([Validators.required]);
      suminsure.setValidators([Validators.required]);

      insurancetype.setValidators(null);
      organisation.setValidators(null);
      // city.setValidators(null);
      nonmotorremarks.setValidators(null);

      selectselfage.setValidators(null);
      ageself.setValidators(null);
      selectspouseage.setValidators(null);
      agespous.setValidators(null);
      // selectson1age.setValidators(null);
      sonage.setValidators(null);
      // selectdaughter1age.setValidators(null);
      daughter1age.setValidators(null);
      selectfatherage.setValidators(null);
      fatherage.setValidators(null);
      selectmotherage.setValidators(null);
      motherage.setValidators(null);

      //disable previous policy status new
    }

    if (leader == "4") {
      // transaction.setValidators(null);
      vehicle.setValidators(null);
      filetype.setValidators(null);
      policyexpiry.setValidators(null);
      Registration_State_Code.setValidators(null);
      Registration_District_Code.setValidators(null);
      Registration_City_Code.setValidators(null);
      Registration_Code.setValidators(null);
      registrationyear.setValidators(null);
      policytype.setValidators(null);
      paowner.setValidators(null);
      ncb.setValidators(null);
      idv.setValidators(null);
      engineno.setValidators(null);

      chassisno.setValidators(null);
      newpolicyno.setValidators(null);
      insurer.setValidators(null);
      make.setValidators(null);
      modal.setValidators(null);
      fuletype.setValidators(null);
      variant.setValidators(null);

      previouspolicyno.setValidators(null);
      policyexpirydate.setValidators(null);
      previouspolicydocuments.setValidators(null);
      previousinsurer.setValidators(null);

      quotescompany.setValidators(null);
      addon.setValidators(null);
      healthpolicytype.setValidators(null);

      kyc.setValidators(null);
      other.setValidators(null);
      remarks.setValidators(null);
      check.setValidators(null);
      gender.setValidators(null);
      pincode.setValidators(null);
      individual.setValidators(null);
      suminsure.setValidators(null);
      invoice.setValidators(null);
      rcfrontimage.setValidators(null);
      rcbackimage.setValidators(null);
      selectselfage.setValidators(null);
      ageself.setValidators(null);
      selectspouseage.setValidators(null);
      agespous.setValidators(null);
      // selectson1age.setValidators(null);
      sonage.setValidators(null);
      // selectdaughter1age.setValidators(null);
      daughter1age.setValidators(null);
      selectfatherage.setValidators(null);
      fatherage.setValidators(null);
      selectmotherage.setValidators(null);
      motherage.setValidators(null);

      insurancetype.setValidators([Validators.required]);
      organisation.setValidators([Validators.required]);
      // city.setValidators([Validators.required]);
      nonmotorremarks.setValidators([Validators.required]);
      pincodeNonmotor.setValidators([Validators.required]);
      cityNonmotor.setValidators([Validators.required]);

      //disable previous policy status new
    }

    // transaction.updateValueAndValidity();
    vehicle.updateValueAndValidity();
    filetype.updateValueAndValidity();
    policyexpiry.updateValueAndValidity();
    Registration_State_Code.updateValueAndValidity();
    Registration_District_Code.updateValueAndValidity();
    Registration_City_Code.updateValueAndValidity();
    Registration_Code.updateValueAndValidity();
    registrationyear.updateValueAndValidity();
    policytype.updateValueAndValidity();
    paowner.updateValueAndValidity();
    ncb.updateValueAndValidity();
    idv.updateValueAndValidity();
    engineno.updateValueAndValidity();

    chassisno.updateValueAndValidity();
    newpolicyno.updateValueAndValidity();
    insurer.updateValueAndValidity();
    make.updateValueAndValidity();
    modal.updateValueAndValidity();
    fuletype.updateValueAndValidity();
    variant.updateValueAndValidity();

    previouspolicyno.updateValueAndValidity();
    policyexpirydate.updateValueAndValidity();
    previouspolicydocuments.updateValueAndValidity();
    previousinsurer.updateValueAndValidity();

    quotescompany.updateValueAndValidity();
    addon.updateValueAndValidity();
    healthpolicytype.updateValueAndValidity();
    kyc.updateValueAndValidity();
    other.updateValueAndValidity();
    remarks.updateValueAndValidity();
    check.updateValueAndValidity();
    gender.updateValueAndValidity();
    pincode.updateValueAndValidity();
    individual.updateValueAndValidity();
    suminsure.updateValueAndValidity();
    invoice.updateValueAndValidity();
    rcfrontimage.updateValueAndValidity();
    rcbackimage.updateValueAndValidity();

    insurancetype.updateValueAndValidity();
    organisation.updateValueAndValidity();
    // city.updateValueAndValidity();
    nonmotorremarks.updateValueAndValidity();

    selectselfage.updateValueAndValidity();
    ageself.updateValueAndValidity();
    selectspouseage.updateValueAndValidity();
    agespous.updateValueAndValidity();
    // selectson1age.updateValueAndValidity();
    sonage.updateValueAndValidity();
    // selectdaughter1age.updateValueAndValidity();
    daughter1age.updateValueAndValidity();
    selectfatherage.updateValueAndValidity();
    fatherage.updateValueAndValidity();
    selectmotherage.updateValueAndValidity();
    motherage.updateValueAndValidity();
    pincodeNonmotor.updateValueAndValidity();
    cityNonmotor.updateValueAndValidity();
  }

  FilterDatacompany() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Globel/GetIns_Companies?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Company = result["Ins_Compaines"];
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  FilterMake() {
    // this.onSelect();
    // this.leader = this.LeadForm.value['lead'][0]['Id'];

    // console.log(this.leader);

    this.api.IsLoading();
    this.api

      .HttpGetType(
        "MyAccountLeads/FilterMake?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Lead=" +
          this.leader
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.Make = result["Data"];
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  FilterFuelType(e) {
    // this.onSelect();
    // this.leader = this.LeadForm.value['lead'][0]['Id'];

    // console.log(e);

    this.api.IsLoading();
    this.api

      .HttpGetType(
        "MyAccountLeads/FilterFuelType?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Lead=" +
          e.Name
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.FuleTypes = result["Data"];
            // console.log(this.FuleTypes);
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  FilterModal(e) {
    // this.LeadForm.get("lead")[0]['Id'].setValue("make");
    // console.log(e.Name);
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "MyAccountLeads/FilterModal?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Make=" +
          e.Name
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            // this.Category.Id;
            this.Modal = result["Data"];
            // console.log(this.Modal);
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  FilterVariant(e) {
    // console.log(e.Name);
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "MyAccountLeads/FilterVariant?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Make=" +
          e.Name
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            // this.Category.Id;
            this.Variant = result["Data"];
            // console.log(this.Modal);
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  FilterQuotesCompany() {
    this.api.IsLoading();
    this.api

      .HttpGetType(
        "MyAccountLeads/FilterQuotesCompany?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )

      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.QuotesCompany = result["Data"];
            // console.log(this.QuotesCompany);
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  FilterPincode() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "MyAccountLeads/search_pincode?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.Pincode = result["Data"];
            // console.log(this.Pincode);
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  get formControls() {
    return this.LeadForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.LeadForm.invalid) {
      return;
    } else {
      var fields = this.LeadForm.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("typex", fields["lead"][0]["Id"]);
      formData.append("namex", fields["name"]);
      formData.append("mobilex", fields["mobile"]);
      formData.append("emailx", fields["email"]);
      formData.append("transition", "saved");

      if (this.leader == 1 || this.leader == 2) {
        formData.append("vehicle_owned_by", fields["vehicle"][0]["Id"]);
        formData.append("fileTypex", fields["filetype"][0]["Id"]);
        formData.append("state_code", fields["Registration_State_Code"]);
        formData.append("mid_no", fields["Registration_District_Code"]);
        formData.append("city_code", fields["Registration_City_Code"]);
        formData.append("number_gadi", fields["Registration_Code"]);

        formData.append("reg_year", fields["registrationyear"][0]["Id"]);
        formData.append("IDV", fields["idv"]);
        formData.append("engine_no", fields["engineno"]);
        formData.append("chassis_no", fields["chassisno"]);
        formData.append("new_policy_no", fields["newpolicyno"]);
        formData.append("current_insx", fields["insurer"][0]["Id"]);

        formData.append("makex", fields["make"][0]["Name"]);
        formData.append("modalx", fields["modal"][0]["Name"]);
        formData.append("fuel_typex", fields["fuletype"][0]["Name"]);
        formData.append("variantx", fields["variant"][0]["Name"]);

        formData.append("addon", fields["addon"][0]["Id"]);
        formData.append("quotes_company", fields["quotescompany"][0]["Id"]);

        if (this.vehicles == "individual" && this.vehicles != "") {
          formData.append("pa_owner", fields["paowner"][0]["Id"]);
        }

        if (this.Filetypes == "New" && this.Filetypes != "") {
          formData.append("invoicex", this.invoice);
        }

        if (this.Filetypes == "Rollover" && this.Filetypes != "") {
          formData.append("NCB", fields["ncb"][0]["Id"]);
          formData.append(
            "policy_expiry_periodx",
            fields["policyexpiry"][0]["Id"]
          );
          formData.append("rc_front_imagexx", this.rcfrontimage);
          formData.append("rc_back_imagexx", this.rcbackimage);
          formData.append("policy_typex", fields["policytype"][0]["Id"]);
        }

        if (
          this.Policyexpiryselect == "not_expired" ||
          this.Policyexpiryselect == "expired_within_90_days" ||
          (this.Policyexpiryselect == "expired_more_than_90_days" &&
            this.Policyexpiryselect != "")
        ) {
          formData.append("previous_policy_no", fields["previouspolicyno"]);
          formData.append("expiry_datex", fields["policyexpirydate"]);
          formData.append("userfile[]", this.previouspolicydocuments);
          formData.append("previous_insx", fields["previousinsurer"][0]["Id"]);
        }
      }

      if (this.leader == 3) {
        formData.append(
          "health_policy_type",
          fields["healthpolicytype"][0]["Id"]
        );
        formData.append("health_lead_kyc_docx", this.kyc);
        formData.append("health_lead_other_docx", this.other);
        formData.append("lead_followUp", fields["remarks"]);
        formData.append("any_disease", fields["check"]);
        formData.append("gender", fields["gender"]);
        formData.append("Plan_ind_float", fields["individual"]);
        formData.append("pincode", fields["pincode"][0]["Name"]);
        formData.append("sumInsured", fields["suminsure"][0]["Id"]);
        formData.append("selfage", fields["ageself"]);
        formData.append("spouseage", fields["agespous"]);
        formData.append("fatherage", fields["fatherage"]);
        formData.append("motherage", fields["motherage"]);
        formData.append("sons_age", JSON.stringify(fields["addSons"]));
        formData.append("daughter_age", JSON.stringify(fields["addDaughters"]));
      }

      if (this.leader == 4) {
        formData.append(
          "type_of_corpinsurancex",
          fields["insurancetype"][0]["Name"]
        );
        formData.append("organisationx", fields["organisation"]);
        formData.append("pincodex", fields["pincodeNonmotor"][0]["Id"]);
        // formData.append('city', fields['city']);
        formData.append("lead_followUp", fields["nonmotorremarks"]);
        formData.append("citynon", fields["cityNonmotor"]);
      }

      // console.log(fields);

      // // console.log('formData');
      this.api.IsLoading();
      this.api.HttpPostType("MyAccountLeads/add_leads", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
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

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      // console.log(this.selectedFiles);
      // console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + ' kb');

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "kyc") {
            this.LeadForm.get("kyc").setValue("");
          }
          if (Type == "other") {
            this.LeadForm.get("other").setValue("");
          }
          if (Type == "invoice") {
            this.LeadForm.get("invoice").setValue("");
          }
          if (Type == "rcfrontimage") {
            this.LeadForm.get("rcfrontimage").setValue("");
          }
          if (Type == "rcbackimage") {
            this.LeadForm.get("rcbackimage").setValue("");
          }
          if (Type == "previouspolicydocuments") {
            this.LeadForm.get("previouspolicydocuments").setValue("");
          }
        } else {
          if (Type == "kyc") {
            this.kyc = this.selectedFiles;
          }
          if (Type == "other") {
            this.other = this.selectedFiles;
          }
          if (Type == "invoice") {
            this.invoice = this.selectedFiles;
          }
          if (Type == "rcfrontimage") {
            this.rcfrontimage = this.selectedFiles;
          }
          if (Type == "rcbackimage") {
            this.rcbackimage = this.selectedFiles;
          }
          if (Type == "previouspolicydocuments") {
            this.previouspolicydocuments = this.selectedFiles;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "kyc") {
          this.LeadForm.get("kyc").setValue("");
        }
        if (Type == "other") {
          this.LeadForm.get("other").setValue("");
        }
        if (Type == "invoice") {
          this.LeadForm.get("invoice").setValue("");
        }
        if (Type == "rcfrontimage") {
          this.LeadForm.get("rcfrontimage").setValue("");
        }
        if (Type == "rcbackimage") {
          this.LeadForm.get("rcbackimage").setValue("");
        }
        if (Type == "previouspolicydocuments") {
          this.LeadForm.get("previouspolicydocuments").setValue("");
        }
      }
    }
  }

  onSelect(type) {
    //  this.Filetypes=this.vehicles ='0';
    // alert(this.LeadForm.value['lead'][0]['Id']);
    // // console.log( this.LeadForm );

    if (type == "lead") {
      this.leader = this.LeadForm.get("lead").value;
    }

    if (type == "vehicle") {
      this.vehicles = this.LeadForm.get("vehicle").value;
    }

    if (type == "FileType") {
      this.Filetypes = this.LeadForm.get("filetype").value;
    }

    if (type == "policyexpire") {
      this.Policyexpiryselect = this.LeadForm.get("policyexpiry").value;
    }

    // if(type == 'single') {
    //   this.individialhealth = this.LeadForm.get('individual').value;
    //   // console.log(this.individialhealth);
    // }
    // this.individialhealth = this.LeadForm.get('individual').value;
    // // console.log(this.individialhealth);

    // console.log(this.leader);
    // console.log(this.Filetypes);
    // console.log(this.vehicles);
    // console.log(this.Policyexpiryselect);

    if (type == "lead") {
      if (empty(this.leader)) {
        this.leader = this.LeadForm.value["lead"][0]["Id"];
      }
    }

    if (type == "vehicle") {
      if (empty(this.vehicles)) {
        this.vehicles = this.LeadForm.value["vehicle"][0]["Id"];
      }
    }

    if (type == "FileType") {
      if (empty(this.Filetypes)) {
        this.Filetypes = this.LeadForm.value["filetype"][0]["Id"];
      }
    }

    if (type == "policyexpire") {
      if (empty(this.Policyexpiryselect)) {
        this.Policyexpiryselect = this.LeadForm.value["policyexpiry"][0]["Id"];
      }
    }

    if (this.leader == "1" || this.leader == "2") {
      this.FilterMake();
    }

    if (
      this.leader == "1" ||
      this.leader == "2" ||
      this.leader == "3" ||
      this.leader == "4" ||
      this.vehicles == "individual" ||
      this.Filetypes == "New" ||
      this.Policyexpiryselect == "not_expired" ||
      this.Policyexpiryselect == "expired_within_90_days" ||
      this.Policyexpiryselect == "expired_more_than_90_days"
    ) {
      this.FileType_Status(
        this.leader,
        this.vehicles,
        this.Filetypes,
        this.Policyexpiryselect
      );
    }
  }

  onItemSelect(item: any, Type: any) {
    //Lob
    var city = item.Id;
    // // console.log(item.Id);

    if (Type == "Make") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.FilterModal(item);
      this.FilterVariant(item);
      this.FilterFuelType(item);
    }
    // this.FilterModal(item);
  }

  //===== ON OPTION DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    //Vertical

    if (Type == "Make") {
      this.FilterModal("OneByOneDeSelect");
      this.FilterVariant("OneByOneDeSelect");
      this.FilterFuelType("OneByOneDeSelect");
    }
    //  this.FilterModal(item);
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
