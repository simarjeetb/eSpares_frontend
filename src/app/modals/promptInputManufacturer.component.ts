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

export class PromptInputManufacturerComponent extends DialogComponent<PromptModel, string> implements PromptModel {
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
   
    /*console.log(this.manufacturer);*/
     if(this.manufacturer.name == ''){
         this.nameErrors = 'Name is required.';
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
