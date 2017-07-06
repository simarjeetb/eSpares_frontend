import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*For list table.*/
// import {DataTableModule} from "angular2-datatable";
import {NG2DataTableModule} from "angular2-datatable-pagination";
import { CustomFormsModule } from 'ng2-validation'


import { ListEquipmentComponent } from './list-component/list-equipment.component';
import { ViewEquipmentComponent } from './view-component/view-equipment.component';

import { AddUpdateEquipmentComponent } from './addupdate-component/addupdate-equipment.component';


import { EquipmentsRoutingModule } from './equipments-routing.module';

import { DatePickerModule } from 'ng2-datepicker';


import { GoogleplaceDirective } from '../shared/directives/googleplaces/googleplaces.directive';
import { FlashMessagesModule } from 'ngx-flash-messages';

import { SharedModule } from '../shared/shared.module';

import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { ImageUploadModule } from 'ng2-imageupload';
import { PromptEquipmentCategoryComponent } from '../modals/promptEquipmentCategory.component';
import { PromptEquipmentManufacturerComponent } from '../modals/promptEquipmentManufacturer.component';
import { ViewEquipmentImageComponent } from '../modals/view-image/ViewEquipmentImage.component';

@NgModule({
    imports: [
        EquipmentsRoutingModule,
        CommonModule,
        NG2DataTableModule,
        CustomFormsModule,
        DatePickerModule,
        FlashMessagesModule,
        BootstrapModalModule,
        SharedModule,
        ImageUploadModule
    ],
    declarations: [
        ListEquipmentComponent,
        AddUpdateEquipmentComponent,
        ViewEquipmentComponent,
        GoogleplaceDirective,
        PromptEquipmentCategoryComponent,
        PromptEquipmentManufacturerComponent,
        ViewEquipmentImageComponent
    ],
  //Don't forget add component to entryComponents section
  entryComponents: [
    PromptEquipmentCategoryComponent,
    PromptEquipmentManufacturerComponent,
    ViewEquipmentImageComponent
  ],
})
export class EquipmentsModule { }