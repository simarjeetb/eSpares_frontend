import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommanService } from '../../shared/services/comman.service';
import { CookieService } from 'ngx-cookie';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { FlashMessagesService } from 'ngx-flash-messages';

declare let jsPDF; 

@Component({
  selector: 'app-users',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {

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
    public addEditDelete:boolean = false;
    public roles                 = 'U';
   
    public constructor(
        private _router: Router, 
        private _userService: UserService, 
        private _cookieService: CookieService,
         private _commanService: CommanService, 
        private _flashMessagesService: FlashMessagesService ) { 
        
        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['users']['addEditDelete']) this.addEditDelete = true;
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
        let route = '/users/list/' + userID;
        this._router.navigate([route]);       
    }

    editUser(userID) {     
        let route = '/users/edit/'+ userID;
        this._router.navigate([route]);       
    } 
    
    removeUser(userID) {
        if(confirm("Do you want to delete?")) {
            this.isLoading = true;
            this._userService.delete(userID).subscribe(res => {
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

    /*This function is use to remove user session if Access token expired. */
    checkAccessToken( err ): void {
        let code    = err.code;
        let message = err.message;

        if( (code == 401 && message == "authorization")) {
            this._cookieService.removeAll();
            this._router.navigate(['/login', {data: true}]);
        }       
    }

    /*Get all Users */
    getUsers(): void {
        this._userService.getAllUsers( this.rowsOnPage, this.activePage, this.sortTrem,  this.searchTerm, this.roles ).subscribe(res => {
            this.isLoading     = false;
            this.isPageLoading = false;
            if(res.success) {
                this.data          = res.data.users;
                this.itemsTotal    = res.data.total;
                this.showAlert();
            } else {
                this.checkAccessToken(res.error);
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
            Email:'Email',
            mobile:'Mobile',
            state:'State',
            registeredOn:'Registered On'
        }

        filteredData.push(header);

        for ( i = 0; i < this.data.length ; i++ ) { 
            let date = new Date(this.data[i].createdAt);
            let registeredOn = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            let temp = {
                name: this.data[i].firstName + ' ' + this.data[i].lastName,
                email: this.data[i].email ? this.data[i].email : '-',
                mobile: this.data[i].mobile ? this.data[i].mobile :'-',
                state: this.data[i].state ? this.data[i].state : '-',
                registeredOn: registeredOn
            };

            filteredData.push(temp);
        }       

        let fileName = "UsersReport-"+Math.floor(Date.now() / 1000); 
        new Angular2Csv( filteredData, fileName);
    }

    downloadPDF() {
        
        let i;
        let filteredData = [];

        let header = [
            "Name",
            "Email",
            "Mobile",
            "State",
            "Registered On"
        ]  

        for ( i = 0; i < this.data.length ; i++ ) { 
            let date = new Date(this.data[i].createdAt);
            let registeredOn = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

            let temp = [
                this.data[i].firstName + ' ' + this.data[i].lastName,                
                this.data[i].email,
                this.data[i].mobile,
                this.data[i].state ? this.data[i].state : '-',
                registeredOn
            ];

            filteredData.push(temp);
        }       

        let fileName = "UsersReport-"+Math.floor(Date.now() / 1000); 

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
