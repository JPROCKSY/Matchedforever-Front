import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminAuthGuard } from './_guard/admin-auth.guard';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { MatchedProfileComponent } from './matched-profile/matched-profile.component';
import { LandingComponent } from './landing/landing.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChatComponent } from './chat/chat.component';
import { UserChatComponent } from './user-chat/user-chat.component';


const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: '',
        canActivate: [AdminAuthGuard],
        component: ManageProfileComponent,
      },
      {
        path: 'my-profile',
        canActivate: [AdminAuthGuard],
        component: MyProfileComponent,
        // component: ViewProfileComponent,
      },
      {
        path: 'change-password',
        canActivate: [AdminAuthGuard],
        component: ChangePasswordComponent,
      },
      {
        path: 'matched-profiles',
        canActivate: [AdminAuthGuard],
        component: MatchedProfileComponent,
      },
      {
        path: 'preview/:id',
        canActivate: [AdminAuthGuard],
        component: ViewProfileComponent,
      },
      {
        path: 'profile/update',
        canActivate: [AdminAuthGuard],
        component: ProfileUpdateComponent,
      },
      {
        path: 'chat',
        canActivate: [AdminAuthGuard],
        component: ChatComponent,
      },
      {
        path: 'user-chat',
        canActivate: [AdminAuthGuard],
        component: UserChatComponent,
      },
    ]
  },
  {
    path: 'landing',
    component: LandingComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  }

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
