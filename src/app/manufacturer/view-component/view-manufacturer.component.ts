import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ManufacturerService } from '../services/manufacturer.service';
import { CommanService } from '../../shared/services/comman.service';
@Component({
  templateUrl: 'view-manufacturer.component.html'
})
export class ViewManufacturerComponent {

	private manufacturerID      = '';
	private manufacturer        = {};
    private isLoading           = true;
    private addEditDelete       = false;

    constructor(
        private _router: Router, 
        private _route: ActivatedRoute,
        private _manufacturerService: ManufacturerService, 
        private _commanService: CommanService ) { 

        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['manufacturer']['addEditDelete']) this.addEditDelete = true;

      	this.manufacturerID = _route.snapshot.params['id'];
  	    this._manufacturerService.get(this.manufacturerID).subscribe(res => {
            this.isLoading = false;
            if(res.success) {
                this.manufacturer = res.data;
            } else {
                this._commanService.checkAccessToken(res.error);
            }
        },err => {
            this.isLoading = false;
        });
    }

    editManufacturer(manufacturerid) {        
        let route = '/manufacturer/edit/'+ manufacturerid;
        this._router.navigate([route]);       
    }

}
