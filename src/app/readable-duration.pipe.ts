import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readableDuration'
})
export class ReadableDurationPipe implements PipeTransform {

  transform(millis?: number): string {

    if (millis) {

      const hours = Math.floor(millis / 1000 / 60 / 60)
      const minutes = Math.floor(millis / 1000 / 60) - (hours * 60)

      return `${hours}h ${minutes}m`
    }

    return ""
  }

}
