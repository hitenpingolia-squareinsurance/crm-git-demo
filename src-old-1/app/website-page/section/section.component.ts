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
  lob: any;
  company_name: any;
  category: any;
  title: any;
  page_id: any;
  id: any;
  image_url: any;
  section_type: any;

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
  selector: "app-section",
  templateUrl: "./section.component.html",
  styleUrls: ["./section.component.css"],
})
export class SectionComponent implements OnInit {
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
  pageId: any;
  Submitform: FormGroup;
  editSectionForm: FormGroup;

  editor = CKEditorComponent;
  selectedFiles: File;
  image: File;

  Id: any;

  showTable: any = 1;
  type: any;
  id: any;
  dataArr: any;
  title: any;
  description: any;

  ordered: any;
  background_color: any;
  is_text_center: any;
  // ckeditorContent: any;
  section_name: any[];
  numColumns: number = 0;

  rows: number[] = [];
  Id1: any;
  section_type: { Id: string; Name: string }[] = [
    {
      Id: "normal",
      Name: "Normal",
    },
    {
      Id: "table",
      Name: "Table",
    },

    {
      Id: "faq",
      Name: "FAQs",
    },
    {
      Id: "image",
      Name: "Image",
    },
    {
      Id: "listing",
      Name: "Listing",
    },
    {
      Id: "html",
      Name: "Html",
    },
  ];

  editorConfig = {
    enterMode: 1, // Use <br> instead of <p>
    shiftEnterMode: 1,
    autoParagraph: false, // Disable automatic paragraph wrapping
    allowedContent: true, // Allow all content as-is
    extraAllowedContent: "{}[*]", // Allow inline styles, attributes, etc.
    forcePasteAsPlainText: false, // Preserve pasted HTML
  };

  category_name: any[];
  category: { Id: string; Name: string }[] = [
    {
      Id: "third party",
      Name: "Third Party",
    },
    {
      Id: "comprehensive",
      Name: "COMPREHENSIVE",
    },
    {
      Id: "claim",
      Name: "Claim",
    },
    {
      Id: "zero depreciation",
      Name: "Zero Depreciation",
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

  currentUrl: any;
  SectionValue: any;
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.currentUrl = this.router.url;

    var splitted = this.currentUrl.split("/");

    this.pageId = splitted[3];

    this.Submitform = this.fb.group({
      description: [""],
      title: [""],
      SelectBlog: [""],
      ckeditorContent: [""],
      sectionType: ["", Validators.required],
      order: ["", Validators.required],
      image: [""],
      background: [false],
      checkList: [false],
      url: [""],
      txtcolor: [""],
      bgcolor: [""],
      titleColor: [""],
    });

    this.editSectionForm = this.fb.group({
      title: [""],
      ordered: [""],

      description: [""],
      background_color: [""],
      is_text_center: [""],
      section_type: [""],
      image: [""],
      no_of_column: [0],
      category: [""],
      url: [""],
      rows: this.fb.array([]),
      allRowData: this.fb.array([]),
      bgcolor: [""],
      txtcolor: [""],
      titleColor: [""],

      ckeditorContent: [""],
      // SelectBlog: [""],
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

    this.editSectionForm.get("section_type").valueChanges.subscribe((value) => {
      if (value && value.length > 0) {
        this.SectionValue = value[0].Id;

        // if (this.GstValue == 'Yes') {
        //   gstno.setValidators(Validators.required);
        //   gstaddress.setValidators(Validators.required);
        //   if (action == 'Edit-pos') {
        //     gstCertificate.setValidators(null);
        //   } else {
        //     gstCertificate.setValidators(Validators.required);
        //   }
        // } else {
        //   gstno.setValidators(null);
        //   gstaddress.setValidators(null);
        //   gstCertificate.setValidators(null);
        // }
        // gstno.updateValueAndValidity();
        // gstaddress.updateValueAndValidity();
        // gstCertificate.updateValueAndValidity();
      }
    });
  }
  get allRowData(): FormArray {
    return this.editSectionForm.get("allRowData") as FormArray;
  }

  newRow(): FormGroup {
    const rowGroup = this.fb.group({});
    // for (let i = 0; i < this.numColumns; i++) {
    //   rowGroup.addControl(`column${i}`, this.fb.control('', Validators.required)); // Add columns dynamically
    // }

    for (let i = 0; i < this.numColumns; i++) {
      rowGroup.addControl(
        `column${i}`,
        this.fb.group({
          name: [""],
          url: [""],
          is_button: [false], // Checkbox default value
          is_clickable: [false], // Checkbox default value
        })
      );
    }
    return rowGroup;
  }

  onNoOfColumnsChange() {
    this.allRowData.controls.forEach((row, index) => {
      this.setColumns(index); // Update columns for each row
    });
  }

  addRow() {
    const row = this.fb.group({
      columns: this.fb.array([]), // Initialize FormArray for columns
    });
    this.allRowData.push(row);
    this.setColumns(this.allRowData.length - 1); // Set columns for the new row
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
    this.allRowData.removeAt(rowIndex); // Remove the specified row
  }

  onColumnChange() {
    this.allRowData.controls.forEach((row, index) => {
      this.setColumns(index); // Update columns for each row
    });
  }

  ngOnInit() {
    this.Get();
    this.currentUrl = this.router.url;
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
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
                "/WebsitePages/FetchPageSection?id=" +
                this.pageId +
                "&User_Type=" +
                this.api.GetUserType() +
                "&User_Id=" +
                this.api.GetUserData("Id")
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
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

  DeletePageSection(DeleteId: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("id", DeleteId);

      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api
        .HttpPostType("WebsitePages/DeletePageSectionData", formData)
        .then(
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

  onDescriptionChange() {
    const descriptionValue = this.Submitform.get("description")
      ? this.Submitform.get("description").value
      : "";
    this.Submitform.patchValue({ ckeditorContent: descriptionValue });
  }

  get formControls() {
    return this.Submitform.controls;
  }

  removeHtmlTags(html: string): string {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  }

  getIdValue(id: any) {
    this.Id = id;
  }

  CloseAddPopup3() {
    this.Submitform.reset();

    this.Submitform.get("ckeditorContent").setValue("");
    this.isSubmitted = false;
  }

  submit() {
    this.isSubmitted = true;
    // console.log(this.Submitform, "the feilds values are ");

    if (this.Submitform.valid) {
      var fields = this.Submitform.value;

      // console.log(this.Submitform, "the feilds values are ");
      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());
      formData.append("description", fields["description"]);
      formData.append("title", fields["title"]);
      // formData.append('SelectBlog', fields['SelectBlog']);
      formData.append("sectionType", fields["sectionType"]);
      formData.append("order", fields["order"]);
      formData.append("page_section_id", this.Id);
      if (this.image) {
        formData.append("image", this.image);
        formData.append("url", fields["url"]);
      }

      formData.append("ckeditorContent", fields["ckeditorContent"]);
      formData.append("background", fields["background"]);
      formData.append("checkList", fields["checkList"]);
      formData.append("txtcolor", fields["txtcolor"]);
      formData.append("bgcolor", fields["bgcolor"]);
      formData.append("titleColor", fields["titleColor"]);

      this.api.IsLoading();
      this.api
        .HttpPostType("WebsitePages/AddPageSectionDetails", formData)
        .then(
          (result: any) => {
            this.api.HideLoading();
            // console.log(result);
            if (result["status"] == 1) {
              this.api.Toast("Success", result["msg"]);

              this.CloseAddPopup3();
              $("#ClosePOUPUP1").click();

              this.Reload();
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
    } else {
      return;
    }
  }

  get formControls1() {
    return this.editSectionForm.controls;
  }

  getValueEdit(id: any) {
    this.Id1 = id;

    // console.log(this.Id1)

    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("id", id);
    // formData.append("type", this.type);

    this.api.IsLoading();
    this.api.HttpPostType("WebsitePages/getPageSectionData", formData).then(
      (result: any) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = JSON.parse(JSON.stringify(result["data"]));

          // if (result["data"]["section_type"] == "table") {
          //   this.dataArr["description"] = "";
          //   this.dataArr["ckeditorContent"] = "";

          // }

          this.numColumns = this.dataArr["no_of_column"]
            ? Number(this.dataArr["no_of_column"])
            : 0;

          this.editSectionForm.patchValue(this.dataArr);

          this.section_name = [result["data"]["section_type"]];

          // if (result["data"]["category"]) {

          //   this.category_name = [result["data"]["category"]];
          // }

          // console.log("THE  data is :-", result["data"])
          // console.log('The category is :-', this.category_name);
          // console.log('The section  is :-', this.section_name);

          if (result["data"]["section_type"] == "table") {
            this.populateTableData(JSON.parse(result["data"]["table_data"]));
          }
        } else {
          // const msg = "msg";
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

  setColumnsEdit(rowIndex: number, row) {
    const columns = this.allRowData.at(rowIndex).get("columns") as FormArray;
    columns.clear();
    for (let i = 0; i < this.numColumns; i++) {
      columns.push(
        this.fb.group({
          name: [row[i]["name"]],
          url: [row[i]["url"]],
          is_button: [row[i]["is_button"] === 1],
          is_clickable: [row[i]["is_clickable"] === 1],
        })
      );
    }
  }

  populateTableData(tableData) {
    for (let index = 0; index < tableData.length; index++) {
      const element = tableData[index];
      const row = this.fb.group({
        columns: this.fb.array([]), // Initialize FormArray for columns
      });
      this.allRowData.push(row);
      this.setColumnsEdit(index, element);
    }
  }

  clearAllRowData() {
    while (this.allRowData.length !== 0) {
      this.allRowData.removeAt(0);
    }
  }

  Helper() {
    this.editSectionForm.reset();
    this.numColumns = 0;
    this.Id1 = '';
    this.clearAllRowData();
  }

  clearBgColor() {
    this.editSectionForm.get("bgcolor").setValue("");
  }
  clearTextColor() {
    this.editSectionForm.get("txtcolor").setValue("");
  }
  clearTitleColor() {
    this.editSectionForm.get("titleColor").setValue("");
  }

  submitsection() {
    this.isSubmitted = true;
    if (this.editSectionForm.invalid) {
      return;
    } else {
      var fields = this.editSectionForm.value;

      //   //   //   console.log("The Feilds values are :- ", this.editSectionForm.value);

      const tempSectionType = fields["section_type"][0]["Id"]
        ? fields["section_type"][0]["Id"]
        : fields["section_type"][0];

      const formData = new FormData();
      formData.append("id", this.Id1);
      // formData.append('background', fields['background_color']);
      // formData.append('is_text_center', fields['is_text_center']);
      formData.append("ordered", fields["ordered"]);
      formData.append(
        "section_type",
        fields["section_type"][0]["Id"]
          ? fields["section_type"][0]["Id"]
          : fields["section_type"][0]
      );
      // formData.append('description', fields["description"]);
      // formData.append("ckeditorContent", this.removeHtmlTags(fields["ckeditorContent"]));
      formData.append("title", fields["title"]);
      if (tempSectionType == "table") {
        formData.append("ckeditorContent", fields["ckeditorContent"]);
        formData.append("tableData", JSON.stringify(fields["allRowData"]));
        formData.append("noOfcolumns", fields["no_of_column"]);
      } else if (
        tempSectionType == "normal" ||
        tempSectionType == "listing" ||
        tempSectionType == "faq" ||
        tempSectionType == "html"
      ) {
        // formData.append('description', fields["description"]);
        formData.append("ckeditorContent", fields["ckeditorContent"]);

        formData.append("background", fields["background_color"]);
        formData.append("is_text_center", fields["is_text_center"]);
      } else if (tempSectionType == "image") {
        formData.append("image", this.image);
        formData.append("url", fields["url"]);
      }

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("txtcolor", fields["txtcolor"]);
      formData.append("bgcolor", fields["bgcolor"]);
      formData.append("titleColor", fields["titleColor"]);

      // if (fields['category'] && fields['category'][0]) {
      //   formData.append("category", fields['category'][0]['Id'] ? fields['category'][0]['Id'] : fields['category'][0]);
      // }

      // // console.log('formData');

      this.api.IsLoading();
      this.api.HttpPostType("WebsitePages/updateSectionData", formData).then(
        (result: any) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            // this.editSectionForm.reset();
            this.isSubmitted = false;
            $("#ClosePOUPUP2").click();
            this.Helper();
            this.Reload();
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
            this.editSectionForm.get("image").setValue("");
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
          this.editSectionForm.get("image").setValue("");
        }
      }
    }
  }

  UploadDocs1(event, Type) {
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
            this.Submitform.get("image").setValue("");
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
          this.Submitform.get("image").setValue("");
        }
      }
    }
  }
}
