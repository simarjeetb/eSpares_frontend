import { Component } from '@angular/core';
import { LandService } from '../services/land.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewLandImageComponent } from '../../modals/view-image/ViewLandImage.component';
import { CommanService } from '../../shared/services/comman.service';
import { DialogService } from "ng2-bootstrap-modal";
import tsConstants = require('./../../tsconstant');

@Component({
  templateUrl: 'view-land.component.html',
  providers: [LandService]
})
export class ViewLandComponent {

    private _host                  = tsConstants.HOST;
    private Id                     = '';
    private land                   = {};

    public isLoading:boolean       = true;
    public addEditDelete:boolean   = false;

    constructor(
        private _router: Router, 
        private _activatedRouter: ActivatedRoute,  
        private _landService: LandService,
        private _dialogService:DialogService,
        private _commanService: CommanService ) { 
        
        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['lands']['addEditDelete']) this.addEditDelete = true;

        this.Id =  _activatedRouter.snapshot.params['id'];
    
        if( this.Id ) {
            this._landService.getLand(this.Id).subscribe( res => {
                this.isLoading = false;
                if(res.success) {
                    this.land  = res.data;
                } else {
                    this._commanService.checkAccessToken(res.error);
                }
            }, err => {
                this.isLoading = false;                
            });
        }  

  }

   updateLand( ID ) {        
        let route = '/land/update/'+ID;
        this._router.navigate([route]);       
    }

    // Use to View Image Prompt
    viewImage(imageUrl) {
        this._dialogService.addDialog(ViewLandImageComponent, {
          imageUrl:imageUrl
        }).subscribe((res)=>{ });
    }   

 
}
