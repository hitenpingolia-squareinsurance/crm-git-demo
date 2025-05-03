import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { ApiService } from "src/app/providers/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import html2canvas from "html2canvas";
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from "ngx-image-cropper";

// import { base64ToFile } from './image-cropper/utils/blob.utils';

@Component({
  selector: "app-work-wishes-create",
  templateUrl: "./work-wishes-create.component.html",
  styleUrls: ["./work-wishes-create.component.css"],
})
export class WorkWishesCreateComponent implements OnInit {
  @ViewChild("elementToCapture", { static: false })
  elementToCapture: ElementRef;
  capturedImage: any;

  imageChangedEvent: any = "";
  croppedImage: any = "";
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  BackgroundAddForm: FormGroup;
  WishForm: FormGroup;
  imageSrc: string = "assets/image/dummy_profile.jpeg";
  bgTheme: string = "";
  titleValue: string = "work anniversary";
  dynamicTitle: string = this.titleValue;
  EmpName: string = "Mrs. Leela abc demo";
  dynamicName: string = this.EmpName;
  tagLine: string = "Wonderful 2 Years";
  dynamicTagLine: string = this.tagLine;
  isSubmitted: boolean = false;
  selectedFiles: any;
  dropdownSettingsingleselect: any;

  file: File;
  DataArr: any;
  logo: string = "assets/image/square_logo_app.png";
  footerData = {};
  title: any;
  backgroundTheme: any;

  empData: any;
  DepartmentData: any;

  starOfColomsShow = false;
  monthData: { Id: string; Name: string }[];
  dynamicMonth: any = "Demo Month";
  SalutationData: { Id: string; Name: string }[];
  dynamicSalutation: any;
  dynamicVartical: any = "Demo Vartical";

  selectedEvent: any;
  CompanySelected: any;
  companyNameData: { Id: string; Name: string }[];
  eventData = {};
  companyId: any;
  LoginDepartment: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.BackgroundAddForm = this.fb.group({
      File: [""],
    });
    this.WishForm = this.fb.group({
      Event: [], // Initialize with default values
      Company: [],
      Departments: [],
      Salutation: [],
      EmployeeName: [],
      Profile: [],
      Title: [],
      Tagline: [],
      Description: [],
      Month: [],
    });
    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    // this.selectedEvent = [{ Id: '1', Name: 'Work Anniversary' }];
    // this.CompanySelected = [{Id: "144", Name: "SQUARE INSURANCE BROKERS PVT LTD"}];
    this.LoginDepartment = this.api.GetUserData("department");
    if (this.api.GetUserData("department") == 7) {
      this.eventData = [
        { Id: "1", Name: "Work Anniversary" },
        { Id: "2", Name: "Star Of The Month" },
      ];
    } else {
      this.eventData = [{ Id: "1", Name: "Work Anniversary" }];
    }

    this.SalutationData = [
      { Id: "1", Name: "Mr." },
      { Id: "2", Name: "Mrs." },
      { Id: "3", Name: "Miss." },
    ];

    this.monthData = [
      { Id: "1", Name: "January" },
      { Id: "2", Name: "February" },
      { Id: "3", Name: "March" },
      { Id: "4", Name: "April" },
      { Id: "5", Name: "May" },
      { Id: "6", Name: "June" },
      { Id: "7", Name: "July" },
      { Id: "8", Name: "August" },
      { Id: "9", Name: "September" },
      { Id: "10", Name: "October" },
      { Id: "11", Name: "November" },
      { Id: "12", Name: "December" },
    ];
  }

  ngOnInit() {
    this.commonForAll();

    this.getBackgroundTheme("Work Anniversary", 1);

    this.title = "Work Anniversary";

    this.WishForm.patchValue({ Event: [this.eventData[0]] });
  }

  onDescChange() {}

  onTitleChange() {
    this.dynamicTitle = this.titleValue;
  }

  onTagLineChange() {
    this.dynamicTagLine = this.tagLine;
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }
  }

  ThemeChange(event: any) {
    let bg = event.target.getAttribute("src");
    this.bgTheme = bg;
  }

  screenshot() {
    const captureElement: any = document.querySelector("#capture");

    // console.log(captureElement);

    html2canvas(captureElement).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      var FileName = new Date();
      const link = document.createElement("a");
      link.setAttribute("download", FileName + ".png");
      link.setAttribute("href", imageData);

      // console.log(link);
      // console.log(imageData);

      // this.shareOnWhatsApp(imageData); // Pass the image data to your sharing function

      link.click();
    });
  }

  shareOnWhatsApp(imageData: string) {
    const encodedImageData = encodeURIComponent(imageData);
    const whatsappWebUrl = `https://web.whatsapp.com/send?text=${encodedImageData}`;

    // Open a new browser window or tab with the WhatsApp Web URL
    window.open(whatsappWebUrl, "_blank");
  }

  //  screenshot() {
  //     const captureElement:any = document.querySelector("#capture");
  //     const imagesToCapture = captureElement.querySelectorAll("img"); // Get all images within the capture element

  //     let loadedImageCount = 0;

  //     imagesToCapture.forEach((image) => {

  //  //console.log(image)
  //       if (image.complete) {
  //         loadedImageCount++;
  //       } else {
  //         image.onload = function () {
  //           loadedImageCount++;
  //           if (loadedImageCount === imagesToCapture.length) {
  //             this.captureScreenshot(captureElement);
  //           }
  //         };
  //       }
  //     });

  //     // If all images are already loaded, capture the screenshot
  //     if (loadedImageCount === imagesToCapture.length) {
  //       this.captureScreenshot(captureElement);
  //     }
  //   }

  //  captureScreenshot(element) {
  //     html2canvas(element).then((canvas) => {
  //       const imageData = canvas.toDataURL("image/png");
  //       const FileName = new Date().toISOString();

  //       const link = document.createElement("a");
  //       link.setAttribute("download", FileName + ".png");
  //       link.setAttribute("href", imageData);
  //       link.click();
  //     });
  //   }

  //  captureAndShareOnWhatsApp() {

  //     const captureElement:any = document.querySelector("#capture");

  //     html2canvas(captureElement).then((canvas) => {
  //       const imageData = canvas.toDataURL("image/jpeg"); // Use "image/jpeg" format for smaller size

  //       // console.log(imageData);

  //       const whatsappMessage = "Check out this image!";
  //       const encodedMessage = encodeURIComponent(whatsappMessage);
  //       const encodedImage = encodeURIComponent(imageData);

  //       const whatsappLink = "whatsapp://send?text="+encodedMessage+"&image="+encodedImage+ " data-action='share/whatsapp/share' ";
  //       // window.location.href = whatsappLink;

  //       const link = document.createElement("a");

  //       link.setAttribute("href", whatsappLink);
  //       link.click();

  //     });
  //   }

  getBackgroundTheme(event: any, type: any) {
    const selectedValue: any = "";
    if (type == 1) {
      const selectedValue = event;
      this.title = selectedValue;
    } else {
      const selectedValue = event["Name"];
      this.title = selectedValue;
    }

    if (this.title == "Star Of The Month") {
      this.empData = [];
    } else {
      this.commonForAll();
    }

    if (selectedValue == "Star Of The Month") {
      this.starOfColomsShow = true;
    } else {
      this.starOfColomsShow = false;
    }

    const formData = new FormData();

    formData.append("Event", selectedValue);

    this.api.HttpPostType("EventTheme/GetBgTheme", formData).then(
      (result) => {
        if (result["status"] == true) {
          this.backgroundTheme = result["Data"];

          this.bgTheme = this.backgroundTheme[7].key_value;
        } else {
          this.api.Toast("Warning", result["Message"]);
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

  commonForAll() {
    const formData = new FormData();

    this.api.HttpPostType("EventTheme/AllDataget", formData).then(
      (result) => {
        if (result["status"] == true) {
          this.DepartmentData = result["Data"]["DepartmentData"];
          this.empData = result["Data"]["empData"];
          this.companyNameData = result["Data"]["companyNameData"];

          this.WishForm.patchValue({ Company: [this.companyNameData[4]] });

          const eventControl = this.WishForm.get("Company");
          const eventValue = eventControl.value;
          // console.log(eventValue);

          this.UpdateTypeValue(eventValue[0]);
        } else {
          this.api.Toast("Warning", result["Message"]);
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

  SearchEmployee(Value: any, Company: any) {
    const formData = new FormData();

    formData.append("Department", Value);
    formData.append("Company", Company);

    this.api.HttpPostType("EventTheme/SearchEmployee", formData).then(
      (result) => {
        if (result["status"] == true) {
          this.empData = result["Data"]["empData"];
        } else {
          this.api.Toast("Warning", result["Message"]);
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

  UpdateEmployee(event: any) {
    const selectedValue = event["Name"];

    this.dynamicName = selectedValue;
  }
  UpdateMonth(event: any) {
    const selectedValue = event["Name"];

    this.dynamicMonth = selectedValue;
    // console.log(this.dynamicMonth);
  }
  UpdateDepartment(event: any) {
    const selectedValue = event["Name"];
    this.SearchEmployee(event["Id"], this.companyId);

    this.dynamicVartical = selectedValue;
  }
  UpdateSalutation(event: any) {
    const selectedValue = event["Name"];

    this.dynamicSalutation = selectedValue;
  }

  UpdateTypeValue(Value: any) {
    const selectedValue = Value["Id"];
    this.companyId = Value["Id"];
    // console.log(selectedValue);

    const formData = new FormData();

    formData.append("company_Id", selectedValue);

    this.api.HttpPostType("EventTheme/fatchLogoAndFooter", formData).then(
      (result) => {
        if (result["status"] == true) {
          this.logo = result["Data"]["logo"];
          this.footerData = result["footer"];
          // console.log(this.footerData);
        } else {
          this.api.Toast("Warning", result["Message"]);
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

  Submit() {
    this.isSubmitted = true;
    if (this.BackgroundAddForm.invalid) {
      return;
    } else {
      var fields = this.BackgroundAddForm.value;
      const formData = new FormData();
      formData.append("File", fields["File"]);
      formData.append("file", this.file);

      this.api.IsLoading();
      this.api.HttpPostType("EventTheme/addbackground", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
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

  captureAndShareOnWhatsApp() {}

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      //console.log(this.selectedFiles);
      //console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      //console.log(ar);
      var ext;

      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      //console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg") {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + " kb");

        if (Total_Size >= 1024 * 8) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "file") {
            this.BackgroundAddForm.get("File").setValue("");
          }
        } else {
          if (Type == "file") {
            this.file = this.selectedFiles;
          }
        }
      } else {
        // console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- jpg,png,jpeg"
        );

        if (Type == "file") {
          this.BackgroundAddForm.get("File").setValue("");
        }
      }
    }
  }

  //new
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    // console.log(event, base64ToFile(event.base64));
  }

  imageLoaded() {
    this.showCropper = true;
    // console.log("Image loaded");
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    // console.log("Cropper ready", sourceImageDimensions);
  }

  loadImageFailed() {
    // console.log("Load failed");
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }
}
