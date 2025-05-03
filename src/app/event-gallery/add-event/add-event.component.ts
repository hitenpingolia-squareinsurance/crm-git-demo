import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-add-event",
  templateUrl: "./add-event.component.html",
  styleUrls: ["./add-event.component.css"],
})
export class AddEventComponent implements OnInit {
  addEventForm: FormGroup;
  isSubmitted = false;
  selectedFiles: File[] = [];
  ID: any;
  title: any;
  tag: any;
  description: any;
  File: string;
  Status: any[] = [];
  Status_Val: any;
  dropdownSettingsType: any = {};
  fileError: any;
  validImageExtensions: string[] = ["jpg", "jpeg", "png", "gif"];
  FileNames: any;
  url: string;
  dataArr: any;
  activeinactive: any = [];

  constructor(
    private dialogRef: MatDialogRef<AddEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private http: HttpClient,
    public route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    if (this.data) {
      this.ID = this.data.Id;
      this.EditData(this.ID);
    } else {
      this.ID = null;
    }
    this.addEventForm = this.formBuilder.group({
      title: ["", [Validators.required]],
      tag: ["", [Validators.required]],
      description: ["", [Validators.required]],
      file: [""],
      Status: ["", [Validators.required]],
    });

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
    };

    this.Status = [
      { Id: "1", Name: "Active" },
      { Id: "2", Name: "In-Active" },
    ];
  }

  get formControls() {
    return this.addEventForm.controls;
  }

  ngOnInit() {}

  CloseModel() {
    this.dialogRef.close();
  }

  onFileChange(event: any) {
    this.fileError = null;
    this.selectedFiles = [];

    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const extension = file.name.split(".").pop().toLowerCase();
        if (!this.validImageExtensions.includes(extension)) {
          this.fileError = `Invalid file type for ${file.name}. Please upload an image with a valid extension (jpg, jpeg, png, gif).`;
          return;
        }
        this.selectedFiles.push(file);
      }
    }

    if (this.selectedFiles.length > 15) {
      this.fileError = "You can only upload up to 15 images at a time.";
      return;
    }
    this.FileNames = this.selectedFiles[0].name;
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  AddData(ID?: any) {
    this.isSubmitted = true;
    if (this.addEventForm.invalid) {
      return;
    } else {
      const fields = this.addEventForm.value;
      const formData = new FormData();
      formData.append("title", fields["title"]);
      formData.append("tag", fields["tag"]);
      formData.append("discription", fields["description"]);
      formData.append("Status", fields["Status"][0]["Id"]);

      if (this.selectedFiles.length > 0) {
        for (let i = 0; i < this.selectedFiles.length; i++) {
          formData.append(
            "file[]",
            this.selectedFiles[i],
            this.selectedFiles[i].name
          );
        }
      }


      if (!ID) {
        this.url = "EventGallery/AddeventGallery";
      } else {
        this.url = "EventGallery/AddeventGallery";
        formData.append("Id", ID);
      }

      this.api.IsLoading();
      this.api.HttpPostType(this.url, formData).then(
        (result:any) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    }
  }


  EditData(ID: any) {

    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", ID);

    this.api.HttpPostType("EventGallery/EventDataEdit", formData).then(
      (resp:any) => {
      
        if (resp["status"] == true) {
        
          this.dataArr = resp["data"];
          this.activeinactive = resp["statusdata"];

          this.addEventForm.patchValue(this.dataArr);
        } else {
      
          const msg = "msg";
          this.api.Toast("Warning", resp["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }
}
