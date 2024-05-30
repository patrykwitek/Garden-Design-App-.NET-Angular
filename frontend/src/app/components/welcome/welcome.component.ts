import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  @Output() changeMode = new EventEmitter();

  username: string = '';
  password: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  public login() {
    const loginValues = {
      username: this.username,
      password: this.password
    };
    
    console.log(loginValues);

    // note: todo
    // this.loginService.login(loginValues).subscribe({
    //   next: () => {
    //     this.router.navigateByUrl('/projects');
    //   },
    //   error: error => {
    //     this.validationErrors = error;
    //   }
    // });
  }

  public changeHomeMode(mode: string) {
    this.changeMode.emit(mode);
  }
}
