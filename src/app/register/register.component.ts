import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../_services/admin-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    public adminService: AdminServiceService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getselctionList();
    this.validateBirthDate();
    this.country();
    // this.getMultiplecity(this.signUpObj.preffered_setlement_state);
    // this.getMultiplestate(this.signUpObj.preffered_setlement_country);
  }


  public isLoading: boolean = false;
  public selctionList: any = {};

  public signUpObj: any = {
    profile_for: '',
    birth_date: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    looking_for: '',
    education: '',
    religion: '',
    preffered_setlement_country: '',
    preffered_setlement_state: '',
    preffered_setlement_city: '',
    height: '',
    remark: '',
    caste: '',
    country_code: '101',

  };


  handledate() {
    this.signUpObj.birth_date = this.formatDate(this.signUpObj.birth_date);
  }

  formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  public minDate: any = "";
  public maxDate: any = "";

  validateBirthDate() {
    const currentDate = new Date();
    let minDate = new Date(
      currentDate.getFullYear() - 18,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    let maxDate = new Date(
      currentDate.getFullYear() - 60,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    this.maxDate = minDate.toISOString().split("T")[0];
    this.minDate = maxDate.toISOString().split("T")[0];
  }

  getselctionList() {
    this.isLoading = true;
    this.adminService.getSelection({}).subscribe((response: any) => {
      console.log(response);

      if (response.success) {
        this.selctionList.communities = response.communities;
        this.selctionList.country = response.country;
        this.selctionList.religion_list = response.religion_list;
        this.selctionList.education_list = response.education_list;
      } else {
        this.selctionList = [];
      }
      this.isLoading = false;
    })
  }
  register(form) {
    if (form.valid) {
      this.isLoading = true;
      this.signUpObj.looking_for = "bride";
      this.adminService.register(this.signUpObj).subscribe((response: any) => {
        if (response.success == 1) {
          this.toastr.success(response.message);
          this.router.navigate(['/login/']);
        } else {
          this.toastr.error(response.message);
        }
        this.isLoading = false; // Stop loading spinner
      });
    }
  }

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  public cityList: any = [];
  public stateList: any = [];

  getMultiplestate(country: any) {
    this.isLoading = true;
    this.adminService
      .multiplestate({ country: country })
      .subscribe((response: any) => {
        console.log(response);

        if (response.success == 1) {
          this.stateList = response.state;
        } else {
          this.toastr.error(response.message);
        }
        this.isLoading = false;
      });
  }

  getMultiplecity(state: any) {
    this.isLoading = true;
    this.adminService
      .multiplecity({ state: state })
      .subscribe((response: any) => {
        console.log(response);

        if (response.success == 1) {
          this.cityList = response.cities;
        } else {
          this.toastr.error(response.message);
        }
        this.isLoading = false;
      });
  }

  // selectCountry(id: any) {
  //   console.log(id);

  //   this.getMultiplestate(id);

  // }

  // selectState(id: any) {
  //   console.log(id);

  //   this.getMultiplecity(id);

  // }

  public heightArray = [
    { feet: 4, inches: 0, cm: 122 },
    { feet: 4, inches: 1, cm: 124 },
    { feet: 4, inches: 2, cm: 127 },
    { feet: 4, inches: 3, cm: 130 },
    { feet: 4, inches: 4, cm: 132 },
    { feet: 4, inches: 5, cm: 135 },
    { feet: 4, inches: 6, cm: 137 },
    { feet: 4, inches: 7, cm: 140 },
    { feet: 4, inches: 8, cm: 142 },
    { feet: 4, inches: 9, cm: 145 },
    { feet: 4, inches: 10, cm: 147 },
    { feet: 4, inches: 11, cm: 150 },
    { feet: 5, inches: 0, cm: 152 },
    { feet: 5, inches: 1, cm: 155 },
    { feet: 5, inches: 2, cm: 157 },
    { feet: 5, inches: 3, cm: 160 },
    { feet: 5, inches: 4, cm: 163 },
    { feet: 5, inches: 5, cm: 165 },
    { feet: 5, inches: 6, cm: 168 },
    { feet: 5, inches: 7, cm: 170 },
    { feet: 5, inches: 8, cm: 173 },
    { feet: 5, inches: 9, cm: 175 },
    { feet: 5, inches: 10, cm: 178 },
    { feet: 5, inches: 11, cm: 180 },
    { feet: 6, inches: 0, cm: 183 },
    { feet: 6, inches: 1, cm: 185 },
    { feet: 6, inches: 2, cm: 188 },
    { feet: 6, inches: 3, cm: 191 },
    { feet: 6, inches: 4, cm: 193 },
    { feet: 6, inches: 5, cm: 196 },
    { feet: 6, inches: 6, cm: 198 },
    { feet: 6, inches: 7, cm: 201 },
    { feet: 6, inches: 8, cm: 203 },
    { feet: 6, inches: 9, cm: 206 },
    { feet: 6, inches: 10, cm: 208 },
    { feet: 6, inches: 11, cm: 211 },
    { feet: 7, inches: 0, cm: 213 },
    { feet: 7, inches: 1, cm: 216 },
    { feet: 7, inches: 2, cm: 218 },
    { feet: 7, inches: 3, cm: 221 },
    { feet: 7, inches: 4, cm: 224 },
    { feet: 7, inches: 5, cm: 226 },
    { feet: 7, inches: 6, cm: 229 },
    { feet: 7, inches: 7, cm: 231 },
    { feet: 7, inches: 8, cm: 234 },
    { feet: 7, inches: 9, cm: 236 },
    { feet: 7, inches: 10, cm: 239 },
    { feet: 7, inches: 11, cm: 241 },
    { feet: 8, inches: 0, cm: 244 },
  ];


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
}
