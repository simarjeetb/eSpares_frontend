import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CropService } from '../services/crop.service';
import { CommanService } from '../../shared/services/comman.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { CookieService } from 'ngx-cookie';
import { PromptCropCategoryComponent } from '../../modals/promptCropCategory.component';
import { ViewCropImageComponent } from '../../modals/view-image/viewCropImage.component';
import { DialogService } from "ng2-bootstrap-modal";
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import tsConstants = require('./../../tsconstant');

@Component({
  templateUrl: 'addupdate-crop.component.html'
})
export class AddUpdateCropComponent {
    @ViewChild('myInput')
    myInputVariable: any;
    private _host = tsConstants.HOST;

	public crop = {
        terms:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod",
        category:'',
        variety:'',
        packaging:'',
        paymentPreference:'COD',
        categoryID:'',
        sellerID:'',
        supplyArea:'',
        supplyAbility:'No',
        quantityUnit:'Kg',
        availableUnit : 'Days',
        verified: 'No',
        state:'',
        district:'',
        images:[]
    };

    
    public isLoading       = false;
    public isPageLoading   = true;
    public category        = [];
    public sellers         = [];
    public cropID:any;
    public date: DateModel;
    public options: DatePickerOptions;

    public varieties: any;
    public states: any;
    public districts: any;
    public promptMessage:string = '';
    
   constructor( private _dialogService:DialogService, 
                private _router : Router,
                private _activateRouter: ActivatedRoute, 
                private _cropService: CropService, 
                private _cookieService: CookieService,
                private _commanService: CommanService, 
                private changeDetectorRef: ChangeDetectorRef ) { 

        this.cropID = _activateRouter.snapshot.params['id'];        
        
        if( this.cropID ) {
            this._cropService.get(this.cropID).subscribe(res => {
                this.isPageLoading = false;
                if(res.success) {
                    this.crop = res.data;
                    this.crop.categoryID = res.data.category.id;
                    if(res.data.seller && res.data.seller.id )this.crop.sellerID = res.data.seller.id;
                } else {
                    this._commanService.checkAccessToken(res.error);
                }
            },err => {
                this.isPageLoading = false;
            });
        } else {
            this.isPageLoading = false;
        }
        /*Use to get all Crops categories*/
        this._cropService.getAllCategories().subscribe( res => {
             this.category = res.data; 
            if( this.cropID ) this.setVarieties();
        }, err => {});
        
        /*Use to get all users*/
        this._cropService.getAllUsers().subscribe( res => {
             if(res.success) {this.sellers = res.data.users;} 
        }, err => {});

        /*Use to get all states*/
        this._cropService.getStates().subscribe( res => { 
            this.states = res.data;   
            if( this.cropID ) this.setDistrict();
        },err => {});
        
        this.options = new DatePickerOptions({ format: 'DD/MM/YYYY', autoApply: true});

    }

    // Show add category Prompt
    showPrompt() {
        this._dialogService.addDialog(PromptCropCategoryComponent, {
          title:'Add Category',
          type: 'crops',
      }).subscribe((res)=>{
            //We get dialog result            
            if( res ){
                let response = res;
                /*console.log(this.category);
                console.log(response);*/
                this.category.push(response);
                this.setCategoryInSelectBox(response);
            }

        });
    }
    setCategoryInSelectBox(response){
        this.crop.categoryID =  response.id;
        this.setVarieties();
    }

     /*If cropID exist then will update existing crop otherwise will add new crop*/
    save() {
        this.isLoading = true;
        if(this.crop["supplyAbility"] == "No") {
            this.crop["supplyRange"] = null;
        }
        if(this.cropID) {
            this.crop["category"] = this.crop["categoryID"];
            if(this.crop["sellerID"]) this.crop["seller"] = this.crop["sellerID"];
            this._cropService.update(this.crop).subscribe(res => {
                this.isLoading = false;
                this._cookieService.put('cropAlert', 'Updated successfully.');
                this._router.navigate(['/crops/list']);
            },err => {
                this.isLoading = false;
            })
        } else {
            this.crop["category"] = this.crop["categoryID"];
            if(this.crop["sellerID"]) this.crop["seller"] = this.crop["sellerID"];
      	    this._cropService.add(this.crop).subscribe(res => {
                this.isLoading = false;
                this._cookieService.put('cropAlert', 'Added successfully.');
                this._router.navigate(['/crops/list']);
            },err => {
                this.isLoading = false;
            });
        }
    }

    /*Use to set variety get from selected on category*/
    setVarieties( ): void {  
        /* reset values. */
        this.varieties         = null;
        if( !this.cropID ){
            this.crop.variety = null;
            this.crop.variety = '';
        }
        /* Initialize category. */
        let categoryID = this.crop.categoryID;        
        if( categoryID ){
            this.category.filter(obj => obj.id == categoryID).map( obj => this.varieties = obj.variety)
        }
        
        this.changeDetectorRef.detectChanges();
    }

    /*Use to set district based on state name*/
    setDistrict( ): void {  
        /* reset values. */
        this.districts         = null;
        if( !this.cropID ){
            this.crop.district = null;
            this.crop.district = '';
        }    

        /* Initialize category. */
        let stateName = this.crop.state; 

        if( stateName ){
            this.states.filter(obj => obj.stateName == stateName).map( obj => this.districts = obj.districts)
        }
        
        this.changeDetectorRef.detectChanges();
    }

    uploadImage(imageResult: ImageResult) {
        let object = {
            data:imageResult.dataURL,
            type:'crops'
        }
        this.myInputVariable.nativeElement.value = "";
        this.isLoading = true;
        this._commanService.uploadImage(object).subscribe( res => {
            this.isLoading = false;
            if(res.success) {
                this.crop.images.push(res.data.fullPath);
            }
        },err => { this.isLoading = false; });
    }

    removeImage(image) {
        let index = this.crop.images.indexOf(image);
        if(index > -1) this.crop.images.splice(index,1);
    }

    // Use to View Image Prompt
    viewImage(imageUrl) {
        this._dialogService.addDialog(ViewCropImageComponent, {
          imageUrl:imageUrl
        }).subscribe((res)=>{ });
    }
}
