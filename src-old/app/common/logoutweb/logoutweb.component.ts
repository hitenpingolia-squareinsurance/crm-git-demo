import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { exit } from 'process';
import { ApiService } from '../../providers/api.service';

@Component({
  selector: 'app-logoutweb',
  templateUrl: './logoutweb.component.html',
  styleUrls: ['./logoutweb.component.css']
})
export class LogoutwebComponent implements OnInit {
  CurrentUrl: string;
  Types: any = '';

  constructor(private router: Router, public api: ApiService, private route: ActivatedRoute) {

    this.api.IsLoading();
    //this.Logout();
    this.CurrentUrl = window.location.pathname;
  }

  ngOnInit() {

    // this.route.queryParams
    //   .subscribe(params => {

    //     this.Types = params.type;
    //   });

    //if (this.Types == 'web') {

    // this.LogoutWEb();
    // }
    // else {

    // this.Logout();
    //}

    setTimeout(() => {

      this.Logout();
    }, 2000);


  }

  Logout() {

    var LoginTypes = localStorage.getItem('LoginType');
    var LoginId = localStorage.getItem('LoginIdSet');
    
    localStorage.removeItem('LoginType');
    localStorage.removeItem('Token');
    localStorage.removeItem('UserData');
    localStorage.setItem('Logged_In', 'FALSE');
    localStorage.removeItem('Login_Token');
    localStorage.removeItem('Login_Token');
    localStorage.removeItem('LoginIdSet');
    const params = new URLSearchParams(window.location.search)
    var name = params.get("type");
    var Id = params.get("Id");
    if (this.CurrentUrl == '/Logoutweb' && (name == 'employee' || name == 'agent' || name == 'user' || name == 'sp')) {
      window.location.href = this.api.ReturnWebUrl() + '/logout-users/' + name;
    } else
      window.location.href = this.api.ReturnWebUrl() + '/logout-users/' + LoginTypes;
  }


  LogoutWEb() {


    var LoginTypes = localStorage.getItem('LoginType');

    localStorage.removeItem('LoginType');
    localStorage.removeItem('Token');
    localStorage.removeItem('UserData');
    localStorage.setItem('Logged_In', 'FALSE');
    localStorage.removeItem('Login_Token');


    setTimeout(() => {

      window.location.href = this.api.ReturnWebUrl() + '/logout-users/' + LoginTypes;
    }, 2000);

  }
}