import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import tsConstants = require('./../../tsconstant');
@Injectable()
export class LandService {

 private _host = tsConstants.HOST;
 private access_token = {};
 private token = '';
  
  private _accessToken = '';
    constructor(private http: Http, private _cookieService: CookieService) { }

    /**@Description: Land listing method**/
    landlist(rowsOnPage, activePage, sortTerm , search = '') {
        
        let headers = new Headers();        
        let urlSearchParams = new URLSearchParams();
        this._accessToken          = this.getAccessToken();

        headers.append('Authorization', this._accessToken);

        let url = this._host +'/land?count='+rowsOnPage+'&page='+activePage+'&sortBy='+sortTerm+'&search='+search;

        
        //let body = urlSearchParams.toString()
    return this.http.get(url, { headers: headers }).map((res:Response) => res.json())
    }

    /**@Description: land save data method*/
    landadd(land) {
      console.log("inside land add");

        let headers = new Headers();        
        let urlSearchParams = new URLSearchParams();
        this._accessToken          = this.getAccessToken();
        headers.append('Authorization', this._accessToken);
        
    return this.http.post(this._host +'/land', land, { headers: headers }).map((res:Response) => res.json())
    }
    
    /**@Description: land detail info method**/
    getLand(land) {
      
        let headers = new Headers();
        let body = {};
        let urlSearchParams = new URLSearchParams();
        this._accessToken          = this.getAccessToken();

        headers.append('Authorization', this._accessToken);
        
    return this.http.get(this._host +'/land/'+ land, { headers: headers }).map((res:Response) => res.json())
    }

    /**@Description: update land info method**/
    updateLand(land) {

        let body            = {};
        
        let headers         = new Headers();
        let urlSearchParams = new URLSearchParams();
        this._accessToken          = this.getAccessToken();
        
        headers.append('Authorization', this._accessToken);
    return this.http.put(this._host +'/land/'+ land.id, land, { headers: headers }).map((res:Response) => res.json())
    }


    /**@Description: update land info method**/
    deleteLand( landId ) {
        
        let headers         = new Headers();
        let urlSearchParams = new URLSearchParams();
        this._accessToken          = this.getAccessToken();
        
        headers.append('Authorization', this._accessToken );
        return this.http.delete(this._host +'/land/'+ landId,  { headers: headers }).map((res:Response) => res.json());
    }    
    
    /**@Description: get seller user list**/
    getAllUsers() {
          
        let headers         = new Headers();
        let urlSearchParams = new URLSearchParams();
        this._accessToken          = this.getAccessToken();
        headers.append('Authorization', this._accessToken );
        
        return this.http.get(this._host +'/user?roles=U', { headers: headers }).map((res:Response) => res.json());
    }

    /**get category list from category table . this will save as foreign key**/
    getAllCategories() {
          
        let headers         = new Headers();
        let urlSearchParams = new URLSearchParams();

        this._accessToken      = this.getAccessToken();

        headers.append('Authorization', this._accessToken );
        return this.http.get(this._host +'/category?type=lands&sort=name', { headers: headers }).map((res:Response) => res.json());
    }

    getStates() {
        let headers = new Headers();        
        this.token   = this.getAccessToken();
        
        headers.append('Authorization', this.token);
        return this.http.get(this._host +'/states', { headers: headers }).map((res:Response) => res.json())
    }


    /**Check access token which saved in cookie here**/
    getAccessToken(): string {
        let token           = this._cookieService.get('token');
        return 'Bearer ' + token;
    }

}
