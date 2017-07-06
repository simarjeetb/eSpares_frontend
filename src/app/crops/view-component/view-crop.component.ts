import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CropService } from '../services/crop.service';
import { CommanService } from '../../shared/services/comman.service';
import { CookieService } from 'ngx-cookie';
import { DialogService } from "ng2-bootstrap-modal";
import { ViewCropImageComponent } from '../../modals/view-image/viewCropImage.component';
import tsConstants = require('./../../tsconstant');

@Component({
  templateUrl: 'view-crop.component.html'
})
export class ViewCropComponent {

    private _host = tsConstants.HOST;

	public cropID      = '';
	public crop        = {};
    public isLoading   = true;
    public addEditDelete:boolean = false;

    constructor(
        private _router: Router, 
        private _route: ActivatedRoute,
        private _cropService: CropService,
        private _commanService: CommanService,
        private _dialogService: DialogService ) { 

        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['crops']['addEditDelete']) this.addEditDelete = true;

      	this.cropID = _route.snapshot.params['id'];
  	    this._cropService.get(this.cropID).subscribe(res => {
            this.isLoading = false;
            if(res.success) {
                this.crop = res.data;
            } else {
                this._commanService.checkAccessToken(res.error);
            }
        },err => {
            this.isLoading = false;
        });

    }

    editCrop(cropid) {        
        let route = '/crops/edit/'+ cropid;
        this._router.navigate([route]);       
    }

    // Use to View Image Prompt
    viewImage(imageUrl) {
        this._dialogService.addDialog(ViewCropImageComponent, {
          imageUrl:imageUrl
      }).subscribe((res)=>{ });
    }
}
