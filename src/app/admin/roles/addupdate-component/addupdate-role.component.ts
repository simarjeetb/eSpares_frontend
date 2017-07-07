import { Component, ChangeDetectorRef } from '@angular/core';
import { RoleService } from '../services/role.service';
import { CommanService } from '../../shared/services/comman.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Component({
  templateUrl: 'addupdate-role.component.html'
})
export class AddUpdateRoleComponent {
	public role = {
        name:'',
        description:'',
        permission:{
            crops:{
                view:false,
                addEditDelete:false
            },
            inputs:{
                view:false,
                addEditDelete:false
            },
            equipments:{
                view:false,
                addEditDelete:false
            },
            lands:{
                view:false,
                addEditDelete:false
            },
            users:{
                view:false,
                addEditDelete:false
            },
            category:{
                view:false,
                addEditDelete:false
            },
            manufacturer:{
                view:false,
                addEditDelete:false
            },
            adminUsers:{
                view:false,
                addEditDelete:false
            },
            adminRoles:{
                view:false,
                addEditDelete:false
            }      
        }, 
        isDeleted:false
    };

    public isLoading       = false;
    public isPageLoading   = true;

    public roleID:any;

    constructor(private _router : Router,
        private _activateRouter: ActivatedRoute, 
        private _roleService: RoleService, 
        private _cookieService: CookieService,
        private _commanService: CommanService, 
        private changeDetectorRef: ChangeDetectorRef ) { 
        this.roleID = _activateRouter.snapshot.params['id'];        
        
        if( this.roleID ) {
            this._roleService.get(this.roleID).subscribe(res => {
                this.isPageLoading = false;
                if(res.success) {
                    this.role = res.data
                } else {
                    this._commanService.checkAccessToken(res.error);
                }
            },err => {
                this.isPageLoading = false;
            });
        } else {
            this.isPageLoading = false;
        }
    }

     /*If roleID exist then will update existing role otherwise will add new role*/
    save() {
        this.isLoading = true;
        if(this.roleID) {
            this._roleService.update(this.role).subscribe(res => {
                this.isLoading = false;
                this._cookieService.put('roleAlert', 'Updated successfully.');
                this._router.navigate(['/roles/list']);
            },err => {
                this.isLoading = false;
            })
        } else {
      	    this._roleService.add(this.role).subscribe(res => {
                this.isLoading = false;
                this._cookieService.put('roleAlert', 'Added successfully.');
                this._router.navigate(['/roles/list']);
            },err => {
                this.isLoading = false;
            });
        }
    }

    autoUpdateRole(key) {
        if(!this.role.permission[key].view && this.role.permission[key].addEditDelete) {
            this.role.permission[key].addEditDelete = false
        }
    }

}
