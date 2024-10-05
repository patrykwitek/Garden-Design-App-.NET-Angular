import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  private initializeForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(16)]],
      confirmPassword: ['', [
        Validators.required,
        this.matchValues('password')]]
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => {
        this.registerForm.controls['confirmPassword'].updateValueAndValidity()
      }
    })
  }

  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return (control.value === control.parent?.get(matchTo)?.value) ? null : { notMatching: true }
    }
  }

  public register() {
    const dateOfBirth = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);

    const registerValues = { ...this.registerForm.value, dateOfBirth: dateOfBirth };

    this.userService.register(registerValues).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: error => {
        this.validationErrors = error;
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
}
