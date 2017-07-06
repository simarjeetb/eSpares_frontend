import { Component } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import { EquipmentService } from '../services/equipment.service';
import { CommanService } from '../../shared/services/comman.service';
import { CookieService } from 'ngx-cookie';
import { ViewEquipmentImageComponent } from '../../modals/view-image/ViewEquipmentImage.component';
import { DialogService } from "ng2-bootstrap-modal";
import tsConstants = require('./../../tsconstant');

@Component({
  templateUrl: 'view-equipment.component.html'
})
export class ViewEquipmentComponent {

    private _host = tsConstants.HOST;
    private equipmentID    = '';
    private equipment      = {};
    private copy_equipment = {};
    private edit           = false;

    private isLoading:boolean = true;
    private addEditDelete:boolean = false;

    constructor(
        private _router: Router, 
        private _activatedRouter: ActivatedRoute, 
        private _equipmentService: EquipmentService, 
        private _cookieService: CookieService,
        private _commanService: CommanService,
        private _dialogService: DialogService ) {     	
        
        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['equipments']['addEditDelete']) this.addEditDelete = true;
        this.equipmentID = _activatedRouter.snapshot.params['id'];
        if( this.equipmentID ) {
            this._equipmentService.get(this.equipmentID).subscribe( res => { 
                this.isLoading = false;
                if( res.success  ){
                    this.equipment = res.data;  
                }else{
                    this._commanService.checkAccessToken(res.error);    
                }
            }, 
            err => {
                this.isLoading = false;
            });
        }    
    }

    editEquipment( equipmentID ) {        
        let route = '/equipments/edit/'+equipmentID;
        this._router.navigate([route]);       
    }   

    // Use to View Image Prompt
    viewImage(imageUrl) {
        this._dialogService.addDialog(ViewEquipmentImageComponent, {
          imageUrl:imageUrl
        }).subscribe((res)=>{ });
    }
}
