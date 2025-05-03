import { ConfrimPaymentMethodComponent } from "./../../../modals/confrim-payment-method/confrim-payment-method.component";
// import { Component,   } from '@angular/core';
import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  HostListener,
  OnInit,
  Renderer2,
} from "@angular/core";
import {
  FormBuilder,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { SocketioService } from "../../../providers/socketio.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { PusherService } from "../../../providers/pusher.service";
import { ViewDetailsModalComponent } from "../../../survey/view-details-modal/view-details-modal.component";
import { OfflineHealthRejectComponent } from "../offline-health-reject/offline-health-reject.component";
import { el } from "date-fns/locale";

@Component({
  selector: "app-offline-health-details",
  templateUrl: "./offline-health-details.component.html",
  styleUrls: ["./offline-health-details.component.css"],
})
export class OfflineHealthDetailsComponent implements AfterViewInit {
  [x: string]: any;
  @ViewChild("scrollframe", { static: false }) scrollFrame: ElementRef;
  @ViewChildren("item") itemElements: QueryList<any>;

  private itemContainer: any;
  private scrollContainer: any;
  private items = [];
  private isNearBottom = true;

  ChatForm: FormGroup;
  Messages: any = [];
  LoginUserId: any;
  AddFlagForm: FormGroup;
  insurerCompanyNames: { label: string; value: string }[] = [];
  Quotation_Id: any = 0;
  RedicrctBackYypes: any = 0;
  row: any = [];
  Status: any = [];
  QuoteAction: any = [];
  Company: any = [];
  RequestedQuote: any = [];
  dropdownSettingsType: any = "";
  RequestedQuoteDate: any = [];
  SharedQuoteForm: FormGroup;
  AddCompletePaymentForm: FormGroup;
  PaymentUrlQuoteForm: FormGroup;
  ShareToPunchingTeam: FormGroup;
  AddPaymentConfrim: FormGroup;

  inputMessage: string = "";
  isSubmitted = false;
  isSubmittedFleg = false;

  images = [];
  selectedFiles: any;
  Self_Dob: any;
  images1: File;
  CountInsurerName = [];
  GetSharedPaymentUrl: any;

  Is_Attachement: string = "No";
  CoustomerImages: any;
  Image_1: any;
  Image_2: any;
  Image_3: any;
  Image_4: any;
  Image_5: any;

  PolicyPdf: File;
  PaymentProof: File;

  PaymentUrls: File;
  CompletePaymentForm: FormGroup;
  RejectedStatus: any;
  GetSingleData: any;
  GetPunchingTeamEmployee: any;
  ChequeImage: any;
  acceptQuoteValueId: any;
  acceptQuoteValue: any;
  Pan_image: number;
  Pan: File;

  Other: File;
  Aadhaar_Back: File;
  Aadhaar_Front: File;
  aadhar_image_front: number;
  aadhar_image_back: number;
  Other_image: number;
  controlNames: string[];
  allImages: { name: string; filename: File }[] = [];
  RequestedQuoteAlldata: any;
  documentUrl: string | URL;
  My_image: number;
  labelColors: { [key: string]: string } = {};
  url: string;
  Email: any;
  EmployeeNameId: any;
  AssignUsertype: any;
  documentTypes = ["self", "spouse", "father", "mother", "son", "daughter"];
  AgentNameId: any;
  AssignUser_Empdata: any;

  GetPunchingTeamSP: any;
  GetPunchingTeamPOS: any;
  customFormArr: any = [];
  insurerDynamic: any = [];
  constructor(
    public api: ApiService,
    public socketService: SocketioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fB: FormBuilder,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private pusherService: PusherService
  ) {
    this.LoginUserId = this.api.GetUserData("Id");

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.SharedQuoteForm = this.fB.group({
      survey: ["", Validators.required],
      surveyRemark: [""],
      quantities: this.fB.array([]),
    });

    this.url = "view-health-requests";

    this.PaymentUrlQuoteForm = this.fB.group({
      PaymentMethod: [""],
      PaymentUrl: [""],
      chequeImage: [""],
      CashProof: [""],
      Cheque_No: [""],
      UtrNumber: [""],
    });

    this.AddPaymentConfrim = this.fB.group({
      PolicyNumber: ["", Validators.required],
      PolicyPdf: ["", Validators.required],
      PaymentProof: [""],
    });

    this.CompletePaymentForm = this.fB.group({
      CompletedSr_No: ["", Validators.required],
    });

    this.ShareToPunchingTeam = this.fB.group({
      PunchingTeam: ["", Validators.required],
    });

    this.SharedQuoteForm.get("survey").setValue("0");

    this.Quotation_Id = this.activatedRoute.snapshot.paramMap.get("Quotation");
    this.RedicrctBackYypes = this.activatedRoute.snapshot.url[0].path;
    this.GetRequestedQuote();
    this.GetAcceptQuoteDetails();
    //   //   //   console.log(this.Quotation_Id);
    this.GetRow();

    this.FilterDatacompany();
    this.addQuantity();
    this.addQuantity();
    this.addQuantity();
    this.addQuantity();
    this.addQuantity();

    this.api.TargetComponent.subscribe(
      (page) => {
        //   //   //   console.log(page);
        if (page == "offline_quotation" || page == "offline_quotation") {
          this.GetRow();
          // this.GetMessages();
        }
      },
      (err) => {}
    );

    this.ChatForm = this.fB.group({
      Message: [""],
    });
  }
  get formControls() {
    return this.SharedQuoteForm.controls;
  }
  get formControls1() {
    return this.PaymentUrlQuoteForm.controls;
  }
  get formControls2() {
    return this.AddPaymentConfrim.controls;
  }
  get formControls3() {
    return this.CompletePaymentForm.controls;
  }
  get formControls4() {
    return this.ShareToPunchingTeam.controls;
  }
  get formControlsAddPaymentConfrim() {
    return this.AddPaymentConfrim.controls;
  }

  get FC() {
    return this.ChatForm.controls;
  }

  get Formcontrols() {
    return this.SharedQuoteForm.controls;
  }

  initializeForm() {
    this.AddFlagForm = this.fB.group({
      InsurerName: ["", Validators.required],
      InsurerDob: ["", Validators.required],
      InsurerMobile: ["", Validators.required],
      InsurerEmail: ["", Validators.required],
    });
  }

  acceptform() {
    let group = {};
    // Loop through documentTypes to create dynamic controls
    this.customFormArr.forEach((field) => {
      if (field.val == "value") {
        group[field.key] = ["", [Validators.required]];
      } else if (field.val == "number") {
        group[field.key] = [
          "",
          [Validators.required, Validators.pattern(/^[0-9]*$/)],
        ];
      } else if (field.type == "doc" && field.validate == "self") {
        group[field.key] = ["", [Validators.required]];
      } else if (field.val == "email") {
        group[field.key] = ["", [Validators.required, Validators.email]];
      } else if (field.lenght == "1") {
        group[field.key] = [
          "",
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^\d+(\.\d+)?$/),
          ],
        ];
      } else {
        group[field.key] = [""];
      }
    });
    // Merge static controls with dynamic controls
    this.AddFlagForm = this.fB.group(group);

    //   //   //   console.log('AddFlagForm controls:', this.AddFlagForm.controls);
  }

  GetSent(event: any, controlName: string) {
    const value = event.target.value;
    //   //   //   console.log("55555",controlName)
    //   //   //   console.log("rsrs",this.AddFlagForm.controls);
    return;
    const control = this.AddFlagForm.get(controlName);
    alert(value);
    if (control) {
      control.setValue(value);

      // Example of setting validation based on the value
      if (value) {
        control.setValidators([Validators.required, Validators.minLength(3)]);
      } else {
        control.setValidators([Validators.required]);
      }
      control.updateValueAndValidity();
    }
  }

  get FormcontrolsFleg() {
    return this.AddFlagForm.controls;
  }

  quantities(): FormArray {
    return this.SharedQuoteForm.get("quantities") as FormArray;
  }

  newQuantity(): FormGroup {
    return this.fB.group({
      Insurer: [""],
      Files: [""],
      Remarks: [""],
      GrossPremium: [""],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe((_) => this.onItemElementsChanged());

    this.socketService.setupSocketConnection();

    this.socketService.ReceiveMessage().subscribe((res: any) => {
      //alert(res.Receiver_Id);
      if (res.Receiver_Id === this.api.GetUserData("Id")) {
        this.GetMessages();
      }
    });

    /*
    this.pusherService.channel.bind("new-message", (data) => {
      // console.log(data.Message);

      var res = JSON.parse(data.Message);

   //   //   //   console.log(res);
   //   //   //   console.log(12345);

      ////   //   console.log(res.Sender_Id);
      ////   //   console.log(res.Receiver_Id);
      ////   //   console.log(res.Type);

      if (
        (res.Sender_Id == this.LoginUserId ||
          res.Receiver_Id == this.LoginUserId) &&
        res.Type == "OfflineQuote"
      ) {
        this.GetMessages();
      }
    });
    */
  }

  private onItemElementsChanged(): void {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position =
      this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled(event: any): void {
    this.isNearBottom = this.isUserNearBottom();
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  }

  UploadAttachment(event) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      //   //   //   console.log(this.selectedFiles);
      //   //   //   console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      //   //   //   console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      //   //   //   console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        //   //   //   console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        //   //   //   console.log(Total_Size + " kb");

        if (Total_Size >= 1024 * 4) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 4 mb");
        } else {
          this.selectedFiles;
          this.Is_Attachement = "Yes";
          this.Send();
        }
      } else {
        //   //   //   console.log("Extenstion is not vaild !");
        this.api.Toast(
          "Warning",
          "Please choose vaild file ! ie :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }

  Send() {
    ////   //   console.log(this.ChatForm.value);
    ////   //   console.log(this.inputMessage);

    this.isSubmitted = true;
    if (this.ChatForm.invalid) {
      return;
    } else {
      var fields = this.ChatForm.value;

      if (this.Is_Attachement == "No") {
        if (fields["Message"] == "" || fields["Message"] == null) {
          return;
        }
      }
      const formData = new FormData();
      formData.append("Reference_Id", this.row.Id);
      formData.append("Reference_No", this.row.Quotation);

      formData.append("CreateUser_Id", this.row.CreateUser_Id);
      formData.append("CreateUser_Type", this.row.CreateUser_Type);

      formData.append("CurrentUser_Id", this.row.CurrentUser_Id);
      formData.append("CurrentUser_Type", this.row.CurrentUser_Type);

      formData.append("Login_User_Id", this.api.GetUserData("Id"));
      formData.append("Login_User_Type", this.api.GetUserType());

      formData.append("Message", fields["Message"]);
      formData.append("Attachement", this.selectedFiles);
      formData.append("Is_Attachement", this.Is_Attachement);
      formData.append("Type", "OfflineQuote");

      this.ChatForm.reset();
      if (this.Is_Attachement == "Yes") {
        this.api.IsLoading();
      }

      this.api.HttpPostType("Chat/Send", formData).then(
        (result: any) => {
          if (this.Is_Attachement == "Yes") {
            this.api.HideLoading();
          }

          if (result["status"] == true) {
            this.GetMessages();
            if (this.row.CreateUser_Id == this.LoginUserId) {
              this.socketService.sendMessage({
                Sender_Id: 0,
                Receiver_Id: this.row.CurrentUser_Id,
                Claim_Id: this.row.Id,
                Message: fields["Message"],
              });
            } else {
              this.socketService.sendMessage({
                Sender_Id: 0,
                Receiver_Id: this.row.CreateUser_Id,
                Claim_Id: this.row.Id,
                Message: fields["Message"],
              });
            }

            this.Is_Attachement = "No";

            //this.api.Toast('Success',result['msg']);
          } else {
            //alert(result['message']);
            this.Is_Attachement = "No";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          ////   //   console.log(err);
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }

  FilterDatacompany() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Globel/GetIns_Companies?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Company = result["Ins_Compaines"];
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

  SetImagesValues(Types, Numbers, setValue) {
    if (Types == "set") {
      if (Numbers == "Image_1") this.Image_1 = setValue;
      else if (Numbers == "Image_2") this.Image_2 = setValue;
      else if (Numbers == "Image_3") this.Image_3 = setValue;
      else if (Numbers == "Image_4") this.Image_4 = setValue;
      else if (Numbers == "Image_5") this.Image_5 = setValue;
    } else if (Types == "unset") {
      if (Numbers == "Image_1") this.Image_1 = "";
      else if (Numbers == "Image_2") this.Image_2 = "";
      else if (Numbers == "Image_3") this.Image_3 = "";
      else if (Numbers == "Image_4") this.Image_4 = "";
      else if (Numbers == "Image_5") this.Image_5 = "";
    }
  }

  UploadDocs(event, Image_no) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      //   //   //   console.log(this.selectedFiles);

      var str = this.selectedFiles.name;
      var ar = str.split(".");

      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        if (Total_Size >= 1024 * 2) {
          this.api.Toast("Warning", "File size is greater than 2 mb");
          this.SetImagesValues("unset", Image_no, this.selectedFiles);
        } else {
          this.SetImagesValues("set", Image_no, this.selectedFiles);
        }
      } else {
        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
        this.SetImagesValues("unset", Image_no, this.selectedFiles);
      }
    }
  }

  UploadDocsKyc(event: any, type: string): void {
    //   //   //   console.log("event.target.file",event.target.file);
    if (!this.AddFlagForm.contains(type)) {
      this.AddFlagForm.addControl(type, new FormControl(""));
    }

    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        const fileName: string = file.name;
        const fileSize: number = file.size / 1024; // in KB

        if (fileSize >= 10240) {
          this.api.Toast("Error", "File size is greater than 10 mb");
        }

        this.setAllImagesValues({ name: type, filename: file });
      }
    }
  }

  setAllImagesValues(data: { name: string; filename: File }): void {
    this.allImages.push(data);
    //   //   //   console.log("All Images:", this.allImages);
  }

  changeColor(labelId: string): void {
    if (this.labelColors[labelId] == "green") {
      this.labelColors[labelId] = "red";
    } else {
      this.labelColors[labelId] = "green";
    }
  }

  AcceptQuotes() {
    // al
    this.isSubmittedFleg = true;
    //this.acceptform();
    const formData = new FormData();
    const fields = this.AddFlagForm.value;
    //   //   console.log("this.AddFlagForm", this.AddFlagForm);
    if (this.AddFlagForm.invalid) {
      this.isSubmittedFleg = true; // Show validation messages
      alert("Form is not valid");
      //   //   //   console.log(this.AddFlagForm.value);
      //   //   //   console.log(fields);
      return;
    }

    alert("Accept Quotes");

    Object.keys(fields).forEach((key) => {
      formData.append(key, fields[key]);
    });

    this.allImages.forEach((imageData) => {
      formData.append(imageData.name, imageData.filename);
    });
    formData.append("InsurerName", fields["InsurerName"]);
    formData.append("InsurerDOB", fields["InsurerDob"]);
    formData.append("InsurerMobile", fields["InsurerMobile"]);
    formData.append("InsurerEmail", fields["InsurerEmail"]);

    if (this.acceptQuoteValue === 0) {
      formData.append("id", this.acceptQuoteValueId);
    }

    if (confirm("Are you sure!")) {
      this.api.IsLoading();
      this.api
        .HttpPostType(
          `Offlinehealthquote/AcceptQuotes?User_Id=${this.api.GetUserData(
            "Id"
          )}&User_Type=${this.api.GetUserType()}&Quotation=${
            this.Quotation_Id
          }`,
          formData
        )
        .then(
          (result: any) => {
            this.api.HideLoading();
            if (result["status"] === true) {
              this.RequestedQuote = result["data"];
              $("#ClosePOUPUP").click();
              if (this.row.SurveyStatus === 1 && this.row.SurveyId === "0") {
                this.router.navigate([
                  `/survey/create-requests/${this.row.Quotation}`,
                ]);
              }
              this.GetRow();
              this.GetAcceptQuoteDetails();
              this.GetRequestedQuote();
            } else {
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.Toast(
              "Warning",
              `Network Error: ${err.name} (${err.statusText})`
            );
          }
        );
    }
  }

  acceptQuoteValueManger(Id: any, Val: any) {
    this.acceptQuoteValueId = Id;
    this.acceptQuoteValue = Val;
  }

  AddSharedCompany() {
    var fields = this.SharedQuoteForm.value;
    const formData = new FormData();
    this.isSubmitted = true;
    if (this.SharedQuoteForm.invalid) {
      //   //   //   console.log(fields);
      //   //   //   console.log(this.SharedQuoteForm.invalid);

      return;
    } else {
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("fields", JSON.stringify(fields));
      formData.append("Image_1", this.Image_1);
      formData.append("Image_2", this.Image_2);
      formData.append("Image_3", this.Image_3);
      formData.append("Image_4", this.Image_4);
      formData.append("Image_5", this.Image_5);

      formData.append("survey", fields["survey"]);
      formData.append("surveyRemark", fields["surveyRemark"]);

      if (confirm("Are you sure !") == true) {
        this.api.IsLoading(); //TypeArray
        this.api
          .HttpPostType(
            "Offlinehealthquote/SharedQuotes?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&quotation_id=" +
              this.Quotation_Id,
            formData
          )
          .then(
            (result: any) => {
              this.api.HideLoading();

              if (result["status"] == 1) {
                this.api.Toast("Success", result["msg"]);
                this.GetRow();
                this.GetRequestedQuote();
                this.SharedQuoteForm.reset();
                this.SharedQuoteForm.get("survey").setValidators(null);
                this.SharedQuoteForm.get("survey").updateValueAndValidity();
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
  }

  AddPaymentUrlForm() {
    var fields = this.PaymentUrlQuoteForm.value;
    const formData = new FormData();

    this.isSubmitted = true;
    if (this.PaymentUrlQuoteForm.invalid) {
      return;
    } else {
      formData.append("PaymentUrl", fields["PaymentUrl"]);
      formData.append("PaymentMethod", fields["PaymentMethod"]);
      formData.append("ChequeImage", this.ChequeImage);
      formData.append("cash_image", this.CashProof);
      formData.append("ChequeNo", fields["Cheque_No"]);
      formData.append("UtrNumber", fields["UtrNumber"]);

      if (confirm("Are you sure !") == true) {
        this.api.IsLoading(); //TypeArray
        this.api
          .HttpPostType(
            "Offlinehealthquote/AddPaymentUrl?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&Quotation=" +
              this.Quotation_Id,
            formData
          )
          .then(
            (result: any) => {
              this.api.HideLoading();
              if (result["status"] == true) {
                this.GetRow();
                this.GetAcceptQuoteDetails();
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
  }

  UploadDocss(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      //   //   //   console.log(this.selectedFiles);
      //   //   //   console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      //   //   //   console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      //   //   //   console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        //   //   //   console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        //   //   //   console.log(Total_Size + " kb");

        if (Total_Size >= 6048) {
          // allow only 1 mb
          this.api.Toast("Error", "File size is greater than 5 mb");

          //document.querySelector('.RC_Motor_Registraion').value = '';
          // if(Type == 'PaymentUrl'){ this.RC_Registration_Reset.nativeElement.value = ''; }

          /*
            if(Type == 'RC_Motor_Registraion'){ this.RC_Registration_Reset.nativeElement.value = ''; }
            if(Type == 'Previous_Policy_Copy'){ this.Previous_Policy_Copy_Reset.nativeElement.value = ''; }
            if(Type == 'Cheque_Payment_Recipt'){ this.Cheque_Payment_Recipt_Reset.nativeElement.value = ''; }
            if(Type == 'Mandate_Letter'){ this.Mandate_Letter_Reset.nativeElement.value = ''; }
            if(Type == 'Invoice'){ this.Invoice_Reset.nativeElement.value = ''; }
            if(Type == 'Renewal_Notice'){ this.Renewal_Notice_Reset.nativeElement.value = ''; }
            if(Type == 'Other'){ this.Other_Reset.nativeElement.value = ''; }

             */
        } else {
          if (Type == "PolicyPdf") {
            this.PolicyPdf = this.selectedFiles;
          }
          if (Type == "PaymentProof") {
            this.PaymentProof = this.selectedFiles;
          }
          if (Type == "PaymentUrl") {
            this.PaymentUrls = this.selectedFiles;
          }
          if (Type == "chequeImage") {
            this.ChequeImage = this.selectedFiles;
          }
          if (Type == "CashProof") {
            this.CashProof = this.selectedFiles;
          }
        }
      } else {
        //   //   //   console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }

  AddPaymentConfrimForm() {
    var fields = this.AddPaymentConfrim.value;
    const formData = new FormData();
    this.isSubmitted = true;
    if (this.AddPaymentConfrim.invalid) {
      return;
    } else {
      formData.append("PolicyNumber", fields["PolicyNumber"]);
      formData.append("PolicyPdf", this.PolicyPdf);
      formData.append("PaymentProof", this.PaymentProof);

      if (confirm("Are you sure !") == true) {
        this.api.IsLoading(); //TypeArray
        this.api
          .HttpPostType(
            "Offlinehealthquote/AddPaymentConfrimForm?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&Quotation=" +
              this.Quotation_Id,
            formData
          )
          .then(
            (result: any) => {
              this.api.HideLoading();
              if (result["status"] == true) {
                this.GetRow();
                this.CreateAnSr();
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
  }

  removeItems(arrs: any, indexs: any) {
    var arr = arrs;
    var index = arr.indexOf(indexs);
    if (index >= 0) {
      arr.splice(index, 1);
    }
    return arr;
  }

  onItemSelectShareRowWise(event: any) {
    this.CountInsurerName.push(event.Id);
    //   //   //   console.log(this.CountInsurerName);
  }

  onItemDeSelectShareRowWise(event: any) {
    this.removeItems(this.CountInsurerName, event.Id);
    //   //   //   console.log(this.CountInsurerName);
  }

  GetRow() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Offlinehealthquote/SingleData?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Quotation=" +
          this.Quotation_Id +
          "&types=" +
          this.RedicrctBackYypes +
          "&urls=" +
          this.url
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.row = result["data"];
            this.insurerCompanyNames = this.row.Insurer_company_name;
            this.AgentNameId = result["AssignUser_Id2"];
            this.AssignUser_Empdata = result["AssignUser_Empdata"];
            this.AssignUsertype = this.row.AssignUsertype;
            this.GetSingleData = result["data"];
            this.Status = result["Status"];
            this.RejectedStatus = result["RejectedStatus"];
            this.QuoteAction = result["AssignBy"];
            //   //   //   console.log("this.row-----",this.row);
            //   //   //   console.log(this.AssignUser_Empdata);
            //   //   //   console.log(this.AssignUsertype);
            this.Self_Dob = this.row.AgeData["self_dob"][0];
            this.Email = this.row["Email"];
            this.Name = this.row["Name"];
            //   //   //   console.log(this.Name);

            //   //   //   console.log(this.row.QuoteStatusNew);

            this.customFormArr = [
              {
                key: "InsurerName",
                name: "Insured Name",
                val: "value",
                value: this.row.Name,
              },
              {
                key: "InsurerDob",
                name: "Insured DOB",
                val: "value",
                value: this.Self_Dob,
              },
              {
                key: "InsurerMobile",
                name: "Insured Mobile",
                val: "number",
                value: this.row.Mobile,
              },
              {
                key: "InsurerEmail",
                name: "Insured Email",
                val: "email",
                value: this.Email,
              },
            ];
            this.documentTypes.forEach((documentType) => {
              if (this.row.AgeData && this.row.AgeData[documentType]) {
                this.row.AgeData[documentType].forEach((age) => {
                  this.customFormArr.push({
                    key: "documentType",
                    name: documentType,
                  });

                  this.customFormArr.push({
                    key: `hight_${documentType}_${age}`,
                    name: "Height (ft/cm)",
                    lenght: "1",
                  });
                  this.customFormArr.push({
                    key: `weight_${documentType}_${age}`,
                    name: "Weight (kg)",
                    lenght: "1",
                  });
                  this.customFormArr.push({
                    key: `name_${documentType}_${age}`,
                    name: "Name",
                    val: "value",
                    type: "name",
                  });
                  this.customFormArr.push({
                    key: `dob_${documentType}_${age}`,
                    name: "DOB",
                    val: "value",
                    type: "dob",
                  });
                  this.customFormArr.push({
                    key: `aadhaar_document_front_${documentType}_${age}`,
                    name: "Adhar Document Frount",
                    type: "doc",
                    validate: documentType,
                  });
                  this.customFormArr.push({
                    key: `aadhar_image_back_${documentType}_${age}`,
                    name: "Adhar Document Back",
                    type: "doc",
                    validate: documentType,
                  });
                  this.customFormArr.push({
                    key: `OtherDocument_${documentType}_${age}`,
                    name: "Other Document",
                    type: "doc",
                  });
                  this.customFormArr.push({
                    key: `pan_document_${documentType}_${age}`,
                    name: "Pan Document",
                    type: "doc",
                    validate: documentType,
                  });
                });
              }
            });

            //   //   //   console.log("his.customFormArr",this.customFormArr);
            //   //   //   console.log("his.this.customLables",this.customLables);

            this.acceptform();
            // this.CurrentClaimStatus = this.row.Status;
            this.GetAcceptQuoteDetails();

            if (this.Status == 2 || this.Status == 3) {
              this.GetPunchingTeam();
            }

            this.GetMessages();
          } else {
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          ////   //   console.log(err);
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  ReplesName(imploded: string): string {
    let exploded = imploded.split("_");
    exploded.pop();
    let newKey = exploded.join("_");
    return newKey
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  GetRequestedQuote() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Offlinehealthquote/GetRequestedQuote?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Quotation=" +
          this.Quotation_Id +
          "&types=" +
          this.RedicrctBackYypes
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.RequestedQuote = result["data"];
            this.RequestedQuoteDate = result["Date"];
            //   //   //   console.log(this.RequestedQuote);
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

  GetAcceptQuoteDetails() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Offlinehealthquote/GetSharedPaymentUrl?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Quotation=" +
          this.Quotation_Id
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.GetSharedPaymentUrl = result["Data"];

            //   //   //   console.log(this.GetSharedPaymentUrl);
          } else {
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          ////   //   console.log(err);
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  ViewDocument(url) {
    // alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  ViewDocument2(filename: string) {
    console.log(filename);
    this.documentUrl = filename;
    window.open(this.documentUrl, "", "left=100,top=50,width=800%,height=600");
  }

  AcceptAssignQuote() {
    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "Offlinehealthquote/AcceptAssignQuote?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Quotation=" +
            this.Quotation_Id
        )
        .then(
          (result: any) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              this.RequestedQuote = result["data"];
              this.GetRow();
              this.GetAcceptQuoteDetails();
              this.GetRequestedQuote();

              //   //   //   console.log(this.row);
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

  FetchPunchingEmployee() {}

  CompletedPayment() {
    this.isSubmitted = true;
    var fields = this.CompletePaymentForm.value;
    const formData = new FormData();

    if (this.CompletePaymentForm.invalid) {
      return;
    } else {
      if (confirm("Are you sure !") == true) {
        formData.append("Quotation", this.Quotation_Id);
        formData.append("Sr_No", fields["CompletedSr_No"]);

        this.api.IsLoading(); //TypeArray
        this.api
          .HttpPostType(
            "Offlinehealthquote/CompletedPayment?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType(),
            formData
          )
          .then(
            (result: any) => {
              this.api.HideLoading();
              if (result["status"] == true) {
                this.GetRow();
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
  }

  CreateAnSr() {
    const formData = new FormData();
    formData.append("Quotation", this.Quotation_Id);
    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();

      formData.append("Source", "CRM");
      // this.api.HttpPostType("OfflineQuoteSR", formData).then(
      this.api.HttpPostType("Rfq/SubmitSr", formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            window.open(result["SrUrl"], "", "fullscreen=yes");
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

  RejectedQuote() {
    if (confirm("Are you sure !") == true) {
      this.api.IsLoading(); //TypeArray
      this.api
        .HttpGetType(
          "Offlinequote/RejectedQuote?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Quotation=" +
            this.Quotation_Id
        )
        .then(
          (result: any) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              this.GetRow();
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

  RejectedQuoteModel(QUOTE: any) {
    const dialogRef = this.dialog.open(OfflineHealthRejectComponent, {
      width: "45%",
      height: "45%",
      disableClose: true,
      data: { Id: QUOTE },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  GetMessages() {
    // alert();
    //this.api.IsLoading();
    //   //   //   console.log(this.row);
    //   //   //   console.log(this.row.Id);
    this.api
      .HttpGetType(
        "Chat/Messages?Type=OfflineQuote&User_Id=" +
          this.api.GetUserData("Id") +
          "&Reference_Id=" +
          this.row.Id
      )
      .then(
        (result: any) => {
          //this.api.HideLoading();
          if (result["status"] == 1) {
            //this.api.Toast('Success',result['msg']);
            this.Messages = result["Messages"];
            this.scrollToBottom();
          } else {
            //alert(result['message']);
            //this.api.Toast('Warning',result['msg']);
          }
        },
        (err) => {
          // Error log
          ////   //   console.log(err);
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  GetPunchingTeam() {
    this.api
      .HttpGetType(
        "Offlinehealthquote/GetPunchingTeam?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Quotation=" +
          this.Quotation_Id
      )
      .then(
        (result: any) => {
          //this.api.HideLoading();
          if (result["Status"] == true) {
            //this.api.Toast('Success',result['msg']);
            this.GetPunchingTeamEmployee = result["Data"];
            this.Type = result["Type"];
          } else {
            //alert(result['message']);
            //this.api.Toast('Warning',result['msg']);
          }
        },
        (err) => {
          // Error log
          ////   //   console.log(err);
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  SharePunchingTeam() {
    this.isSubmitted = true;
    var fields = this.ShareToPunchingTeam.value;
    const formData = new FormData();

    if (this.ShareToPunchingTeam.invalid) {
      return;
    } else {
      if (confirm("Are you sure !") == true) {
        formData.append("Quotation", this.Quotation_Id);
        formData.append("PunchingEmployee", fields["PunchingTeam"][0]["Id"]);

        this.api.IsLoading(); //TypeArray
        this.api
          .HttpPostType(
            "Offlinequote/AssignPunchingEmployee?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType(),
            formData
          )
          .then(
            (result: any) => {
              this.api.HideLoading();
              if (result["status"] == true) {
                this.GetRow();
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
  }

  ViewOfflineQuoteDetailsPaymentConfrim(Id: any, type: any, Quotationid: any) {
    const dialogRef = this.dialog.open(ConfrimPaymentMethodComponent, {
      width: "30%",
      height: "30%",
      disableClose: true,
      data: { Id: Id, type: type, Quotation: this.Quotation_Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  InspectionDetails(id: any) {
    const dialogConfig = this.dialog.open(ViewDetailsModalComponent, {
      width: "90%",
      height: "90%",
      data: { sid: id },
    });

    dialogConfig.afterClosed().subscribe((result: any) => {
      //   //   //   console.log(result);
    });
  }

  SrPopup(type, row_Id): void {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Code"));
    formData.append("Source", "CRM");

    this.api
      .HttpPostTypeBms("../v2/sr/life/LifeSubmit/GetUserId", formData)
      .then(
        (result: any) => {
          if (result["Status"] == true) {
            var baseurl = "https://crm.squareinsurance.in/";
            var url =
              baseurl +
              "business-login/form/general-insurance/" +
              type +
              "/crm/" +
              result["User_Id"] +
              "/" +
              row_Id +
              "/web";
            window.open(url, "", "fullscreen=yes");
          } else {
            this.api.Toast("Error", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again! " + err.message
          );
        }
      );
  }
} //end
