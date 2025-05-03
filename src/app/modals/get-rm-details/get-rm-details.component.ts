
import {

  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
  OnInit,
  Component,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


 
@Component({
  selector: 'app-get-rm-details',
  templateUrl: './get-rm-details.component.html',
  styleUrls: ['./get-rm-details.component.css']
})
export class GetRmDetailsComponent implements OnInit {
 

  ActivePage: string = "Default";
  UpdateFollowForm: any;
  isSubmitted = false;
  today = new Date();
  Nextes: Date;
  SrTableId: any;
  Status: any;
  DateTimesShow: boolean = false;
  Agent_id: any;
  LoginType: any;
  LoginId: any;
  FetchData: any;
  TeleRmData: any;
  RmData: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<GetRmDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
   
  }

  ngOnInit() {
    this.Nextes = new Date();
    this.Nextes.setDate(this.Nextes.getDate() + 365);

    this.LoginId = this.data.User_Id;
    this.LoginType = this.data.User_Type ;
    this.GetRmTeleRmDetails();
   }
  

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  GetRmTeleRmDetails() {
 
      const formData = new FormData();


      formData.append("User_Id", this.LoginId);
      formData.append("User_Type", this.LoginType );
     
      
        this.api.IsLoading();

        this.api.HttpPostType("MyPos/GetRmTeleRmDetails", formData).then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == 1) {
                this.FetchData = result['Data'];
                this.RmData  = result['RmData'];
                this.TeleRmData = result['TeleRmData'];

              } else {
              this.api.Toast("Warning", result["msg"]);
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
 
}
