import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../_services/admin-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
// import Swiper from 'swiper';

import Swiper, { Autoplay } from 'swiper';

declare var Fancybox: any;
Swiper.use([Autoplay]);
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
    private location: Location
  ) { }


  ngOnInit() {
    // this.getProfileId();

    const userData = localStorage.getItem('MATCHEDFOREVERF');
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.plan_id = parsedData.plan_id;
    }
    if (this.plan_id != '19') {
      this.valid_userF = true;
    }
    this.getLoggedInUser();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.profileId = id
        this.profileDetail();
      }
    });


  }


  getLoggedInUser() {
    let user: any = this.adminService.getLoggedInUser();
    // console.log('userdata locccal', user);
    // console.log(user);

    this.login_user_id = user.value.id;
    console.log(this.login_user_id);

  }

  profileId: any = "";
  valid_userF: boolean = false;
  plan_id: any;

  getProfileId() {
    this.profileId = this.route.snapshot.params["id"]
      ? this.route.snapshot.params["id"]
      : "";

    if (this.profileId) {
      this.profileDetail();
    }


  }

  handleVisibility(isActive) {

    let obj: any = {
      id: this.profileId,
      activity: ""
    }

    let message = "";

    if (isActive == '0') {
      obj.activity = 1;
      message = "Publish";
    } else {
      obj.activity = 0;
      message = "Unpublish";
    }
    console.log(obj);
    // return

    this.adminService.manageActivity(obj).subscribe((response: any) => {
      if (response.success == 1) {
        this.toastr.success(response.message);
        this.profileDetail();
      } else {
        this.toastr.error(response.message);
      }
    })
  }


  public isGeneratingBio: boolean = false;

  getBiodata() {
    if (this.isGeneratingBio == false) {
      this.isGeneratingBio = true;
      this.adminService
        .profileBiodata({ id: this.profileId })
        .subscribe(
          (response: any) => {
            if (response.success == 1) {
              // this.profileObj = response.profile;
              // console.log(this.profileObj.basicInfo.relatives_information);
              // if(Object.keys(this.profileObj.family_information).length > 0){
              //   this.familyFlag = true;
              // } else {
              //   this.familyFlag = false;
              // }

              this.isGeneratingBio = false;
              const biodataLink = response.biodata_link;
              const fancyboxTrigger = document.getElementById("fancyboxTrigger") as HTMLAnchorElement;

              if (fancyboxTrigger) {
                fancyboxTrigger.href = biodataLink;
                fancyboxTrigger.click(); // Trigger click to open Fancybox
              }
              // window.open(response.biodata_link, "_self");

            } else {
              this.toastr.error(response.message);
            }
          }
        );
    }
  }


  public profileObj: any = {};
  public familyFlag: boolean = false;
  profileDetail() {
    this.adminService
      .profileDetail({ id: this.profileId, candidate_id : this.login_user_id })
      .subscribe(
        (response: any) => {
          if (response.success == 1) {
            this.profileObj = response.profile;
            console.log(this.profileObj);
            if (Object.keys(this.profileObj.family_information).length > 0) {
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
  backbutton() {
    this.location.back();
  }





  // **** 

  // selectOption(option: string, id?: any, user_id?: any, message?: any) {
  selectOption(option: string, id: any, user_id: any, message?: any) {
    // const selectedProfile = this.profileList[this.currentProfileIndex];
    // const userId = this.loggedInUser.id;
    const userId = user_id;
    const candidateId = id;
    // alert('data');

    // if (this.Activetab == 'sent_by_rm') {

    // }





    if (option == "Interested" && message && message != '') {


      this.adminService
        .requestSend({
          user_id: userId,
          candidate_id: candidateId,
          status: "request_sent",
          message: message,
          // status: this.Activetab == 'request_received' ? 'accepted' : 'request_sent',
        })
        .subscribe((response: any) => {
          if (response.success == 1) {
            this.toastr.success(response.message);
            this.router.navigate(['/']);
          } else {
            this.toastr.error(response.message);
          }
          // this.getprofile();
        });
    }
    if (option == "Not-Interested") {
      this.adminService
        .requestSend({
          user_id: userId,
          candidate_id: candidateId,
          status: "not_interested",
        })
        .subscribe((response: any) => {
          if (response.success == 1) {
            this.toastr.success(response.message);
            this.router.navigate(['/']);
          } else {
            this.toastr.error(response.message);
          }
        });
    }
    if (option == "Rejected") {
      this.adminService
        .requestreject({
          user_id: userId,
          candidate_id: candidateId,
          status: "rejected",
          // status: this.Activetab == 'request_received' ? 'rejected' : 'not_interested',
        })
        .subscribe((response: any) => {
          if (response.success == 1) {
            this.toastr.success(response.message);
          } else {
            this.toastr.error(response.message);
          }
        });
    }
    this.isinterestedF = false;
    this.userdata.message = '';
    // this.getprofile();

    // console.log(`Profile ${selectedProfile.first_name} ${option}`);

    // Move to the next profile
    // this.nextProfile();
  }


  isinterestedF: boolean = false;

  closePopUp() {
    this.isinterestedF = false;
  }

  userdata: any = {

  }

  login_user_id: any;



  openPopUp(option: any, data: any) {
    this.isinterestedF = true;

    // this.userdata.user_id = this.login_user_id
    // this.userdata.candidate_id = data.id
    // this.userdata.first_name = data.first_names
    // this.userdata.last_name = data.last_name
    // console.log(this.userdata);

    // console.log(data.first_name);

  }




  // swiper test start

  ngAfterViewInit() {
    new Swiper('.swiper-container', this.swiperConfig);
    Fancybox.bind('[data-fancybox="gallery"]', {

    });
    Fancybox.bind('[data-fancybox="biodata"]', {

    });
  }

  swiperConfig = {
    slidesPerView: 1,
    // spaceBetween: 30,

    navigation: {
      nextEl: '.swiper-button-next',   // Defines the next button
      prevEl: '.swiper-button-prev'    // Defines the previous button
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true
    },
    autoplay: {
      delay: 3000, // Delay between transitions in milliseconds
      disableOnInteraction: false // Continue autoplay after user interactions
    },
    loop: true // Enables continuous loop mode

  };


  // swiper test end

  no_profile_pic() {
    this.toastr.error("No Profile Picture found.")
  }

  sendMesageRequest(candidate){
    this.adminService.sentChatRequest({candidate_id: candidate, user_id:this.login_user_id, status:"request_sent"}).subscribe((response:any) => {
        if(response.success){
            this.toastr.success(response.message);
        } else {
            this.toastr.error(response.message);
        }
    })
}
}
