import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import tsConstants = require('./../../tsconstant');

@Injectable()
export class CommanService {

    private _host = tsConstants.HOST;
    private _accessToken = '';

  	constructor(  
        private _http: Http, 
        private _router: Router,
        private _cookieService: CookieService ) { 
    }

    /*This function is use to remove user session if Access token expired. */
  	checkAccessToken( err ): void {
        let code    = err.code;
        let message = err.message;

        if( (code == 401 && message == "authorization")) {
            this._cookieService.removeAll();
            this._router.navigate(['/login', {data: true}]);
        }else {
            
        }      
    }
    
    /*This function is use to get access token from cookie. */
    getAccessToken(): string {
        let token           = this._cookieService.get('token');
        return 'Bearer ' + token;
    }

    /*This function is use to get Roles from cookie. */
    getActions(): object {
        let actions         = this._cookieService.getObject('actions');
        return actions;
    }

    /*Use to add new image*/
    uploadImage(object) {

        let headers         = new Headers();
        this._accessToken   = this.getAccessToken();
        
        headers.append('Authorization', this._accessToken);
        return this._http.post(this._host +'/upload', object, { headers: headers }).map((res:Response) => res.json())
    }
}
