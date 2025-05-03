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
  selector: 'app-addchannel',
  templateUrl: './addchannel.component.html',
  styleUrls: ['./addchannel.component.css']
})
export class AddchannelComponent implements OnInit {

  AddFieldForm: FormGroup;
    isSubmitted = false;
  
    dropdownSettingsmultiselect: {
      singleSelection: boolean;
      idField: string;
      textField: string;
      itemsShowLimit: number;
      enableCheckAll: boolean;
      allowSearchFilter: boolean;
    };
  
    company: any[];
    statusAr: any[];
    payin: { Id: string; Name: string; }[];
    id: any;
    type: any;
  
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
  
      this.id = this.data.id;
      this.type = this.data.type;
     
    
      this.AddFieldForm = this.formBuilder.group({
        company: ['', Validators.required],
        branch: ['', [Validators.required, Validators.pattern('[a-zA-Z. ]*')]],
        contactPerson: ['', [Validators.required, Validators.pattern('[a-zA-Z. ]*')]],
        email: ['', [Validators.required, Validators.email]], // Wrapping validators in an array
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      });
      
  
      this.dropdownSettingsmultiselect = {
        singleSelection: true,
        idField: "Id",
        textField: "Name",
        itemsShowLimit: 1,
        enableCheckAll: false,
        allowSearchFilter: true,
      };
  
  
  
     
  
  
    }
  
    ngOnInit() {
      this.getCompany();
      if(this.type == 'update'){
        this.fetchData();
      }
    }
  
    get FC() { return this.AddFieldForm.controls; }

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
              // payin: [{ Id: result[0].payin_posting_criteria, Name: result[0].payin_posting_criteria == 1 ? 'Risk End Date' : 'Issue Date' }],

            
             
            });
          
            document.getElementById('click-close').click();
          },
          (err) => {
            this.api.HideLoading();
          }
        );
    }

    
  getCompany() {
 
    const formData = new FormData();
    formData.append('User_Id' , this.api.GetUserData("Id"));
    formData.append('User_Type' , this.api.GetUserType());
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


  SubBtn() {
    this.isSubmitted = true;
    if (this.AddFieldForm.valid) {
      const fields = this.AddFieldForm.value
      console.log(fields);
      const formData = new FormData();
      formData.append('loginId' , this.api.GetUserData("Id"));
      formData.append('loginType' , this.api.GetUserType());
      formData.append("company", JSON.stringify(fields['company']));
      formData.append("branch", fields['branch']);
      formData.append("contactPerson", fields['contactPerson']);
      formData.append("email", fields['email']);
      formData.append("phone", fields['phone']);
      // formData.append("payin", JSON.stringify(fields['payin']));
      formData.append("updateId", this.id);

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms("../v2/business_master/InsurerChannels/AddChannel", formData)
        .then(
          (resp:any) => {
            this.api.HideLoading();
            if (resp['status'] == true) {
            this.api.Toast('Success', resp['msg'])
              this.CloseModel();
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
