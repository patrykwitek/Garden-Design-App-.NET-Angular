import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-on-off-toogle-switch',
  templateUrl: './on-off-toogle-switch.component.html',
  styleUrls: ['./on-off-toogle-switch.component.scss']
})
export class OnOffToogleSwitchComponent {
  @Input() isTurnOn: boolean = false;

  public toggleMode() {
    this.isTurnOn = !this.isTurnOn;
  }
}
