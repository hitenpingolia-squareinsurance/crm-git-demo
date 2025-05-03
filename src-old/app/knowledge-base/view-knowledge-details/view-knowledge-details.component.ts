import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  ElementRef,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

class ColumnsObj {
  SrNo: string;
  Id: string;
  LOB: string;
  TypeName: string;
  Quotation_Id: string;
  Company: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: "app-view-knowledge-details",
  templateUrl: "./view-knowledge-details.component.html",
  styleUrls: ["./view-knowledge-details.component.css"],
})
export class ViewKnowledgeDetailsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  @ViewChild("videoPlayer", { static: false })
  videoplayer: ElementRef;

  isPlay: boolean = false;
  ViewKnowledgeBaseData: any;
  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  SendmailForm: FormGroup;
  isSubmitted = false;
  buttonDisable = false;

  Ins_Compaines: any = [];
  GlobelLOB: any = [];
  PolicyFileType: any = [];
  PolicyType: any = [];
  ProductType: any = [];
  SR_Session_Year: any = [];
  SRSource_Ar: any = [];
  filterrd: any = [];

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsingleselect: any = {};

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";

  QidSr: any;

  //selected
  ItemLOBSelection: any = [];
  minDate: Date;
  maxDate: Date;
  financialYearVal: { Id: string; Name: string }[];
  currentUrl: string;
  Login_Type: string | null;
  videourl: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.GetKnowledgeBaseDetails();

    this.Login_Type = this.api.GetUserType();
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  ViewVideo(url) {
    this.videourl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  //ACCEPT REQUEST
  GetKnowledgeBaseDetails() {
    this.api.IsLoading();

    const formData = new FormData();
    formData.append("UserId", this.api.GetUserData("Id"));
    formData.append("UserType", this.api.GetUserType());
    formData.append("Status", "1");

    this.api.IsLoading();
    this.api
      .HttpPostType("KnowledgeBase/ViewKnowledgeBaseDetails", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            // this.api.Toast("Success", result["msg"]);
            this.ViewKnowledgeBaseData = result["data"];
            // this.Reload();
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
