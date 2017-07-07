import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { DataTableModule } from "angular2-datatable";
import {NG2DataTableModule} from "angular2-datatable-pagination";

import { ListUserComponent } from './list-component/list-user.component';
import { AddUpdateUserComponent } from './addupdate-component/addupdate-user.component';
import { ViewUserComponent } from './view-component/view-user.component';
import { UsersRoutingModule } from './users-routing.module';
import { CustomFormsModule } from 'ng2-validation'
import { FlashMessagesModule } from 'ngx-flash-messages';
import { SharedModule } from '../shared/shared.module';
@NgModule({
    imports: [
      	UsersRoutingModule,
      	CommonModule,
      	// DataTableModule,
        NG2DataTableModule,
        CustomFormsModule,
        FlashMessagesModule,
        SharedModule    
    ],
    declarations: [
      	ListUserComponent,
      	AddUpdateUserComponent,
      	ViewUserComponent
    ]
})
export class UsersModule { }