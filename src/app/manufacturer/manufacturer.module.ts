import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG2DataTableModule } from "angular2-datatable-pagination";
import { ListManufacturerComponent } from './list-component/list-manufacturer.component';
import { AddUpdateManufacturerComponent } from './addupdate-component/addupdate-manufacturer.component';
import { ViewManufacturerComponent } from './view-component/view-manufacturer.component';
import { ManufacturerRoutingModule } from './manufacturer-routing.module';
import { ManufacturerService } from './services/manufacturer.service';
import { CustomFormsModule } from 'ng2-validation';
import { DatePickerModule } from 'ng2-datepicker';
import { FlashMessagesModule } from 'ngx-flash-messages';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
  	 ManufacturerRoutingModule,
  	 CommonModule,
     NG2DataTableModule,
     CustomFormsModule,
     DatePickerModule, 
     FlashMessagesModule,
     SharedModule    
  ],
  providers: [
  	ManufacturerService
  ],
  declarations: [
  	ListManufacturerComponent,
  	AddUpdateManufacturerComponent,
  	ViewManufacturerComponent
  ]
})
export class ManufacturerModule { }