import { Component, OnInit, Inject } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-slab-reports",
  templateUrl: "./slab-reports.component.html",
  styleUrls: ["./slab-reports.component.css"],
})
export class SlabReportsComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;
  AddMenuForm: FormGroup;
  isSubmitted_1 = false;

  Id: any;
  row: any = [];
  MasterMenus: any = [];

  IsNewMenuItem: any = 0;

  Additonal_Action_Json: any = [];
  dropdownSettings: any = {};

  url: string = "";
  urlSafe: SafeResourceUrl;
  Currenturi: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,

    public api: ApiService,
    public formBuilder: FormBuilder,
    public sanitizer: DomSanitizer
  ) {
    this.Currenturi = this.activatedRoute.snapshot.paramMap.get("Url");
  }

  ngOnInit() {
    this.url =
      "https://panopticinfotech.com/uat/slab_report/" + this.Currenturi;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}
