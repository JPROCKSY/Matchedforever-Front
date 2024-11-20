import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../_services/admin-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    public adminService: AdminServiceService,
    public toastr:ToastrService
  ) { }

  ngOnInit() {
  }

  public isLoading: boolean = false;

  public loginObj: any = {
    contact_no: "",
    otp1: '', 
    otp2: '',
    otp3: '',
    otp4: '',
    user_type:'1'
  }

  public otpsentF:Boolean = false;


  submitotp(form){
    if(form.valid){
      this.isLoading = true;
      this.adminService.adminotp(this.loginObj).subscribe((response: any) => {
        if (response.success == 1) {
          this.toastr.success(response.message);
          this.otpsentF = true;
        } else {
          this.toastr.error(response.message);
        }
        this.isLoading = false; // Stop loading spinner
      });
    }
  }

  // Combine OTP digits into a single string before submitting for login
  getCombinedOTP(): string {
    return this.loginObj.otp1 + this.loginObj.otp2 + this.loginObj.otp3 + this.loginObj.otp4;
  }

  submitadmin(form) {
    if (form.valid) {
      this.isLoading = true;

      const combinedOtp = this.getCombinedOTP();
      this.loginObj.otp = combinedOtp;

      this.adminService.adminSignIn(this.loginObj).subscribe((response: any) => {
        if (response.success == 1) {
          this.adminService.setObjservableUser(JSON.stringify(response.user));
          this.toastr.success(response.message);
          this.router.navigate(['/']);
        } else {
          
          this.toastr.error(response.message);
        }
        this.isLoading = false; 
      });
    }
  }
  
  moveFocus(event, nextInput) {
    if (event.target.value.length === 1) {
      const nextElement = document.getElementById(`otp${nextInput}`);
      if (nextElement) {
        nextElement.focus();
      }
    }
  }

}
