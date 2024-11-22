import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, NavigationEnd } from '@angular/router';
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
  }

  public loggedInUser: any = {};

  getLoggedInUser() {
    let user: any = this.adminService.getLoggedInUser();
    this.loggedInUser = user.value;
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
  }
  
  public sidemenuF:boolean = false;
  collapseMenu(){
    this.sidemenuF = !this.sidemenuF
  }

  collapseMenu2(){
    if (window.innerWidth <= 991) {
      this.sidemenuF = !this.sidemenuF
    }
  }

}
