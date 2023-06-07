import { AfterViewInit, Component, HostBinding, Input, OnInit, QueryList, ViewChild, ViewChildren, inject, isDevMode } from '@angular/core';
import { FirebaseDocument, FirebaseService, Phase } from '../firebase.service';
import { Observable, firstValueFrom, take } from 'rxjs';
import { PhaseComponent } from '../timer/phase/phase.component';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements AfterViewInit {

  @Input()
  startOfDay!: number

  @Input()
  timespan!: number

  @HostBinding('style.height.vh')
  height?: number = undefined

  phases$?: Observable<FirebaseDocument<Phase>[]>

  @ViewChildren(PhaseComponent)
  phaseComponents!: QueryList<PhaseComponent>

  constructor(private firebase: FirebaseService) { }

  async ngAfterViewInit() {

    
    this.phases$ = this.firebase.getPhasesOfDay(this.startOfDay)

    const isToday = this.startOfDay == new Date().setHours(0, 0, 0, 0)

    // check if startOfDay is today
    if (isToday) {
      // if so, scroll last element into view
      console.log('scrolling last element into view')

      this.phaseComponents.changes.pipe(take(1)).subscribe((comps) => {

        (comps.last.elementRef.nativeElement as HTMLDivElement).scrollIntoView({ behavior: 'smooth' })
      })

      const phases = await firstValueFrom(this.phases$)
      console.log(phases)

    }

  }

}
