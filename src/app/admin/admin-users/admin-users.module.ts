import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG2DataTableModule } from "angular2-datatable-pagination";

import { ListAdminUserComponent } from './list-component/list-admin-user.component';
import { AddUpdateAdminUserComponent } from './addupdate-component/addupdate-admin-user.component';
import { ViewAdminUserComponent } from './view-component/view-admin-user.component';
import { AdminUsersRoutingModule } from './admin-users-routing.module';
import { CustomFormsModule } from 'ng2-validation'
import { FlashMessagesModule } from 'ngx-flash-messages';
import { SharedModule } from '../shared/shared.module';
@NgModule({
    imports: [
      	AdminUsersRoutingModule,
      	CommonModule,
        NG2DataTableModule,
        CustomFormsModule,
        FlashMessagesModule,
        SharedModule    
    ],
    declarations: [
      	ListAdminUserComponent,
      	AddUpdateAdminUserComponent,
      	ViewAdminUserComponent
    ]
})
export class AdminUsersModule { }