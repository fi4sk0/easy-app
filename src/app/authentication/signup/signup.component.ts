import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/firebase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  username?: string;
  password?: string;
  passwordRepeat?: string;

  constructor(public firebase: FirebaseService, private router: Router) {}

  register() {
    if (
      this.password == null ||
      this.passwordRepeat != this.password ||
      this.username == null
    ) {
      return;
    }

    try {
      this.firebase.signup(this.username, this.password);
      // if this worked, go to timer
      this.router.navigateByUrl('/timer')
    } catch (e) {
      console.log(e)
    }
  }
}
