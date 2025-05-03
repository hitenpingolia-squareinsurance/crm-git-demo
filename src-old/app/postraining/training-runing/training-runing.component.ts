import { Component, OnInit ,ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from  '@angular/forms';
import { Router,ActivatedRoute } from  '@angular/router';
import { trim } from 'jquery';
import { ApiService } from '../../providers/api.service';
import { SocketioService } from '../../providers/socketio.service';

@Component({
  selector: 'app-training-runing',
  templateUrl: './training-runing.component.html',
  styleUrls: ['./training-runing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TrainingRuningComponent implements OnInit {

container: HTMLElement;
ChatForm: FormGroup;
 isSubmitted  =  false;

Ticket_Id:any=0;
row:any=[];
Messages:any=[];

inputMessage:string='';

selectedFiles: File;
Is_Attachement:string = 'No';
CurrentTicketStatus:any;

  ShowUpdateStatusLabels:boolean=false;
  RedicrctBackYypes: string;
  CheckQuotationPopup:boolean=false;
  Training_Type: string;
  ModuleName: any;
  UrlRunning: any;
  ContentDiv: any;
  ContentModultTitle: any;
  ContentModultPerContent: any;
  TabIdMain: any;
  TopicContent: any;
  TopicTabs: any;
  Activate_Module: any;
  Loc_Modules: any;
  Training_Time: any;
  Current_Time: any;
  NextModule: any;
  ExamCompleted: any;
  ShowNextModule: any='';
  ExamComplted: boolean;
  TimerInterval: any;
  TermCheckbox: any='';
  Login_Token: string;
  i: any='';
  constructor(
			public api : ApiService,
			public socketService : SocketioService,
			private router: Router,
			private activatedRoute: ActivatedRoute,
			private formBuilder: FormBuilder,

	) {

    this.RedicrctBackYypes=activatedRoute.snapshot.url[0].path
		this.ChatForm  =  this.formBuilder.group({
			Message: ['']
		});


	}

  ngOnInit() {

    this.Login_Token=localStorage.getItem('Login_Token');
    this.Training_Type = atob(this.activatedRoute.snapshot.paramMap.get('Type'));

    if(this.Training_Type=='Motor' || this.Training_Type=='Life'){

      this.CheckModule();

        setTimeout(()=>{

          this.UpdateTimes();


        },3000)

       this.TimerInterval=setInterval(() => {

           this.UpdateTimes();


        }, 5000);

    }
    else{
        alert(121);
        // this.router .navigate(['Logoutweb']);
    }

    if(document.getElementById('TrainingDivLabelTraining'))
      document.getElementById('TrainingDivLabelTraining').style.display="none";


  }

  get FC() { return this.ChatForm.controls; }

  CheckModule(){

    // alert(this.Login_Token);

    var Ids=this.api.GetUserData('Id');
    var Roles=this.api.GetUserType();
	  this.api.IsLoading();
		this.api.HttpGetType('TrainingExam/Module_Start/'+this.Training_Type+'?User_Id='+Ids+'&User_Role='+Roles+'&Training_Token='+this.Login_Token).then((result:any) => {
		this.api.HideLoading();


			if(result['status'] ==true){

        this.ModuleName=result['data']['ModuleName'];
        this.UrlRunning=result['data']['UrlRunning'];
        this.Activate_Module=result['data']['Activate_Module'];
        console.log(this.ModuleName);
        this.Loc_Modules=result['data']['Loc_Module'];

        this.ShowContentsModule();
        this.ShowContentsModulePerModule(this.ModuleName);
        this.GetTimerDetails(this.ModuleName);
        
			}
      else{

				this.api.Toast('Warning',result['msg']);

        setTimeout(() => {

          this.router.navigate([result['data']['Return']]);

          }, 1000);
			}

		}, (err) => {

		  this.api.HideLoading();
		  this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );

	    });
  }




  ShowContentsModule(){

    var Ids=this.api.GetUserData('Id');
    var Roles=this.api.GetUserType();

	  this.api.IsLoading();
		this.api.HttpGetType('TrainingExam/showContentTrainingModuleAll/'+this.Training_Type).then((result:any) => {
		this.api.HideLoading();


			if(result['status'] ==true){

        this.ContentModultTitle=result['data'];


			}
      else{

				this.api.Toast('Warning',result['msg']);


			}

		}, (err) => {

		  this.api.HideLoading();
		  this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );

	    });
  }

  GetTimerDetails(Module:string){

    var Ids=this.api.GetUserData('Id');
    var Roles=this.api.GetUserType();

	  // this.api.IsLoading();
		this.api.HttpGetType('TrainingExam/CheckTimers/'+Ids+'/'+this.Training_Type+'?module='+Module).then((result:any) => {
		// this.api.HideLoading();


			if(result['status'] ==true){

        this.Training_Time=result['data']['TrianingTime'];
        this.Current_Time=result['data']['CurrentTime'];
        this.NextModule=result['data']['NextModule'];
        this.ExamCompleted=result['data']['ExamCompleted'];

        // alert(this.NextModule+' '+this.ExamCompleted);


        if(this.ExamCompleted=='' && this.NextModule!==''){

          this.ShowNextModule=this.NextModule;
          this.ExamComplted=false;
          var NewModule='module'+this.NextModule;
          this.ModuleName=NewModule;
          this.UpdateTimes();
          this.CheckModule();


        }
        else if(this.ExamCompleted=='Yes' && this.NextModule==''){

          this.ShowNextModule=this.NextModule;
          this.ExamComplted=true;
          clearInterval(this.TimerInterval);
        }

			}
      else{

				this.api.Toast('Warning',result['msg']);

			}

		}, (err) => {

		  this.api.HideLoading();
		  this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );

	    });
  }

  UpdateTimes(){

    console.log(this.ModuleName);
    var Ids=this.api.GetUserData('Id');
    var Roles=this.api.GetUserType();
    

	  // this.api.IsLoading();
		this.api.HttpGetType('TrainingExam/checkReadingStudyData/'+Ids+'/'+Roles+'/'+this.Training_Type+'?&module='+this.ModuleName).then((result:any) => {
		// this.api.HideLoading();

			if(result['status'] ==true){

        var ResponseTimes=trim(result['msg']);

        // this.api.Toast('Success',result['msg']);

        this.GetTimerDetails(this.ModuleName);


			}
      else{

				this.api.Toast('Warning',result['msg']);

        setTimeout(() => {

          this.router.navigate([result['data']['Return']]);

          }, 1000);

			}

		}, (err) => {

		  this.api.HideLoading();
		  this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );

	    });
  }


  ShowContentsModulePerModule(Module:string){

    var Ids=this.api.GetUserData('Id');
    var Roles=this.api.GetUserType();

	  this.api.IsLoading();
		this.api.HttpGetType('TrainingExam/showContentPerModule/'+Module+'/'+this.Training_Type).then((result:any) => {
		this.api.HideLoading();


			if(result['status'] ==true){

        this.ContentModultPerContent=result['data'];
        this.ShowContentsModuleSingleModuleTopic(Module,result['data'][0]['topic_name']);

			}
      else{

				this.api.Toast('Warning',result['msg']);

			}

		}, (err) => {

		  this.api.HideLoading();
		  this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );

	    });
  }

  ShowContentsModuleSingleModuleTopic(Module:string,TopicName:any){

    var Ids=this.api.GetUserData('Id');
    var Roles=this.api.GetUserType();

	  this.api.IsLoading();
		this.api.HttpGetType('TrainingExam/ShowTopicContent/'+Module+'/'+TopicName+'/'+this.Training_Type).then((result:any) => {
		this.api.HideLoading();


			if(result['status'] ==true){

        this.TopicContent=result['data'];



			}
      else{

				this.api.Toast('Warning',result['msg']);

			}

		}, (err) => {

		  this.api.HideLoading();
		  this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );

	    });
  }

  ShowModuleChapterContent(event:any,Module:string,TabId:any){



     this.ShowContentsModulePerModule(Module);
     this.TabIdMain=TabId;

  }
  ShowModuleChapterContentStop(Activate_Module:any){


    this.api.Toast('Warning','Kindly complete previous module first');
    this.ShowContentsModule();

  }

  ShowModuleContentDatas(Module:string,TopicName:any,TabId:any){

    this.ShowContentsModuleSingleModuleTopic(Module,TopicName);
    this.TopicTabs=TabId;

  }

  ExamNow(){

      document.getElementById('ClickTerAndCondiotn').click();

  }

  ProceeTOExamPage(){
    var CheckBox=this.TermCheckbox;
    if(CheckBox==''){

      this.api.Toast('Warning','Kindly Accept Term & Conditions');
    }
    else{

      document.getElementById('ClosePopups').click();

      var Decodes=btoa(this.Training_Type);

       this.router.navigate(['Agent/ExamStart/'+Decodes]);

    }

  }

  ClosePopup(){

    document.getElementById('ClosePopups').click();
  }






}
