import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, UrlSegment } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/providers/api.service";
import { DataTableDirective } from "angular-datatables";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";


class ColumnsObj {
  Id: any;
  Name: any;
  riskClass: any;
  status: any;
  SrNo:any;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}

@Component({
  selector: 'app-occupation',
  templateUrl: './occupation.component.html',
  styleUrls: ['./occupation.component.css']
})
export class OccupationComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dataAr: ColumnsObj[];

  modalAction: "add" | "edit" = "add";
  // OccupationForm: any;
  SubmitOccupation: any = false;
  occupationId: any;
  currentOccupation: any = {};
  OccupationForm: FormGroup;
  occupations: any;
  searchQuery: string = '';

  constructor(
      private route: ActivatedRoute,
      private api: ApiService,
      private http: HttpClient,
      private FormBuilder: FormBuilder) { 

    this.OccupationForm = this.FormBuilder.group({
        Name: ['', Validators.required],
        });
  }

  ngOnInit() {
    this.Get();
  }

  openAddModal() {
    this.modalAction = "add";
    this.OccupationForm.get("Name").setValue("");
  }
  openEditModal(occupationId: number) {
    this.modalAction = "edit";
    this.getDatabyID(occupationId);
    this.occupationId = occupationId;
  }


  get formcontrolsOccupationForm() {
    return this.OccupationForm.controls;
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  ClearSearch() {
    this.searchQuery = '';
    this.dataAr = [];
    this.ResetDT();
    // this.Is_Export = 0;
  }

  SearchData(): void {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
        const TablesNumber = `${dtInstance.table().node().id}`;
        const searchTerm = this.searchQuery.trim(); // Get the search term from input

        if (TablesNumber == "example2") {
            dtInstance.search(searchTerm).draw(); // Apply search only when button is clicked
        } else if (TablesNumber == "Table1") {
          dtInstance.column(0).search(this.api.encryptText(JSON.stringify(searchTerm))).draw();

            // dtInstance.search(searchTerm).draw();
        }
    });
}

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  Get() {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: "Bearer " + this.api.GetToken(),
        }),
      };
      const that = this;
      this.dtOptions = {
        pagingType: "full_numbers",
        pageLength: 10,
        serverSide: true,
        processing: true,
        // dom: "ilpftripl",
        ajax: (dataTablesParameters: any, callback) => {
          // const type = this.currentView === "vendor-type" ? 1 : 2; // Set the type here based on your view
  
          that.http
            .post<DataTablesResponse>(
              this.api.additionParmsEnc(
                environment.apiUrl +
                  "/PospManegment/FetchOccupationData?User_Id=" +
                  this.api.GetUserData("Id") +
                  "&User_Type=" +
                  this.api.GetUserType()
              ),
  
              dataTablesParameters,
              httpOptions
            )
            .subscribe((res: any) => {
              var resp = JSON.parse(this.api.decryptText(res.response));
              that.dataAr = resp.data;
              that.occupations = resp.data;
  
              // console.log(that.dataAr);
              if (that.dataAr.length > 0) {
              }
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            });
        },
      };
    }



    getDatabyID(occupationId: number) {
      let formData = new FormData();
      formData.append("id", String(occupationId));
  
      this.api.IsLoading();
      this.api.HttpPostType(`/PospManegment/Get_Fetch_Occupation_Data`, formData).then(
        (resp: any) => {
          //   //   //   console.log('Response:', resp);
          this.api.HideLoading();
          if (resp["status"] == true) {
            if (resp && resp.data && resp.data.length > 0) {
              this.currentOccupation = resp.data[0].Name;
              this.OccupationForm.patchValue({ Name: this.currentOccupation });
              //   //   //   console.log('Fetched Vendor:', this.currentVendor);
            }
          } else {
            this.api.ToastBeforeLogin("Warning", resp["message"]);
            this.api.HideLoading();
          }
          // // alert(resp.message);
        },
        (err) => {
          this.api.HideLoading();
          console.error("Error fetching vendor:", err);
        }
      );
    }


  submitForm() {

    let formData = new FormData();
    var fields = this.OccupationForm.value;

    this.SubmitOccupation = true;

    if (this.OccupationForm.invalid) {
      return;
    } else {
      if (this.modalAction === "add") {

        const formData = new FormData();

        formData.append("name", fields["Name"]);

        this.api.IsLoading();
        this.api.HttpPostType("/PospManegment/OccupationStore", formData).then(
          (resp: any) => {
            if (resp["status"] == true) {
              this.api.Toast("Success", resp.msg);
              this.Reload();
              this.Get();
              this.api.HideLoading();

              let filterContainer = document.getElementById("close1");

              if (filterContainer) {
                document.getElementById("close1").click();
              } else {
              }

              
            } else {

              this.api.Toast("Warning", resp.msg);
              this.api.HideLoading();
              
            }
          },
          (err) => {
            this.api.HideLoading();
            console.error("Error adding vendor:", err);
          }
        );
      } else if (this.modalAction === "edit") {
        if (!this.occupationId || !this.occupationId) {
          console.error("Error: No vendor selected for update!");
          return;
        }



        const formData = new FormData();
        formData.append("id", this.occupationId);
        formData.append("name", fields["Name"]);

        this.api.IsLoading();
        this.api.HttpPostType(`/PospManegment/OccupationStore`, formData).then(
          (resp: any) => {
            if (resp["status"] == true) {
              this.api.Toast("Success", resp.msg);
              this.Reload();
              this.Get();
              this.api.HideLoading();

              let filterContainer = document.getElementById("close1");

              if (filterContainer) {
                document.getElementById("close1").click();
              }
              
            } else {
              this.api.Toast("Warning", resp.msg);
              this.api.HideLoading();
              
            }
          },
          (err) => {
            this.api.HideLoading();
            console.error("Error updating vendor:", err);
          }
        );
      }
    }
  }

  toggleStatus(occupationId: any): void {
    // Find the selected occupation from the list
    const occupation = this.occupations.find((o) => o.Id === occupationId);
    
    if (!occupation) {
        console.error("Occupation not found");
        return;
    }

    // Show a confirmation alert before proceeding
    if (!confirm(`Are you sure you want to change the status of ${occupation.Name}?`)) {
        return; // Exit function if user cancels
    }

    // Toggle the status between 0 and 1
    const newStatus = occupation.status == 1 ? 0 : 1;

    // Prepare form data to send to the backend
    let formData = new FormData();
    formData.append("id", String(occupationId));
    formData.append("status", String(newStatus));

    this.api.IsLoading(); // Show loading indicator

    // Send the request to update the status
    this.api.HttpPostType(`/PospManegment/updateStatus`, formData).then(
      (resp:any) => {
        this.api.HideLoading(); // Hide loading indicator

        if (resp["status"] == true) {
          this.Reload();
          this.Get();
          // Update the status locally if the update is successful
          occupation.status = newStatus;
          
        } else {
          console.error("Failed to update status:", resp.message);
        }
      },
      (err) => {
        this.api.HideLoading(); // Hide loading indicator
        console.error("Error updating status:", err);
      }
    );
}


}
