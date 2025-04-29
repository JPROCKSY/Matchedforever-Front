import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../_services/admin-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  constructor(
    public adminService: AdminServiceService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.getLoggedInUser();
  }


  isLoading = false;

  public loggedInUser: any = {};

  getLoggedInUser() {
    let user: any = this.adminService.getLoggedInUser();
    this.loggedInUser = user.value;
    if (this.loggedInUser.id) {
      // this.getContactPerson();
      this.profileObj.id = this.loggedInUser.id;
      this.profileDetail();
    }

    
  }

  backbutton(){
    this.location.back();
  }





  public responseObj: any = {};

  public profileObj: any = {
    id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    country_code: "",
    phone: "",
    alternate_number: "",
    caste: "",
    subcaste: "",
    religion: "",
    gender: "",
    looking_for: "",
    email: "",
    relationship_status: "",
    is_active: "1",
    reference: "",
    reference_name: "",
    reference_number: "",
    reference_profession: "",
    reference_remark: "",
    user_type: "1",
    plan_id: "",

    // Section for basic information

    birth_place: "",
    height: "",
    birth_date: "",
    birth_time: "",
    current_country: "",
    weight: "",
    smoking_habits: "",
    drinking_habits: "",
    doctor: "",
    medical_history: "",
    medical_history_description: "",
    food_habits: "",
    instagram_link: "",
    facebook_link: "",
    linkedin_link: "",
    languages: [],
    hobbies: [],
    other_hobby: "",

    preffered_setlement_country: "",
    preffered_setlement_state: "",
    preffered_setlement_city: "",
    birth_year: "",

    user_family_background: "",
    user_family_type: "",
    user_citizenship: "",
    user_visa: "",

    mother_tongue: "",
    native_place: "",
    complexion: "",
    blood_group: "",
    body_type: "",
    cuisines: "",
    manglik: "",
    zodiac_sign: "",
    family_value: "",
    relatives_information: [],
    fathersalivestatus: "",
    mothersalivestatus: "",
    additionalInformation: "",
    additionalFamilyInformation: "",

    // Address section fields

    residential_address: "",
    residential_address_apt: "",
    residential_country: "",
    residential_state: "",
    residential_city: "",
    residential_zipcode: "",
    residential_type: "",
    residential_house_type: "",
    company_address: "",
    weekend_address: "",
    future_residential_address: "",
    future_residential_address_apt: "",
    future_residential_country: "",
    future_residential_state: "",
    future_residential_city: "",
    future_residential_zipcode: "",
    future_residential_type: "",
    future_residential_house_type: "",
    parents_address: "",
    about: "",
    abroad_studies: "",
    education: [],
    occupation: [],

    // Fields of Preferences

    age_gap: "",
    min_age_gap: "2006",
    max_age_gap: "",
    height_preferance: "",
    education_preferance: "",
    believes_in_horoscopes: "",
    occuppation_preferance: "",
    family_background: "",
    min_net_worth: "",
    food_habits_preferance: "",
    drinking_habits_preferance: "",
    smoking_habits_preferance: "",
    discription: "",
    country_of_settlement: [],
    state_of_settlement: [],
    city_of_settlement: [],
    family_type: "",
    caste_preference: [],
    subcaste_preference: [],
    religion_preference: [],
    abroad_studies_preference: "",
    citizenship: [],
    visa: [],
    fathers_preference: "",
    mothers_preference: "",

    mother_tongue_preference: "",
    complexion_preference: "",
    minimum_weight: "",
    maximum_weight: "",
    body_type_preference: "",

    education_type_preference: "",
    occupation_type_preference: "",

    images: [],
    kyc: [],
    fixed_preferences: [],
    imagesPreview: [],
    kycPreview: [],
    document: "",
    kundali: "",
    remove_ids: [],
    remove_kyc_ids: [],
    profile_pic: "",

    net_family_income: "",
    net_family_income_currency: "",
    net_family_income_value: "",
    family_information: {
      fathers_info: {
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        gender: "",
        additional_info: "",
        education: [
          {
            id: "",
            user_id: "",
            university_name: "",
            type: "",
            is_higher_education: "",
            education: "",
            other_education: "",
            description: "",
            created_at: "",
            updated_at: "",
          },
        ],
        occupation: [
          {
            id: "",
            user_id: "",
            type_of_occupation: "",
            company_name: "",
            company_revenue: "",
            designation: "",
            description: "",
            monthly_income: "",
            yearly_income: "",
            created_at: "",
            updated_at: "",
          },
        ],
      },
      mothers_info: {
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        gender: "",
        additional_info: "",
        education: [
          {
            id: "",
            user_id: "",
            university_name: "",
            type: "",
            is_higher_education: "",
            education: "",
            other_education: "",
            description: "",
            created_at: "",
            updated_at: "",
          },
        ],
        occupation: [
          {
            id: "",
            user_id: "",
            type_of_occupation: "",
            company_name: "",
            company_revenue: "",
            designation: "",
            description: "",
            monthly_income: "",
            yearly_income: "",
            created_at: "",
            updated_at: "",
          },
        ],
      },
      siblings: [
        {
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          gender: "",
          additional_info: "",
          relationship_type: "",
          education: [
            {
              university_name: "",
              type: "",
              is_higher_education: "",
              education: "",
              description: "",
            },
          ],
          occupation: [
            {
              type_of_occupation: "",
              company_name: "",
              company_revenue: "",
              designation: "",
              description: "",
              monthly_income: "",
              yearly_income: "",
            },
          ],
        },
      ],
    },

    remove_siblings: [],
  };


  profileDetail() {
    this.adminService
      .profileDetail({ id: this.loggedInUser.id })
      .subscribe((response: any) => {
        if (response.success == 1) {
          this.responseObj = response.profile;
        } else {
          this.toastr.error(response.message);
        }
      });
  }


  handleVisibility(isActive){

    let obj:any = {
      id: this.loggedInUser.id,
      activity : ""
    }

    let message = "";

    if(isActive == '0') {
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
}
