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
    public toastr: ToastrService
  ) { }

  ngOnInit() {
    // this.startCountdown();
    this.country();

  }
  isResendDisabled: boolean = false;
  countdown: number = 60; // Set initial countdown time
  interval: any;
  startCountdown() {
    this.isResendDisabled = true;
    this.countdown = 60;

    this.interval = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(this.interval);
        this.isResendDisabled = false; // Enable resend OTP
      }
    }, 1000);
  }


  public isLoading: boolean = false;

  public loginObj: any = {
    contact_no: "",
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: '',
    user_type: '1',
    country_code: '91',
  }


  public otpsentF: Boolean = false;

  response_message: any = "";

  loginMethod: string = 'phone'; // Default to phone login

  // Submit OTP Form

  isSubmiting: boolean = false;
  submitotp(form) {
    if (form.valid) {
      this.isSubmiting = true;
      this.isLoading = true;

      if (this.loginObj.country_code) {
        this.loginObj.country_code = this.loginObj.country_code.replace(/\+/g, '');
      }

      this.adminService.adminotp(this.loginObj).subscribe((response: any) => {
        if (response.success == 1) {
          // this.response_message = response.message;
          this.isSubmiting = false;
          this.toastr.success(response.message);
          this.startCountdown();
          this.otpsentF = true;
          setTimeout(() => {
            const nextElement = document.getElementById('otp1');
            // as HTMLInputElement
            if (nextElement) {
              nextElement.focus();
            }
          }, 0);
        } else {
          this.isSubmiting = false;
          // this.toastr.error(response.message);
          this.response_message = response.message;
        }
        this.isLoading = false; // Stop loading spinner
      });
    }
    // this.response_message = '';

  }

  // Combine OTP digits into a single string before submitting for login
  getCombinedOTP(): string {
    return this.loginObj.otp1 + this.loginObj.otp2 + this.loginObj.otp3 + this.loginObj.otp4;
  }

  // Submit Admin Form (with OTP)


  submitadmin(form) {
    if (1 == 1) {
      this.isLoading = true;

      // Combine OTP
      const combinedOtp = this.getCombinedOTP();
      this.loginObj.otp = combinedOtp;

      if (this.loginObj.country_code) {
        this.loginObj.country_code = this.loginObj.country_code.replace(/\+/g, '');
      }

      this.adminService.adminSignIn(this.loginObj).subscribe((response: any) => {
        if (response.success == 1) {

          this.adminService.setObjservableUser(JSON.stringify(response.user));
          this.toastr.success(response.message);
          this.router.navigate(['/']);
        } else {
          this.toastr.error(response.message);
        }
        this.isLoading = false; // Stop loading spinner
      });
    }
  }

  // Restrict input to numbers only
  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Move focus to the next input or auto-submit when OTP is complete
  moveFocus(event, nextInput?) {
    if (event.target.value.length === 1) {
      if (nextInput) {
        const nextElement = document.getElementById(`otp${nextInput}`);
        if (nextElement) {
          nextElement.focus();
        }
      }
    }
  }
  changeTab(tab: any) {
    if (tab > 1) {

      tab = tab - 1;
      const nextElement = document.getElementById(`otp${tab}`);
      if (nextElement) {
        nextElement.focus();
      }
    }
  }




  // Trigger the form submission when the 4th OTP field is filled
  onOtp4Change() {
    if (this.loginObj.otp4.length === 1) {
      this.submitadmin({ valid: true }); // Auto-submit when otp4 is filled
    }
  }




  // 



  // resendOtp() {
  //   if (this.isResendDisabled) return; // Prevent spam clicking

  //   console.log('OTP resent!');

  //   // Restart the countdown
  //   this.isResendDisabled = true;
  //   this.countdown = 60;
  //   this.startCountdown();
  // }
  resendOtp() {
    if (this.isResendDisabled) {
      return;
    }// Prevent spam clicking

    console.log('OTP resent!');

    // Restart the countdown after resending OTP
    this.startCountdown();

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




  // 

  response_message_clear() {
    this.response_message = '';
  }


  countryList: any = [];

  country() {
    this.adminService.country({}).subscribe((response: any) => {
      if (response.success) {
        this.countryList = response.country;
      } else {
        this.toastr.error(response.message);
      }
    });
  }
  toSmallerCase(country: any) {
    return country.toLowerCase();
  }

  checkIfPlusPresent(countryCode: string): boolean {
    return countryCode.trim().startsWith('+');
  }
}
