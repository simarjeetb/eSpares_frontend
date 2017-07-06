import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommanService } from './services/comman.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers:[CommanService],
  declarations: []
})
export class SharedModule { }
