import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { PlanComponent } from "../plan/plan.component";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-view-form",
  templateUrl: "./view-form.component.html",
  styleUrls: ["./view-form.component.css"],
})
export class ViewFormComponent implements OnInit {
  id: any;
  dataAr: any[] = [];

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.id;
  }

  ngOnInit() {
    this.Get();
  }

  Get() {
    const formData = new FormData();
    formData.append("id", this.id);

    this.api.HttpPostType("/Plan_Title/planView", formData).then(
      (resp) => {
        this.dataAr[0] = JSON.parse(resp["data"][0]["form"]);

        //   //   //   console.log(this.dataAr);
        this.api.HideLoading();
      },
      (err) => {
        console.error("HTTP error:", err);
        this.api.HideLoading();
      }
    );
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
