import { Component, OnInit } from '@angular/core';
import { CropService } from '../services/crop.service';
import { CommanService } from '../../shared/services/comman.service';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { FlashMessagesService } from 'ngx-flash-messages';
import tsConstants = require('./../../tsconstant');

declare let jsPDF; 

@Component({
  selector: 'app-crops',
  templateUrl: './list-crop.component.html',
  styleUrls: ['./list-crop.component.scss']
})
export class ListCropComponent implements OnInit {
    
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
        private _cropService: CropService,
        private _commanService: CommanService, 
        private _cookieService: CookieService, 
        private _flashMessagesService: FlashMessagesService ) { 
        
        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['crops']['addEditDelete']) this.addEditDelete = true;

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
        this.getCrops();        
        this.activePage = 1;
        this.getCrops();   

        this.itemsOnPage = this.rowsOnPage;
    }

    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

    viewCrop(cropID) {
        let route = '/crops/list/' + cropID;
        this._router.navigate([route]);       
    }

    editCrop(cropID) {     
        let route = '/crops/edit/'+cropID;
        this._router.navigate([route]);       
    }

     /* Function use to remove Crop with crop id*/
    removeCrop(cropID) {
        if(confirm("Do you want to delete?")) {
            this.isLoading = true;
            this._cropService.delete(cropID).subscribe(res => {
                this.response  = res;
                this.isLoading = false;  
                let start       = (this.activePage * this.rowsOnPage - this.rowsOnPage + 1);
                this.itemsTotal = this.itemsTotal - 1;
                
                if( ! (this.itemsTotal >= start) ){
                   this.activePage = this.activePage -1
                }
                this._cookieService.put('cropAlert', 'Deleted successfully.');
                /* reload page. */
                this.getCrops();
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
 

    /*Get all Crops*/
    getCrops(): void {   
        this._cropService.getAllCrops( this.rowsOnPage, this.activePage, this.sortTrem,  this.searchTerm ).subscribe(res => {
            this.isLoading     = false;
            this.isPageLoading = false;
            if(res.success) {
                this.data          = res.data.crops;
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
        this.getCrops();
    }

    public onRowsChange( event ): void {
        this.isLoading  = true;
        this.rowsOnPage = this.itemsOnPage;
        this.activePage = 1;
        this.getCrops();      
    }

    public onSortOrder(event) {
        this.sortTrem = this.sortBy+' '+this.sortOrder;
        this.isLoading  = true; 
        this.getCrops();
    }

    public search( event, element = 'input' ) {
        if( element == 'input' ) {
            if(event.keyCode == 13 || this.searchTerm == '') {
                this.searchTerm = this.searchTerm.trim();
                this.isLoading  = true;
                this.getCrops(); 
                this.activePage = 1;
                this.getCrops(); 
            }
        }else{
            this.searchTerm = this.searchTerm.trim();
            this.isLoading  = true;
            this.getCrops(); 
            this.activePage = 1;
            this.getCrops(); 
        }
    }

    downloadCSV(): void {
        let i;
        let filteredData = [];
        
        let header = {
            name:"Crop Name",
            category:'Category',
            price:'Offer Price',
            quantity:'Qty.',
            highestBid:'Highest Bid',
            district:'District',
            availableFrom:'Available From',
            seller:'Seller'
        }

        filteredData.push(header);

        for ( i = 0; i < this.data.length ; i++ ) { 
            let availableDate = this.data[i].availableFrom ? this.data[i].availableFrom.day ? this.data[i].availableFrom.day + '/' + this.data[i].availableFrom.month + '/' + this.data[i].availableFrom.year : '-' :'-';
            let seller = this.data[i].seller ? this.data[i].seller.firstName ? this.data[i].seller.firstName + ' ' + this.data[i].seller.lastName : this.data[i].seller.email : '-';
            let state = this.data[i].seller ? this.data[i].seller.state ? '(' + this.data[i].seller.state + ')' : '' : '';
            seller += ' ' + state;
            let temp = {
                name: this.data[i].name,
                category: this.data[i].category.name,
                price: this.data[i].price,
                quantity: this.data[i].quantity + ' ' + this.data[i].quantityUnit,
                highestBid: '-',
                district: this.data[i].district,
                availableFrom: availableDate,
                seller: seller
            };

            filteredData.push(temp);
        }       

        let fileName = "CropsReport-"+Math.floor(Date.now() / 1000); 
        new Angular2Csv( filteredData, fileName);
    }

    downloadPDF() {
        
        let i;
        let filteredData = [];

        let header = [
            "Crop Name",
            "Category",
            "Offer Price",
            "Qty.",
            "Highest Bid",
            "District",
            "Available From",
            "Seller",
        ]   

        for ( i = 0; i < this.data.length ; i++ ) { 
            let availableDate = this.data[i].availableFrom ? this.data[i].availableFrom.day ? this.data[i].availableFrom.day + '/' + this.data[i].availableFrom.month + '/' + this.data[i].availableFrom.year : '-' :'-';
            let seller = this.data[i].seller ? this.data[i].seller.firstName ? this.data[i].seller.firstName + ' ' + this.data[i].seller.lastName : this.data[i].seller.email : '-';
            let state = this.data[i].seller ? this.data[i].seller.state ? '(' + this.data[i].seller.state + ')' : '' : '';
            seller += ' ' + state;
            let temp = [

                this.data[i].name,                
                this.data[i].category.name,
                this.data[i].price,
                this.data[i].quantity + ' ' + this.data[i].quantityUnit,
                '-',
                this.data[i].district,
                availableDate,
                seller
            ];

            filteredData.push(temp);
        }       

        let fileName = "CropsReport-"+Math.floor(Date.now() / 1000); 

        var doc = new jsPDF();    

        doc.autoTable(header, filteredData,  {
            theme: 'grid',
            headerStyles: {fillColor: 0},
            startY: 10, // false (indicates margin top value) or a number 
            margin: {horizontal: 7}, // a number, array or object 
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

        let alertMessage = this._cookieService.get('cropAlert');
        if( alertMessage ) {
            this._flashMessagesService.show( alertMessage, {
                classes: ['alert', 'alert-success'],
                timeout: 3000,
            });
            this._cookieService.remove('cropAlert');
        }    
    }
}
