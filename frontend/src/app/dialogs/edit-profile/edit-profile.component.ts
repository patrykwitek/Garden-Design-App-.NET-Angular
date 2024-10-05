import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { IUser } from 'src/app/models/interfaces/i-user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  public editProfileForm: FormGroup = new FormGroup({});
  public maxDate: Date = new Date();
  public validationErrors: string[] | undefined;

  private currentUserUsername: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<EditProfileComponent>,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.userService.currentUser$.pipe(take(1)).subscribe({
      next: async (user) => {
        if (!user) throw new Error('Current user is not set up');

        this.currentUserUsername = user.username;

        this.userService.getUserDataForEditProfile(user.username).subscribe(
          (userData) => {
            const date = this.formatDate(userData.dateOfBirth);

            this.editProfileForm = this.formBuilder.group({
              username: [userData.username, Validators.required],
              dateOfBirth: [date, Validators.required]
            });

            this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
          },
          error => {
            console.error('Error loading user data: ', error);
          }
        );
      }
    });
  }

  public cancel() {
    this.dialogRef.close();
  }

  public async edit() {
    const dateOfBirth = this.getDateOnly(this.editProfileForm.controls['dateOfBirth'].value);

    const editProfileFormValues = { ...this.editProfileForm.value };

    if (!this.currentUserUsername || !editProfileFormValues.username || !dateOfBirth) return;

    const editProfileValues = {
      oldUsername: this.currentUserUsername,
      newUsername: editProfileFormValues.username,
      dateOfBirth: dateOfBirth
    };

    this.userService.editProfile(editProfileValues).subscribe({
      next: () => {
        const currentUser = localStorage.getItem('garden-design-app-user');
        if (currentUser) {
          const currentUserJson: IUser = JSON.parse(currentUser);
          currentUserJson.username = editProfileValues.newUsername;
          this.userService.setCurrentUser(currentUserJson);

          this.editProfileForm.reset(editProfileFormValues);
          this.toastr.success('Profile successfully edited');
        }
      },
      error: error => {
        this.validationErrors = error;
        this.toastr.error('Error editing profile: ', error);
      }
    });
  }

  private getDateOnly(dateOfBirth: string | undefined) {
    if (!dateOfBirth) {
      return;
    }

    let dateOfdob = new Date(dateOfBirth);

    return new Date(dateOfdob.setMinutes(dateOfdob.getMinutes() - dateOfdob.getTimezoneOffset()))
      .toISOString()
      .slice(0, 10);
  }

  private formatDate(date: string): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
