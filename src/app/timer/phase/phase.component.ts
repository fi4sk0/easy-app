import { Component, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FirebaseDocument, FirebaseService, Phase, PhaseVisualType, types } from 'src/app/firebase.service';

@Component({
  selector: 'app-phase',
  templateUrl: './phase.component.html',
  styleUrls: ['./phase.component.scss'],
  host: {
    class: 'block px-2 transition-all ease-in-out absolute w-full'
  }
})
export class PhaseComponent implements OnInit, OnChanges {

  @Input()
  phase!: FirebaseDocument<Phase>

  @Input()
  nextPhase?: FirebaseDocument<Phase>

  @Input()
  startOfDay!: number

  visualType?: PhaseVisualType

  duration?: number

  @HostBinding('class')
  hostBgClass?: string

  @HostBinding("class.shadow-lg")
  hasShadow = false



  @HostBinding('style.height.%')
  height: number = 10

  @HostBinding('style.top.%')
  top: number = 0

  timer?: number 

  constructor(private firebase: FirebaseService, public elementRef: ElementRef<HTMLDivElement>) {}

  ngOnInit(): void {
        
  }

  ngOnChanges(changes: SimpleChanges): void {

    const tmpStartOfDay = new Date(this.startOfDay)
    const startOfDay = this.startOfDay
    const endOfDay = new Date(tmpStartOfDay.getFullYear(), tmpStartOfDay.getMonth(), tmpStartOfDay.getDate() + 1).getTime()

    this.visualType = types.find(type => this.phase.data.type == type.type)
    this.hostBgClass = this.visualType?.color

    if (this.timer) {
      clearInterval(this.timer)
    }

    this.hasShadow = this.nextPhase == null

    if (this.nextPhase != null) {

      this.duration = this.nextPhase.data.createdAt - this.phase.data.createdAt
      this.height = this.duration / (endOfDay - startOfDay) * 100
      this.top = (this.phase.data.createdAt - startOfDay) / (endOfDay - startOfDay) * 100
    } else {

      this.duration = Date.now() - this.phase.data.createdAt
      
      this.height = this.duration / (endOfDay - startOfDay) * 100
      this.top = (this.phase.data.createdAt - startOfDay) / (endOfDay - startOfDay) * 100

      this.timer = setInterval(() => {
        this.duration = Date.now() - this.phase.data.createdAt
        this.height = this.duration / (endOfDay - startOfDay) * 100
        this.top = (this.phase.data.createdAt - startOfDay) / (endOfDay - startOfDay) * 100

      }, 1000) as unknown as number

    }

  }

  changed(event: any) {

    const date = new Date()

    date.setHours(event.target.value.split(":")[0])
    date.setMinutes(event.target.value.split(":")[1])

    this.firebase.update(this.phase.id, {createdAt: date.getTime()})
  }

}
