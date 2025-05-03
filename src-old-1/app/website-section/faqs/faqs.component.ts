import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../providers/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { empty } from 'rxjs';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FAQsComponent implements OnInit {
  dropdownSettingsType: any = {};
  Faq_form: FormGroup;
  isSubmitted = false;
  urlblank: any;
  url:any;
  Id: any;
  dataAr: any[];


  constructor(
    private FormBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // this.dropdownSettingsType = {
    //   singleSelection: true,
    //   idField: "Id",
    //   textField: "Name",
    //   itemsShowLimit: 1,
    //   enableCheckAll: false,
    //   allowSearchFilter: true,
    // };

    // this.url = [
    //   { Id: 'Term Insurance', Name: 'Term Insurance' },
    //   { Id: 'Health Insurance', Name: 'Health Insurance' },
    //   { Id: 'Car Insurance', Name: 'Car Insurance' },
    //   { Id: 'Two Wheeler Insurance', Name: 'Two Wheeler Insurance' },
    //   { Id: 'Investment', Name: 'Investment' },
    //   { Id: 'Travel insurance', Name: 'Travel insurance' },
    //   { Id: 'Home insurance', Name: 'Home insurance' },
    // ];

    this.Faq_form = this.FormBuilder.group({
      url_val: ["", Validators.required],
      questions: this.FormBuilder.array([this.createQuestion()]),

    });

  }
  get formControls() {
    return this.Faq_form.controls;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
       this.Id = params.get('Id');
    });
    if (this.Id != null) {
      this.EditData();
    }


  }

  get questions() {
    return this.Faq_form.get('questions') as FormArray;
  }

  createQuestion(): FormGroup {
    return this.FormBuilder.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });
  }

  AddMore_Que() {
    this.isSubmitted = true;
    if (this.Faq_form.invalid) {
      return
    } else {

      this.questions.push(this.createQuestion());
    }
  }

  Faqform() {
    this.isSubmitted = true;
    if (this.Faq_form.invalid) {
      return
    } else {
      const formdata = new FormData();
      const fields = this.Faq_form.value;

      const questionsArray = this.Faq_form.get('questions').value;
      questionsArray.forEach((q) => {
        const questionAnswer = { question: q.question, answer: q.answer };
      });
      formdata.append('url', fields['url_val'])
      formdata.append('type', "FAQ's")
      formdata.append('question-answer', JSON.stringify(questionsArray));

      if (!empty(this.Id) || this.Id !== null) {
        formdata.append('ID', this.Id);
      }


      this.api.HttpPostType("WebsiteSection/FAQs", formdata)
        .then(
          (result: any) => {
            if (result['status'] == true) {
              // Reset  form
              this.Faq_form.reset();
              this.urlblank = '';
              this.Faq_form.get('url_val').setValue([]);
              this.questions.clear();
              this.questions.push(this.createQuestion());
              this.api.Toast("Success", result['Msg']);
              this.router.navigate(['/WebsiteSection/FAQs-veiw']);
              this.isSubmitted = false;
            } else {
              this.api.Toast("Warning", result['Msg']);
            }
          },
          (err) => {
            this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          });
    }
  }

  removeQuestion(index: number) {

    this.questions.removeAt(index);

  }

  EditData() {
    
    this.api.HttpGetType("WebsiteSection/FAQsDetails?ID=" + this.Id)
      .then(
        (result: any) => {
          if (result['status'] == 1) {
            this.dataAr = result.data;
            this.urlblank = result.url;

            // this.Faq_form.patchValue(this.dataAr);

            this.Faq_form.patchValue({
              questions: this.dataAr.map((question) => ({
                question: question.question,
                answer: question.answer
              }))
            });

          } else {
            this.api.Toast("Warning", result['msg']);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
          )
        }
      )
  }





}
