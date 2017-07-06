import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { CommanService } from '../../shared/services/comman.service';
import tsConstants = require('./../../tsconstant');
@Injectable()
export class CropService {

    private _host = tsConstants.HOST;
    private _accessToken = '';

    constructor(
        private _http: Http,
        private _commanService: CommanService ) { 
    }

    /*Use to fetch all crops*/
  	getAllCrops(rowsOnPage, activePage, sortTrem , search = '') {

        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();
        
        let url = this._host +'/crops?count='+rowsOnPage+'&page='+activePage+'&sortBy='+sortTrem+'&search='+search;

        headers.append('Authorization', this._accessToken);
		return this._http.get(url, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to add new crop*/
    add(crop) {

        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();
        
        headers.append('Authorization', this._accessToken);
        return this._http.post(this._host +'/crops', crop, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to get crop with crop id*/
    get(cropID) {
        
        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();
    
        headers.append('Authorization', this._accessToken);
        return this._http.get(this._host +'/crops/'+ cropID, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to update crop*/
    update(crop) {

        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();

        headers.append('Authorization', this._accessToken);
        return this._http.put(this._host +'/crops/'+ crop.id, crop, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to Delete crop with crop id */
    delete( cropID ) {
        
        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();
        
        headers.append('Authorization', this._accessToken );
        return this._http.delete(this._host +'/crops/'+ cropID,  { headers: headers }).map((res:Response) => res.json());
    }

    /*Use to fetch all categories*/
    getAllCategories() {
          
        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();

        headers.append('Authorization', this._accessToken );
        return this._http.get(this._host +'/category?type=crops&sort=name', { headers: headers }).map((res:Response) => res.json());
    }

    /*Use to fetch all Users*/
    getAllUsers() {
          
        let headers         = new Headers();
        this._accessToken   = this._commanService.getAccessToken();

        headers.append('Authorization', this._accessToken );
        return this._http.get(this._host +'/user?roles=U', { headers: headers }).map((res:Response) => res.json());
    }

    /*Use to fetch all States*/
    getStates() {
        let headers = new Headers();        
        this._accessToken   = this._commanService.getAccessToken();
        
        headers.append('Authorization', this._accessToken);
        return this._http.get(this._host +'/states?sort=stateName', { headers: headers }).map((res:Response) => res.json())
    }

}
