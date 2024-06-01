import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  public getDateOnly(date: string | undefined) {
    if (!date) {
      return;
    }

    let dateOfdob = new Date(date);

    return new Date(dateOfdob.setMinutes(dateOfdob.getMinutes() - dateOfdob.getTimezoneOffset()))
      .toISOString()
      .slice(0, 10);
  }
}
