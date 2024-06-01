import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimeagoModule } from "ngx-timeago";
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    NgxSpinnerModule.forRoot({
      type: 'line-spin-fade'
    }),
    TimeagoModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  exports: [
    ToastrModule,
    NgxSpinnerModule,
    BsDatepickerModule,
    PaginationModule,
    TimeagoModule
  ]
})
export class SharedModule { }
