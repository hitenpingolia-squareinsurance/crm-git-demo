import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";


import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { InsurerChannelComponent } from "../insurer-channel.component";


@Component({
  selector: 'app-updatechannel',
  templateUrl: './updatechannel.component.html',
  styleUrls: ['./updatechannel.component.css']
})
export class UpdatechannelComponent implements OnInit {

    AddFieldForm: FormGroup;
    active: { Id: string; Name: string }[];
    status: { Id: string; Name: string }[];
    type: { Id: string; Name: string }[];
    isSubmitted = false;
  
    dropdownSettingsmultiselect: {
      singleSelection: boolean;
      idField: any;
      textField: string;
      itemsShowLimit: number;
      enableCheckAll: boolean;
      allowSearchFilter: boolean;
    };
  
    dropdownSettings: {
      singleSelection: boolean;
      idField: string;
      textField: string;
      itemsShowLimit: number;
      enableCheckAll: boolean;
      allowSearchFilter: boolean;
    };
    
    company: any[];
    id: any;
    dataAr: any[];
    statusAr: any[];
  payin: { Id: string; Name: string; }[];
    
  
    constructor(
      public api: ApiService,
      private http: HttpClient,
      private router: Router,
      private fb: FormBuilder,
      private activatedRoute: ActivatedRoute,
      public dialog: MatDialog,
      private formBuilder: FormBuilder,
      private httpClient: HttpClient,
      private route: ActivatedRoute,
      private dialogRef: MatDialogRef<InsurerChannelComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
  
      this.id = data.id;
  
      this.AddFieldForm = this.formBuilder.group({
        company: ['', Validators.required],
        branch: ['', [Validators.required, Validators.pattern('[a-zA-Z. ]*')]],
        contactPerson: ['', Validators.required],
        email: ['', Validators.required],
        phone: ['', Validators.required],
        payin: ['', Validators.required],
      });


  
      this.dropdownSettingsmultiselect = {
        singleSelection: true,
        idField: "Id",
        textField: "Name",
        itemsShowLimit: 1,
        enableCheckAll: false,
        allowSearchFilter: true,
      };
      this.dropdownSettings = {
        singleSelection: false,
        idField: "Id",
        textField: "Name",
        itemsShowLimit: 1,
        enableCheckAll: false,
        allowSearchFilter: true,
      };
  
    
      this.payin = [
        { Id: '1', Name: 'Risk End Date' },
        { Id: '2', Name: 'Issue Date' },
      ];
    
    }
  

    ngOnInit() {
   
      this.fetchData();
      this.getCompany();
    }
  
    get FC() { return this.AddFieldForm.controls; }

    getCompany() {
      const formData = new FormData();
      formData.append('loginId' , this.api.GetUserData("Id"));
      formData.append('loginType' , this.api.GetUserType());
      this.api
        .HttpPostType("reports/BussinessReport/Company", formData)
        .then(
          (resp:any) => {
           
            this.company = resp;
          },
          (err) => {
            console.error('HTTP error:', err);
          }
        );
    }
  
    fetchData() {
      const formData = new FormData();
      formData.append("updateId", this.id);
      // this.api.IsLoading();
      this.api
        .HttpPostTypeBms('../v2/business_master/InsurerChannels/ChannelData', formData)
        .then(
          (resp:any) => {
          const result = resp.data;
          // console.log(result);
          
            this.AddFieldForm.patchValue({
              company : [
                { Id: resp.companyDataUpdate.Id, Name: resp.companyDataUpdate.Name }
              ],
              branch: result[0].branch_address,
              contactPerson : result[0].contact_person_name,
              email : result[0].contact_person_email,
              phone : result[0].contact_person_mobile_no,
              payin: [{ Id: result[0].payin_posting_criteria, Name: result[0].payin_posting_criteria == 1 ? 'Risk End Date' : 'Issue Date' }],

            
             
            });
          
            document.getElementById('click-close').click();
          },
          (err) => {
            this.api.HideLoading();
          }
        );
    }
  

    SubBtn() {
      this.isSubmitted = true;
      if (this.AddFieldForm.valid) {

      const fields = this.AddFieldForm.value
      
      const formData = new FormData();
      
      formData.append("company", JSON.stringify(fields['company']));
      formData.append("branch", fields['branch']);
      formData.append("contactPerson", fields['contactPerson']);
      formData.append("email", fields['email']);
      formData.append("phone", fields['phone']);
      formData.append("payin", JSON.stringify(fields['payin']));
        formData.append("updateId", this.id);
        this.api.IsLoading();
        this.api
        .HttpPostTypeBms("../v2/business_master/InsurerChannels/AddChannel", formData)
          .then(
            (resp:any) => {
              this.api.HideLoading();
             
              if (resp['status'] == true) {
                this.CloseModel();
                this.api.Toast("Success" , resp['msg']);
              }
              this.isSubmitted = false;
            },
            (err) => {
              this.api.HideLoading();
            }
          );
      }
    }
  
    CloseModel(): void {
      this.dialogRef.close({
        Status: "Model Close",
      });
    }
  

}
