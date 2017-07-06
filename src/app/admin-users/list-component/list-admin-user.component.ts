import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AdminUserService } from '../services/admin-user.service';
import { CommanService } from '../../shared/services/comman.service';
import { CookieService } from 'ngx-cookie';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { FlashMessagesService } from 'ngx-flash-messages';

declare let jsPDF; 

@Component({
  selector: 'app-users',
  templateUrl: './list-admin-user.component.html',
  styleUrls: ['./list-admin-user.component.scss']
})
export class ListAdminUserComponent implements OnInit {

    public data                  = [];
    public totalRecords          = 0;
    public filterQuery           = "";
    public rowsOnPage            = 5;
    public sortBy                = "";
    public sortOrder             = "desc";
    public activePage            = 1;
    public itemsTotal            = 0;
    public searchTerm            = '';
    public sortTrem              = '';
    
    public itemsOnPage;  
    
    public response:any;
    public isLoading:boolean     = false;
    public isPageLoading:boolean = true;
    public roles                 = 'A';
    public addEditDelete = false;
    
    public constructor(
        private _router: Router, 
        private _adminUserService: AdminUserService, 
        private _cookieService: CookieService,
        private _commanService: CommanService, 
        private _flashMessagesService: FlashMessagesService ) { 

        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['adminUsers']['addEditDelete']) this.addEditDelete = true;
        
    }

    ngOnInit(): void {

        this._router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });

        /*set initial sort condition */
        this.sortTrem = 'createdAt' + ' ' + this.sortOrder; 

        /*Load data*/
        this.getUsers();        
        this.activePage = 1;
        this.getUsers();
        
        this.itemsOnPage = this.rowsOnPage;
    }

    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

    viewUser (userID) {
        let route = '/admin-users/list/' + userID;
        this._router.navigate([route]);       
    }

    editUser(userID) {     
        let route = '/admin-users/edit/'+ userID;
        this._router.navigate([route]);       
    } 
    
    removeUser(userID) {
        if(confirm("Do you want to delete?")) {
            this.isLoading = true;
            this._adminUserService.delete(userID).subscribe(res => {
                this.response  = res;
                this.isLoading = false;    
                let start       = (this.activePage * this.rowsOnPage - this.rowsOnPage + 1);
                this.itemsTotal = this.itemsTotal - 1;
                
                if( ! (this.itemsTotal >= start) ){
                   this.activePage = this.activePage -1
                }
                this._cookieService.put('userAlert', 'Deleted successfully.');
                /* reload page. */
                this.getUsers();
            },err => {
                this.isLoading = false;
            });             
        }
    }

    /*Get all Users */
    getUsers(): void {
        this._adminUserService.getAllAdminUsers( this.rowsOnPage, this.activePage, this.sortTrem,  this.searchTerm, this.roles ).subscribe(res => {
            this.isLoading     = false;
            this.isPageLoading = false;
            if(res.success) {
                this.data          = res.data.users;
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
        this.getUsers();
    }

    public onRowsChange( event ): void {
        this.isLoading  = true;
        this.rowsOnPage = this.itemsOnPage;
        this.activePage = 1;
        this.getUsers();      
    }

    public onSortOrder(event) {
        this.sortTrem = this.sortBy+' '+this.sortOrder;
        this.isLoading  = true; 
        this.getUsers();
    }

    public search( event, element = 'input' ) {
        if( element == 'input' ) {
            if(event.keyCode == 13 || this.searchTerm == '') {
                this.searchTerm = this.searchTerm.trim();
                this.isLoading  = true;
                this.getUsers();
                this.activePage = 1;
                this.getUsers(); 
            }
        }else{
            this.searchTerm = this.searchTerm.trim();
            this.isLoading  = true;
            this.getUsers();
            this.activePage = 1;
            this.getUsers(); 
        }
    }

    downloadCSV(): void {
        let i;
        let filteredData = [];
        
        let header = {
            name:"Name",
            role:"Role",
            Email:'Email',
            mobile:'Mobile',
            state:'Market'
        }

        filteredData.push(header);

        for ( i = 0; i < this.data.length ; i++ ) { 
            let date = new Date(this.data[i].createdAt);
            let temp = {
                name: this.data[i].firstName + ' ' + this.data[i].lastName,
                role: this.data[i].roleId ? this.data[i].roleId.name : '-',
                email: this.data[i].email ? this.data[i].email : '-',
                mobile: this.data[i].mobile ? this.data[i].mobile :'-',
                state: this.data[i].state ? this.data[i].state : '-'
            };

            filteredData.push(temp);
        }       

        let fileName = "AdminUsersReport-"+Math.floor(Date.now() / 1000); 
        new Angular2Csv( filteredData, fileName);
    }

    downloadPDF() {
        
        let i;
        let filteredData = [];

        let header = [
            "Name",
            "Role",
            "Email",
            "Mobile",
            "Market",
            "Registered On"
        ]  

        for ( i = 0; i < this.data.length ; i++ ) { 
            let date = new Date(this.data[i].createdAt);
            let registeredOn = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

            let temp = [
                this.data[i].firstName + ' ' + this.data[i].lastName,  
                this.data[i].roleId ? this.data[i].roleId.name : '-',                
                this.data[i].email,
                this.data[i].mobile,
                this.data[i].state ? this.data[i].state : '-',
                registeredOn
            ];

            filteredData.push(temp);
        }       

        let fileName = "AdminUsersReport-"+Math.floor(Date.now() / 1000); 

        var doc = new jsPDF();    

        doc.autoTable(header, filteredData,  {
            theme: 'grid',
            headerStyles: {fillColor: 0},
            startY: 10, // false (indicates margin top value) or a number 
            margin: {horizontal: 6}, // a number, array or object 
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

        let alertMessage = this._cookieService.get('userAlert');
        if( alertMessage ) {
            this._flashMessagesService.show( alertMessage, {
                classes: ['alert', 'alert-success'],
                timeout: 3000,
            });
            this._cookieService.remove('userAlert');
        }    
    }
}
