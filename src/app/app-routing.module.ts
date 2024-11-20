import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminAuthGuard } from './_guard/admin-auth.guard';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';


const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path : '',
        canActivate: [AdminAuthGuard],
        component: ManageProfileComponent,  
      },
      {
        path : 'preview/:id',
        canActivate: [AdminAuthGuard],
        component: ViewProfileComponent,  
      },
      {
        path : 'profile/update',
        canActivate: [AdminAuthGuard],
        component: ProfileUpdateComponent,  
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
  }

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
