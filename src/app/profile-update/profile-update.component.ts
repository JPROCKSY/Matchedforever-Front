import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../_services/admin-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit {

  constructor(
    public adminService: AdminServiceService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getLoggedInUser();
    this.getAllPaymentPlan();
    this.getRelationshipStatus();
    this.country();
    this.getEducations();
    this.getReligions();
    this.getoccupations();
    this.getAllCaste();
    this.getAllLanguages();
    this.getAllHobbies();
    this.validateBirthDate();
    this.getAllCitizenShips();
    this.getAllEducationType();
    this.getAllOccupationType();
  }


  isLoading = false;
  createProfileForm: FormGroup;
  basicInformationForm: FormGroup;

  public activeTab: any = "User";

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

  public networthRange: any = [
    {
      range: "0-50 lakh",
      value: "0-5000000",
    },
    {
      range: "50 lakh-1 cr",
      value: "5000000-10000000",
    },
    {
      range: "1-2 cr",
      value: "10000000-20000000",
    },
    {
      range: "2-5 cr",
      value: "20000000-50000000",
    },
    {
      range: "5-10 cr",
      value: "50000000-100000000",
    },
    {
      range: "10-50 cr",
      value: "100000000-500000000",
    },
    {
      range: "50-100 cr",
      value: "500000000-1000000000",
    },
    {
      range: "100-200 cr",
      value: "1000000000-2000000000",
    },
    {
      range: "200-1000 cr",
      value: "2000000000-10000000000",
    },
    {
      range: "1000 above",
      value: "10000000000-above",
    },
  ];

  educationList: {
    university_name: string;
    type: string;
    is_higher_education: string;
    education: string;
    description: string;
  }[] = [
    {
      university_name: "",
      type: "",
      is_higher_education: "",
      education: "",
      description: "",
    },
  ];

  occupationList: {
    type_of_occupation: string;
    occupation_type: string;
    company_name: string;
    company_revenue: string;
    company_revenue_value: string;
    company_revenue_currency: string;
    designation: string;
    description: string;
    monthly_income: string;
    monthly_income_value: string;
    monthly_income_currency: string;
    yearly_income: string;
    yearly_income_value: string;
    yearly_income_currency: string;
  }[] = [
    {
      type_of_occupation: "",
      occupation_type: "",
      company_name: "",
      company_revenue: "",
      company_revenue_value: "",
      company_revenue_currency: "",
      designation: "",
      description: "",
      monthly_income: "",
      monthly_income_value: "",
      monthly_income_currency: "",
      yearly_income: "",
      yearly_income_value: "",
      yearly_income_currency: "",
    },
  ];

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

  selectedTab: number = 1;

  setTab(tabNumber: number) {
    this.selectedTab = tabNumber;
  }

  handledate() {
    this.profileObj.birth_date = this.formatDate(this.profileObj.birth_date);
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

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  _keyPressAamount(event: any) {
    const pattern = /[0-9.]/; // Only allow digits and decimal point
    let inputChar = String.fromCharCode(event.charCode);

    // Allow only one decimal point
    if (inputChar === "." && event.target.value.includes(".")) {
      event.preventDefault();
      return;
    }

    // Prevent anything other than digits and a single decimal point
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  urlError: boolean = false;

  _urlValidator(event: any, isInputEvent = false): void {
    const urlPattern =
      /^(http:\/\/|https:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    const input =
      event.target.value +
      (isInputEvent ? "" : String.fromCharCode(event.charCode));

    if (!urlPattern.test(input)) {
      this.urlError = true;
      if (!isInputEvent) {
        event.preventDefault();
      }
    } else {
      this.urlError = false;
    }
  }

  _heightkeyPress(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);

    // Prevent multiple decimals in the input
    if (inputChar === "." && event.target.value.includes(".")) {
      event.preventDefault();
      return;
    }

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  handleActiveTab(tab) {
    this.activeTab = tab;
  }

  profileDetail() {
    this.adminService
      .profileDetail({ id: this.loggedInUser.id })
      .subscribe((response: any) => {
        if (response.success == 1) {
          this.responseObj = response.profile;
          this.educationList = [];
          this.occupationList = [];

          this.profileObj.id = this.responseObj.id;
          this.profileObj.first_name = this.responseObj.first_name;
          this.profileObj.middle_name = this.responseObj.middle_name;
          this.profileObj.email = this.responseObj.email;
          this.profileObj.country_code = this.responseObj.country_id;
          this.profileObj.alternate_country_code =
            this.responseObj.alternate_country_id;
          this.profileObj.last_name = this.responseObj.last_name;
          this.profileObj.phone = this.responseObj.phone;
          this.profileObj.alternate_number = this.responseObj.alternate_number;
          this.profileObj.email = this.responseObj.email;
          this.profileObj.plan_id = this.responseObj.plan_id;
          this.profileObj.family_group_no = this.responseObj.family_group_no;
          this.profileObj.caste = this.responseObj.caste;

          if (this.profileObj.caste) {
            this.getAllSubCaste(this.profileObj.caste);
          }

          this.profileObj.subcaste = this.responseObj.subcaste;

          this.profileObj.religion = this.responseObj.religion;
          this.profileObj.looking_for = this.responseObj.looking_for;
          this.profileObj.reference = this.responseObj.reference;

          this.profileObj.reference_name = this.responseObj.reference_name;
          this.profileObj.reference_number = this.responseObj.reference_number;
          this.profileObj.reference_profession =
            this.responseObj.reference_profession;
          this.profileObj.reference_remark = this.responseObj.reference_remark;

          if (this.profileObj.reference != "Person") {
            this.profileObj.reference_name = "";
            this.profileObj.reference_number = "";
            this.profileObj.reference_profession = "";
            this.profileObj.reference_remark = "";
          }

          this.profileObj.suncaste = this.responseObj.suncaste;
          this.profileObj.profile_pic = this.responseObj.profile_pic;
          this.profileObj.gender = this.responseObj.gender;
          this.profileObj.is_active = this.responseObj.is_active;
          this.profileObj.is_married = this.responseObj.is_married;
          this.profileObj.document = this.responseObj.bioData;
          this.responseObj.hobbies.forEach((element) => {
            this.profileObj.hobbies.push(element.hobby_id);
          });
          this.responseObj.languages.forEach((element) => {
            this.profileObj.languages.push(element.language_id);
          });

          // Basic info portion

          this.profileObj.relationship_status =
            this.responseObj.basicInfo.relationship_status;
          this.profileObj.other_hobby = this.responseObj.basicInfo.other_hobby;
          this.profileObj.current_country =
            this.responseObj.basicInfo.current_country;
          this.profileObj.preffered_setlement_country =
            this.responseObj.basicInfo.preffered_setlement_country;
          this.profileObj.preffered_setlement_state =
            this.responseObj.basicInfo.preffered_setlement_state;
          this.profileObj.preffered_setlement_city =
            this.responseObj.basicInfo.preffered_setlement_city;
          this.profileObj.birth_date = this.responseObj.basicInfo.birth_date;
          this.profileObj.birth_place = this.responseObj.basicInfo.birth_place;
          this.profileObj.birth_time = this.responseObj.basicInfo.birth_time;
          this.profileObj.height = this.responseObj.basicInfo.height;
          this.profileObj.weight = this.responseObj.basicInfo.weight;
          this.profileObj.food_habits = this.responseObj.basicInfo.food_habits;
          this.profileObj.drinking_habits =
            this.responseObj.basicInfo.drinking_habits;
          this.profileObj.smoking_habits =
            this.responseObj.basicInfo.smoking_habits;
          this.profileObj.medical_history =
            this.responseObj.basicInfo.medical_history;
          this.profileObj.medical_history_description =
            this.responseObj.basicInfo.medical_history_description;
          this.profileObj.doctor = this.responseObj.basicInfo.doctor;
          this.profileObj.user_family_background =
            this.responseObj.basicInfo.user_family_background;
          this.profileObj.user_family_type =
            this.responseObj.basicInfo.user_family_type;
          this.profileObj.residential_address =
            this.responseObj.basicInfo.residential_address;
          this.profileObj.residential_address_apt =
            this.responseObj.basicInfo.residential_address_apt;
          this.profileObj.residential_type =
            this.responseObj.basicInfo.residential_type;
          this.profileObj.residential_house_type =
            this.responseObj.basicInfo.residential_house_type;
          this.profileObj.residential_country =
            this.responseObj.basicInfo.residential_country;
          this.states(this.profileObj.residential_country);
          this.profileObj.residential_state =
            this.responseObj.basicInfo.residential_state;
          this.cities(this.profileObj.residential_state);
          this.profileObj.residential_city =
            this.responseObj.basicInfo.residential_city;
          this.profileObj.residential_zipcode =
            this.responseObj.basicInfo.residential_zipcode;
          this.profileObj.residential_type =
            this.responseObj.basicInfo.residential_type;
          this.profileObj.company_address =
            this.responseObj.basicInfo.company_address;
          this.profileObj.weekend_address =
            this.responseObj.basicInfo.weekend_address;
          this.profileObj.future_residential_address =
            this.responseObj.basicInfo.future_residential_address;
          this.profileObj.future_residential_address_apt =
            this.responseObj.basicInfo.future_residential_address_apt;
          this.profileObj.future_residential_type =
            this.responseObj.basicInfo.future_residential_type;
          this.profileObj.future_residential_house_type =
            this.responseObj.basicInfo.future_residential_house_type;
          this.profileObj.future_residential_country =
            this.responseObj.basicInfo.future_residential_country;
          this.profileObj.future_residential_state =
            this.responseObj.basicInfo.future_residential_state;
          this.profileObj.future_residential_city =
            this.responseObj.basicInfo.future_residential_city;
          this.profileObj.future_residential_zipcode =
            this.responseObj.basicInfo.future_residential_zipcode;
          this.profileObj.future_residential_type =
            this.responseObj.basicInfo.future_residential_type;
          this.profileObj.parents_address =
            this.responseObj.basicInfo.parents_address;
          this.profileObj.about = this.responseObj.basicInfo.about;
          this.profileObj.facebook_link =
            this.responseObj.basicInfo.facebook_link;
          this.profileObj.instagram_link =
            this.responseObj.basicInfo.instagram_link;
          this.profileObj.linkedin_link =
            this.responseObj.basicInfo.linkedin_link;
          this.profileObj.net_family_income_value =
            this.responseObj.basicInfo.net_family_income_value;
          this.profileObj.net_family_income =
            this.responseObj.basicInfo.net_family_income;
          this.profileObj.net_family_income_currency =
            this.responseObj.basicInfo.net_family_income_currency;
          this.profileObj.user_citizenship =
            this.responseObj.basicInfo.user_citizenship;

          if (this.profileObj.user_citizenship) {
            this.getAllVisas(this.profileObj.user_citizenship);
          }
          this.profileObj.user_visa = this.responseObj.basicInfo.user_visa;
          this.profileObj.abroad_studies =
            this.responseObj.basicInfo.abroad_studies;

          this.profileObj.mother_tongue =
            this.responseObj.basicInfo.mother_tongue;
          this.profileObj.native_place =
            this.responseObj.basicInfo.native_place;
          this.profileObj.complexion = this.responseObj.basicInfo.complexion;
          this.profileObj.blood_group = this.responseObj.basicInfo.blood_group;
          this.profileObj.body_type = this.responseObj.basicInfo.body_type;
          this.profileObj.cuisines = this.responseObj.basicInfo.cuisines;
          this.profileObj.manglik = this.responseObj.basicInfo.manglik;
          this.profileObj.zodiac_sign = this.responseObj.basicInfo.zodiac_sign;
          this.profileObj.family_value =
            this.responseObj.basicInfo.family_value;
          this.profileObj.fathersalivestatus =
            this.responseObj.basicInfo.fathersalivestatus;
          this.profileObj.mothersalivestatus =
            this.responseObj.basicInfo.mothersalivestatus;
          this.profileObj.relatives_information =
            this.responseObj.basicInfo.relatives_information;
          this.profileObj.additionalInformation =
            this.responseObj.basicInfo.additionalInformation;
          this.profileObj.additionalFamilyInformation =
            this.responseObj.basicInfo.additionalFamilyInformation;
          this.profileObj.additionalEducationInformation =
            this.responseObj.basicInfo.additionalEducationInformation;
          this.profileObj.additionalOccupationInformation =
            this.responseObj.basicInfo.additionalOccupationInformation;

          // Arrays

          this.profileObj.education = this.responseObj.education;

          this.profileObj.education.forEach((data) => {
            this.educationList.push(data);
          });

          this.profileObj.occupation = this.responseObj.occupation;
          this.profileObj.occupation.forEach((data) => {
            this.occupationList.push(data);
          });

          this.profileObj.images = this.responseObj.images;
          this.profileObj.kyc = this.responseObj.kyc;

          // Preferance portion

          this.profileObj.age_gap = this.responseObj.userPreferances.age_gap;
          this.profileObj.education_type_preference =
            this.responseObj.userPreferances.education_type_preference;
          this.profileObj.occupation_type_preference =
            this.responseObj.userPreferances.occupation_type_preference;
          this.profileObj.min_age_gap =
            this.responseObj.userPreferances.min_age_gap;
          this.profileObj.max_age_gap =
            this.responseObj.userPreferances.max_age_gap;
          this.profileObj.height_preferance =
            this.responseObj.userPreferances.height;
          this.profileObj.believes_in_horoscopes =
            this.responseObj.userPreferances.believes_in_horoscopes;
          this.profileObj.education_preferance =
            this.responseObj.userPreferances.education;
          this.profileObj.occuppation_preferance =
            this.responseObj.userPreferances.occuppation;

          this.profileObj.food_habits_preferance =
            this.responseObj.userPreferances.food_habits;
          this.profileObj.drinking_habits_preferance =
            this.responseObj.userPreferances.drinking_habits;
          this.profileObj.smoking_habits_preferance =
            this.responseObj.userPreferances.smoking_habits;
          this.profileObj.discription =
            this.responseObj.userPreferances.discription;
          this.profileObj.country_of_settlement =
            this.responseObj.userPreferances.country_of_settlement;
          this.profileObj.state_of_settlement =
            this.responseObj.userPreferances.state_of_settlement;
          this.profileObj.city_of_settlement =
            this.responseObj.userPreferances.city_of_settlement;
          this.profileObj.fathers_preference =
            this.responseObj.userPreferances.fathers_preference;
          this.profileObj.mothers_preference =
            this.responseObj.userPreferances.mothers_preference;
          this.profileObj.relationship_status_preferance =
            this.responseObj.userPreferances.relationship_status_preferance;
          this.profileObj.doctor_preference =
            this.responseObj.userPreferances.doctor_preference;

          if (this.profileObj.country_of_settlement) {
            this.prefStateList(this.profileObj.country_of_settlement);
          }
          if (this.profileObj.preffered_setlement_country) {
            this.getMultiplestate(this.profileObj.preffered_setlement_country);
          }
          if (this.profileObj.state_of_settlement) {
            this.prefCityList(this.profileObj.state_of_settlement);
          }
          if (this.profileObj.preffered_setlement_state) {
            this.getMultiplecity(this.profileObj.preffered_setlement_state);
          }

          this.profileObj.religion_preference =
            this.responseObj.userPreferances.religion;
          this.profileObj.caste_preference =
            this.responseObj.userPreferances.caste;
          this.profileObj.subcaste_preference =
            this.responseObj.userPreferances.subcaste;
          this.profileObj.citizenship =
            this.responseObj.userPreferances.citizenship;
          this.profileObj.visa = this.responseObj.userPreferances.visa;
          this.profileObj.abroad_studies_preference =
            this.responseObj.userPreferances.abroad_studies;
          this.profileObj.fixed_preferences = this.responseObj.userPreferances
            .fixed_preferences
            ? this.responseObj.userPreferances.fixed_preferences.split(",")
            : [];

          this.profileObj.mother_tongue_preference =
            this.responseObj.userPreferances.mother_tongue_preference;
          this.profileObj.complexion_preference =
            this.responseObj.userPreferances.complexion_preference;
          this.profileObj.minimum_weight =
            this.responseObj.userPreferances.minimum_weight;
          this.profileObj.maximum_weight =
            this.responseObj.userPreferances.maximum_weight;
          this.profileObj.body_type_preference =
            this.responseObj.userPreferances.body_type_preference;

          this.profileObj.family_background =
            this.responseObj.userPreferances.family_background;
          this.profileObj.family_type =
            this.responseObj.userPreferances.family_type;
          this.profileObj.min_net_worth =
            this.responseObj.userPreferances.min_net_worth;
          this.profileObj.document = this.responseObj.bioData;
          this.profileObj.kundali = this.responseObj.kundali;

          // Family Information

          if (Object.keys(this.responseObj.family_information).length > 0) {
            this.profileObj.family_information =
              this.responseObj.family_information;
          }

          if (
            !this.responseObj.family_information.siblings ||
            this.responseObj.family_information.siblings.length == 0
          ) {
            this.responseObj.family_information.siblings = [];
          }
        } else {
          this.toastr.error(response.message);
        }
      });
  }

  toggleFixedPreference(key: string, event: any): void {
    setTimeout(() => {
      if (event.target.checked) {
        if (!this.profileObj.fixed_preferences.includes(key)) {
          this.profileObj.fixed_preferences.push(key);
        }
      } else {
        const index = this.profileObj.fixed_preferences.indexOf(key);
        if (index !== -1) {
          this.profileObj.fixed_preferences.splice(index, 1);
        }
      }
    }, 50);
  }

  isChecked(preference: string): boolean {
    return this.profileObj.fixed_preferences.includes(preference);
  }

  handleReference(data) {
    if (data == "Person") {
      this.profileObj.reference_name = "";
      this.profileObj.reference_number = "";
      this.profileObj.reference_profession = "";
      this.profileObj.reference_remark = "";
    }
  }

  save(form, routingFlag, nextTab) {
    if (form.valid) {
      this.isLoading = true;
      this.profileObj.education = this.educationList;
      this.profileObj.occupation = this.occupationList;

      for (var key in this.profileObj) {
        if (this.profileObj[key] === undefined) {
          this.profileObj[key] = "";
        }
      }

      let formData = new FormData();

      for (var key in this.profileObj) {
        formData.append(key, this.profileObj[key]);
        if (key == "images") {
          for (var index in this.profileObj.imagesPreview) {
            formData.append(
              "images[" + index + "]",
              this.profileObj.imagesPreview[index]
            );
          }
        }

        if (key == "kyc") {
          for (var index in this.profileObj.kycPreview) {
            formData.append(
              "kyc[" + index + "]",
              this.profileObj.kycPreview[index]
            );
          }
        }

        if (key == "education") {
          formData.append("education", JSON.stringify(this.educationList));
        }

        if (key == "occupation") {
          formData.append("occupation", JSON.stringify(this.occupationList));
        }

        if (key == "family_information") {
          if (
            (this.profileObj.family_information.fathers_info &&
              this.profileObj.family_information.fathers_info.first_name) ||
            (this.profileObj.family_information.mothers_info &&
              this.profileObj.family_information.mothers_info.first_name)
          ) {
            formData.append(
              "family_information",
              JSON.stringify(this.profileObj.family_information)
            );
          } else {
            formData.delete("family_information");
          }
        }
      }

      if (this.profileObj.id || this.profileObj.id) {
        this.profileObj.id = this.profileObj.id;
        this.adminService.updateProfile(formData).subscribe((response: any) => {
          if (response.success) {
            this.activeTab = nextTab;
            if (routingFlag == "true") {
              this.toastr.success(response.message);
              this.router.navigate(["/"]);
            }
          }
          this.isLoading = false;
        });
      }
    }
  }

  public formError: boolean = false;

  saveAndNext(form, routingFlag, nextTab) {
    if (form.valid && routingFlag == "false") {
      this.save(form, false, nextTab);
      this.formError = false;
    } else {
      this.formError = true;
    }
  }

  // Api for dropdowns

  public educationTypeList: any = [];

  getAllEducationType() {
    this.adminService.getEducationType({}).subscribe((response: any) => {
      if (response.success == 1) {
        this.educationTypeList = response.data;
      } else {
        this.educationTypeList = [];
      }
    });
  }

  public occupationTypeList: any = [];

  getAllOccupationType() {
    this.adminService.getOccupationType({}).subscribe((response: any) => {
      if (response.success == 1) {
        this.occupationTypeList = response.data;
      } else {
        this.occupationTypeList = [];
      }
    });
  }

  public paymentPlanList: any = [];

  getAllPaymentPlan() {
    this.adminService.getSubscription({}).subscribe((response: any) => {
      if (response.success == 1) {
        this.paymentPlanList = response.subscription_list;
      } else {
        this.toastr.error(response.error);
      }
    });
  }

  relationShipStatusList: any = [];

  getRelationshipStatus() {
    this.adminService.getRelationship({}).subscribe((response: any) => {
      if (response.success) {
        this.relationShipStatusList = response.marital_status;
        this.relationShipStatusList = this.relationShipStatusList.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
      }
    });
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

  stateList: any = [];

  states(id) {
    this.adminService.states({ country_id: id }).subscribe((response: any) => {
      if (response.success) {
        this.stateList = response.states;
        this.stateList = this.stateList.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      } else {
        // this.toastr.error(response.message);
      }
    });
  }

  cityList: any = [];

  cities(id) {
    this.adminService.city({ state_id: id }).subscribe((response: any) => {
      if (response.success) {
        this.cityList = response.cities;
        this.cityList = this.cityList.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      } else {
        this.cityList = [];
        // this.toastr.error(response.message);
      }
    });
  }

  public prefcityListArray: any = [];
  public prefstateListArray: any = [];
  public basecityListArray: any = [];
  public basestateListArray: any = [];

  getMultiplestate(country) {
    // this.isLoading = true;
    if (country) {
      this.adminService
        .multiplestate({ country: country })
        .subscribe((response: any) => {
          if (response.success == 1) {
            this.basestateListArray = response.state;
            this.basestateListArray = this.basestateListArray.sort((a, b) =>
              a.name.localeCompare(b.name)
            );
          } else {
            this.basestateListArray = [];
            // this.toastr.error(response.message);
          }
          // this.isLoading = false;
        });
    }
  }

  getMultiplecity(state) {
    // this.isLoading = true;
    if (state) {
      this.adminService
        .multiplecity({ state: state })
        .subscribe((response: any) => {
          if (response.success == 1) {
            this.basecityListArray = response.cities;
            this.basecityListArray = this.basecityListArray.sort((a, b) =>
              a.name.localeCompare(b.name)
            );
          } else {
            this.basecityListArray = [];

            // this.toastr.error(response.message);
          }
          // this.isLoading = false;
        });
    }
  }

  prefStateList(country) {
    // this.isLoading = true;
    if (country) {
      this.adminService
        .multiplestate({ country: country })
        .subscribe((response: any) => {
          if (response.success == 1) {
            this.prefstateListArray = response.state;
            this.prefstateListArray = this.prefstateListArray.sort((a, b) =>
              a.name.localeCompare(b.name)
            );
          } else {
            this.prefstateListArray = [];
            // this.toastr.error(response.message);
          }
          // this.isLoading = false;
        });
    }
  }

  prefCityList(state) {
    // this.isLoading = true;
    if (state && state.length > 0) {
      this.adminService
        .multiplecity({ state: state })
        .subscribe((response: any) => {
          if (response.success == 1) {
            this.prefcityListArray = response.cities;
            this.prefcityListArray = this.prefcityListArray.sort((a, b) =>
              a.name.localeCompare(b.name)
            );
          } else {
            this.prefcityListArray = [];
            // this.toastr.error(response.message);
          }
          // this.isLoading = false;
        });
    }
  }

  educationListArray: any = [];
  getEducations() {
    this.adminService.getEducation({}).subscribe((response: any) => {
      this.educationListArray = response.education_list;
      this.educationListArray = this.educationListArray.sort((a, b) =>
        a.education.localeCompare(b.education)
      );
    });
  }

  religionList: any = [];
  getReligions() {
    this.adminService.getReligion({}).subscribe((response: any) => {
      if (response.success) {
        this.religionList = response.religion_list;
        this.religionList = this.religionList.sort((a, b) =>
          a.religion.localeCompare(b.religion)
        );
      }
    });
  }

  occupationListArray: any = [];
  getoccupations() {
    this.adminService.getOccupations({}).subscribe((response: any) => {
      if (response.success == 1) {
        this.occupationListArray = response.occupation_list;
        this.occupationListArray = this.occupationListArray.sort((a, b) =>
          a.occupation.localeCompare(b.occupation)
        );
      }
    });
  }

  casteList: any = [];
  getAllCaste() {
    this.adminService.getCaste({}).subscribe((response: any) => {
      if (response.success == 1) {
        this.casteList = response.caste_list;
        this.casteList = this.casteList.sort((a, b) =>
          a.community.localeCompare(b.community)
        );
      } else {
        this.casteList = [];
        // this.toastr.error(response.message);
      }
    });
  }

  subCasteList: any = [];
  getAllSubCaste(id) {
    let obj: any = {
      parent_id: id,
    };
    this.subCasteList = [];
    this.profileObj.subcaste = "";
    this.adminService.getCaste(obj).subscribe((response: any) => {
      if (response.success == 1) {
        this.subCasteList = response.caste_list;
        this.subCasteList = this.subCasteList.sort((a, b) =>
          a.community.localeCompare(b.community)
        );
      } else {
        this.subCasteList = [];

        // this.toastr.error(response.message);
      }
    });
  }

  languagesList: any = [];
  getAllLanguages() {
    this.adminService.getLanguage({}).subscribe((response: any) => {
      if (response.success == 1) {
        this.languagesList = response.language;
        this.languagesList = this.languagesList.sort((a, b) =>
          a.language.localeCompare(b.language)
        );
      } else {
        this.languagesList = [];
        // this.toastr.error(response.message);
      }
    });
  }

  hobbiesList: any = [];
  getAllHobbies() {
    this.adminService.getHobbies({}).subscribe((response: any) => {
      if (response.success == 1) {
        this.hobbiesList = response.hobbies;
        this.hobbiesList = this.hobbiesList.sort((a, b) =>
          a.hobby.localeCompare(b.hobby)
        );
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  citizenshipList: any = [];
  getAllCitizenShips() {
    this.adminService.getCitizenship({}).subscribe((response: any) => {
      if (response.success == 1) {
        this.citizenshipList = response.citizenship_list;
        this.citizenshipList = this.citizenshipList.sort((a, b) =>
          a.citizenship.localeCompare(b.citizenship)
        );
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  visaList: any = [];
  getAllVisas(id) {
    let obj = {
      id: id,
    };

    this.adminService.citizenshipDetails(obj).subscribe((response: any) => {
      if (response.success == 1) {
        this.visaList = response.citizenship_details.visa;
        this.visaList = this.visaList.sort((a, b) =>
          a.visa.localeCompare(b.visa)
        );
      } else {
        this.visaList = [];
        // this.toastr.error(response.message)
      }
    });
  }

  // Change functions

  public addressFlag: boolean = false;
  sameAddress(event) {
    this.addressFlag = true;
    if (event.target.checked) {
      this.profileObj.future_residential_address =
        this.profileObj.residential_address;
      this.profileObj.future_residential_address_apt =
        this.profileObj.residential_address_apt;
      this.profileObj.future_residential_country =
        this.profileObj.residential_country;
      this.profileObj.future_residential_state =
        this.profileObj.residential_state;
      this.profileObj.future_residential_city =
        this.profileObj.residential_city;
      this.profileObj.future_residential_zipcode =
        this.profileObj.residential_zipcode;
      this.profileObj.future_residential_type =
        this.profileObj.residential_type;
      this.profileObj.future_residential_house_type =
        this.profileObj.residential_house_type;
    }
  }

  // Functions for Education tab

  addEducation() {
    const education = {
      university_name: "",
      type: "",
      is_higher_education: "",
      education: "",
      description: "",
    };
    this.educationList.push(education);
    this.profileObj.education = this.educationList;
  }

  deleteEducation(index: number) {
    this.educationList.splice(index, 1);
  }

  addOccupation() {
    const occupation = {
      type_of_occupation: "",
      occupation_type: "",
      company_name: "",
      company_revenue: "",
      company_revenue_value: "",
      company_revenue_currency: "",
      designation: "",
      description: "",
      monthly_income: "",
      monthly_income_value: "",
      monthly_income_currency: "",
      yearly_income: "",
      yearly_income_value: "",
      yearly_income_currency: "",
    };
    this.occupationList.push(occupation);
    this.profileObj.occupation = this.occupationList;
  }

  deleteOccupation(index: number) {
    this.occupationList.splice(index, 1);
  }

  // functions for uploading images

  profileImages(event) {
    // this.profileObj.imagesPreview = [];
    var files = event.srcElement.files;
    for (var key in files) {
      if (typeof files[key].type != "undefined") {
        this.profileObj.imagesPreview.push(files[key]);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileObj.images.push({ image: e.target.result });
        };

        reader.readAsDataURL(files[key]);
      }
    }
  }

  kycImages(event) {
    this.profileObj.kycPreview = [];
    var files = event.srcElement.files;
    for (var key in files) {
      if (typeof files[key].type != "undefined") {
        this.profileObj.kycPreview.push(files[key]);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileObj.kyc.push({ image: e.target.result });
        };

        reader.readAsDataURL(files[key]);
      }
    }
  }

  profilePicture(event) {
    this.profileObj.profile_pic = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileObj.profile_pic_view = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeImages(i, id) {
    this.profileObj.images.splice(i, 1);
    if (!this.profileObj.remove_ids) {
      this.profileObj.remove_ids = [];
    }
    this.profileObj.remove_ids.push(id);
  }

  removeKYCImages(i, id) {
    this.profileObj.kyc.splice(i, 1);
    if (!this.profileObj.remove_kyc_ids) {
      this.profileObj.remove_kyc_ids = [];
    }
    this.profileObj.remove_kyc_ids.push(id);
  }

  document(event) {
    this.profileObj.document = event.target.files[0];
  }

  kundali(event) {
    this.profileObj.kundali = event.target.files[0];
  }

  // Functions for adding family information

  addMoreRelative() {
    let newRelative = {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      gender: "",
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
    };

    this.profileObj.family_information.siblings.push(newRelative);
  }

  removeRelative(index, id) {
    this.profileObj.family_information.siblings.splice(index, 1);
    this.profileObj.remove_siblings.push(id);
  }

  /* Test function to check the validation */

  checkValidation(form) {
    if (form.valid) {
      this.activeTab = "Basic Information";
    } else {
      this.activeTab = "User";
    }
  }

  checkInformationValidation(form) {
    if (form.valid) {
      this.activeTab = "Family Information";
    } else {
      this.activeTab = "Basic Information";
    }
  }

  checkFamilyValidation(form) {
    if (form.valid) {
      this.activeTab = "Address";
    } else {
      this.activeTab = "Family Information";
    }
  }

  // Country code function

  toSmallerCase(country: any) {
    return country.toLowerCase();
  }

}
