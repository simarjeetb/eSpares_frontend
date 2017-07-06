import { Component, OnInit } from '@angular/core';
import { ManufacturerService } from '../services/manufacturer.service';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { FlashMessagesService } from 'ngx-flash-messages';
import { CommanService } from '../../shared/services/comman.service';

declare let jsPDF; 

@Component({
  selector: 'app-manufacturers',
  templateUrl: './list-manufacturer.component.html',
  styleUrls: ['./list-manufacturer.component.scss']
})
export class ListManufacturerComponent implements OnInit {

    public data                  = [];
    public totalRecords          = 0;
    public filterQuery           = "";
    public rowsOnPage            = 5;
    public sortBy                = "createdAt";
    public sortOrder             = "desc";
    public activePage            = 1;
    public itemsTotal            = 0;
    public searchTerm            = '';
    public sortTrem              = '';

    public itemsOnPage;    

    public response:any;
    public isLoading:boolean     = false;
    public isPageLoading:boolean = true;
    public addEditDelete:boolean = false;

    public constructor(
        private _router: Router, 
        private _cookieService: CookieService,
        private _commanService: CommanService, 
        private _manufacturerService: ManufacturerService, 
        private _flashMessagesService: FlashMessagesService ) { 

        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['manufacturer']['addEditDelete']) this.addEditDelete = true;
        
    }

    ngOnInit(): void {
        
        this._router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });

        /*set initial sort condition */
        this.sortTrem = this.sortBy + ' ' + this.sortOrder;         

        /*Load data*/
        this.getManufacturer();        
        this.activePage = 1;
        this.getManufacturer();   

        this.itemsOnPage = this.rowsOnPage;
    }

    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

    viewManufacturer(manufacturerID) {
        let route = '/manufacturer/list/' + manufacturerID;
        this._router.navigate([route]);       
    }

    editManufacturer(manufacturerID) {     
        let route = '/manufacturer/edit/'+manufacturerID;
        this._router.navigate([route]);       
    }

     /* Function use to remove Manufacturer with manufacturer id*/
    // removeManufacturer(manufacturerID) {
    //     if(confirm("Do you want to delete?")) {
    //         this.isLoading = true;
    //         this._manufacturerService.delete(manufacturerID).subscribe(res => {
    //             this.response  = res;
    //             this.isLoading = false;  
    //             let start       = (this.activePage * this.rowsOnPage - this.rowsOnPage + 1);
    //             this.itemsTotal = this.itemsTotal - 1;
                
    //             if( ! (this.itemsTotal >= start) ){
    //                this.activePage = this.activePage -1
    //             }
    //             this._cookieService.put('manufacturerAlert', 'Deleted successfully.');
    //             /* reload page. */
    //             this.getManufacturer();
    //         },err => {
    //             this.isLoading = false;
    //         });             
    //     }
    // } 

    /*Get all manufacturer*/
    getManufacturer(): void {   
        this._manufacturerService.getAllManufacturer( this.rowsOnPage, this.activePage, this.sortTrem,  this.searchTerm ).subscribe(res => {
            this.isLoading     = false;
            this.isPageLoading = false;
            if(res.success) {
                this.data          = res.data.manufacturers;
                this.itemsTotal    = res.data.total;
                this.showAlert();
            } else {
                this._commanService.checkAccessToken(res.error);
            }
        },err => {
            this.isLoading     = false;
            this.isPageLoading = false;
       });
    }

    public onPageChange(event) {
        this.isLoading     = true;
        this.rowsOnPage = event.rowsOnPage;
        this.activePage = event.activePage;
        this.getManufacturer();
    }

    public onRowsChange( event ): void {
        this.isLoading  = true;
        this.rowsOnPage = this.itemsOnPage;
        this.activePage = 1;
        this.getManufacturer();      
    }

    public onSortOrder(event) {
        this.sortTrem = this.sortBy+' '+this.sortOrder;
        this.isLoading  = true; 
        this.getManufacturer();
    }

    public search( event, element = 'input' ) {
        if( element == 'input' ) {
            if(event.keyCode == 13 || this.searchTerm == '') {
                this.searchTerm = this.searchTerm.trim();
                this.isLoading  = true;
                this.getManufacturer(); 
                this.activePage = 1;
                this.getManufacturer(); 
            }
        }else{
            this.searchTerm = this.searchTerm.trim();
            this.isLoading  = true;
            this.getManufacturer(); 
            this.activePage = 1;
            this.getManufacturer(); 
        }
    }

    showAlert(): void {

        let alertMessage = this._cookieService.get('manufacturerAlert');
        if( alertMessage ) {
            this._flashMessagesService.show( alertMessage, {
                classes: ['alert', 'alert-success'],
                timeout: 3000,
            });
            this._cookieService.remove('manufacturerAlert');
        }    
    }
}
