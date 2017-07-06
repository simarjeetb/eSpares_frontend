import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { CommanService } from '../../shared/services/comman.service';
import tsConstants = require('./../../tsconstant');

@Injectable()
export class EquipmentService {

    private _host = tsConstants.HOST;
    private _accessToken = '';

  	constructor(
        private _http: Http,
        private _commanService: CommanService ) { 
    }
  	
  	getAllEquipments( rowsOnPage, activePage, sortTrem , search = '',) {
  		
        let headers         = new Headers();
        this._accessToken          = this._commanService.getAccessToken();
        
        let url = this._host +'/equipment?count='+rowsOnPage+'&page='+activePage+'&sortBy='+sortTrem+'&search='+search;;

        headers.append('Authorization', this._accessToken );
		return this._http.get( url, { headers: headers }).map((res:Response) => res.json());
  	}

  	add( equipment ) {

      	let headers         = new Headers();
        this._accessToken          = this._commanService.getAccessToken();
        
        headers.append('Authorization', this._accessToken );
    	return this._http.post(this._host +'/equipment', equipment, { headers: headers }).map((res:Response) => res.json());
    }

    /** get a single Equipment by ID **/
    get( equipmentID ) {

        let headers         = new Headers();
        this._accessToken          = this._commanService.getAccessToken();
        
        headers.append('Authorization', this._accessToken );
        return this._http.get( this._host +'/equipment/' + equipmentID, { headers: headers }).map((res:Response) => res.json());
    }

    /** update equipment **/
    update(equipment) {
        
        let headers         = new Headers();
        this._accessToken          = this._commanService.getAccessToken();
        
        headers.append('Authorization', this._accessToken );
        return this._http.put(this._host +'/equipment/'+ equipment.id, equipment, { headers: headers }).map((res:Response) => res.json());
    }

    /** DeleteID equipment by ID **/
    delete( equipmentID ) {
        
        let headers         = new Headers();
        this._accessToken          = this._commanService.getAccessToken();
        
        headers.append('Authorization', this._accessToken );
        return this._http.delete(this._host +'/equipment/'+ equipmentID,  { headers: headers }).map((res:Response) => res.json());
    }
   

   /*Use to fetch all categories*/
    getAllCategories() {
          
        let headers         = new Headers();
        this._accessToken          = this._commanService.getAccessToken();

        headers.append('Authorization', this._accessToken );
        return this._http.get(this._host +'/category?type=equipments&sort=name', { headers: headers }).map((res:Response) => res.json());
    }

    /*Use to fetch all Users*/
    getAllUsers() {
          
        let headers         = new Headers();
        this._accessToken          = this._commanService.getAccessToken();

        headers.append('Authorization', this._accessToken );
        return this._http.get(this._host +'/user?roles=U', { headers: headers }).map((res:Response) => res.json());
    }

    /*Use to fetch all Manufactures*/
    getAllManufactures() {
          
        let headers = new Headers();        
        this._accessToken   = this._commanService.getAccessToken();
        
        headers.append('Authorization', this._accessToken);
        return this._http.get(this._host +'/manufacturer?sort=name', { headers: headers }).map((res:Response) => res.json())
    }

    getStates() {
        let headers = new Headers();        
        this._accessToken   = this._commanService.getAccessToken();
        
        headers.append('Authorization', this._accessToken);        
        return this._http.get(this._host +'/states?sort=stateName', { headers: headers }).map((res:Response) => res.json())
    }

}/*end class*/
