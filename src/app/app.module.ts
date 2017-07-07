import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
// import { DropdownModule } from 'ng2-bootstrap/dropdown';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './admin/shared/nav-dropdown.directive';

import { CookieModule } from 'ngx-cookie';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';

import { ActiveRouteGuard } from './admin/auth/services/activate-route-guard';
import { DeactiveRouteGuard } from './admin/auth/services/deactivate-route-guard';
import { ChildRouteGuard } from './admin/auth/services/child-route-guard';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './admin/shared/sidebar.directive';
import { AsideToggleDirective } from './admin/shared/aside.directive';
import { BreadcrumbsComponent } from './admin/shared/breadcrumb.component';
import { PaginationModule } from 'ng2-bootstrap';
// Routing Module
import { AppRoutingModule } from './app.routing';
import { HttpModule } from '@angular/http';

// Layouts
import { FullLayoutComponent } from './admin/layouts/full-layout.component';

import { FlashMessagesModule } from 'ngx-flash-messages';


import { LoginComponent } from './admin/auth/login/login.component';
import { CustomFormsModule } from 'ng2-validation';
import { ForgotPasswordComponent } from './admin/auth/forgot-password/forgot-password.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    // DropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    PaginationModule.forRoot(),
    CookieModule.forRoot(),    
    HttpModule,
    CustomFormsModule,
    FlashMessagesModule,
    BootstrapModalModule
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,    
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    LoginComponent,
    ForgotPasswordComponent    
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    ActiveRouteGuard,
    DeactiveRouteGuard,
    ChildRouteGuard
  ],
  bootstrap: [ 
    AppComponent
  ]
})
export class AppModule { }
