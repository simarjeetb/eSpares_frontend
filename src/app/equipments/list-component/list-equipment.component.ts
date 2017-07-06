import { Component, OnInit } from '@angular/core';
// import { cropTable } from './crop-seed'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
// import {PaginationInstance} from 'ng2-pagination';
import {Http} from "@angular/http";
import {DataTableModule} from "angular2-datatable";

import { EquipmentService } from '../services/equipment.service';

import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { FlashMessagesService } from 'ngx-flash-messages';
import { CookieService } from 'ngx-cookie';

import { CommanService } from '../../shared/services/comman.service';
import tsConstants = require('./../../tsconstant');

declare let jsPDF; 

@Component({
    selector: 'app-equipment-management',
    templateUrl: './list-equipment.component.html',
     // providers: [SweetAlertService],
    styleUrls: ['./list-equipment.component.scss']
})
export class ListEquipmentComponent implements OnInit {

    private _host = tsConstants.HOST;
 
    public data         = [];
    public totalRecords = 0;
    public filterQuery  = "";
    public rowsOnPage   = 5;
    public sortBy       = "createdAt";
    public sortOrder    = "desc";
    public activePage   = 1;
    public itemsTotal   = 0;
    public searchTerm   = '';
    public sortTrem     = '';

    public itemsOnPage;


    public response:any;
    public isLoading:boolean     = false;
    public isPageLoading:boolean = true;
    private addEditDelete:boolean = false;
    public errMessage            = "";
   
    public constructor( 
        private activatedRouter: ActivatedRoute, 
        private _router: Router, 
        private _equipmentService: EquipmentService, 
        private _flashMessagesService: FlashMessagesService, 
        private _cookieService: CookieService,
        private _commanService: CommanService ) { 
        
        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['equipments']['addEditDelete']) this.addEditDelete = true;
    
    }   

    ngOnInit(): void {
         this._router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });
        
        /*set initial sort condition */
        this.sortTrem = this.sortBy+' '+this.sortOrder;

        /*Load data*/
        this.getEquipments();        
        this.activePage = 1;
        this.getEquipments();

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

    viewEquipment (equipmentID) {
        let route = '/equipments/list/'+equipmentID;
        this._router.navigate([route]);       
    }

    sendUpdateEquipment( equipmentID ) {     
        
        let route = '/equipments/edit/'+equipmentID;
        this._router.navigate([route]);       
    }

     
    removeEquipment( equipmentID ) {
        if(confirm("Do you want to delete?")) {
            this.isLoading  = true;     
            this._equipmentService.delete(equipmentID).subscribe(res => {
                this.response     = res;
                this.isLoading    = false;
                // //this.totalRecords = this.data.length;
                // this.itemsTotal   = this.itemsTotal - 1;
                // // this.data = [];                
                // this.removeByAttr(this.data, 'id', equipmentID);  

                let start       = (this.activePage * this.rowsOnPage - this.rowsOnPage + 1);
                this.itemsTotal = this.itemsTotal - 1;
                
                if( ! (this.itemsTotal >= start) ){
                   this.activePage = (this.activePage - 1)
                }
                this._cookieService.put('equipmentAlert', 'Deleted successfully.');
                
                /* reload page. */
                this.getEquipments();
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

    /*get all equipments*/
    getEquipments() {   
        this._equipmentService.getAllEquipments( this.rowsOnPage, this.activePage, this.sortTrem,  this.searchTerm ).subscribe(res => {
            
            this.isLoading     = false;
            this.isPageLoading = false;
            
            if(res.success) {
                this.data       = res.data.equipments;
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

    /**/
    public onPageChange(event) {
        this.isLoading     = true;
        this.rowsOnPage = event.rowsOnPage;
        this.activePage = event.activePage;
        this.getEquipments();
    }

    public onRowsChange( event ): void {
        this.isLoading  = true;
        this.rowsOnPage = this.itemsOnPage;
        this.activePage = 1;
        this.getEquipments();      
    }

    public onSortOrder(event) {
        this.sortTrem = this.sortBy+' '+this.sortOrder;
        this.isLoading  = true;        
        this.getEquipments();
    }

    public searchEquipment( event, element = 'input' ) {
        if( element == 'input'  ){
            if(event.keyCode == 13 || this.searchTerm == '') {
                this.searchTerm = this.searchTerm.trim();
                this.isLoading  = true;
                this.getEquipments(); 
                this.activePage = 1;
                this.getEquipments(); 
            }           
        }else{
            this.searchTerm = this.searchTerm.trim();
            this.isLoading  = true;
            this.getEquipments(); 
            this.activePage = 1;
            this.getEquipments(); 
        }
    }

    downloadCSV(): void {
        
        let i;
        let filteredData = [];
        
        let header = {
            name:"Name",
            supplier:'Supplier',
            district:'District',
            rentSell:'Type',
            modelyear:'Model Year',
            quantity:'Quantity',
            price:'Price'
        }

        filteredData.push(header);

        for ( i = 0; i < this.data.length ; i++ ) { 
            let temp = {
                name: this.data[i].name,
                supplier: this.data[i].user.firstName,
                district: this.data[i].district,
                rentSell: this.data[i].rentSell,
                modelyear: this.data[i].modelyear,
                quantity: this.data[i].quantity,
                price: (this.data[i].rentSell == 'rent') ? this.data[i].rate +'/'+ this.data[i].price_unit : this.data[i].rate,
            };

            filteredData.push(temp);
        }       

        let fileName = "EquipmentReport-"+Math.floor(Date.now() / 1000); 
        new Angular2Csv( filteredData, fileName);
    }

    downloadPDF() {
        
        let i;
        let filteredData = [];

        let header = [
            "Name",
            "Supplier",
            "District",
            "Type",
            "Model Year",
            "Quantity",
            "Price",
        ];      
       
        for ( i = 0; i < this.data.length ; i++ ) { 
            let username = '-';
            
            console.log( typeof(this.data[i].user))
            
            if( typeof(this.data[i].user) != 'undefined'){
                username = this.data[i].user.email;
            } 

            let temp = [

                this.data[i].name,                
                username,
                this.data[i].district,
                this.data[i].rentSell,
                this.data[i].modelyear,
                this.data[i].quantity,
                (this.data[i].rentSell == 'rent') ? this.data[i].rate +'/'+ this.data[i].price_unit : this.data[i].rate,
            ];

            filteredData.push(temp);
        }       

        let fileName = "EquipmentReport-"+Math.floor(Date.now() / 1000)+".pdf"; 

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

        let alertMessage = this._cookieService.get('equipmentAlert');
        if( alertMessage ) {
            this._flashMessagesService.show( alertMessage, {
                classes: ['alert', 'alert-success'],
                timeout: 3000,
            });
            this._cookieService.remove('equipmentAlert');
        }    
    }
}
