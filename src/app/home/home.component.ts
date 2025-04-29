import { Component, OnInit, } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AdminServiceService } from '../_services/admin-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {



  constructor(private router: Router, public adminService: AdminServiceService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // this.checkToken();
        this.activeRoute = this.activatedRoute.snapshot.url.join('/');
      }
    })
  }


  activeRoute: string;


  ngOnInit() {
    this.getLoggedInUser();
    this.notificationList();

    const userData = localStorage.getItem('MATCHEDFOREVERF');
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.plan_type = parsedData.plan_type;
    }
  }

  plan_type: any;
  public loggedInUser: any = {};

  getLoggedInUser() {
    let user: any = this.adminService.getLoggedInUser();
    this.loggedInUser = user.value;
    console.log(this.loggedInUser);
  }

  // checkToken() {
  //   this.adminService.checktoken({}).subscribe((response: any) => {
  //     if (response.success == 1) {

  //     } else {
  //       this.getlogout();
  //     }
  //   })
  // }



  getlogout() {
    this.adminService.removeObjservableUser();
    this.router.navigate(["/login"])
    // localStorage.removeItem('filter');
    localStorage.removeItem('tabname');

  }

  public sidemenuF: boolean = false;
  collapseMenu() {
    this.sidemenuF = !this.sidemenuF
  }

  collapseMenu2() {
    if (window.innerWidth <= 991) {
      this.sidemenuF = !this.sidemenuF
    }
  }


  isPopupOpen = false;

  openPopup() {
    this.isPopupOpen = !this.isPopupOpen;
  }

  closePopup() {
    this.isPopupOpen = false;
  }


  notofication_List: any = [];
  total_record: any = 0;
  unread_count: any = 0;

  notificationList() {
    this.adminService.getNotification({ user_id: this.loggedInUser.id }).subscribe((response: any) => {

      console.log(response);

      if (response.success == 1) {
        this.notofication_List = response.records;
        this.total_record = response.total_records;
        this.unread_count = response.unreadCount;
      }


    })
  }

  notificationObj = {
    user_id: '',
    parent_id: ''
  }

  redirct_notification(data: any, type: any) {
    console.log(data);
    if (type == 'single') {
      this.notificationObj.parent_id = data.id;
      this.notificationObj.user_id = this.loggedInUser.id;
    }
    console.log(data.type);

    this.adminService.clearNotification(this.notificationObj).subscribe((response: any) => {
      if (response.success == 1) {
        console.log(response.message);
        if (data.type === 'Request_received') {

          localStorage.setItem('tabname', 'request_received');

          // this.router.navigate(['/']);

          // window.location.href = '/';
          this.router.navigate(['/'], {
            queryParams: { tab: 'request_received' }
          });



          console.log('Navigation successful!');
          this.isPopupOpen = false;
        }
      }
    })

    this.notificationList();
    this.isPopupOpen = false;


  }

  markallRead() {
    this.adminService.clearNotification({ user_id: this.loggedInUser.id }).subscribe((response: any) => {
      if (response.success == 1) {
        this.isPopupOpen = false;
        this.notificationList();
      }
    })
  }


  myprofile(id: any) {
    console.log(id);
    // window.location.href = `/my-profile`;
    // window.location.href = `/preview/${id}`;
    // this.router.navigate(['/']);
    this.router.navigate([`/preview/${id}`]);

  }
}
