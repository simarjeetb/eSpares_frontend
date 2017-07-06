import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

export interface PromptModel {
  imageUrl:string;
}

@Component({
  selector: 'view-image',
  templateUrl: 'viewImage.component.html'
})

export class ViewInputImageComponent extends DialogComponent<PromptModel, string> implements PromptModel {
  imageUrl: string;
  
  constructor(
    dialogService: DialogService ) {
    super(dialogService);
  }

}
