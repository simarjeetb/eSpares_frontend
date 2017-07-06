import { Component,ViewChild } from '@angular/core';
import { LandService } from '../services/land.service';
import { CommanService } from '../../shared/services/comman.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { CookieService } from 'ngx-cookie';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { ViewLandImageComponent } from '../../modals/view-image/ViewLandImage.component';
import { DialogService } from "ng2-bootstrap-modal";
import tsConstants = require('./../../tsconstant');

@Component({
  templateUrl: 'add-land.component.html',
  providers: [LandService]

})
export class AddLandComponent {
    
    @ViewChild('myInput')
    myInputVariable: any;
    private _host = tsConstants.HOST;

	private land = {
        rentSell: 'Lease',
        unit:'Ft',
        categoryId:'',
        location:'',
        sellerId:'',
        city: '',
        district: '',
        state: '',
        pincode: '',        
        periodsunit:'Day',
        verified: 'No',
        priceunit:'Day',
        term_condition:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod",
        images:[]
    };
    private sellers = [];
    private category = [];
    private years = [];
    private Id: any;
    private response:any;
        private address:any;

    private states: any;
    private districts: any;
    public options: DatePickerOptions;
    private isLoading:boolean   = true;
    
    private currentYear = new Date().getFullYear();
    private showMessage:boolean = false;
    private action:string = 'Add';
    
    constructor(
        private _router : Router,  
        private _activateRouter: ActivatedRoute, 
        private _landService: LandService,
        private _commanService: CommanService, 
        private _cookieService: CookieService,
        private _dialogService:DialogService ) {

        this.options = new DatePickerOptions({ format: 'DD/MM/YYYY', autoApply: true});                
        
        this.Id = _activateRouter.snapshot.params['id'];        

        if( this.Id ) {
            this._landService.getLand(this.Id).subscribe( res => { 
                 this.isLoading = false;
              if(res.success) {
                this.land = res.data; 
                this.action = 'Edit'
                this.land.sellerId = res.data.user.id;
                this.land.categoryId = res.data.categoryId;

                  } else {
                    this.checkAccessToken(res.error);    
                  } 
              }, err => {
                 this.checkAccessToken(err);    
              });
        }else{
             this.isLoading = false;
        }
        this._landService.getAllCategories().subscribe( res => { this.category = res.data; }, err => { this.checkAccessToken(err); });
        this._landService.getAllUsers().subscribe( res => { this.sellers = res.data.users; }, err => { this.checkAccessToken(err); });

        this._landService.getStates().subscribe( res => { 
            this.states = res.data;   
            if( this.action == 'Edit' ){                
                this.setDistrict();
            }           
        }, 
        err => {
            this.checkAccessToken(err);     
        });        
                 
        /*create years array. */
        this.years.push(this.currentYear);
        for (var i = 1; i <= 50; i++) {
            this.years.push(this.currentYear - i);
        }

    }

    submitLand() {
        this.isLoading = true;
        if( this.action == 'Edit' ) {
            this.updateLand();            
        }else {
           this.addLand();
        }
    }

    addLand() {
        if(this.land["sellerId"]) this.land["user"] = this.land["sellerId"];
        if(this.land["categoryId"]) this.land["category"] = this.land["categoryId"];

        this._landService.landadd(this.land).subscribe(res => {
            this.response    = res;
            this.showMessage = true;
            this._cookieService.put('landAlert', 'Added Successfully.');
            this._router.navigate(['/land/list', {data: "success"} ]);
        });      
      
    }


    updateLand() {
        if(this.land["sellerId"]) this.land["user"] = this.land["sellerId"];
        if(this.land["categoryId"]) this.land["category"] = this.land["categoryId"];
        this._landService.updateLand(this.land).subscribe(res => {
            this.response    = res;
            this.showMessage = true;
            this._cookieService.put('landAlert', 'Updated Successfully.');
            this._router.navigate(['/land/list', {data: "success"} ]);
        }); 
    }

    setDistrict( ): void {  
        /* reset values. */
        this.districts         = null;
        if( this.action !== 'Edit' ){
            this.land.district = null;
            this.land.district = '';
        }    

        /* Initialize category. */
        let stateName = this.land.state; 


        if( stateName ){
            this.states.filter(obj => obj.stateName == stateName).map( obj => this.districts = obj.districts)
        }
        
    }


    closeMessage() {
        this.showMessage = false;
    } 

    checkAccessToken( err ): void {
        let code    = err.code;
        let message = err.message;

        if( (code == 401 && message == "authorization")) {
            this._cookieService.removeAll();
            this._router.navigate(['/login', {data: true}]);
        }else {
        }      
    }

    uploadImage(imageResult: ImageResult) {
        let object = {
            data:imageResult.dataURL,
            type:'lands'
        }
        this.myInputVariable.nativeElement.value = "";
        this.isLoading = true;
        this._commanService.uploadImage(object).subscribe( res => {
            this.isLoading = false;
            if(res.success) {
                this.land.images.push(res.data.fullPath);
            }
        },err => { this.isLoading = false; });
    }

    removeImage(image) {
        let index = this.land.images.indexOf(image);
        if(index > -1) this.land.images.splice(index,1);
    }

    // Use to View Image Prompt
    viewImage(imageUrl) {
        this._dialogService.addDialog(ViewLandImageComponent, {
          imageUrl:imageUrl
        }).subscribe((res)=>{ });
    }
}
