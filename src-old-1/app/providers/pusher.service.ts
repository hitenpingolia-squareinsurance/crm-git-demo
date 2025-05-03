import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  pusher: any;
  channel: any;

  constructor() {

    this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster,
      encrypted: true
    });
    this.channel = this.pusher.subscribe('events-channel');

   }
   
    /*
	sendToServer( data ) {
		this.http.post('http://localhost/pusher-php-server/index.php', data)
		.subscribe(data => {});
	}
   */
 
}
