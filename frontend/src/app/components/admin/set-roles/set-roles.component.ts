import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PaginationParams } from 'src/app/models/classes/paginationParams';
import { IPagination } from 'src/app/models/interfaces/i-pagination';
import { IUserData } from 'src/app/models/interfaces/i-user-data';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-set-roles',
  templateUrl: './set-roles.component.html',
  styleUrls: ['./set-roles.component.scss']
})
export class SetRolesComponent implements OnInit {
  public usersList: IUserData[] = [];
  public pagination: IPagination | undefined;
  public isLoading: boolean = false;

  private usersListParams: PaginationParams | undefined;

  constructor(
    public dialogRef: MatDialogRef<SetRolesComponent>,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadUsersList();
    this.isLoading = false;
  }

  public cancel() {
    this.dialogRef.close();
  }

  public pageChanged(event: any) {
    if (this.usersListParams && this.usersListParams.pageNumber !== event.page) {
      this.usersListParams.pageNumber = event.page;

      this.userService.getUsersList(this.usersListParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.usersList = response.result;
            this.pagination = response.pagination;
          }
        }
      });
    }
  }

  public changeRole(user: IUserData) {
    this.userService.changeRole(user).subscribe({
      next: () => { },
      error: error => {
        this.toastr.error('Error changing the role: ', error);
      }
    });
  }

  private loadUsersList() {
    this.usersListParams = new PaginationParams();
    this.usersListParams.pageSize = 10;

    this.userService.getUsersList(this.usersListParams).subscribe({
      next: response => {
        if (response.result && response.pagination) {
          this.usersList = response.result;
          this.pagination = response.pagination;
        }
      }
    });
  }
}
