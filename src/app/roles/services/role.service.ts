import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { CommanService } from '../../shared/services/comman.service';
import tsConstants = require('./../../tsconstant');

@Injectable()
export class RoleService {

    private _host = tsConstants.HOST;
    private _accessToken = '';

    constructor(
        private _http: Http,
        private _commanService: CommanService ) { 
    }

    /*Use to fetch all roles*/
  	getAllRoles(rowsOnPage, activePage, sortTrem , search = '') {

        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();
        
        let url = this._host +'/permission?count='+rowsOnPage+'&page='+activePage+'&sortBy='+sortTrem+'&search='+search;

        headers.append('Authorization', this._accessToken);
		return this._http.get(url, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to add new role*/
    add(role) {

        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();
        
        headers.append('Authorization', this._accessToken);
        return this._http.post(this._host +'/permission', role, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to get role with role id*/
    get(roleID) {
        
        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();
    
        headers.append('Authorization', this._accessToken);
        return this._http.get(this._host +'/permission/'+ roleID, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to update role*/
    update(role) {

        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();

        headers.append('Authorization', this._accessToken);
        return this._http.put(this._host +'/permission/'+ role.id, role, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to Delete role with role id */
    delete( roleID ) {
        
        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();
        
        headers.append('Authorization', this._accessToken );
        return this._http.delete(this._host +'/permission/'+ roleID,  { headers: headers }).map((res:Response) => res.json());
    }

}
