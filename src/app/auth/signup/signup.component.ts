import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  userData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  };

  constructor(private router: Router) {}

  onRegister() {
    console.log(this.userData);
    
    this.router.navigateByUrl('/signup/onboard', { state: { userData: this.userData } });
    if (this.userData.password === this.userData.confirmPassword && this.userData.termsAccepted) {
      // Navigate to onboard with user data as state
      this.router.navigateByUrl('/signup/onboard', { state: { userData: this.userData } });
    } else {
      alert("Passwords don't match or terms not accepted!");
    }
  }

}
