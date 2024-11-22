import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpEventType } from "@angular/common/http";
import { Observable, of, BehaviorSubject, Subject } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminServiceService {

    private objservableadmin = new Subject<any>();

    private objservablecategory = new Subject<any>();

    private apiUrl = environment.apiUrl

    constructor(private http: HttpClient) { }

    adminSignIn(userData): Observable<any> {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post<any>(environment.apiUrl + 'verifyOtp', JSON.stringify(userData), httpOptions).pipe();
    }

    adminotp(userData): Observable<any> {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post<any>(environment.apiUrl + 'login', JSON.stringify(userData), httpOptions).pipe();
    }

    getqrartwork(data): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post<any>(environment.apiUrl + 'getqrartwork', JSON.stringify(data), httpOptions).pipe();
    }



    sendcode(userData): Observable<any> {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post<any>(environment.apiUrl + 'manage_user/forgot_password', JSON.stringify(userData), httpOptions).pipe();
    }

    checkcode(userData): Observable<any> {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post<any>(environment.apiUrl + 'manage_user/check_code', JSON.stringify(userData), httpOptions).pipe();
    }

    getProfiles(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'getProfilesForUser', JSON.stringify(data), httpOptions).pipe();
    }

    getmatchedProfiles(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'sharedProfile/list', JSON.stringify(data), httpOptions).pipe();
    }

    profileDetail(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'profile/detail', JSON.stringify(data), httpOptions).pipe();
    }

    
    getPref(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'profile/preferences', JSON.stringify(data), httpOptions).pipe();
    }
    savePref(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthdataHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'profile/update_preferences', data, httpOptions).pipe();
    }

    requestSend(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'handleRequest/send', JSON.stringify(data), httpOptions).pipe();
    }

    requestreject(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'handleRequest/changestatus', JSON.stringify(data), httpOptions).pipe();
    }

    getSubscription(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'subscription/list', JSON.stringify(data), httpOptions).pipe();
    }

    getRelationship(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'relationshipStatus/list', JSON.stringify(data), httpOptions).pipe();
    }

    

    updateProfile(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthdataHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'profile/update', data, httpOptions).pipe();
    }

    getCaste(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'manageCaste/list', JSON.stringify(data), httpOptions).pipe();
    }


    multiplecity(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'multiplecities', JSON.stringify(data), httpOptions).pipe();
    }

    multiplestate(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'multiplestates', JSON.stringify(data), httpOptions).pipe();
    }


    citizenshipDetails(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'citizenship/details', JSON.stringify(data), httpOptions).pipe();
    }

    getCitizenship(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'citizenship/list', JSON.stringify(data), httpOptions).pipe();
    }

    getNestedCaste(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'manageCaste/nested-list', JSON.stringify(data), httpOptions).pipe();
    }


    country(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'country', JSON.stringify(data), httpOptions).pipe();
    }

    states(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'states', JSON.stringify(data), httpOptions).pipe();
    }

    city(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'cities', JSON.stringify(data), httpOptions).pipe();
    }

    getHobbies(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'manageHobbies/list', JSON.stringify(data), httpOptions).pipe();
    }

    getLanguage(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'manageLanguage/list', JSON.stringify(data), httpOptions).pipe();
    }




    getEducation(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'education/list', JSON.stringify(data), httpOptions).pipe();
    }


    getEducationType(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'manageEducationType/list', JSON.stringify(data), httpOptions).pipe();
    }


    getReligion(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'religion/list', JSON.stringify(data), httpOptions).pipe();
    }


    getOccupations(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'manageOccupation/list', JSON.stringify(data), httpOptions).pipe();
    }

    getOccupationType(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(environment.apiUrl + 'manageOccupationType/list', JSON.stringify(data), httpOptions).pipe();
    }
 
    setObjservableUser(objLoggedInUser) {
        this.objservableadmin.next(objLoggedInUser);
        localStorage.setItem("MATCHEDFOREVERF", objLoggedInUser);
    }

    removeObjservableUser() {
        this.objservableadmin.next();
        localStorage.removeItem("MATCHEDFOREVERF");
    }

    getLoggedInUser() {
        const userData = JSON.parse(localStorage.getItem('MATCHEDFOREVERF'));
        return of(userData);
    }

    setlocal(objLoggedInUser) {
        this.objservableadmin.next(objLoggedInUser);
        localStorage.setItem("resetpassword", objLoggedInUser);
    }

    removelocal() {
        this.objservableadmin.next();
        localStorage.removeItem("resetpassword");
    }

    getlocal() {
        const userData = localStorage.getItem('resetpassword');
        return of(userData);
    }

    private getAuthHeaders(): HttpHeaders {
        var user: any = this.getLoggedInUser();

        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': user.value.token
        });
    }

    private getAuthdataHeaders(): HttpHeaders {
        var user: any = this.getLoggedInUser();
        return new HttpHeaders({
            'Authorization': user.value.token
        });
    }

    checktoken(data): Observable<any> {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        return this.http.post<any>(this.apiUrl + 'checktoken', JSON.stringify(data), httpOptions).pipe();
    }

    
}
