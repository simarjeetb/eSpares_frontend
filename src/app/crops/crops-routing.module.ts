import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ng2-bootstrap';
import { ListCropComponent } from './list-component/list-crop.component';
import { AddUpdateCropComponent } from './addupdate-component/addupdate-crop.component';
import { ViewCropComponent } from './view-component/view-crop.component';
import { HttpModule } from '@angular/http';
import { ChildRouteGuard } from '../auth/services/child-route-guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Crops'
    },
    children: [
      {
        path: '',
        component: ListCropComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        component: ListCropComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: AddUpdateCropComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'Add Crop'
        }
      },
      {
        path: 'list/:id',
        component: ViewCropComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'View'
        }
      },
      {
        path: 'edit/:id',
        component: AddUpdateCropComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'Edit Crop'
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
export class CropsRoutingModule {}
