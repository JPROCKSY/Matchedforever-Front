import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from '@angular/router';
import { AdminServiceService } from '../_services/admin-service.service';
import { PagerService } from "src/app/_services/pager-service";

@Component({
  selector: 'app-matched-profile',
  templateUrl: './matched-profile.component.html',
  styleUrls: ['./matched-profile.component.css']
})
export class MatchedProfileComponent implements OnInit {



  constructor(
    public adminService: AdminServiceService,
    public pagerService: PagerService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getLoggedInUser();
  }

  public loggedInUser: any = {};

  getLoggedInUser() {
    let user: any = this.adminService.getLoggedInUser();
    this.loggedInUser = user.value;
    if (this.loggedInUser.id) {
      this.dataObj.user_id = this.loggedInUser.id;
      this.getprofile();
    }
  }

  public dataObj: any = {
    total: "",
    type: "sent_by_rm"
}

  resetPagination() {
    this.dataObj.page = 0;
  }



public dummyRecords = [1, 2, 3, 4 , 5, 6, 7, 8, 9, 10];
public isLoading: boolean = false;

public profileList: any = [];

getprofile() {
    this.isLoading = true;
    this.adminService.getmatchedProfiles(this.dataObj).subscribe((response: any) => {
        if (response.success) {
            this.profileList = response.sent_profiles;
            this.dataObj.total = response.total_records;
        } else {
            this.profileList = [];
        }
        this.isLoading = false;
    })
}

selectOption(option: string, id:number) {
  const userId = this.loggedInUser.id;
  const candidateId = id;

  if(option == 'Interested'){
    this.adminService.requestSend({user_id : userId , candidate_id: candidateId , status : 'request_sent'}).subscribe((response: any) => {
      if (response.success == 1) {
        this.toastr.success(response.message);
      } else {
        this.toastr.error(response.message);
      }
    });
  }
  if(option == 'Rejected'){
    this.adminService.requestreject({user_id : userId , candidate_id: candidateId , status : 'rejected'}).subscribe((response: any) => {
      if (response.success == 1) {
        this.toastr.success(response.message);
      } else {
        this.toastr.error(response.message);
      }
    });
  }
  this.profileList = [];
  this.getprofile();


}













}
