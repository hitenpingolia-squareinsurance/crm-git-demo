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
import { QcChecklistComponent } from "src/app/business-management/qc-checklist/qc-checklist.component";

@Component({
  selector: 'app-addckecklist',
  templateUrl: './addckecklist.component.html',
  styleUrls: ['./addckecklist.component.css']
})
export class AddckecklistComponent implements OnInit {
  type: any;
  id: any;
  AddFieldForm: FormGroup;
  isActive = false;
  isSubmitted = false;
  
    dropdownSettingsmultiselect: {
      singleSelection: boolean;
      idField: string;
      textField: string;
      itemsShowLimit: number;
      enableCheckAll: boolean;
      allowSearchFilter: boolean;
    };
  SRSource_Ar: { Id: string; Name: string; }[];
  LOB_dropdownSettings: { singleSelection: boolean; enableCheckAll: boolean; idField: string; textField: string; };
  Source_Type: any;
  activetab: any;

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
        private dialogRef: MatDialogRef<QcChecklistComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
      ) {
    
        this.id = this.data.id;
        this.type = this.data.type;
       
     

        this.AddFieldForm = this.formBuilder.group({
          checkListName : ['',Validators.required],
          Source_Type :['',Validators.required],
          declaration: ['', Validators.required]
        });
        
    
        this.dropdownSettingsmultiselect = {
          singleSelection: true,
          idField: "Id",
          textField: "Name",
          itemsShowLimit: 1,
          enableCheckAll: false,
          allowSearchFilter: true,
        };
        this.LOB_dropdownSettings = {
          singleSelection: false,
          enableCheckAll: false,
          idField: "Id",
          textField: "Name",
        };
    
        
        this.SRSource_Ar = [
          { Id: "2", Name: "Offline" },
          { Id: "1", Name: "Online" }
        ];
    
      }

      ngOnInit() {
        if(this.type == 'update'){
          this.fetchData();
        }
      }

  
      CloseModel(): void {
        this.dialogRef.close({
          Status: "Model Close",
          Active:this.activetab
        });
      }

  get FC() { return this.AddFieldForm.controls; }


      SubBtn() {
       
        this.isSubmitted = true;
        if (this.AddFieldForm.valid) {
          const fields = this.AddFieldForm.value;
          const formData = new FormData();
          // formData.append('loginId' , this.api.GetUserData("Id"));
          formData.append('loginId' , this.api.GetUserId());
          formData.append('loginType' , this.api.GetUserType());
          formData.append("declaration", fields['declaration']);
          formData.append("checkListName", fields['checkListName']);
          formData.append("Source_Type", JSON.stringify(fields['Source_Type']));
          formData.append("updateId", this.id);
          this.api.IsLoading();
          this.api
            .HttpPostTypeBms("../v2/reports/CheckListQcReport/addchecklist", formData)
            .then(
              (resp:any) => {
                this.api.HideLoading();
                console.log("resp",resp)
                if (resp['Status'] == true) {
                  this.activetab = resp['Data']['type'];
                  this.api.Toast('Success', resp['Message'])
                  this.CloseModel();
    
                }else{
                  this.api.Toast('Warning', resp['Message'])
                }
                this.isSubmitted = false;
              },
              (err) => {
                this.api.HideLoading();
              }
            );
        }
      }

    ckconfig = {
      height: 360,
      allowedContent: true,
    };

  fetchData() {
    const formData = new FormData();
    formData.append("updateId", this.id);

    this.api
      .HttpPostTypeBms('/../../v2/reports/CheckListQcReport/viewCheckList', formData)
      .then(
        (resp:any) => {
        const result = resp.data;
          this.AddFieldForm.patchValue({
          
            declaration : result[0].content,
            checkListName : result[0].name,
            Source_Type : [{ Id: resp.type[0].Id , Name: resp.type[0].Id == 1 ? 'Online' : 'Offline' }]

          });
        
          document.getElementById('click-close').click();
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }


  onItemSelect(item: any, Type: any) {
    console.log("Type : " + Type);
    console.log("onItemSelect", item);

   
  }





}
