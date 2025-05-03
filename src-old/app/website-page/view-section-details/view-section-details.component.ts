import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  ViewChild,
} from "@angular/core";

import { MatDialog } from "@angular/material/dialog";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { DataTableDirective } from "angular-datatables";

import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CKEditorComponent } from "ckeditor4-angular";

class ColumnsObj {
  id: any;
  SrNo: any;
  page_section_id: any;
  description: any;
  title: any;
  created_at: any;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-view-section-details",
  templateUrl: "./view-section-details.component.html",
  styleUrls: ["./view-section-details.component.css"],
})
export class ViewSectionDetailsComponent implements OnInit {
  // @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  // datatableElement: DataTableDirective;

  // dtOptions: DataTables.Settings = {};
  // dataAr: ColumnsObj[] = [];
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  ActivePage: string = "Default";
  loadAPI: Promise<any>;
  currentUrl: any;

  ActionType: any = "";
  searchform: FormGroup;
  isSubmitted = false;
  pageId: any;

  urlSegment: string;
  urlSegment2: string;
  urlSegment3: string;

  title: any;
  description: any;
  // section_type: any;
  ordered: any;
  background_color: any;
  is_check_list: any;
  ckeditorContent: any;
  editor = CKEditorComponent;
  selectedFiles: File;
  image: File;

  editorConfig = {
    enterMode: 1, // Use <br> instead of <p>
    shiftEnterMode: 1,
    autoParagraph: false, // Disable automatic paragraph wrapping
    allowedContent: true, // Allow all content as-is
    extraAllowedContent: "{}[*]", // Allow inline styles, attributes, etc.
    forcePasteAsPlainText: false, // Preserve pasted HTML
  };

  dataArr: any;
  Id1: any;
  editDetailsForm: FormGroup;
  section_name: any;
  section_type: { Id: string; Name: string }[] = [
    {
      Id: "normal",
      Name: "Normal",
    },

    {
      Id: "listing",
      Name: "Listing",
    },
  ];

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

  constructor(
    public api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.editDetailsForm = this.fb.group({
      title: [""],
      ordered: [0, Validators.required],

      description: [""],
      background_color: [""],
      is_check_list: [""],
      section_type: [""],
      image: [""],

      bgcolor: [""],
      txtcolor: [""],
      titleColor: [""],

      ckeditorContent: [""],
      SelectBlog: [""],
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
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      limitSelection: 5,
    };

    this.currentUrl = this.router.url;
    // console.log(this.currentUrl);
    var splitted = this.currentUrl.split("/");
    //   //   //   console.log("the splitted is :- ", splitted);

    this.pageId = splitted[3];

    //   //   //   console.log("the page id is :-", this.pageId);
  }

  ngOnInit() {
    this.Get();
  }



  // Reload() {
  //   this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     var pageinfo = dtInstance.page.info().page;
  //     dtInstance.page(pageinfo).draw(false);
  //   });
  //   // this.Get();
  // }

  // ClearSearch() {
  //   var fields = this.SearchForm.reset();
  //   this.Is_Export = 0;
  // }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/WebsitePages/ViewSectionDetails?id=" +
                this.pageId +
                "&User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType()
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            this.dataAr = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  DeletePageDetails(DeleteId: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("id", DeleteId);

      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api
        .HttpPostType("WebsitePages/DeletePageDetailsData", formData)
        .then(
          (result: any) => {
            this.api.HideLoading();

            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              this.Reload();
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

  getValueEdit(id: any) {
    this.Id1 = id;

    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("id", id);
    // formData.append("type", this.type);

    this.api.IsLoading();
    this.api
      .HttpPostType("WebsitePages/getPageSectionDetailsData", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.dataArr = result["data"];

            //   //   //   console.log(this.dataArr);

            this.editDetailsForm.patchValue(this.dataArr);

            this.section_name = [result["data"]["section_type"]];

            // console.log("the section_name is :- ", this.section_name);
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

  get formControls() {
    return this.editDetailsForm.controls;
  }

  removeHtmlTags(html: string): string {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  }

  // onDescriptionChange() {
  //   const descriptionValue = this.editDetailsForm.get('description') ? this.editDetailsForm.get('description').value : '';
  //   this.editDetailsForm.patchValue({ ckeditorContent: descriptionValue });
  // }

  clearBgColor() {
    this.editDetailsForm.get("bgcolor").setValue("");
  }
  clearTextColor() {
    this.editDetailsForm.get("txtcolor").setValue("");
  }
  clearTitleColor() {
    this.editDetailsForm.get("titleColor").setValue("");
  }




  Helper() {
    this.editDetailsForm.reset();
    this.isSubmitted = false;
    this.Id1 = '';
    this.Reload();
  }

  
  submit() {
    this.isSubmitted = true;
    if (this.editDetailsForm.invalid) {
      return;
    } else {
      var fields = this.editDetailsForm.value;

      //   //   //   console.log("The Feilds values are :- ", fields);

      const formData = new FormData();
      formData.append("id", this.Id1);

      formData.append("background", fields["background_color"]);
      formData.append("is_check_list", fields["is_check_list"]);
      formData.append("ordered", fields["ordered"]);
      formData.append(
        "section_type",
        fields["section_type"][0]["Id"]
          ? fields["section_type"][0]["Id"]
          : fields["section_type"][0]
      );

      // formData.append('description', fields["description"]);
      formData.append("ckeditorContent", fields["ckeditorContent"]);
      formData.append("title", fields["title"]);

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());
      if (this.image) {
        formData.append("image", this.image);
      }
      formData.append("bgcolor", fields["bgcolor"]);
      formData.append("txtcolor", fields["txtcolor"]);
      formData.append("titleColor", fields["titleColor"]);

      this.api.IsLoading();
      this.api
        .HttpPostType("WebsitePages/updateSectionDetailsData", formData)
        .then(
          (result: any) => {
            this.api.HideLoading();
            // console.log(result);
            if (result["status"] == 1) {
              this.api.Toast("Success", result["msg"]);
              this.isSubmitted = false;

              $("#ClosePOUPUP6").click();
              this.Reload();

              // this.Get();
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

      if (
        ext == "png" ||
        ext == "jpeg" ||
        ext == "jpg" ||
        ext == "pdf" ||
        ext == "webp" ||
        ext == "svg"
      ) {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + " kb");

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "image") {
            this.editDetailsForm.get("image").setValue("");
          }
        } else {
          if (Type == "image") {
            this.image = this.selectedFiles;
          }
        }
      } else {
        // console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF,WEBP,SVG,"
        );

        if (Type == "image") {
          this.editDetailsForm.get("image").setValue("");
        }
      }
    }
  }
}
