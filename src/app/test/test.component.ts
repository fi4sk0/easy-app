import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  foo?: string
  bar?: string

  constructor(public firebase: FirebaseService) {

  }

  ngOnInit() {

  }

}
