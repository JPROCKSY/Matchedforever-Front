import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { AdminServiceService } from "../_services/admin-service.service";
import { PagerService } from "src/app/_services/pager-service";



@Component({
    selector: "app-manage-profile",
    templateUrl: "./manage-profile.component.html",
    styleUrls: ["./manage-profile.component.css"],
})
export class ManageProfileComponent implements OnInit {
    constructor(
        public adminService: AdminServiceService,
        public pagerService: PagerService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) { }


    // 
    @ViewChild('dropdown', { static: false }) dropdown!: ElementRef;


    @HostListener('document:click', ['$event'])
    handleOutsideClick(event: MouseEvent) {
        if (
            this.dropdownOpen &&
            this.dropdown &&
            !this.dropdown.nativeElement.contains(event.target)
        ) {
            this.dropdownOpen = !this.dropdownOpen;
        }
    }
    // 



    public Activetab: any = "";

    dropdownOpen = false;


    toggleDropdown(event: Event): void {
        event.stopPropagation();
        this.dropdownOpen = !this.dropdownOpen;
    }

    // setActivetab(tab) {
    //     this.Activetab = tab;
    //     this.dataObj.page = 0;
    //     this.dataObj.type = tab;
    //     this.dropdownOpen = false;
    //     this.getprofile();
    // }
    setActivetab(tab) {
        this.dataObj.search = '';
        this.allObj.search = '';
        this.Activetab = tab;
        this.allObj.page = 1;
        this.dataObj.page = 0;
        this.dataObj.type = tab;
        this.dropdownOpen = false;

        localStorage.setItem('tabname', tab);


        this.getprofile();


        // remove query params

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { tab: null },
            queryParamsHandling: 'merge'
        });
    }


    getActiveTabLabel(): string {
        switch (this.Activetab) {
            case 'all': return `All(${this.all_total})`;
            case '': return `Suggested Profiles (${this.suggested_total})`;
            case 'sent_by_rm': return `Sent by RM (${this.counters.sent_by_rm})`;
            case 'view_profile': return `Viewed Profiles (${this.counters.view_profile})`;
            case 'accepted': return `Connected (${this.counters.accepted})`;
            case 'request_received': return `Req. Received (${this.counters.request_received_count})`;
            case 'rejected': return `Req. Rejected (${this.counters.rejected})`;
            case 'sent_request': return `Interested (${this.counters.request_sent})`;
            case 'not_interested': return `Not Interested (${this.counters.not_interested})`;
            default: return 'Select';
        }
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const tab = params['tab'];
            if (tab) {
                this.Activetab = tab;
                console.log('Active tab set from query param:', tab);
                this.dataObj.type = 'request_received';
                this.getprofile();
            }
        });

        this.getLoggedInUser();
        this.getProfilesByRm();
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
        this.getRelationshipStatus();
        this.getCounters();
        // this.getAllSubCaste();

        const userData = localStorage.getItem('MATCHEDFOREVERF');
        if (userData) {
            const parsedData = JSON.parse(userData);
            this.plan_id = parsedData.plan_id;
        }
        if (this.plan_id != '19') {
            this.valid_userF = true;
        }

    }
    previewBack: any;
    notificationTab: any;
    valid_userF: boolean = false;
    plan_id: any;
    public loggedInUser: any = {};

    getLoggedInUser() {
        let user: any = this.adminService.getLoggedInUser();
        this.loggedInUser = user.value;
        const previewback_tab = localStorage.getItem('tabname');

        if (this.loggedInUser.id) {
            this.dataObj.user_id = this.loggedInUser.id;
            this.dataObj.id = this.loggedInUser.id;
            this.allObj.user_id = this.loggedInUser.id;
            if (previewback_tab) {
                this.Activetab = previewback_tab;
                this.dataObj.type = this.Activetab;
                this.getprofile();
            }
            else {
                this.dataObj.type = "";
            }
            this.getprofile();

        }
    }

    public dataObj: any = {
        page: 0,
        limit: 1000,
        search: "",
        total: "",
    };

    public preferenceFilterF: boolean = false;
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
                this.occupationListArray = this.occupationListArray.sort(
                    (a, b) => a.occupation.localeCompare(b.occupation)
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

    public filterObj: any = {};

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

    prefStateList(countryID) {
        this.isLoading = true;
        this.adminService
            .multiplestate({ country: countryID })
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

    prefCityList(stateId) {
        this.isLoading = true;
        this.adminService
            .multiplecity({ state: stateId })
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


    public rmObj: any = {
        search: "",
        sorting: "",
        type: "",
        user_id: "",
    }

    public allProfiles: any = [];

    public rmList: any = []

    getProfilesByRm() {
        this.rmObj.user_id = this.loggedInUser.id;
        this.isLoading = true;
        this.adminService.getmatchedProfiles(this.rmObj).subscribe((response: any) => {
            if (response.success) {
                this.rmList = response.sent_profiles;
            } else {
                this.rmList = []
            }
            this.isLoading = false;
        })
    }


    dummyrecord = [1, 2, 3, 4, 5, 6, 7, 8];


    submitFilters() {
        
        this.resetPagination();

        var preferenceObj: any = {};

        console.log(this.profileObj.id);

        // preferenceObj.id = this.profileObj.id ? this.profileObj.id : this.loggedInUser.id;
        preferenceObj.id = this.loggedInUser.id;
        preferenceObj.age_gap = this.profileObj.age_gap ? this.profileObj.age_gap : "";
        preferenceObj.min_age_gap = this.profileObj.min_age_gap ? this.profileObj.min_age_gap : "";
        preferenceObj.max_age_gap = this.profileObj.max_age_gap ? this.profileObj.max_age_gap : "";
        preferenceObj.height_preferance = this.profileObj.height ? this.profileObj.height : "";
        preferenceObj.believes_in_horoscopes = this.profileObj.believes_in_horoscopes ? this.profileObj.believes_in_horoscopes : "";
        preferenceObj.education_preferance = this.profileObj.education ? this.profileObj.education : "";
        preferenceObj.education_type_preference = this.profileObj.education_type_preference ? this.profileObj.education_type_preference : "";
        preferenceObj.occupation_type_preference = this.profileObj.occupation_type_preference ? this.profileObj.occupation_type_preference : "";
        preferenceObj.relationship_status_preferance = this.profileObj.relationship_status_preferance ? this.profileObj.relationship_status_preferance : "";
        preferenceObj.doctor_preference = this.profileObj.doctor_preference ? this.profileObj.doctor_preference : "";
        preferenceObj.occuppation_preferance = this.profileObj.occuppation ? this.profileObj.occuppation : "";
        preferenceObj.country_of_settlement = this.profileObj.country_of_settlement ? this.profileObj.country_of_settlement : "";
        preferenceObj.state_of_settlement = this.profileObj.state_of_settlement ? this.profileObj.state_of_settlement : "";
        preferenceObj.city_of_settlement = this.profileObj.city_of_settlement ? this.profileObj.city_of_settlement : "";
        preferenceObj.food_habits_preferance = this.profileObj.food_habits ? this.profileObj.food_habits : "";
        preferenceObj.drinking_habits_preferance = this.profileObj.drinking_habits ? this.profileObj.drinking_habits : "";
        preferenceObj.smoking_habits_preferance = this.profileObj.smoking_habits ? this.profileObj.smoking_habits : "";
        preferenceObj.discription = this.profileObj.discription ? this.profileObj.discription : "";
        preferenceObj.family_background = this.profileObj.family_background ? this.profileObj.family_background : "";
        preferenceObj.family_type = this.profileObj.family_type ? this.profileObj.family_type : "";
        preferenceObj.min_net_worth = this.profileObj.min_net_worth ? this.profileObj.min_net_worth : "";
        preferenceObj.caste_preference = this.profileObj.caste ? this.profileObj.caste : "";
        preferenceObj.subcaste_preference = this.profileObj.subcaste ? this.profileObj.subcaste : "";
        preferenceObj.religion_preference = this.profileObj.religion ? this.profileObj.religion : "";
        preferenceObj.citizenship = this.profileObj.citizenship ? this.profileObj.citizenship : "";
        preferenceObj.visa = this.profileObj.visa ? this.profileObj.visa : "";
        preferenceObj.abroad_studies_preference = this.profileObj.abroad_studies ? this.profileObj.abroad_studies : "";
        preferenceObj.fathers_preference = this.profileObj.fathers_preference ? this.profileObj.fathers_preference : "";
        preferenceObj.mothers_preference = this.profileObj.mothers_preference ? this.profileObj.mothers_preference : "";
        preferenceObj.fixed_preferences = this.profileObj.fixed_preferences ? this.profileObj.fixed_preferences : "";
        preferenceObj.mother_tongue_preference = this.profileObj.mother_tongue_preference ? this.profileObj.mother_tongue_preference : "";
        preferenceObj.complexion_preference = this.profileObj.complexion_preference ? this.profileObj.complexion_preference : "";
        preferenceObj.minimum_weight = this.profileObj.minimum_weight ? this.profileObj.minimum_weight : "";
        preferenceObj.maximum_weight = this.profileObj.maximum_weight ? this.profileObj.maximum_weight : "";
        preferenceObj.body_type_preference = this.profileObj.body_type_preference ? this.profileObj.body_type_preference : "";

        let formData = new FormData();
        for (var key in preferenceObj) {
            formData.append(key, preferenceObj[key]);
        }

        console.log(this.profileObj);

        this.adminService.updateProfilePreferenec(formData).subscribe((response: any) => {
            if (response.success) {
                this.toastr.success(response.message);
                this.preferenceFilterF = false;
                // let redirectionTab = nextTab.replace(" ", "-").toLowerCase();
                // this.activeTab = nextTab;
                // if (routingFlag == "true") {
                //   this.router.navigate(["/profiles"]);
                // } else {
                //   this.router.navigate(["/profiles/create/" + this.profileObj.id + "/" + redirectionTab]);
                // }
            }
            this.isLoading = false;
            this.getpref();
            this.getprofile();
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
            console.log(this.profileObj.fixed_preferences);
        }, 50);
    }

    isChecked(preference: string): boolean {
        return this.profileObj.fixed_preferences.includes(preference);
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

    // 
    counters: any = {
        sent_by_rm: 0,
        accepted: 0,
        request_received_count: 0,
        rejected: 0,
        request_sent: 0,
        not_interested: 0,
        view_profile: 0
    };

    getCounters() {
        this.adminService.getCounters({ user_id: this.loggedInUser.id }).subscribe((response: any) => {
            if (response.success) {
                this.counters = response.counts;
            }
        });
    }

    public dummyRecords = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    public isLoading: boolean = false;

    public profileObj: any = {};

    getpref() {
        this.isLoading = true;
        this.adminService.getPref({ id: this.loggedInUser.id }).subscribe((response: any) => {
            if (response.success) {
                this.profileObj = response.details;
                if (this.profileObj.country_of_settlement.length > 0) {
                    this.prefStateList(this.profileObj.country_of_settlement);
                }
                if (this.profileObj.state_of_settlement.length > 0) {
                    this.prefCityList(this.profileObj.state_of_settlement);
                }
                if (this.profileObj.caste) {
                    this.getAllSubCaste(this.profileObj.caste);
                }
                if (this.profileObj.country_of_settlement) {
                    this.profileObj.preffered_setlement_country = this.profileObj.country_of_settlement;
                }
                // if (this.profileObj.user_citizenship) {
                //     this.getAllVisas(this.profileObj.visa);
                // }
                this.profileObj.fixed_preferences = this.profileObj.fixed_preferences ? this.profileObj.fixed_preferences.split(",") : [];

            } else {
            }
            this.isLoading = false;
        });
    }

    public profileList: any = [];
    isLoadingF: boolean = false;
    isLoadingAllF: boolean = false;

    isnavigateTab: boolean = false; // notification redirect back flag


    all_total: any = 0;
    suggested_total: any = 0;


    getprofile() {
        this.isLoading = true;
        this.profileList = [];

        // this.isLoadingF = true;
        this.dataObj.page = 0; // add 
        if (this.dataObj.type == "") {
            this.isLoadingF = true;

            this.adminService.getmatchedProfiles(this.dataObj).subscribe((response: any) => {
                if (response.success) {
                    this.profileList = response.sent_profiles;
                    // console.log(this.profileList);
                    this.dataObj.total = response.total_records;
                    this.suggested_total = response.total_records;
                    this.setUsersPage(this.dataObj.page, 0);


                    this.isnavigateTab = true; //  notification redirect flag

                } else {
                    this.profileList = [];

                }
                this.isLoading = false;
                this.isLoadingF = false;
            });


            // S add all here

            this.allProfilesList = [];
            this.isLoadingAllF = true;
            this.adminService.getmatchedProfiles(this.allObj).subscribe((response: any) => {
                if (response.success == 1) {
                    this.allProfilesList = response.sent_profiles;
                    this.all_total = response.total_records;
                    this.isnavigateTab = true; //  notification redirect flag
                    this.isLoadingAllF = false;

                } else {
                    this.allObj.page = 0;
                    this.toastr.error(response.message, "Error", {});
                    this.isLoadingAllF = false;

                }
                this.isLoading = false;
                // this.isLoadingAllF = false;
            });

            // E add all here
            // console.log(this.isLoadingF);

        } else if (this.dataObj.type == "all") {
            this.allProfilesList = [];
            this.isLoadingF = true;
            this.adminService.getmatchedProfiles(this.allObj).subscribe((response: any) => {
                if (response.success == 1) {
                    this.allProfilesList = response.sent_profiles;
                    this.dataObj.total = response.total_records;
                    this.isnavigateTab = true; //  notification redirect flag
                    this.all_total = response.total_records;
                } else {
                    this.allObj.page = 0;
                    this.toastr.error(response.message, "Error", {});
                }
                this.isLoading = false;
                this.isLoadingF = false;
            });
        } else {
            this.isLoadingF = true;
            // console.log(this.isLoadingF);


            this.adminService.getmatchedProfiles(this.dataObj).subscribe((response: any) => {
                if (response.success) {
                    this.profileList = response.sent_profiles;
                    // console.log(this.profileList);
                    this.dataObj.total = response.total_records;
                    this.setUsersPage(this.dataObj.page, 0);
                    this.isnavigateTab = true; //  notification redirect flag
                } else {
                    this.profileList = [];
                    // this.isLoadingF = false;

                }
                this.isLoading = false;
                this.isLoadingF = false;
            });
            // console.log(this.isLoadingF);


        }


    }

    // onScroll(event: any) {
    //     console.log("hii");
    //     const element = event.target;
      
    //     const atBottom =
    //       element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
      
    //     const moreRecordsAvailable = this.allProfilesList.length < this.all_total;
      
    //     if (atBottom && moreRecordsAvailable && !this.isLoadingAllF) {
    //       this.allObj.page += 1;
    //       this.loadAllProfiles();
    //     }
    // }

    @HostListener('window:scroll', [])
        onWindowScroll() {
        const pos = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
        const max = document.documentElement.scrollHeight;

        const moreRecordsAvailable = this.allProfilesList.length < this.all_total;

        if (pos >= max - 50 && moreRecordsAvailable && !this.isLoadingAllF) {
            console.log("Reached bottom of page. Loading more...");
            this.allObj.page += 1;
            this.loadAllProfiles();
        }
    }

    loadAllProfiles() {
        if (this.isLoadingAllF) return;
      
        this.isLoadingAllF = true;
      
        this.adminService.getmatchedProfiles(this.allObj).subscribe((response: any) => {
          if (response.success == 1) {
            if (this.allObj.page === 1) {
              this.allProfilesList = response.sent_profiles;
            } else {
              this.allProfilesList = this.allProfilesList.concat(response.sent_profiles);
            }
            this.all_total = response.total_records;
          } else {
            this.toastr.error(response.message, "Error", {});
          }
      
          this.isLoadingAllF = false;
        });
      }


    public usersPager: any = [];
    setUsersPage(page: number, flag: number) {
        this.usersPager = this.pagerService.getPager(
            this.dataObj.total,
            page,
            this.dataObj.limit
        );
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
                this.getprofile(); // Fetch next set of profiles
            }
            this.currentProfileIndex = 0; // Reset to first profile in the new batch
        }
    }


    // message: any;

    selectOption(option: string, id, user_id: any, message?: any) {
        const selectedProfile = this.profileList[this.currentProfileIndex];
        // const userId = this.loggedInUser.id;
        const userId = user_id;
        const candidateId = id;

        // alert('data');
        console.log(option);



        if (this.Activetab == 'sent_by_rm') {

        }


        if (option == "Interested" && message && message != '') {



            this.adminService
                .requestSend({
                    user_id: userId,
                    candidate_id: candidateId,
                    // status: "request_sent",
                    message: message,
                    status: this.Activetab == 'request_received' ? 'accepted' : 'request_sent',
                })
                .subscribe((response: any) => {
                    if (response.success == 1) {
                        this.toastr.success(response.message);
                    } else {
                        this.toastr.error(response.message);
                    }
                    this.getprofile();
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
                    // status: "rejected",
                    status: this.Activetab == 'request_received' ? 'rejected' : 'not_interested',
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
        this.getprofile();

        console.log(`Profile ${selectedProfile.first_name} ${option}`);

        // Move to the next profile
        this.nextProfile();
    }

    // Get the current profile being displayed
    getCurrentProfile() {
        return this.profileList[this.currentProfileIndex];
    }


    isSearch: boolean = false;
    openSearch() {
        this.isSearch = true;
    }

    isSearchh: boolean = false;
    openSearchh() {
        this.isSearchh = true;
    }


    isinterestedF: boolean = false;

    closePopUp() {
        this.isinterestedF = false;
    }

    userdata: any = {

    }

    openPopUp(option: any, data: any) {
        this.isinterestedF = true;

        this.userdata.user_id = this.loggedInUser.id
        this.userdata.candidate_id = data.id
        this.userdata.first_name = data.first_name
        this.userdata.last_name = data.last_name
        // console.log(this.userdata);

        // console.log(data.first_name);

    }

    isExpanded: boolean = false;
    viewbasicInfo() {
        this.isExpanded = !this.isExpanded;
    }


    public allObj: any = {
        search: "",
        total: "",
        rm_id: "",
        caste: "",
        preffered_setlement_country: "",
        looking_for: "",
        doctor: "",
        education: "",
        education_type: "",
        age: "",
        occupation: "",
        occupation_type: "",
        net_worth: "",
        from_date: "",
        to_date: "",
        plan: "",
        status: "",
        is_deleted: "",
        min_age_gap: "",
        max_age_gap: "",
        type: "all",
        page: 1,
        limit:"10"

    };

    allProfilesList: any = [];

    getUsers() {
        this.isLoading = true;

        this.adminService.getUsers(this.allObj).subscribe((response: any) => {
            if (response.success == 1) {
                this.allProfilesList = response.user_list;
                this.allObj.total = response.total_records;
            } else {
                this.allObj.page = 0;
                this.toastr.error(response.message, "Error", {});
            }
            this.isLoading = false;
        });
    }

    onSearchChangee() {
        // this.resetPagination();
        this.getprofile();
    }

    submitFilterss() {
        this.preferenceFilterrF = false;
        this.allObj.page = 1;
        this.onallSearch()
    }

    //   resetPaginationn() {
    //     this.allObj.page = 0;
    //   }

    public preferenceFilterrF = false;
    openPreferencee() {
        this.preferenceFilterrF = !this.preferenceFilterrF;
    }



    // 
    // all after suggested

    // suggested_all_list: any = [];
    // suggested_all() {
    //     this.allProfilesList = [];
    //     this.isLoadingF = true;
    //     this.adminService.getmatchedProfiles(this.allObj).subscribe((response: any) => {
    //         if (response.success == 1) {
    //             this.allProfilesList = response.sent_profiles;
    //             this.dataObj.total = response.total_records;
    //             this.isnavigateTab = true; //  notification redirect flag
    //         } else {
    //             this.allObj.page = 0;
    //             this.toastr.error(response.message, "Error", {});
    //         }
    //         this.isLoading = false;
    //         this.isLoadingF = false;
    //     });
    // }
    onsuggetSearch() {

        this.isLoadingF = true;
        this.isLoading = true;

        this.adminService.getmatchedProfiles(this.dataObj).subscribe((response: any) => {
            if (response.success) {
                this.profileList = response.sent_profiles;
                // console.log(this.profileList);
                this.dataObj.total = response.total_records;
                this.setUsersPage(this.dataObj.page, 0);
                this.isLoadingF = false;
                this.isLoading = false;
                this.suggested_total = response.total_records;

                this.isnavigateTab = true; //  notification redirect flag

            } else {
                this.profileList = [];

                this.isLoading = false;
                this.isLoadingF = false;
            }
        });



    }
    onallSearch() {
        this.allObj.page = 1;
        this.allProfilesList = [];
        this.isLoadingAllF = true;
        this.adminService.getmatchedProfiles(this.allObj).subscribe((response: any) => {
            if (response.success == 1) {
                this.allProfilesList = response.sent_profiles;
                this.dataObj.total = response.total_records;
                this.all_total = response.total_records;
                this.isnavigateTab = true; //  notification redirect flag
                this.isLoadingAllF = false;

            } else {
                this.allObj.page = 1;
                this.toastr.error(response.message, "Error", {});
                this.isLoadingAllF = false;

            }
            // this.isLoading = false;
            // this.isLoadingAllF = false;
        });



    }


}