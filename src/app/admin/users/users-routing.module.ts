import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ng2-bootstrap';
import { ListUserComponent } from './list-component/list-user.component';
import { AddUpdateUserComponent } from './addupdate-component/addupdate-user.component';
import { ViewUserComponent } from './view-component/view-user.component';
import { ChildRouteGuard } from '../auth/services/child-route-guard';
import { HttpModule } from '@angular/http';
import { UserService } from './services/user.service';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Users'
    },
    children: [
      {
        path: '',
        component: ListUserComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        component: ListUserComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: AddUpdateUserComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'Add User'
        }
      },
      {
        path: 'list/:id',
        component: ViewUserComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'View'
        }
      },
      {
        path: 'edit/:id',
        component: AddUpdateUserComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'Edit User'
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
    UserService
  ],
  exports: [
    RouterModule,
    FormsModule,
    Ng2TableModule,
    PaginationModule
  ]
})
export class UsersRoutingModule {}
