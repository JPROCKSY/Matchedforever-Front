import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from '@angular/router';
import { AdminServiceService } from '../_services/admin-service.service';
import { PagerService } from "src/app/_services/pager-service";



@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css']
})
export class ManageProfileComponent implements OnInit {

  constructor(
    public adminService: AdminServiceService,
    public pagerService: PagerService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getLoggedInUser();
    this.getEducations();
    this.getEducationType();
    this.getReligions();
    this.getoccupations();
    this.getOccupationType();
    this.getAllCaste();
    this.getAllLanguages();
    this.getAllHobbies();
    this.getAllCitizenShips();
    this.getAllCountry();
    this.getpref();
  }

  public loggedInUser: any = {};

  getLoggedInUser() {
    let user: any = this.adminService.getLoggedInUser();
    this.loggedInUser = user.value;
    if (this.loggedInUser.id) {
      this.dataObj.id = this.loggedInUser.id;
      this.getprofile();
    }
  }

  public dataObj: any = {
    page: 1,
    limit: 10,
    search: "",
    total: "",
}

public preferenceFilterF = false;
  openPreference() {
    this.preferenceFilterF = !this.preferenceFilterF;
  }

public casteList: any = [];

getAllCaste() {
  this.adminService.getNestedCaste({}).subscribe((response: any) => {
    if (response.success == 1) {
      this.casteList = response.caste_list;
      this.casteList = this.casteList.sort((a, b) =>
        a.community.localeCompare(b.community)
      );
    } else {
      this.toastr.error(response.message);
    }
  });
}


public countryList: any = [];

getAllCountry() {
  this.adminService.country({}).subscribe((response: any) => {
    if (response.success == 1) {
      this.countryList = response.country;
      this.countryList = this.countryList.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else {
      this.toastr.error(response.message);
    }
  });
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

  educationTypeList: any = [];

  getEducationType() {
    this.adminService.getEducationType({}).subscribe((response: any) => {
      this.educationTypeList = response.data;
      this.educationTypeList = this.educationTypeList.sort((a, b) =>
        a.name.localeCompare(b.name)
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

  occupationTypeList: any = [];

  getOccupationType() {
    this.adminService.getOccupationType({}).subscribe((response: any) => {
      if (response.success == 1) {
        this.occupationTypeList = response.data;
        this.occupationTypeList = this.occupationTypeList.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      }
    });
  }

  subCasteList: any = [];

  public filterObj:any = {};

  getAllSubCaste(id) {
    let obj: any = {
      parent_id: id,
    };
    this.subCasteList = [];
    this.filterObj.subcaste = "";
    this.adminService.getCaste(obj).subscribe((response: any) => {
      if (response.success == 1) {
        this.subCasteList = response.caste_list;
        this.subCasteList = this.subCasteList.sort((a, b) =>
          a.community.localeCompare(b.community)
        );
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  public prefcityList: any = [];
  public prefstateList: any = [];

  

  prefStateList() {
    this.isLoading = true;
    this.adminService
      .multiplestate({ country: this.dataObj.country_of_settlement })
      .subscribe((response: any) => {
        if (response.success == 1) {
          this.prefstateList = response.state;
          this.prefstateList = this.prefstateList.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        } else {
          this.toastr.error(response.message);
        }
        this.isLoading = false;
      });
  }

  prefCityList() {
    this.isLoading = true;
    this.adminService
      .multiplecity({ state: this.dataObj.state_of_settlement })
      .subscribe((response: any) => {
        if (response.success == 1) {
          this.prefcityList = response.cities;
          this.prefcityList = this.prefcityList.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        } else {
          this.toastr.error(response.message);
        }
        this.isLoading = false;
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
        this.toastr.error(response.message);
      }
    });
  }


  submitFilters() {
    // if (this.profileObj.height && Array.isArray(this.profileObj.height)) {
    //   this.profileObj.height = this.profileObj.height.join(',');
    // }
  
    // if (this.profileObj.education && Array.isArray(this.profileObj.education)) {
    //   this.profileObj.education = this.profileObj.education.join(',');
    // }
  
    // if (this.profileObj.education_type_preference && Array.isArray(this.profileObj.education_type_preference)) {
    //   this.profileObj.education_type_preference = this.profileObj.education_type_preference.join(',');
    // }
  
    // if (this.profileObj.occuppation && Array.isArray(this.profileObj.occuppation)) {
    //   this.profileObj.occuppation = this.profileObj.occuppation.join(',');
    // }
  
    // if (this.profileObj.occupation_type_preference && Array.isArray(this.profileObj.occupation_type_preference)) {
    //   this.profileObj.occupation_type_preference = this.profileObj.occupation_type_preference.join(',');
    // }
  
    // if (this.profileObj.family_background && Array.isArray(this.profileObj.family_background)) {
    //   this.profileObj.family_background = this.profileObj.family_background.join(',');
    // }
  
    // if (this.profileObj.food_habits && Array.isArray(this.profileObj.food_habits)) {
    //   this.profileObj.food_habits = this.profileObj.food_habits.join(',');
    // }
  
    // if (this.profileObj.smoking_habits && Array.isArray(this.profileObj.smoking_habits)) {
    //   this.profileObj.smoking_habits = this.profileObj.smoking_habits.join(',');
    // }
  
    // if (this.profileObj.drinking_habits && Array.isArray(this.profileObj.drinking_habits)) {
    //   this.profileObj.drinking_habits = this.profileObj.drinking_habits.join(',');
    // }
  
    // if (this.profileObj.country_of_settlement && Array.isArray(this.profileObj.country_of_settlement)) {
    //   this.profileObj.country_of_settlement = this.profileObj.country_of_settlement.join(',');
    // }
  
    // if (this.profileObj.state_of_settlement && Array.isArray(this.profileObj.state_of_settlement)) {
    //   this.profileObj.state_of_settlement = this.profileObj.state_of_settlement.join(',');
    // }
  
    // if (this.profileObj.city_of_settlement && Array.isArray(this.profileObj.city_of_settlement)) {
    //   this.profileObj.city_of_settlement = this.profileObj.city_of_settlement.join(',');
    // }
  
    // if (this.profileObj.caste && Array.isArray(this.profileObj.caste)) {
    //   this.profileObj.caste = this.profileObj.caste.join(',');
    // }
  
    // if (this.profileObj.subcaste && Array.isArray(this.profileObj.subcaste)) {
    //   this.profileObj.subcaste = this.profileObj.subcaste.join(',');
    // }
  
    // if (this.profileObj.religion && Array.isArray(this.profileObj.religion)) {
    //   this.profileObj.religion = this.profileObj.religion.join(',');
    // }
  
    // if (this.profileObj.citizenship && Array.isArray(this.profileObj.citizenship)) {
    //   this.profileObj.citizenship = this.profileObj.citizenship.join(',');
    // }
  
    // if (this.profileObj.visa && Array.isArray(this.profileObj.visa)) {
    //   this.profileObj.visa = this.profileObj.visa.join(',');
    // }


    this.resetPagination();

    for (var key in this.profileObj) {
      if (this.profileObj[key] === undefined) {
        this.profileObj[key] = "";
      }
    }

    let formData = new FormData();

    for (var key in this.profileObj) {
      formData.append(key, this.profileObj[key]); 
    }

    this.adminService.savePref(formData).subscribe((response: any) => {
      if (response.success == 1) {
        this.getprofile();
      } else {     
        this.toastr.error(response.message);
      }
      this.isLoading = false; 
    });
    
  }

  resetPagination() {
    this.dataObj.page = 0;
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
        this.toastr.error(response.message);
      }
    });
  }

public dummyRecords = [1, 2, 3, 4 , 5, 6, 7, 8, 9, 10];
public isLoading: boolean = false;

public profileObj:any = {};

getpref() {
  this.isLoading = true;
  this.adminService.getPref({id : this.loggedInUser.id}).subscribe((response: any) => {
      if (response.success) {
          this.profileObj = response.details;
      } else {

      }
      this.isLoading = false;
  })
}

public profileList: any = [];

getprofile() {
    this.isLoading = true;
    this.adminService.getProfiles(this.dataObj).subscribe((response: any) => {
        if (response.success) {
            this.profileList = response.matched_profiles;
            this.dataObj.total = response.total_records;
            this.setUsersPage(this.dataObj.page, 0);
        } else {
            this.profileList = [];
        }
        this.isLoading = false;
    })
}






public usersPager: any = [];
setUsersPage(page: number, flag: number) {
    this.usersPager = this.pagerService.getPager(this.dataObj.total, page, this.dataObj.limit);
    this.dataObj.page = this.usersPager.currentPage;
    if (flag == 1) {
        this.getprofile();
    }
}

currentProfileIndex = 0;

nextProfile() {
  this.currentProfileIndex++;

  // If we've reached the last profile, fetch the next set
  if (this.currentProfileIndex >= this.profileList.length) {
    if (this.dataObj.page * this.dataObj.limit < this.dataObj.total) {
      this.dataObj.page++; // Increment page
      this.getprofile();  // Fetch next set of profiles
    }
    this.currentProfileIndex = 0; // Reset to first profile in the new batch
  }
}


selectOption(option: string) {
  const selectedProfile = this.profileList[this.currentProfileIndex];
  const userId = this.loggedInUser.id;
  const candidateId = selectedProfile.id;

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

  console.log(`Profile ${selectedProfile.first_name} ${option}`);

  // Move to the next profile
  this.nextProfile();
}

// Get the current profile being displayed
getCurrentProfile() {
  return this.profileList[this.currentProfileIndex];
}
  
}
