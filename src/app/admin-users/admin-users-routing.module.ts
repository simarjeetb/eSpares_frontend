import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ng2-bootstrap';
import { ListAdminUserComponent } from './list-component/list-admin-user.component';
import { AddUpdateAdminUserComponent } from './addupdate-component/addupdate-admin-user.component';
import { ViewAdminUserComponent } from './view-component/view-admin-user.component';
import { HttpModule } from '@angular/http';
import { AdminUserService } from './services/admin-user.service';
import { ChildRouteGuard } from '../auth/services/child-route-guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admin Users'
    },
    children: [
      {
        path: '',
        component: ListAdminUserComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        component: ListAdminUserComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: AddUpdateAdminUserComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'Add Admin User'
        }
      },
      {
        path: 'list/:id',
        component: ViewAdminUserComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'View'
        }
      },
      {
        path: 'edit/:id',
        component: AddUpdateAdminUserComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'Edit Admin User'
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    Ng2TableModule,
    PaginationModule,
    HttpModule
  ],
  providers: [
    AdminUserService
  ],
  exports: [
    RouterModule,
    FormsModule,
    Ng2TableModule,
    PaginationModule
  ]
})
export class AdminUsersRoutingModule {}
