import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  model: any = {};
  showDropdownMenu: boolean = false;

  constructor(
    public loginService: LoginService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.showDropdownMenu = false;

    this.loginService.login(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        this.model = {};
      }
    })
  }

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/');
  }

  toggleDropdownMenu(): void {
    this.showDropdownMenu = !this.showDropdownMenu;
    this.changeDropdownIcon();
  }

  clickOutside(): void {
    this.showDropdownMenu = false;
    this.changeDropdownIcon();
  }

  changeDropdownIcon() {
    const icon: Element | null = document.querySelector(".icon");

    if (icon !== null) {
      if (this.showDropdownMenu) {
        icon.innerHTML = "keyboard_arrow_up";
      }
      else {
        icon.innerHTML = "keyboard_arrow_down";
      }
    }
  }
}
