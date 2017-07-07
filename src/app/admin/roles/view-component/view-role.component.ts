import { Component } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { RoleService } from '../services/role.service';
import { CookieService } from 'ngx-cookie';
import { CommanService } from '../../shared/services/comman.service';

@Component({
  templateUrl: 'view-role.component.html'
})
export class ViewRoleComponent {

	private roleID          = '';
	private role            = {};
    private isLoading       = true;
    private addEditDelete   = false;
    constructor(
        private _router: Router, 
        private _route: ActivatedRoute,
        private _roleService: RoleService, 
        private _cookieService: CookieService,
        private _commanService: CommanService ) { 

        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['adminRoles']['addEditDelete']) this.addEditDelete = true;

      	this.roleID = _route.snapshot.params['id'];
  	    this._roleService.get(this.roleID).subscribe(res => {
            this.isLoading = false;
            if(res.success) {
                this.role = res.data;
            } else {
                this._commanService.checkAccessToken(res.error);
            }
        },err => {
            this.isLoading = false;
        });
    }

    editRole(roleid) {        
        let route = '/roles/edit/'+ roleid;
        this._router.navigate([route]);       
    }

}
