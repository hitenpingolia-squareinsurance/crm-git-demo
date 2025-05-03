import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-edit-ins-company",
  templateUrl: "./edit-ins-company.component.html",
  styleUrls: ["./edit-ins-company.component.css"],
})
export class EditInsCompanyComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;
  Id: any;

  items: Array<any>;
  value: any;
  selected: any;
  Name: any;
  Status: any;

  /*
public items:Array<any> = [
    {id: 1, text: 'Python'},
    {id: 2, text: 'Node Js'},
    {id: 3, text: 'Java'},
    {id: 4, text: 'PHP', disabled: true},
    {id: 5, text: 'Django'},
    {id: 6, text: 'Angular'},
    {id: 7, text: 'Vue'},
    {id: 8, text: 'ReactJs'},
  ];
  
  selected = [
    {id: 2, text: 'Node Js'},
    {id: 8, text: 'ReactJs'}
  ]; 
*/

  constructor(
    public api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      Name: ["", Validators.required],
      Cities: ["", Validators.required],
      Status: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.Id = this.activatedRoute.snapshot.paramMap.get("Id");
    // console.log(this.Id);
    this.Get();
  }

  get formControls() {
    return this.AddForm.controls;
  }

  Get() {
    this.api.IsLoading();
    this.api.HttpGetType("data/InsuranceCompanies/GetById?Id=" + this.Id).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.selected = JSON.parse(result["Row"]["Branch_Cities"]);
          this.Name = result["Row"]["Name"];
          this.Status = result["Row"]["Status"];

          //this.AddForm  =  this.formBuilder.group({
          //Name: [result['Row']['Name'], Validators.required],
          // Cities: [result['Row']['Branch_Cities'], Validators.required],
          //Status: [result['Row']['Status'], Validators.required],
          //});
        } else {
          alert(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        alert(err.message);
      }
    );
  }

  removed(value: any): void {
    // console.log('Removed value is: ', value);
  }

  searchCities(e) {
    //// console.log(e.target.value);
    //this.api.IsLoading();
    this.api
      .HttpGetType("data/InsuranceCompanies/Cities?q=" + e.target.value)
      .then(
        (result) => {
          //this.api.HideLoading();
          if (result["Status"] == true) {
            this.items = result["Data"];
          } else {
            //alert(result['Message']);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          alert(err.message);
        }
      );
  }

  Edit() {
    // console.log(this.AddForm.value);
    this.isSubmitted = true;
    if (this.AddForm.invalid) {
      return;
    } else {
      var fields = this.AddForm.value;
      const formData = new FormData();

      formData.append("Id", this.Id);
      formData.append("Name", fields["Name"]);
      formData.append("Cities", JSON.stringify(fields["Cities"]));
      formData.append("Status", fields["Status"]);

      this.api.IsLoading();
      this.api.HttpPostType("data/InsuranceCompanies/Edit", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.router.navigate(["/data-management/insurance-companies"]);
          } else {
            alert(result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          alert(err.message);
        }
      );
    }
  }
}
