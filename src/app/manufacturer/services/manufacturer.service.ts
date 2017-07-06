import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { CommanService } from '../../shared/services/comman.service';
import tsConstants = require('./../../tsconstant');

@Injectable()
export class ManufacturerService {

    private _host = tsConstants.HOST;
    private _accessToken = '';

    constructor(
        private _http: Http,
        private _commanService: CommanService ) { 
    }

    /*Use to fetch all manufacturers*/
  	getAllManufacturer(rowsOnPage, activePage, sortTrem , search = '') {

        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();
        
        let url = this._host +'/allmanufacturer?count='+rowsOnPage+'&page='+activePage+'&sortBy='+sortTrem+'&search='+search;

        headers.append('Authorization', this._accessToken);
		return this._http.get(url, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to add new manufacturer*/
    add(manufacturer) {

        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();
        
        headers.append('Authorization', this._accessToken);
        return this._http.post(this._host +'/manufacturer', manufacturer, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to get manufacturer with manufacturer id*/
    get(manufacturerID) {
        
        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();
    
        headers.append('Authorization', this._accessToken);
        return this._http.get(this._host +'/manufacturer/'+ manufacturerID, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to update manufacturer*/
    update(manufacturer) {

        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();

        headers.append('Authorization', this._accessToken);
        return this._http.put(this._host +'/manufacturer/'+ manufacturer.id, manufacturer, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to Delete manufacturer with manufacturer id */
    delete( manufacturerID ) {
        
        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();
        
        headers.append('Authorization', this._accessToken );
        return this._http.delete(this._host +'/manufacturer/'+ manufacturerID,  { headers: headers }).map((res:Response) => res.json());
    }

}
