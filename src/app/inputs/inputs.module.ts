import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG2DataTableModule } from "angular2-datatable-pagination";
import { InputService } from './services/input.service';
import { SharedModule } from '../shared/shared.module';
import { ListInputComponent } from './list-component/list-input.component';
import { AddUpdateInputComponent } from './addupdate-component/addupdate-input.component';
import { ViewInputComponent } from './view-component/view-input.component';
import { InputsRoutingModule } from './inputs-routing.module';
import { CustomFormsModule } from 'ng2-validation';
import { DatePickerModule } from 'ng2-datepicker';
import { FlashMessagesModule } from 'ngx-flash-messages';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { PromptInputCategoryComponent } from '../modals/promptInputCategory.component';
import { PromptInputManufacturerComponent } from '../modals/promptInputManufacturer.component';
import { ViewInputImageComponent } from '../modals/view-image/viewInputImage.component';
import { ImageUploadModule } from 'ng2-imageupload';

@NgModule({
  imports: [
  	InputsRoutingModule,
  	CommonModule,
    NG2DataTableModule,
    CustomFormsModule,
    FlashMessagesModule,
    SharedModule,
    BootstrapModalModule,
    ImageUploadModule
  ],
  providers: [
    InputService
  ],
  declarations: [
  	ListInputComponent,
  	AddUpdateInputComponent,
  	ViewInputComponent,
    PromptInputCategoryComponent,
    PromptInputManufacturerComponent,
    ViewInputImageComponent
  ],
  //Don't forget add component to entryComponents section
  entryComponents: [
    PromptInputCategoryComponent,
    PromptInputManufacturerComponent,
    ViewInputImageComponent
  ]
})
export class InputsModule { }