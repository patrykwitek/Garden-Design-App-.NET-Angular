import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {

  constructor(
    public dialogRef: MatDialogRef<EditProfileComponent>
  ) { }

  public cancel() {
    this.dialogRef.close();
  }

}
