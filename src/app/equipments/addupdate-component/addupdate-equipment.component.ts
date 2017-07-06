import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { PromptEquipmentCategoryComponent } from '../../modals/promptEquipmentCategory.component';
import { PromptEquipmentManufacturerComponent } from '../../modals/promptEquipmentManufacturer.component';
import { ViewEquipmentImageComponent } from '../../modals/view-image/ViewEquipmentImage.component';
import { DialogService } from "ng2-bootstrap-modal";

import { EquipmentService } from '../services/equipment.service';
import { CommanService } from '../../shared/services/comman.service';
import { CookieService } from 'ngx-cookie';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import tsConstants = require('./../../tsconstant');

@Component({
    templateUrl: 'addupdate-equipment.component.html'
})
export class AddUpdateEquipmentComponent {
    @ViewChild('myInput')
    myInputVariable: any;
    private _host = tsConstants.HOST;
    
    public equipment   = {
                            name: '',
                            category_id: '',
                            category: '',
                            companyManufacturer: '',
                            companyManufacturer_id: '',
                            model: '',
                            modelyear: '',                            
                            rentSell: 'rent',
                            rate: '',
                            usage: '',
                            description: '',
                            termsConditions: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
                            quantity: '1',
                            user:'',
                            user_id:'',
                            supply_ablity: 'No',
                            price_unit: 'Hour',
                            city: '',
                            district: '',
                            state: '',
                            pincode: '',
                            supply_area: '',
                            verified: 'No',
                            avalibilityperiodUnits: 'Hour',
                            variety: '',
                            payment_method: 'COD',
                            availableFrom: {},
                            images:[]
                        };


    private allEquipments     = [];
    private category          = [];
    private sellers:any       = [];
    private manufacturers:any = [];
    

    private equipmentID: any;
    private response:any;
    
    private showMessage:boolean = false;
    private isLoading:boolean   = true;

    private action:string = 'Add';

    private currentYear = new Date().getFullYear();
    private years = [];

    private address:any;

    private date: DateModel;
    private options: DatePickerOptions;

    private varieties: any;
    
    private states: any;
    private districts: any;
    
    constructor(
        private _dialogService:DialogService,
        private _router : Router,
        private _activateRouter: ActivatedRoute,
        private _equipmentService: EquipmentService,
        private _commanService: CommanService,
        private changeDetectorRef: ChangeDetectorRef,
        private _cookieService: CookieService) {
        
        this.options = new DatePickerOptions({ format: 'DD/MM/YYYY', autoApply: true});

        this.equipmentID = _activateRouter.snapshot.params['id'];        
        
        if( this.equipmentID ) {
            this._equipmentService.get(this.equipmentID).subscribe( res => { 
                        this.isLoading = false;
                        if(res.success) {
                            this.equipment = res.data; 
                            this.action = 'Edit';                                                     
                        } else {
                            this._commanService.checkAccessToken(res.error);    
                        } 
                    }, 
                    err => { });
        }else{
            this.isLoading = false;
        }

        this._equipmentService.getAllCategories().subscribe( res => { 
            this.category = res.data;
            if( this.action == 'Edit' ){                
                this.setVarieties();                
            }
        }, 
        err => { });
        
        this._equipmentService.getAllUsers().subscribe( res => { 
            this.sellers = res.data.users;              
        }, 
        err => { });

        this._equipmentService.getAllManufactures().subscribe( res => { 
            this.manufacturers = res.data;              
        }, 
        err => { });

        this._equipmentService.getStates().subscribe( res => { 
            this.states = res.data;   
            if( this.action == 'Edit' ){                
                this.setDistrict();
            }           
        }, 
        err => { });        
                 
        /*create years array. */
        this.years.push(this.currentYear);
        for (var i = 1; i <= 50; i++) {
            this.years.push(this.currentYear - i);
        }
    }

    // Show add category Prompt
    showCategoryPrompt() {
        this._dialogService.addDialog(PromptEquipmentCategoryComponent, {
          title:'Add Category',
          type: 'equipments',
      }).subscribe((res)=>{
            //We get dialog result
            if( res ){
                let response = res;   
                this.category.push(response);
                this.setCategoryInSelectBox(response);
            }
        });
    }
    setCategoryInSelectBox(response){
        this.equipment.category_id =  response.id;
        this.setVarieties();
    }


        // Show add PromptEquipmentManufacturerComponent Prompt
    showManufacturerPrompt() {
        this._dialogService.addDialog(PromptEquipmentManufacturerComponent, {
          title:'Add Manufacturer',
          type: 'equipments',
      }).subscribe((res)=>{
            //We get dialog result            
            if( res ){
                let response = res;
                this.manufacturers.push(response);
                this.setInputManufacturer(response);
            }

        });
    }
    setInputManufacturer(argu){
        this.equipment.companyManufacturer_id = argu.id;
    }



    submitEquipment() {
        this.isLoading = true;

        if( this.action == 'Edit' ) {
            this.editEquipment();            
        }else {
           this.addEquipment();
        }
    }

    clearEquipment() {
        this.equipment   = {
                            name: '',
                            category_id: '',
                            category: '',
                            companyManufacturer: '',
                            companyManufacturer_id: '',
                            model: '',
                            modelyear: '',                            
                            rentSell: 'rent',
                            rate: '',
                            usage: '',
                            description: '',
                            termsConditions: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
                            quantity: '1',
                            user:'',
                            user_id:'',
                            supply_ablity: 'yes',
                            price_unit: 'Hour',
                            city: '',
                            district: '',
                            state: '',
                            pincode: '',
                            supply_area: '',
                            verified: 'No',
                            avalibilityperiodUnits: 'Hour',
                            variety: '',
                            payment_method: 'COD',
                            availableFrom: {},
                            images:[]
                        };
    }

    setVarieties( ): void {  
        /* reset values. */
        this.varieties         = null;
        if( this.action !== 'Edit' ){
            this.equipment.variety = null;
            this.equipment.variety = '';
        }
        /* Initialize category. */
        let categoryID = this.equipment.category_id;        
        if( categoryID ){
            this.category.filter(obj => obj.id == categoryID).map( obj => this.varieties = obj.variety)
        }
        
        this.changeDetectorRef.detectChanges();
    }

    setDistrict( ): void {  
        /* reset values. */
        this.districts         = null;
        if( this.action !== 'Edit' ){
            this.equipment.district = null;
            this.equipment.district = '';
        }    

        /* Initialize category. */
        let stateName = this.equipment.state; 


        if( stateName ){
            this.states.filter(obj => obj.stateName == stateName).map( obj => this.districts = obj.districts)
        }
        
        this.changeDetectorRef.detectChanges();
    }

    addEquipment() {
        this.equipment.category            = this.equipment.category_id;
        this.equipment.user                = this.equipment.user_id;
        this.equipment.companyManufacturer = this.equipment.companyManufacturer_id;


        this._equipmentService.add(this.equipment).subscribe(res => {
            this.response    = res;
            this.showMessage = true;
            // this.equipment   = {};
            this._cookieService.put('equipmentAlert', 'Added successfully.');
            this.clearEquipment();
            this._router.navigate(['/equipments/list', {data: "success"} ]);
        },
        err => { });      
    	
    }


    editEquipment() {
        
        this.equipment.category = this.equipment.category_id;
        this.equipment.user     = this.equipment.user_id;
        this.equipment.companyManufacturer = this.equipment.companyManufacturer_id;

        this._equipmentService.update(this.equipment).subscribe(res => {
            this.response    = res;
            this.showMessage = true;
            
            this._cookieService.put('equipmentAlert', 'Updated successfully.');

            this.clearEquipment();            
            this._router.navigate(['/equipments/list', {data: "success"} ]);
        },
        err =>{ }); 
    }   

    closeMessage() {
        this.showMessage = false;
    }

    uploadImage(imageResult: ImageResult) {
        let object = {
            data:imageResult.dataURL,
            type:'equipments'
        }
        this.myInputVariable.nativeElement.value = "";
        // this.isLoading = true;
        this._commanService.uploadImage(object).subscribe( res => {
            // this.isLoading = false;
            if(res.success) {
                this.equipment.images.push(res.data.fullPath);
            }
        },err => { this.isLoading = false; });
    }

    removeImage(image) {
        let index = this.equipment.images.indexOf(image);
        if(index > -1) this.equipment.images.splice(index,1);
    }

    // Use to View Image Prompt
    viewImage(imageUrl) {
        this._dialogService.addDialog(ViewEquipmentImageComponent, {
          imageUrl:imageUrl
        }).subscribe((res)=>{ });
    }
}

