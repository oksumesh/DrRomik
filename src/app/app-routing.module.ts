import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { UserOnboardingComponent } from './auth/signup/user-onboarding/user-onboarding.component';
import { RegisterSuccessComponent } from './auth/signup/register-success/register-success.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  {path:"signup/onboard",component:UserOnboardingComponent},
  {path:'popup',component:RegisterSuccessComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
