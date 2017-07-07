import { Component, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router,ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { FlashMessagesService } from 'ngx-flash-messages'

@Component({
  templateUrl: 'addupdate-user.component.html'
})
export class AddUpdateUserComponent {
	
    public user = {
        district:'',
        state:''
    };
    public isLoading       = false;
    public isPageLoading   = true;
    public userID:any;
    public states: any;
    public districts: any;
    public errMessage      = '';

    constructor(private _router : Router, private _activateRouter: ActivatedRoute, private _userService: UserService, private _cookieService: CookieService, private changeDetectorRef: ChangeDetectorRef, private _flashMessagesService: FlashMessagesService  ) { 
        this.userID = _activateRouter.snapshot.params['id'];        

        if( this.userID ) {
            this._userService.get(this.userID).subscribe(res => {
                if(res.success) {
                    this.user = res.data;
                    this.isPageLoading = false;
                } else {
                    this.checkAccessToken(res.error);
                }
            },err => {
                this.isPageLoading = false;
            });
        } else {
            this.isPageLoading = false;
        }
        
        /*Use to get all states*/
        this._userService.getStates().subscribe( res => { 
            this.states = res.data;   
            if( this.userID ) this.setDistrict();
        },err => {});
    } 

    /*If useID exist then will update existing user otherwise will add new user*/
    save() {
        this.isLoading = true;
        if(this.userID) {
            this.user["username"] = this.user["email"];
            this._userService.update(this.user).subscribe(res => {
                if(res.success) {                    
                    this.isLoading = false;
                    this._cookieService.put('userAlert', 'Updated successfully.');
                    this._router.navigate(['/users/list']);
                } else {
                    this.checkAccessToken(res.error);
                }
            },err => {
                this.isLoading = false;
            })
        } else {
            this.user["username"] = this.user["email"];
            this._userService.add(this.user).subscribe(res => {
                this.isLoading = false;
                if(res.success) {
                    this._cookieService.put('userAlert', 'Added successfully.');
                    this._router.navigate(['/users/list']);
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
    setDistrict( ): void {  
        /* reset values. */
        this.districts         = null;
        if( !this.userID ){
            this.user.district = null;
            this.user.district = '';
        }    

        /* Initialize category. */
        let stateName = this.user.state; 

        if( stateName ){
            this.states.filter(obj => obj.stateName == stateName).map( obj => this.districts = obj.districts)
        }
        
        this.changeDetectorRef.detectChanges();
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

    showAlert(): void {

            this._flashMessagesService.show( this.errMessage, {
                classes: ['alert', 'alert-danger'],
                timeout: 3000,
            });
    } 
}
