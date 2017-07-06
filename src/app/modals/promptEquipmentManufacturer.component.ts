import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { ManufacturerService } from '../manufacturer/services/manufacturer.service';

export interface PromptModel {
  title:string;
  type: string;
}

@Component({
  selector: 'prompt',
  templateUrl: 'prompteManufacturer.component.html',
  providers:[ManufacturerService]
})

export class PromptEquipmentManufacturerComponent extends DialogComponent<PromptModel, string> implements PromptModel {
   title: string;
  type: string;
  nameErrors: string = '';
  emailErrors: string = '';
  mobileErrors: string = '';
  manufacturer: any = {
        name:'',
        description:''
    };

  constructor(
    dialogService: DialogService, 
    private _manufacturerService: ManufacturerService) {
    super(dialogService);
  }

  apply() {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var mobRegex = /^(\+91-|\+91|0)?\d{10}$/;
    /*console.log(this.manufacturer);*/
     if(this.manufacturer.name == ''){
         this.nameErrors = 'Name is required.';
         return false;
     }
     else if( this.manufacturer.email == '' && !emailRegex.test(this.manufacturer.email) ){
         this.emailErrors = 'Email is not valid.';
         return false;
     }
     else if( this.manufacturer.mobile == '' && !mobRegex.test(this.manufacturer.mobile) ){
         this.mobileErrors = 'Mobile is Required';   
         return false;
     }

    this._manufacturerService.add(this.manufacturer).subscribe(res => {
      
        this.result = res;
        this.close();  
            
    },err => {
      console.log("Server Error!");
       console.log(JSON.parse(err._body));
       var errBody = JSON.parse(err._body);
        if(errBody.invalidAttributes.email){
          this.emailErrors = 'Email is not valid.';  
        }
        if(errBody.invalidAttributes.mobile){
           this.mobileErrors = 'Mobile is not vaild';
        }
        return false;
    });

  }


}
