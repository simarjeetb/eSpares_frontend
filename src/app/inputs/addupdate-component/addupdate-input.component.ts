import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { InputService } from '../services/input.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { CommanService } from '../../shared/services/comman.service';
import { PromptInputCategoryComponent } from '../../modals/promptInputCategory.component';
import { PromptInputManufacturerComponent } from '../../modals/promptInputManufacturer.component';
import { ViewInputImageComponent } from '../../modals/view-image/viewInputImage.component';
import { DialogService } from "ng2-bootstrap-modal";
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import tsConstants = require('./../../tsconstant');

@Component({
  templateUrl: 'addupdate-input.component.html'
})
export class AddUpdateInputComponent {

    @ViewChild('myInput')
    myInputVariable: any;
    private _host = tsConstants.HOST;

    public input     = {
        categoryID:'',
        manufacturerID:'',
        sellerID:'',
        variety:'',
        terms:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod",
        district:'',
        state:'',
        priceUnit:'grams',
        images:[]
    };
   
    public isLoading       = false;
    public isPageLoading   = true;
    public inputID: any;
    public response:any;
    public categories = [];
    public manufacturers = [];
    public sellers = [];
    private action:string = 'Add';

    public varieties: any;
    public states: any;
    public districts: any;

    constructor(
        private _router : Router,
        private _dialogService:DialogService, 
        private _activateRouter: ActivatedRoute, 
        private _inputService: InputService, 
        private _cookieService: CookieService,
        private _commanService: CommanService,
        private changeDetectorRef: ChangeDetectorRef ) {

        this.inputID = _activateRouter.snapshot.params['id'];        
        
        /*Use to get all users*/        
        this._inputService.getAllUsers().subscribe( res => { 
            if(res.success) {
                this.sellers = res.data.users;
            } 
        }, err => {});
        
        /*Use to get all input Manufactures*/
        this._inputService.getAllManufactures().subscribe( res => { 
            this.manufacturers = res.data; 
        }, err => {});

        /*Use to get all input categories*/
        this._inputService.getAllCategories().subscribe( res => {
            this.categories = res.data; 
             if( this.action == 'Edit' ){                
                this.setVarieties();                
            }
        }, err => {});

        /*Use to get all states*/
        this._inputService.getStates().subscribe( res => { 
            this.states = res.data;   
            if( this.action == 'Edit' ){                
                this.setDistrict();
            }   
        },err => {});

        if( this.inputID ) {
            this._inputService.get(this.inputID).subscribe( res => {
                this.isPageLoading = false;
                if(res.success) {
                    this.input = res.data;
                    this.action = 'Edit';
                    if(res.data.manufacturer && res.data.manufacturer.id) this.input.manufacturerID = res.data.manufacturer.id;
                    if(res.data.user && res.data.user.id ) this.input.sellerID = res.data.user.id;
                    if(res.data.category && res.data.category.id )this.input.categoryID = res.data.category.id;
                } else {
                    this._commanService.checkAccessToken(res.error);
                }
            }, err => {
                this.isPageLoading = false;
                this._commanService.checkAccessToken(err);
            });
        } else {
            this.isPageLoading = false;
        }
    }

        // Show add category Prompt
    showCategoryPrompt() {
        this._dialogService.addDialog(PromptInputCategoryComponent, {
          title:'Add Category',
          type: 'inputs',
      }).subscribe((res)=>{
            //We get dialog result
            if( res ){
                let response = res;   
                this.categories.push(response);
                this.setCategoryInSelectBox(response);
            }
        });
    }
    setCategoryInSelectBox(response){
        
        this.input.categoryID = response.id;
        this.setVarieties();
    }


    // Show add PromptInputManufacturerComponent Prompt
    showPrompt() {
        this._dialogService.addDialog(PromptInputManufacturerComponent, {
          title:'Add Manufacturer',
          type: 'inputs',
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
        this.input.manufacturerID = argu.id;
    }

    /*If inputID exist then will update existing input otherwise will add new input*/
    save() {
        this.isLoading = true;

        if( this.action == 'Edit' ) {
            this.editInput();            
        }else {
           this.addInput();
        }
    }


clearInput() {
    this.input     = {
        categoryID:'',
        manufacturerID:'',
        sellerID:'',
        variety:'',
        terms:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod",
        district:'',
        state:'',
        priceUnit:'grams',
        images:[]
    };
}    


    addInput() {
            this.input["manufacturer"] = this.input["manufacturerID"];
            this.input["category"]     = this.input["categoryID"];
            if(this.input["sellerID"]) this.input["user"] = this.input["sellerID"];
            this._inputService.add(this.input).subscribe(res => {
                this.response          = res;
                this.isLoading         = false;
                this._cookieService.put('inputAlert', 'Added successfully.');
                this.clearInput();
                this._router.navigate(['/inputs/list']);
            },err => {
                this.isLoading = false;
            });
    }


    editInput() {
        
        this.input["manufacturer"] = this.input["manufacturerID"];
            this.input["category"]     = this.input["categoryID"];
            if(this.input["sellerID"]) this.input["user"] = this.input["sellerID"];
            this._inputService.update(this.input).subscribe(res => {
                this.response          = res;
                this.isLoading         = false;
                this._cookieService.put('inputAlert', 'Updated successfully.');
                this.clearInput();      
                this._router.navigate(['/inputs/list']);
            },err => {
                this.isLoading = false;
            })

    } 



    /*Use to set variety get from selected on category*/
    /*setVarieties( ): void {  
       
        this.varieties         = null;
        if( !this.inputID ){
            this.input.variety = null;
            this.input.variety = '';
        }
       
        let categoryID = this.input.category_id;        
        if( categoryID ){
            this.categories.filter(obj => obj.id == categoryID).map( obj => this.varieties = obj.variety)
        }
        
        this.changeDetectorRef.detectChanges();
    }*/

    setVarieties( ): void {  
        /* reset values. */
        this.varieties         = null;
        if( this.action !== 'Edit' ){
            this.input.variety = null;
            this.input.variety = '';
        }
        console.log("category:", this.input.categoryID);
        
        /* Initialize category. */
        let categoryID = this.input.categoryID;        
        if( categoryID ){
            this.categories.filter(obj => obj.id == categoryID).map( obj => this.varieties = obj.variety)
        }
        
        this.changeDetectorRef.detectChanges();
    }


    /*Use to set district based on state name*/
    setDistrict( ): void {  
        /* reset values. */
        this.districts         = null;
        if( !this.inputID ){
            this.input.district = null;
            this.input.district = '';
        }    

        /* Initialize category. */
        let stateName = this.input.state; 

        if( stateName ){
            this.states.filter(obj => obj.stateName == stateName).map( obj => this.districts = obj.districts)
        }
        
        this.changeDetectorRef.detectChanges();
    }

    uploadImage(imageResult: ImageResult) {
        let object = {
            data:imageResult.dataURL,
            type:'inputs'
        }
        this.myInputVariable.nativeElement.value = "";
        this.isLoading = true;
        this._commanService.uploadImage(object).subscribe( res => {
            this.isLoading = false;
            if(res.success) {
                this.input.images.push(res.data.fullPath);
            }
        },err => { this.isLoading = false; });
    }

    removeImage(image) {
        let index = this.input.images.indexOf(image);
        if(index > -1) this.input.images.splice(index,1);
    }

    // Use to View Image Prompt
    viewImage(imageUrl) {
        this._dialogService.addDialog(ViewInputImageComponent, {
          imageUrl:imageUrl
        }).subscribe((res)=>{ });
    }

}
