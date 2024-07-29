import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>
  ) { }

  public cancel() {
    this.dialogRef.close();
  }

}
