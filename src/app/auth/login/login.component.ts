import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import tsConstants = require('./../../tsconstant');


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [LoginService]
})
export class LoginComponent implements OnInit {
    
    public user = {
        grant_type : 'password',
        client_id  : tsConstants.CLIENT_ID
    };

    public errMessage            = '';
    public isPageLoading:boolean = false;
    public rememberMe            = true;
    private _session             = false;

    constructor(private _router : Router, private _loginService: LoginService, private _cookieService: CookieService, private _activateRouter: ActivatedRoute) { 
        this._session = _activateRouter.snapshot.params['data'];
        if(this._session) {
            this.errMessage = 'Your session has expired. Please login again.';
        }
    }

    ngOnInit() {
        if(localStorage.getItem("remember")) {
            this.user["username"] = localStorage.getItem("remember");
        }
    }

  	login() {
        
        this.isPageLoading     = true;
        this.errMessage        = '';        

		this._loginService.login(this.user).subscribe(res => {

            this.isPageLoading = false;
            let token          = res.access_token;
            let actions;
            
            if( res.role_id && res.role_id['permission'] ) {

                actions         = res.role_id['permission'];
                actions['type'] = res.roles            
                /* Setup Cookie */
                this._cookieService.put('token', token );
                this._cookieService.putObject('actions', actions );
                if(this.rememberMe) {
                    localStorage.setItem("remember",this.user["username"]);
                } else {
                     localStorage.removeItem('remember');
                }
                this._router.navigate(['/dashboard']);           
            } else if(res.roles == 'SA') {
                actions = {
                        type:res.roles
                }
                /* Setup Cookie */
                this._cookieService.put('token', token );
                this._cookieService.putObject('actions', actions );
                if(this.rememberMe) {
                    localStorage.setItem("remember",this.user["username"]);
                } else {
                     localStorage.removeItem('remember');
                }
                this._router.navigate(['/dashboard']);           
            } else {
                this.errMessage    = "You are not authorized please contact markit admin.";
            }

        },err => {       
            this.isPageLoading = false;
            this.errMessage    = "Email or Password is not correct.";
        });

	}
}
