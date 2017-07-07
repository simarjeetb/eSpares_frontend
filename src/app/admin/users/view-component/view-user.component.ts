import { Component } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { UserService } from '../services/user.service';
import { CommanService } from '../../shared/services/comman.service';
import { CookieService } from 'ngx-cookie';
@Component({
    templateUrl: 'view-user.component.html'
})
export class ViewUserComponent {
	public userID        = '';
	public user          = {};
    public isLoading     = true;
    public addEditDelete = false

    constructor(
        private _route: ActivatedRoute, 
        private _router : Router,
        private _userService: UserService, 
        private _cookieService: CookieService,
        private _commanService: CommanService  ) { 

        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['users']['addEditDelete']) this.addEditDelete = true;

        this.userID = _route.snapshot.params['id'];
  	    this._userService.get(this.userID).subscribe(res => {
            if(res.success) {
               this.user = res.data;
               this.isLoading = false;
            } else {
               this.checkAccessToken(res.error); 
            } 
        },err => {
           this.isLoading = false
        });
    }

    editUser(userid) {        
        let route = '/users/edit/'+ userid;
        this._router.navigate([route]);       
    }

    removeUser(userid) {
        if(confirm("Do you want to delete?")) {
            this.isLoading = true;
            this._userService.delete(userid).subscribe(res => {
                this.isLoading = false;
                this._router.navigate(['/users/list/']);      
            },err => {
                this.isLoading = false;
            });             
        }
    }

    /*This function is use to remove user session if Access token expired. */
    checkAccessToken( err ): void {
        let code    = err.code;
        let message = err.message;

        if( (code == 401 && message == "authorization")) {
            this._cookieService.removeAll();
            this._router.navigate(['/login', {data: true}]);
        }        
    }
}
