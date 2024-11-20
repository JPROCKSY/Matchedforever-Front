import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../_services/admin-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  constructor(
    public adminService: AdminServiceService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,


  ) { }

  ngOnInit() {
      this.getProfileId();
  }

  profileId:any = "";


  getProfileId() {
    this.profileId = this.route.snapshot.params["id"]
      ? this.route.snapshot.params["id"]
      : "";

    if (this.profileId) {
      this.profileDetail();
    }
  }


  public profileObj:any = {};
  public familyFlag:boolean = false;
  profileDetail() {
    this.adminService
      .profileDetail({ id: this.profileId })
      .subscribe(
        (response: any) => {
          if (response.success == 1) {
            this.profileObj = response.profile;
            console.log(this.profileObj.basicInfo.relatives_information);
            if(Object.keys(this.profileObj.family_information).length > 0){
              this.familyFlag = true;
            } else {
              this.familyFlag = false;
            }

          } else {
            this.toastr.error(response.message);
          }
        }
      );
  }

}
