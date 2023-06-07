import { Component, OnDestroy } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Subscription, filter, timeout } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-login',
  templateUrl: './check-login.component.html',
  styleUrls: ['./check-login.component.scss']
})
export class CheckLoginComponent implements OnDestroy {

  subscription: Subscription

  constructor(private firebase: FirebaseService, router: Router) {

    this.subscription = this.firebase.authState.pipe(filter(user => user != null), timeout({each: 2000})).subscribe({
      next: auth => router.navigateByUrl('timer'),
      error: () => router.navigateByUrl('signup')
    })

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
