import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimerComponent } from './timer/timer.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { LoginComponent } from './authentication/login/login.component';
import { TestComponent } from './test/test.component';
import { CheckLoginComponent } from './check-login/check-login.component';

const routes: Routes = [
  {
    path: '',
    component: CheckLoginComponent
  },
  {
    path: 'timer',
    component: TimerComponent,
  },
  {
    path: 'signup', 
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'test',
    component: TestComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
