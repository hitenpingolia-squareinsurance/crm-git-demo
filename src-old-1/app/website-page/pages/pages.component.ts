import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { CKEditorComponent } from "ckeditor4-angular";

class ColumnsObj {
  SrNo: any;
  id: any;
  page_name: any;
  title: any;
  company_name: any;
  created_at: any;
  lob: any;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.css"],
})
export class PagesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;

  ActionType: any = "";

  dtElements: any;
  SearchForm: FormGroup;

  isSubmitted = false;
  Is_Export: number;

  numColumns: number = 0;

  rows: number[] = [];
  dataArr: any;
  Id1: any;
  lob_name: any[];
  company_name: { Id: string; Name: string }[];
  company: any[];

  lob: { Id: string; Name: string }[] = [
    {
      Id: "motor",
      Name: "motor",
    },
    {
      Id: "health",
      Name: "health",
    },
    {
      Id: "pa",
      Name: "pa",
    },
    {
      Id: "nonmotor",
      Name: "non motor",
    },
    {
      Id: "travel",
      Name: "travel",
    },
    {
      Id: "life",
      Name: "life",
    },
  ];

  pageName: { Id: string; Name: string }[];

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

  Submitform: FormGroup;
  Submitform1: FormGroup;
  dropdownSettingsmultiselect = {};

  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
    closeDropDownOnSelection: boolean;
  };
  Id: any;
  url: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
    };

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: false,
    };

    this.Submitform = this.formBuilder.group({
      pageName: ["", Validators.required],

      description: [""],
      slug: ["", Validators.required],
      title: [""],
      SelectBlog: [""],
      ckeditorContent: [""],
      companyName: [""],
      segment: [""],
      lob: ["", Validators.required],
      order: [0],
    });

    this.Submitform1 = this.formBuilder.group({
      category: [""],

      description: [""],
      title: [""],
      noOfColumns: [""],
      SelectBlog: [""],
      ckeditorContent: [""],
      background: [false],
      url: [""],
      sectionType: ["", Validators.required],
      order: ["", Validators.required],
      image: [""],
      rows: this.formBuilder.array([]),
      allRowData: this.formBuilder.array([]),
      textCenter: [false],
      bgcolor: [""],
      txtcolor: [""],
      titleColor: [""],
    });

    this.SearchForm = this.formBuilder.group({
      Search: [""],
    });
  }

  get allRowData(): FormArray {
    return this.Submitform1.get("allRowData") as FormArray;
  }

  ngOnInit() {
    this.Get();
    this.addRow();
  }

  ClearSearch() {
    this.SearchForm.reset();
    this.Reload();
    this.ResetDT();
  }

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

  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      var fields = this.SearchForm.value;

      //   //   //   console.log("The search value is :- ", fields);

      var query = {
        Search: fields["Search"],
      };

      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
    });
  }

  Get() {
    // alert(this.api.GetUserData("type"));
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
                "/WebsitePages/FetchPageDetails?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType()
            ),

            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            // console.log(that.dataAr);
            if (that.dataAr.length > 0) {
            }
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  DeletePage(DeleteId: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("id", DeleteId);

      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api.HttpPostType("WebsitePages/DeletePageData", formData).then(
        (result: any) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.Reload();
          } else {
            const msg = "msg";

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

  // onDescriptionChange() {
  //   const descriptionValue = this.Submitform.get('description') ? this.Submitform.get('description').value : '';
  //   this.Submitform.patchValue({ ckeditorContent: descriptionValue });
  // }

  // removeHtmlTags(html: string): string {
  //   return html.replace(/<\/?[^>]+(>|$)/g, '');
  // }

  // Fetchlob() {

  //   this.api.IsLoading();
  //   this.api.HttpGetType("WebsitePages/lobdropdown").then(
  //     (result: any) => {
  //       this.api.HideLoading();
  //       if (result["status"] === "success") {
  //         this.lob = result["data"].map((item, index) => ({
  //           Id: index + 1,
  //           Name: item.lob
  //         }));
  //       } else {
  //         this.api.Toast("Warning", result["message"]);
  //       }
  //     },
  //     (err) => {
  //       this.api.HideLoading();
  //       this.api.Toast(
  //         "Warning",
  //         "Network Error: " + err.name + " (" + err.statusText + ")"
  //       );
  //     }
  //   );
  // }

  Helper() {
    this.Submitform.reset();
    this.isSubmitted = false;
    this.Id1 = '';
    this.Submitform.get("ckeditorContent").setValue("");
  }

  submit() {
    this.isSubmitted = true;
    if (this.Submitform.valid) {
      var fields = this.Submitform.value;

      //   //   //   console.log("The values are :- ", fields);

      //   //   //   console.log("The id is :- ", this.Id1);

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("pageName", fields["pageName"]);

      formData.append("slug", fields["slug"]);

      // formData.append('description', fields["description"]);
      formData.append("ckeditorContent", fields["ckeditorContent"]);

      formData.append("title", fields["title"]);
      // formData.append('companyName', fields['companyName']);
      formData.append("segment", fields["segment"]);

      formData.append("order", fields["order"]);

      this.api.IsLoading();

      if (this.Id1 != "" && this.Id1 !== undefined) {
        this.url = "WebsitePages/updatePageData";
        formData.append("id", this.Id1);
        //   //   //   console.log("The updated company Name", fields["companyName"]);
        if (fields["companyName"] && fields["companyName"].length > 0) {
          formData.append(
            "companyName",
            fields["companyName"][0]["Id"]
              ? fields["companyName"][0]["Id"]
              : fields["companyName"][0]
          );
        }

        formData.append(
          "lob",
          fields["lob"][0]["Id"] ? fields["lob"][0]["Id"] : fields["lob"][0]
        );
      } else {
        this.url = "WebsitePages/AddPage";

        formData.append("lob", fields["lob"][0]["Id"]);
        if (fields["companyName"] && fields["companyName"].length > 0) {
          formData.append("companyName", fields["companyName"][0]["Id"]);
        }
        // formData.append('companyName', fields["companyName"][0]["Id"]);
      }
      this.api.HttpPostType(this.url, formData).then(
        (result: any) => {
          this.api.HideLoading();

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            // this.CloseModel();
            this.Reload();
            this.Submitform.reset();
            this.isSubmitted = false;
            $("#ClosePOUPUP1").click();
            this.Id1 = "";
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
    } else {
      return;
    }
  }

  getIdValue(id: any) {
    this.Id = id;
  }
  get formControls() {
    return this.Submitform.controls;
  }
  get formControls1() {
    return this.Submitform1.controls;
  }

  CloseAddPopup() {
    this.resetSectionPage();
  }
  CloseAddPopup1() {
    this.Submitform.reset();
  }

  clearAllRowData() {
    while (this.allRowData.length !== 0) {
      this.allRowData.removeAt(0);
    }
  }

  resetSectionPage() {
    this.Submitform1.reset();
    this.numColumns = 0;
    this.clearAllRowData();
    this.isSubmitted = false;
  }

  onSectionSubmit() {
    this.isSubmitted = true;

    //   //   //   console.log(this.Submitform1.value);
    if (this.Submitform1.valid) {
      var fields = this.Submitform1.value;
      // console.log("The value of table is :-", fields);

      // console.log("The  json table data  are :- ", JSON.stringify(fields['allRowData']));

      const formData = new FormData();
      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());
      formData.append("id", this.Id);
      // formData.append('category', fields["category"]);

      formData.append("description", fields["description"]);
      formData.append("ckeditorContent", fields["ckeditorContent"]);
      formData.append("sectionType", fields["sectionType"]);
      if (this.image) {
        formData.append("image", this.image);
        formData.append("url", fields["url"]);
      }
      formData.append("order", fields["order"]);
      formData.append("noOfColumns", fields["noOfColumns"]);
      formData.append("title", fields["title"]);
      formData.append("background", fields["background"]);
      formData.append("textCenter", fields["textCenter"]);

      formData.append("tableData", JSON.stringify(fields["allRowData"]));

      formData.append("txtcolor", fields["txtcolor"]);
      formData.append("bgcolor", fields["bgcolor"]);
      formData.append("titleColor", fields["titleColor"]);

      this.api.IsLoading();
      this.api.HttpPostType("WebsitePages/AddPageSection", formData).then(
        (result: any) => {
          this.api.HideLoading();

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            // this.Submitform1.reset();
            this.resetSectionPage();

            $("#ClosePOUPUP4").click();
            this.Reload();
            // window.location.reload();
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
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    } else {
      return;
    }
  }

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");

      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();

      if (
        ext == "png" ||
        ext == "jpeg" ||
        ext == "jpg" ||
        ext == "pdf" ||
        ext == "webp" ||
        ext == "svg"
      ) {
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        if (Total_Size >= 1024 * 2) {
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "image") {
            this.Submitform1.get("image").setValue("");
          }
        } else {
          if (Type == "image") {
            this.image = this.selectedFiles;
          }
        }
      } else {
        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF,WEBP,SVG,"
        );

        if (Type == "image") {
          this.Submitform1.get("image").setValue("");
        }
      }
    }
  }

  newRow(): FormGroup {
    const rowGroup = this.fb.group({});

    for (let i = 0; i < this.numColumns; i++) {
      rowGroup.addControl(
        `column${i}`,
        this.fb.group({
          name: [""],
          url: [""],
          is_button: [false],
          is_clickable: [false],
        })
      );
    }
    return rowGroup;
  }

  onNoOfColumnsChange() {
    // this.clearAllRowData();

    this.allRowData.controls.forEach((row, index) => {
      this.setColumns(index);
    });
  }

  addMoreColumns() {
    if (this.numColumns > 0) {
      this.rows.push(this.rows.length);
      const rowIndex = this.rows.length - 1;

      for (let i = 0; i < this.numColumns; i++) {
        this.Submitform1.addControl(
          `column${rowIndex}_${i}`,
          this.fb.group({
            name: [""],
            url: [""],
            is_button: [false],
            is_clickable: [false],
          })
        );
      }
      this.setColumns(rowIndex);
    }
  }

  addRow() {
    const row = this.fb.group({
      columns: this.fb.array([]),
    });
    //Newly added
    const columns = row.get("columns") as FormArray;
    columns.clear();

    this.allRowData.push(row);
    this.setColumns(this.allRowData.length - 1);
  }

  setColumns(rowIndex: number) {
    const columns = this.allRowData.at(rowIndex).get("columns") as FormArray;
    columns.clear();
    for (let i = 0; i < this.numColumns; i++) {
      columns.push(
        this.fb.group({
          name: [""],
          url: [""],
          is_button: [false],
          is_clickable: [false],
        })
      );
    }
  }

  removeRow(rowIndex: number) {
    this.allRowData.removeAt(rowIndex);
  }

  onColumnChange() {
    this.allRowData.controls.forEach((row, index) => {
      this.setColumns(index);
    });
  }

  // onDescriptionChange1() {
  //   const descriptionValue = this.Submitform1.get('description') ? this.Submitform1.get('description').value : '';
  //   this.Submitform1.patchValue({ ckeditorContent: descriptionValue });
  // }

  // getIdValue1(id: any) {
  //   this.Id1 = id;
  // }

  getcompanylist(lob: any) {
    const formData = new FormData();
    formData.append("lob", lob);

    this.api.IsLoading();
    this.api.HttpPostType("WebsitePages/companyDropDownlobwise", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] === "success") {
          this.company_name = result["data"].map((item, index) => ({
            Id: item.code,
            Name: item.name,
          }));
        } else {
          this.api.Toast("Warning", result["message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error: " + err.name + " (" + err.statusText + ")"
        );
      }
    );
  }

  getValueEdit(id: any) {
    this.Id1 = id;
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("id", id);
    //   //   //   console.log("The id is :-", id);

    //formData.append("type", this.type);

    this.api.IsLoading();
    this.api.HttpPostType("WebsitePages/getPageEditData", formData).then(
      (result: any) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = result["data"];

          //   //   //   console.log(this.dataArr);

          this.Submitform.patchValue(this.dataArr);

          this.lob_name = [result["data"]["lob"]];

          this.company = [result["data"]["companyName"]];

          this.getcompanylist(result["data"]["lob"]);
          // console.log("The Company_name is :-", this.company);
          // console.log("The lob name  is :-", this.lob_name);
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

  FetchCompany(e) {
    //   //   //   console.log("The  lob wsie is :-", e);

    const formData = new FormData();
    formData.append("lob", e.Id);

    this.api.IsLoading();
    this.api.HttpPostType("WebsitePages/companyDropDownlobwise", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] === "success") {
          this.company_name = result["data"].map((item, index) => ({
            Id: item.code,
            Name: item.name,
          }));
        } else {
          this.api.Toast("Warning", result["message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error: " + err.name + " (" + err.statusText + ")"
        );
      }
    );
  }
}
