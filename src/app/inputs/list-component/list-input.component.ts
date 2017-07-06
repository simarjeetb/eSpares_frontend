import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { InputService } from '../services/input.service';
import { CommanService } from '../../shared/services/comman.service';
import { CookieService } from 'ngx-cookie';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { FlashMessagesService } from 'ngx-flash-messages';
import tsConstants = require('./../../tsconstant');

declare let jsPDF; 

@Component({
  selector: 'app-inputs',
  templateUrl: './list-input.component.html',
  styleUrls: ['./list-input.component.scss']
})
export class ListInputComponent implements OnInit {

    private _host = tsConstants.HOST;
    
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
        private _inputService: InputService,
        private _cookieService: CookieService,
        private _flashMessagesService: FlashMessagesService,
        private _commanService: CommanService ) { 

        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['inputs']['addEditDelete']) this.addEditDelete = true;
        
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
        this.getInputs();        
        this.activePage = 1;
        this.getInputs();
        
        this.itemsOnPage = this.rowsOnPage;
    }

    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

    viewInput(inputID) {
       let route = '/inputs/list/'+inputID;
       this._router.navigate([route]);       
    }

    editInput(inputID) {     
       let route = '/inputs/edit/'+inputID;
        this._router.navigate([route]);       
    }

    /* Function use to remove Crop with crop id*/ 
    removeInput( inputID ) {
        if(confirm("Do you want to delete?")) {
            this.isLoading = true;
            this._inputService.delete(inputID).subscribe(res => {
                this.response  = res;
                this.isLoading = false;  
                let start       = (this.activePage * this.rowsOnPage - this.rowsOnPage + 1);
                this.itemsTotal = this.itemsTotal - 1;
                
                if( ! (this.itemsTotal >= start) ){
                   this.activePage = this.activePage -1
                }
                this._cookieService.put('inputAlert', 'Deleted successfully.');
                /* reload page. */
                this.getInputs();     
            },err => {
                this.isLoading = false;
            });  
        }
    } 

    /*Function use to remove deleted crop from list*/ 
    removeByAttr(arr, attr, value){
        let i = arr.length;
        while(i--){
           if( arr[i] 
               && arr[i].hasOwnProperty(attr) 
               && (arguments.length > 2 && arr[i][attr] === value ) ){ 

               arr.splice(i,1);

           }
        }
        return arr;
    }

    /*Get all Users */
    getInputs(): void {
        this._inputService.getAllInputs( this.rowsOnPage, this.activePage, this.sortTrem,  this.searchTerm ).subscribe(res => {
            this.isLoading     = false;
            this.isPageLoading = false;
            if(res.success) {
                this.data          = res.data.inputs;
                this.itemsTotal    = res.data.total;
                this.showAlert();
            } else {
                this._commanService.checkAccessToken(res.error);
            }
        },err => {
            this.isLoading     = false;
            this.isPageLoading = false;
            this._commanService.checkAccessToken(err);
       });             
    }    

    public onPageChange(event) {
        this.isLoading     = true;
        this.rowsOnPage = event.rowsOnPage;
        this.activePage = event.activePage;
        this.getInputs();
    }

    public onRowsChange( event ): void {
        this.isLoading  = true;
        this.rowsOnPage = this.itemsOnPage;
        this.activePage = 1;
        this.getInputs();      
    }

    public onSortOrder(event) {
        this.sortTrem = this.sortBy+' '+this.sortOrder;
        this.isLoading  = true; 
        this.getInputs();
    }

    public search( event, element = 'input' ) {
        if( element == 'input' ) {
            if(event.keyCode == 13 || this.searchTerm == '') {
                this.searchTerm = this.searchTerm.trim();
                this.isLoading  = true;
                this.getInputs(); 
                this.activePage = 1;
                this.getInputs(); 
            }
        }else{
            this.searchTerm = this.searchTerm.trim();
            this.isLoading  = true;
            this.getInputs(); 
            this.activePage = 1;
            this.getInputs(); 
        }
    }

    downloadCSV(): void {
        let i;
        let filteredData = [];
        
        let header = {
            name:"Name",
            category:'Category',
            manufacturer:"Manufacturer",
            price:'Price',
            seller:'Seller'
        }

        filteredData.push(header);

        for ( i = 0; i < this.data.length ; i++ ) { 
            let seller = this.data[i].user ? this.data[i].user.email : '-';
            let temp = {
                name: this.data[i].name,
                category: this.data[i].category.name,
                price: this.data[i].price,
                manufacturer: this.data[i].manufacturer.name,
                seller: seller
            };

            filteredData.push(temp);
        }       

        let fileName = "InputsReport-"+Math.floor(Date.now() / 1000); 
        new Angular2Csv( filteredData, fileName);
    }

    downloadPDF() {
        
        let i;
        let filteredData = [];

        let header = [
            "Name",
            "Category",
            "Manufacturer",
            "Price",
            "Seller"
        ]   

        for ( i = 0; i < this.data.length ; i++ ) { 
            let temp = [
                this.data[i].name,                
                this.data[i].category.name,
                this.data[i].manufacturer.name,
                this.data[i].price,
                this.data[i].user ?this.data[i].user.email : '-'
            ];

            filteredData.push(temp);
        }       

        let fileName = "InputsReport-"+Math.floor(Date.now() / 1000); 

        var doc = new jsPDF();    

        doc.autoTable(header, filteredData,  {
            theme: 'grid',
            headerStyles: {fillColor: 0},
            startY: 10, // false (indicates margin top value) or a number 
            margin: {horizontal: 5}, // a number, array or object 
            pageBreak: 'auto', // 'auto', 'avoid' or 'always' 
            tableWidth: 'wrap', // 'auto', 'wrap' or a number,  
            tableHeight: '1', // 'auto', 'wrap' or a number,  
            showHeader: 'everyPage',
            tableLineColor: 200, // number, array (see color section below) 
            tableLineWidth: 0,
            fontSize: 10,
            overflow : 'linebreak',
            columnWidth : 'auto',
            cellPadding : 2,       
            cellSpacing : 0,       
            valign : 'top',
            lineHeight: 15, 

        });

        doc.save(fileName);
    }

    showAlert(): void {

        let alertMessage = this._cookieService.get('inputAlert');
        if( alertMessage ) {
            this._flashMessagesService.show( alertMessage, {
                classes: ['alert', 'alert-success'],
                timeout: 3000,
            });
            this._cookieService.remove('inputAlert');
        }    
    } 

}
