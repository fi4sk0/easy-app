import { Component, OnInit } from '@angular/core';
import { FirebaseService, types } from '../firebase.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  timespan = 12;

  timespanButtons = [4, 8, 12, 24];

  types = types

  startOfDays = [] as number[]

  constructor(public firebase: FirebaseService) {}

  async ngOnInit() {
    // create array with millis for each day
    const now = new Date()

    const days = [-3, -2, -1, 0]
    this.startOfDays = days.map(day => {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + day)
      return date.getTime()
    })

  }

}
