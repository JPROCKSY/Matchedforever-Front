import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { PagerService } from './_services/pager-service';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { OwlDateTimeModule,OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatchedProfileComponent } from './matched-profile/matched-profile.component';
import { LandingComponent } from './landing/landing.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChatComponent } from './chat/chat.component';
// import { SwiperModule } from 'ngx-swiper-wrapper';

import { AngularFireAuthModule } from '@angular/fire/auth';   // For Firebase Authentication
import { AngularFirestoreModule } from '@angular/fire/firestore';  // For Firestore
import { AngularFireModule } from '@angular/fire';   // For initializing Firebase
import { environment } from '../environments/environment';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { UserChatComponent } from './user-chat/user-chat.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ManageProfileComponent,
    ProfileUpdateComponent,
    ViewProfileComponent,
    MatchedProfileComponent,
    LandingComponent,
    MyProfileComponent,
    RegisterComponent,
    ChangePasswordComponent,
    ChatComponent,
    UserChatComponent,
  ],
  imports: [
    BrowserModule,
    //  SwiperModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    PagerService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
