import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ng2-bootstrap';
import { ListInputComponent } from './list-component/list-input.component';
import { AddUpdateInputComponent } from './addupdate-component/addupdate-input.component';
import { ViewInputComponent } from './view-component/view-input.component';
import { ChildRouteGuard } from '../auth/services/child-route-guard';
import { HttpModule } from '@angular/http';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Inputs'
    },
    children: [
     {
        path: '',
        component: ListInputComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        component: ListInputComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: AddUpdateInputComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'Add Input'
        }
      },
      {
        path: 'list/:id',
        component: ViewInputComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'View'
        }
      },
      {
        path: 'edit/:id',
        component: AddUpdateInputComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'Edit Input'
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
export class InputsRoutingModule {}
