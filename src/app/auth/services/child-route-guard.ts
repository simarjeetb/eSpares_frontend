import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie';


@Injectable()
export class ChildRouteGuard implements CanActivate {

    constructor(
        private _router : Router, 
        private _cookieService: CookieService ) { }

    canActivate(
        _route : ActivatedRouteSnapshot,
        _state : RouterStateSnapshot) {

        var url = _state.url
        let actions = this._cookieService.getObject('actions');

        if(actions['type'] == 'SA') {
            return true;
        } else if(url.indexOf('/crops') == 0) {
            if( url == '/crops' || (url.indexOf('/crops/list') == 0) ) {
                if(actions['crops']['view']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            } else {
                if(actions['crops']['addEditDelete']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            }
        } else if(url.indexOf('/inputs') == 0) {
            if( url == '/inputs' || (url.indexOf('/inputs/list') == 0) ) {
                if(actions['inputs']['view']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            } else {
                if(actions['inputs']['addEditDelete']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            }
        } else if(url.indexOf('/equipments') == 0) {
            if( url == '/equipments' || (url.indexOf('/equipments/list') == 0) ) {
                if(actions['equipments']['view']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            } else {
                if(actions['equipments']['addEditDelete']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            }
        } else if(url.indexOf('/land') == 0) {
            if( url == '/land' || (url.indexOf('/land/list') == 0) ) {
                if(actions['lands']['view']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            } else {
                if(actions['lands']['addEditDelete']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            }
        } else if(url.indexOf('/users') == 0) {
            if( url == '/users' || (url.indexOf('/users/list') == 0) ) {
                if(actions['users']['view']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            } else {
                if(actions['users']['addEditDelete']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            }
        } else if(url.indexOf('/category') == 0) {
            if( url == '/category' || (url.indexOf('/category/list') == 0) ) {
                if(actions['category']['view']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            } else {
                if(actions['category']['addEditDelete']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            }
        } else if(url.indexOf('/manufacturer') == 0) {
            if( url == '/manufacturer' || (url.indexOf('/manufacturer/list') == 0) ) {
                if(actions['manufacturer']['view']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            } else {
                if(actions['manufacturer']['addEditDelete']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            }
        } else if(url.indexOf('/roles') == 0) {
            if( url == '/roles' || (url.indexOf('/roles/list') == 0) ) {
                if(actions['adminRoles']['view']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            } else {
                if(actions['adminRoles']['addEditDelete']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            }
        } else if(url.indexOf('/admin-users') == 0) {
            if( url == '/admin-users' || (url.indexOf('/admin-users/list') == 0) ) {
                if(actions['adminUsers']['view']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            } else {
                if(actions['adminUsers']['addEditDelete']) {
                    return true;
                } else {
                    this.authorizationEror();
                    return false;
                }
            }                       
        } else {
            this.authorizationEror();
            return false;
        }

    }

    authorizationEror() {
        alert("You are not allow to access this page");
    }
}