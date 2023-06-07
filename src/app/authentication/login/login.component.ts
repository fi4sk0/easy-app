import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username?: string;
  password?: string;

  constructor(public firebase: FirebaseService, private router: Router) {}

  async login() {
    if (this.username == null || this.password == null) {
      return;
    }

    try {
      this.firebase.login(this.username, this.password);
      // if this worked, go to timer
      this.router.navigateByUrl('/timer');
    } catch (e) {
      console.log(e);
    }
  }
}
