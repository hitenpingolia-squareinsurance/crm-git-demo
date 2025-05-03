import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-add-ratings',
  templateUrl: './add-ratings.component.html',
  styleUrls: ['./add-ratings.component.css']
})

export class AddRatingsComponent implements OnInit {

  selectedFiles: File;
  
  AddRatingForm: FormGroup;
  isSubmitted = false;
  SelectedFiles: File;
  image:File;

  dropdownSettingsType: any = "";
  dropdownSettingsMultiselect: any = "";
  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  
  Insurer: { Id: string; Name: string; }[];
  currentUrl: string;
  urlSegment: string;
  urlSegment2: string;
  urlSegment3: string;
  id: string;
  dataArr: any;
  pagename: any;
  companyname:any;
  companyData:any;
  cityData: any;
  url: any;
  CityVal: any;
  Company: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {

    this.currentUrl = this.router.url;
    console.log(this.currentUrl);
	 var splitted = this.currentUrl.split("/");
    console.log(splitted);

	 if(typeof splitted[2] != 'undefined') {
			this.urlSegment = splitted[2];
	 }
   if(typeof splitted[3] != 'undefined') {
    this.urlSegment2 = splitted[3];
  }
  if(typeof splitted[4] != 'undefined') {
    this.urlSegment3 = splitted[4];
  }

  // console.log(this.urlSegment2);

  if(this.urlSegment2 == 'add_ratings'){
    this.id = '';
  }else{
    this.id = this.urlSegment3;
  }

    this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsMultiselect = {
      singleSelection: true,
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

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.Insurer = [
      { Id: 'Term Insurance', Name: 'Term Insurance' },
      { Id: 'Health Insurance', Name: 'Health Insurance' },
      { Id: 'Car Insurance', Name: 'Car Insurance' },
      { Id: 'Two Wheeler Insurance', Name: 'Two Wheeler Insurance' },
      { Id: 'Investment', Name: 'Investment' },
      { Id: 'Life Insurance', Name: 'Life Insurance' },
      { Id: 'Travel insurance', Name: 'Travel insurance' },
      { Id: 'Home insurance', Name: 'Home insurance' },
    ];


    if(this.id == ''){
      this.AddRatingForm = this.formBuilder.group({
        insurercompany: ["", Validators.required],
        name: ["", Validators.required],
        image: [""],
        customerrating: ["", Validators.required],
        policycoveragerating: [""],
        policybenifit: [""],
        premiumrating: [""],
        city: [""],
        titlereview: [""],
        discriptionreview: [""],
        company: [""],
      });
    }else{
      this.AddRatingForm = this.formBuilder.group({
        insurercompany: ["", Validators.required],
        name: ["", Validators.required],
        image: [""],
        customerrating: [""],
        policycoveragerating: [""],
        policybenifit: [""],
        premiumrating: [""],
        city: [""],
        titlereview: [""],
        discriptionreview: [""],
        company: [""],
      });
    }
    


  }

  ngOnInit() {   
    this.FilterCity();
    if(this.id != '' && this.id != 'undefined'){
      this.getimageValue();
    }else{

    }

  }


  validateInput(input) {
          // Ensure the input value is between 1 and 5
      if (input.value < 1 || input.value > 5) {
          // If not, reset the input value
          input.value = "";
      }
  }

  // fetchcompany(){
        
  //   var fields = this.AddRatingForm.get('insurercompany').value;
  //   const formData = new FormData();

  //   if (fields && fields.length > 0) {
  //     var productName = fields[0].Id;
   
  //   } else {
  //     console.log('No fields available');
  //   }

  //   formData.append('Product' , productName);


  //   this.api.IsLoading();
  //   this.api
  //     .HttpPostType(
  //       "WebsiteSection/fetchcompany",formData
  //     )
  //     .then(
  //       (result:any) => {
  //         this.api.HideLoading();
  //         console.log(result);
  //         if (result["status"] == true) {
  //           this.Company = result["company"];
  //           console.log(result.status);
  //         } else {
  //           this.api.Toast("Warning", result["Message"]);
  //         }
  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //         this.api.Toast(
  //           "Warning",
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //       }
  //     );

    
  // }




  UpdateTypeValue(e: any) {
    const selectedValue = e["Id"];
    console.log(selectedValue);

    const formData = new FormData();

    formData.append("product", selectedValue);

    this.api.HttpPostType("WebsiteSection/fetchcompany", formData).then(
      (result) => {
        if (result["status"] == true) {
          this.Company = result["company"];
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



  FilterCity() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "WebsiteSection/GetCity?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result:any) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.CityVal = result["Data"];
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




  getimageValue() {



    //  var fields = this.loginform.value;
    const formData = new FormData();

    formData.append("login_type",  this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));


    formData.append("id", this.id);


      this.api.IsLoading();
      this.api.HttpPostType("WebsiteSection/GetRatingalue", formData).then((result:any) => {
      this.api.HideLoading();
      console.log(result);


      if (result['status'] == true) {

        this.dataArr = result['data'];

        this.pagename = result["pagename"];
        this.cityData = result["cityVal"];
        this.companyname = result['company'];
        this.companyData = result['companyData'];
        if(this.pagename != ''){
          this.UpdateTypeValue(this.pagename[0]);

        }
        this.AddRatingForm.patchValue(this.dataArr);
      
      } else {
        const msg = 'msg';
        //alert(result['message']);
        this.api.Toast('Warning', result['msg']);
      }

    }, (err) => {
      // Error log
      // console.log(err);
      this.api.HideLoading();
      const newLocal = 'Warning';
      this.api.Toast(newLocal, 'Network Error : ' + err.name + '(' + err.statusText + ')');
      //this.api.ErrorMsg('Network Error :- ' + err.message);
    });


  }



  UploadDocs(event, Type) {
    this.SelectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {

      var str = this.SelectedFiles.name;
      var ar = str.split(".");
      console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf" ||  ext== "avif" || ext== "svg") {
        console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);
        // alert(Total_Size);
        console.log(Total_Size + " kb");

        if (Total_Size > 500) { // allow only 2 mb

          alert('File size is greater than 500 kb');

          this.AddRatingForm.get('image').setValue('');

        } else {

          this.image = this.SelectedFiles;

        }

      } else {
        console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }


  get formControls() {
    return this.AddRatingForm.controls;
  }
  
  Submit() {

    this.isSubmitted = true;
    if (this.AddRatingForm.invalid) {
      return;
    } else {

      var fields = this.AddRatingForm.value;
      const formData = new FormData();

      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      formData.append("insurercompany", fields["insurercompany"][0]['Id']);
      formData.append("name", fields["name"]);
      formData.append("customerrating", fields["customerrating"]);
      formData.append("policycoveragerating", fields["policycoveragerating"]);
      formData.append("policybenifit", fields["policybenifit"]);
      formData.append("premiumrating", fields["premiumrating"]);
      formData.append("city", fields["city"][0]['Id']);
      formData.append("titlereview", fields["titlereview"]);
      formData.append("discriptionreview", fields["discriptionreview"]);
      formData.append("image", this.image);
      formData.append("Company", fields["company"][0].Name);
      
      if(this.id != ''){
        formData.append("Id", this.id);
        this.url = "WebsiteSection/EditRating";
      }else{
        this.url = "WebsiteSection/AddRating";
      }

      // console.log(formData);
      
      this.api.IsLoading();
      this.api.HttpPostType(this.url, formData).then(
        (result:any) => {
          this.api.HideLoading();

          console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.router.navigate(["WebsiteSection/products/view_ratings"]);
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

