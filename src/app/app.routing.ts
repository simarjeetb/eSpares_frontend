import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
// Layouts
import { FullLayoutComponent } from './admin/layouts/full-layout.component';

import { LoginComponent } from './admin/auth/login/login.component';
import { ForgotPasswordComponent } from './admin/auth/forgot-password/forgot-password.component'
import { ActiveRouteGuard } from './admin/auth/services/activate-route-guard';
import { DeactiveRouteGuard } from './admin/auth/services/deactivate-route-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'admin/login',
    component: LoginComponent,
    canActivate: [ActiveRouteGuard]
  },
  {
    path: 'admin/forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [ActiveRouteGuard]
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    canActivate: [DeactiveRouteGuard],
    children: [
      {
        path: 'admin/dashboard',
        loadChildren: './admin/dashboard/dashboard.module#DashboardModule'
      },
       {
        path: 'admin/users',
        loadChildren: './admin/users/users.module#UsersModule'      
      },
      {
        path: 'admin/roles',
        loadChildren: './admin/roles/roles.module#RolesModule'      
      },
      {
        path: 'admin/category',
        loadChildren: './admin/category/category.module#CategoryModule'      
      },
      {
        path: 'admin-users',
        loadChildren: './admin/admin-users/admin-users.module#AdminUsersModule'      
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes),HttpModule ],
  exports: [ RouterModule,HttpModule ]
})
export class AppRoutingModule {}
