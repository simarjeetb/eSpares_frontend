import { Component, ChangeDetectorRef } from '@angular/core';
import { AdminUserService } from '../services/admin-user.service';
import { CommanService } from '../../shared/services/comman.service';
import { Router,ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { FlashMessagesService } from 'ngx-flash-messages'

@Component({
  templateUrl: 'addupdate-admin-user.component.html'
})
export class AddUpdateAdminUserComponent {
	
    public user = {
        district:'',
        state:'',
        roles:'A',
        roleId:'',
        roleID:''
    };
    public roles           = [];
    public isLoading       = false;
    public isPageLoading   = true;
    public userID:any;
    public states: any;
    // public districts: any;
    public errMessage      = '';

    constructor(
        private _router : Router, 
        private _activateRouter: ActivatedRoute, 
        private _adminUserService: AdminUserService,
        private _cookieService: CookieService,
        private _commanService: CommanService, 
        private _changeDetectorRef: ChangeDetectorRef, 
        private _flashMessagesService: FlashMessagesService  ) { 
        this.userID = _activateRouter.snapshot.params['id'];        

        if( this.userID ) {
            this._adminUserService.get(this.userID).subscribe(res => {
                this.isPageLoading = false;
                if(res.success) {
                    this.user = res.data;
                } else {
                    this._commanService.checkAccessToken(res.error);
                }
            },err => {
                this.isPageLoading = false;
                this._commanService.checkAccessToken(err);
            });
        } else {
            this.isPageLoading = false;
        }
        
        /*Use to get all states*/
        this._adminUserService.getStates().subscribe( res => { 
            this.states = res.data;   
            // if( this.userID ) this.setDistrict();
        },err => {});

        /*Use to get all roles*/
        this._adminUserService.getRoles().subscribe( res => { 
            console.log("all roles",res);
            this.roles = res.data;
        },err => {});
    } 

    /*If useID exist then will update existing user otherwise will add new user*/
    save() {
        this.isLoading = true;
        if(this.userID) {
            this.user["username"] = this.user["email"];
            this.user["roleId"] = this.user["roleID"];
            this._adminUserService.update(this.user).subscribe(res => {
                this.isLoading = false;
                if(res.success) {                    
                    this._cookieService.put('userAlert', 'Updated successfully.');
                    this._router.navigate(['/admin-users/list']);
                } else {
                    this._commanService.checkAccessToken(res.error);
                }
            },err => {
                this.isLoading = false;
                this._commanService.checkAccessToken(err);
            })
        } else {
            this.user["username"] = this.user["email"];
            this.user["roleId"] = this.user["roleID"];
            this._adminUserService.add(this.user).subscribe(res => {
                this.isLoading = false;
                if(res.success) {
                    this._cookieService.put('userAlert', 'Added successfully.');
                    this._router.navigate(['/admin-users/list']);
                } else {
                     window.scrollTo(0, 0);
                    this.errMessage = res.error.message;
                    this.showAlert();
                }
            },err => {
                this.isLoading = false;
            });
        }
    }

    /*Use to set district based on state name*/
    // setDistrict( ): void {  
    //     /* reset values. */
    //     this.districts         = null;
    //     if( !this.userID ){
    //         this.user.district = null;
    //         this.user.district = '';
    //     }    

    //     /* Initialize category. */
    //     let stateName = this.user.state; 

    //     if( stateName ){
    //         this.states.filter(obj => obj.stateName == stateName).map( obj => this.districts = obj.districts)
    //     }
        
    //     this._changeDetectorRef.detectChanges();
    // }

    showAlert(): void {

            this._flashMessagesService.show( this.errMessage, {
                classes: ['alert', 'alert-danger'],
                timeout: 3000,
            });
    } 
}
