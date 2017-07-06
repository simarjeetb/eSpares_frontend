import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ng2-bootstrap';
import { HttpModule } from '@angular/http';


import { ListEquipmentComponent } from './list-component/list-equipment.component';
import { ViewEquipmentComponent } from './view-component/view-equipment.component';

import { AddUpdateEquipmentComponent } from './addupdate-component/addupdate-equipment.component';

import { EquipmentService } from './services/equipment.service';
import { ChildRouteGuard } from '../auth/services/child-route-guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Equipments'
    },
    children: [
      {
        path: '',
        component: ListEquipmentComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        component: ListEquipmentComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: AddUpdateEquipmentComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'Add Equipment'
        }
      },
      {
        path: 'list/:id',
        component: ViewEquipmentComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'View'
        }
      },
      {
        path: 'edit/:id',
        component: AddUpdateEquipmentComponent,
        canActivate: [ChildRouteGuard],
        data: {
          title: 'Edit Equipment'
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
    EquipmentService
  ],
  exports: [
    RouterModule,
    FormsModule,
    Ng2TableModule,
    PaginationModule    
  ]
})
export class EquipmentsRoutingModule {}
