import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndosmentService {

 srNo: string;


  setOption(value: any) {
     this.srNo = value;
   }

   getOption() {
     return this.srNo;
   }

  constructor() { }

}
