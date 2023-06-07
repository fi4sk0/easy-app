import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhaseComponent } from './timer/phase/phase.component';
import { FormsModule } from '@angular/forms';
import { TimerComponent } from './timer/timer.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { LoginComponent } from './authentication/login/login.component';
import { TestComponent } from './test/test.component';
import { CheckLoginComponent } from './check-login/check-login.component';
import { ReadableDurationPipe } from './readable-duration.pipe';
import { DayComponent } from './day/day.component';

@NgModule({
  declarations: [
    AppComponent,
    PhaseComponent,
    TimerComponent,
    SignupComponent,
    LoginComponent,
    TestComponent,
    CheckLoginComponent,
    ReadableDurationPipe,
    DayComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
