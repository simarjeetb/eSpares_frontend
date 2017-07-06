import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { CategoryService } from '../category/services/category.service';

export interface PromptModel {
  title:string;
  name:string;
  type: string;
}

@Component({
  selector: 'prompt',
  templateUrl: 'prompte.component.html',
  providers:[CategoryService]
})

export class PromptInputCategoryComponent extends DialogComponent<PromptModel, string> implements PromptModel {
  title: string;
  type: string;
  message: string = '';
  nameErr: string = '';
  name: string = '';
  catg: any = { name:'', variety: [] };
  oBj: any = { vname:'' };
  constructor(
    dialogService: DialogService, 
    private _catgService: CategoryService) {
    super(dialogService);
  }

  apply() {
     if(this.catg.name == ''){
         this.nameErr = "Name is required." ;
         return false;
     }


    this.catg.type = this.type;
    this._catgService.add(this.catg).subscribe(res => {

      this.result = res;
      this.close();

    },err => {
      console.log("Server Error!");
        return false
    });

  }

   addEelement(){
     if(!this.oBj.vname){
         this.message = "Variety is required." ;
         return false;
     }
        let index = this.catg.variety.indexOf(this.oBj.vname);

        if(index >=0 ) {
            
           this.message = "Already exists." ;
           return false;            

                } else {

                    this.catg.variety.push(this.oBj.vname);
                    this.oBj.vname = "";
                    this.message = "" ;
                    return true;

                }
    }

    removeEelement(index){
        this.catg.variety.splice(index,1);
    }



}
