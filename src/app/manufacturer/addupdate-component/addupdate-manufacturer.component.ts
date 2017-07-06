import { Component, ChangeDetectorRef } from '@angular/core';
import { ManufacturerService } from '../services/manufacturer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { CommanService } from '../../shared/services/comman.service';

@Component({
  templateUrl: 'addupdate-manufacturer.component.html'
})
export class AddUpdateManufacturerComponent {
	public manufacturer = {
        name:'',
        description:''
    };

    public isLoading       = false;
    public isPageLoading   = true;
    public manufacturerID:any;

    
    constructor(
        private _router : Router,
        private _activateRouter: ActivatedRoute, 
        private _manufacturerService: ManufacturerService, 
        private _cookieService: CookieService,
        private _commanService: CommanService,  
        private changeDetectorRef: ChangeDetectorRef ) { 
        this.manufacturerID = _activateRouter.snapshot.params['id'];        
        
        if( this.manufacturerID ) {
            this._manufacturerService.get(this.manufacturerID).subscribe(res => {
                this.isPageLoading = false;
                if(res.success) {
                    this.manufacturer = res.data;
                } else {
                    this._commanService.checkAccessToken(res.error);
                }
            },err => {
                this.isPageLoading = false;
            });
        } else {
            this.isPageLoading = false;
        }

    }

     /*If manufacturerID exist then will update existing manufacturer otherwise will add new manufacturer*/
    save() {
        this.isLoading = true;
        if(this.manufacturerID) {
            this._manufacturerService.update(this.manufacturer).subscribe(res => {
                this.isLoading = false;
                this._cookieService.put('manufacturerAlert', 'Updated successfully.');
                this._router.navigate(['/manufacturer/list']);
            },err => {
                this.isLoading = false;
            })
        } else {
      	    this._manufacturerService.add(this.manufacturer).subscribe(res => {
                this.isLoading = false;
                this._cookieService.put('manufacturerAlert', 'Added successfully.');
                this._router.navigate(['/manufacturer/list']);
            },err => {
                this.isLoading = false;
            });
        }
    }

}
