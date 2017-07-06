import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminUserService } from '../services/admin-user.service';
import { CookieService } from 'ngx-cookie';
import { CommanService } from '../../shared/services/comman.service';

@Component({
    templateUrl: 'view-admin-user.component.html'
})
export class ViewAdminUserComponent {
	public userID = '';
	public user = {};
    public isLoading = true;
    public addEditDelete = false;

    constructor(
        private _route: ActivatedRoute, 
        private _router : Router,
        private _adminUserService: AdminUserService, 
        private _cookieService: CookieService,
        private _commanService: CommanService ) {

        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['adminUsers']['addEditDelete']) this.addEditDelete = true;

        this.userID = _route.snapshot.params['id'];
  	    this._adminUserService.get(this.userID).subscribe(res => {
            this.isLoading = false;
            if(res.success) {
               this.user = res.data;
            } else {
               this._commanService.checkAccessToken(res.error);
            } 
        },err => {
           this.isLoading = false;
           this._commanService.checkAccessToken(err);
        });
    }

    editUser(userid) {        
        let route = '/admin-users/edit/'+ userid;
        this._router.navigate([route]);       
    }

    removeUser(userid) {
        if(confirm("Do you want to delete?")) {
            this.isLoading = true;
            this._adminUserService.delete(userid).subscribe(res => {
                this.isLoading = false;
                this._router.navigate(['/admin-users/list/']);      
            },err => {
                this.isLoading = false;
            });             
        }
    }

}
