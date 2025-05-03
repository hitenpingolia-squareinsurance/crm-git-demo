import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from  '@angular/router';

@Component({
  selector: 'app-starter-page',
  templateUrl: './starter-page.component.html',
  styleUrls: ['./starter-page.component.css']
})
export class StarterPageComponent implements OnInit {
  EncodeMotor: string;
  EncodeLife: string;

  constructor(private router: Router) { }

  ngOnInit() { 

    this.EncodeMotor=btoa('Motor');
    this.EncodeLife=btoa('Life');
    
  } 
  Clicks(Type:any){


    this.router.navigate(['Agent/Training/'+btoa('Motor')]);
  }

}
