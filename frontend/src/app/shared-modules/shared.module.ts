import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

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
    BsDatepickerModule.forRoot()
  ],
  exports: [
    ToastrModule,
    NgxSpinnerModule,
    BsDatepickerModule
  ]
})
export class SharedModule { }
