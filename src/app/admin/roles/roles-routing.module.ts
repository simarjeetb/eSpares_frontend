import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ng2-bootstrap';
import { ListRoleComponent } from './list-component/list-role.component';
import { AddUpdateRoleComponent } from './addupdate-component/addupdate-role.component';
import { ViewRoleComponent } from './view-component/view-role.component';
import { ChildRouteGuard } from '../auth/services/child-route-guard';
import { HttpModule } from '@angular/http';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Roles'
    },
    children: [
      {
        path: '',
        component: ListRoleComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        component: ListRoleComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: AddUpdateRoleComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'Add Role'
        }
      },
      {
        path: 'list/:id',
        component: ViewRoleComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'View'
        }
      },
      {
        path: 'edit/:id',
        component: AddUpdateRoleComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'Edit Role'
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
  exports: [
    RouterModule,
    FormsModule,
    Ng2TableModule,
    PaginationModule
  ]
})
export class RolesRoutingModule {}
