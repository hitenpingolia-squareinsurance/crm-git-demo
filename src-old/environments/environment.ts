var apiUrlBmsBase1 = "https://api.policyonweb.com/API/v1";
var apiUrlBms1 = "https://api.policyonweb.com/API/v1/crm";

// var apiUrlBmsBase1 = 'https://uat.policyonweb.com/bms/v1';
// var apiUrlBms1 = "https://uat.policyonweb.com/bms/v1/crm";

// var apiUrlBmsBase1 ='http://localhost/bms-api/v1';  //-- PARAS
// var apiUrlBms1 ='http://localhost/bms-api/v1/crm';  //-- PARAS

//var apiUrlBmsBase1 = 'http://13.127.142.101/sanity/ci/bony/bms/';  //-- NEW FTP SERVER PARAS

// var apiUrlBmsBase1 = 'http://13.127.142.101/sanity/ci/bony/live/v1/';
// var apiUrlBms1 = 'http://13.127.142.101/sanity/ci/bony/live/v1/';

// var apiUrl1 = 'https://helpdesk.squareinsurance.in/helpdeskbackup/crmdev/api/';

var apiUrl1 = "https://crm.squareinsurance.in/backuplivelife/api/";

// var apiUrl1 = "http://13.127.142.101/sanity/ci/puspendar/crmdev/api/";

// var apiUrl1 = 'http://13.127.142.101/sanity/ci/puspendar/latest/api/';

// var apiUrl1 = 'http://localhost/crmdev/api/';

var user = JSON.parse(localStorage.getItem("UserData"));
if (user != null) {
  if (user["Code"] == "SIBAdmin") {
    // apiUrlBmsBase1 = "https://api.policyonweb.com/copy-api/v1";
    apiUrlBmsBase1 = "http://13.127.142.101/sanity/ci/bony/live/v1/";
    apiUrl1 = "https://crm.squareinsurance.in/backuplivelife-copy/api";
  }
}

export const environment = {
  production: true,
  pusher: {
    key: "ab292ed447c156572d03",
    cluster: "ap2",
  },
  SOCKET_ENDPOINT: "https://node.squareinsurance.in:3002",

  SOCKET_ENDPOINT_VALUE: "https://node.squareinsurance.in:3000",

  apiUrl: apiUrl1,
  // apiUrl: "http://43.205.60.83/Crm/api/",

  // apiUrlBms: "https://api.policyonweb.com/API/v1/crm",
  apiUrlBms: apiUrlBms1,

  apiUrlBmsBase: apiUrlBmsBase1,

  firebase: {
    apiKey: "AIzaSyC7BV4A8b4qh0XmceumbRXgz30Awe7nqW4",
    authDomain: "squarecrm-82c8f.firebaseapp.com",
    projectId: "squarecrm-82c8f",
    storageBucket: "squarecrm-82c8f.appspot.com",
    messagingSenderId: "196022669915",
    appId: "1:196022669915:web:e5b20f7cb71c2b4494257e",
    measurementId: "G-Z4T9K9CW4E",
    vapidKey:
      "BKI5E5clXWdV29LxZHquzOrOLZgXpfiVVHwjZb3fkWjss2TrHNQVf7kVep10n17VFmd4lkrdCIm0kSv3oS1m_t0",
  },
};
