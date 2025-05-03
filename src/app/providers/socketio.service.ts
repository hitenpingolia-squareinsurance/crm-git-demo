import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { environment } from "../../environments/environment";
import { Observable, of, throwError } from "rxjs";
//npm install socket.io-client@^2.3.0

@Injectable({
  providedIn: "root",
})
export class SocketioService {
  socket;
  Connected_Id: any = "";

  constructor() {
    //alert(environment.SOCKET_ENDPOINT);
    // console.log('Socket IO calling...');
  }

  //https://medium.com/iamdeepinder/creating-a-real-time-app-with-angular-8-and-socket-io-with-nodejs-af63bd59a47f

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT_VALUE, {
      transport: ["websocket"],
    });
    this.socket.on("connection", () => {
      ////   //   console.log("Connected! ID: " + this.socket["id"]);
      this.Connected_Id = this.socket["id"];
    });
  }

  sendMessage(data) {
    // console.log(this.Connected_Id);
    this.socket.emit("my-message", data);
  }

  public ReceiveMessage = () => {
    return Observable.create((observer) => {
      this.socket.on("my-message", (message) => {
        // console.log(message);

        observer.next(message);
      });
    });
  };
}
