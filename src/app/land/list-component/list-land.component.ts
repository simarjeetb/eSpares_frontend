import { Component, OnInit } from '@angular/core';
import {PaginationInstance} from 'ng2-pagination';
import { LandService } from '../services/land.service';
import { CommanService } from '../../shared/services/comman.service';
import { Router,ActivatedRoute, NavigationEnd } from '@angular/router';
import {Http} from "@angular/http";
import {DataTableModule} from "angular2-datatable";
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { CookieService } from 'ngx-cookie';
import { FlashMessagesService } from 'ngx-flash-messages';
import tsConstants = require('./../../tsconstant');

declare let jsPDF; 

@Component({
  selector: 'app-land-management',
  templateUrl: './list-land.component.html',
  styleUrls: ['./list-land.component.scss']
})
export class ListLandComponent implements OnInit {

    private _host = tsConstants.HOST;
    
    test: any = [];
    public data                = [];
    public totalRecords        = 0;
    public filterQuery         = "";
    public rowsOnPage          = 5;
    public sortBy              = "createdAt";
    public sortOrder           = "desc";
    public activePage   = 1;
    public itemsTotal   = 0;
    public searchTerm   = '';
    public sortTerm     = '';
    public itemsOnPage;

    public response:any;
    public isLoading:boolean     = false;
    public documents = [];
    public selectedDocument = [];
    public errMessage = '';
    public isPageLoading:boolean = true;
    public addEditDelete:boolean = false;


    public constructor(
        private _router: Router, 
        private _landService: LandService, 
        private _cookieService: CookieService,  
        private _flashMessagesService: FlashMessagesService,
        private _commanService: CommanService ) { 
        
        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['lands']['addEditDelete']) this.addEditDelete = true;
    
    }

    ngOnInit(): void {

      this._router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });

         /*set initial sort condition */
        this.sortTerm = this.sortBy+' '+this.sortOrder;

        /*Load data*/
        this.getLands();        
        this.activePage = 1;
        this.getLands();

        this.itemsOnPage = this.rowsOnPage;

    }

    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }
    public sortByUser = (seller: any) => {
        return seller.firstname;
    }

    viewLand (Id) {
           
       let route = '/land/list/'+Id;
       this._router.navigate([route]);       
    }

    sendUpdateLand( Id ) {    
        
       let route = '/land/update/'+Id;
        this._router.navigate([route]);       
    }

    removeLand( Id ) {
        if(confirm("Do you want to delete?")) {
            console.log("Implement delete functionality here");
            this.isLoading = true;
            this._landService.deleteLand(Id).subscribe(res => {
                this.response  = res;
                this.isLoading = false;

                
                 let start       = (this.activePage * this.rowsOnPage - this.rowsOnPage + 1);
                this.itemsTotal = this.itemsTotal - 1;
                
                if( ! (this.itemsTotal >= start) ){
                   this.activePage = (this.activePage - 1)
                }

                this._cookieService.put('landAlert', 'Deleted Successfully.');
                /* reload page. */
                this.getLands();
            });  
        }
    } 

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

    /*get all getLands*/
    getLands() {
        this._landService.landlist( this.rowsOnPage, this.activePage, this.sortTerm, this.searchTerm ).subscribe(res => {
            
            this.isLoading     = false;
            this.isPageLoading = false;

            if(res.success) {
                this.data       = res.data.lands;
                this.itemsTotal = res.data.total;
               this.showAlert();
            
            } else {
                this._commanService.checkAccessToken(res.error);    
            }        
        }, 
        err => {
              this._commanService.checkAccessToken(err);
              this.isLoading     = false;
              this.isPageLoading = false;
        });

    }

    public onPageChange(event) {
        this.isLoading     = true;
        this.rowsOnPage = event.rowsOnPage;
        this.activePage = event.activePage;
        this.getLands();
    }

    public onRowsChange( event ): void {
        this.isLoading  = true;
        this.rowsOnPage = this.itemsOnPage;
        this.activePage = 1;
        this.getLands();      
    }

    public onSortOrder(event) {
        this.sortTerm = this.sortBy+' '+this.sortOrder;
        this.isLoading  = true;        
        this.getLands();
    }

    public search( event, element = 'input' ) {
        if( element == 'input' ) {
            if(event.keyCode == 13 || this.searchTerm == '') {
                this.searchTerm = this.searchTerm.trim();
                this.isLoading  = true;
                this.getLands();
                this.activePage = 1;
                this.getLands(); 
            }
        }else{
            this.searchTerm = this.searchTerm.trim();
            this.isLoading  = true;
            this.getLands(); 
            this.activePage = 1;
            this.getLands(); 
        }
    }

     downloadCSV(): void {
        let i;
        let filteredData = [];
        
        let header = {
            name:"Owner Name",
            district:'District ',
            rentSell:'Land For',
            area:'Area',
            price:'Expected Price'
        }

        filteredData.push(header);

        for ( i = 0; i < this.data.length ; i++ ) { 
            let user = this.data[i].user.firstName + ' ' + this.data[i].user.lastName ;

            let temp = {
                name: user,
                district: this.data[i].district,
                rentSell: this.data[i].rentSell,
                area: this.data[i].area,
                price: this.data[i].expected_price,
                
            };

            filteredData.push(temp);
        }       

        let fileName = "LandsReport-"+Math.floor(Date.now() / 1000); 
        new Angular2Csv( filteredData, fileName);
    }

    downloadPDF() {        
        let i;
        let filteredData = [];
        let header = [
            "Owner Name",
            'District ',
            'Land For',
            'Area',
            'Expected Price'
        ];      
       
        for ( i = 0; i < this.data.length ; i++ ) { 
            let name = '-';
            if( typeof(this.data[i].user) != 'undefined'){
                name = this.data[i].user.firstName +" "+ this.data[i].user.lastName;
            } 

            let temp = [
                name,
                this.data[i].district,
                this.data[i].rentSell,
                this.data[i].area,
                (this.data[i].rentSell == 'Lease') ? this.data[i].expected_price +'/'+ this.data[i].priceunit : this.data[i].expected_price,
            ];

            filteredData.push(temp);
        }       

        let fileName = "LandReport-"+Math.floor(Date.now() / 1000); 

        var doc = new jsPDF();    
        // doc.setFontSize(10);
        // doc.setFontSize(12);

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

        let alertMessage = this._cookieService.get('landAlert');
        if( alertMessage ) {
            this._flashMessagesService.show( alertMessage, {
                classes: ['alert', 'alert-success'],
                timeout: 3000,
            });
            this._cookieService.remove('landAlert');
        }    
    }

}
