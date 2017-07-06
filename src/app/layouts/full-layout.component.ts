import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommanService } from '../shared/services/comman.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  providers:[CommanService]
})
export class FullLayoutComponent implements OnInit {

  public disabled: boolean           = false;
  public status: {isopen: boolean}   = {isopen: false};
  public active;
  public access = {
        crops:false,
        inputs:false,
        equipments:false,
        lands:false,
        users:false,
        category:false,
        manufacturer:false,
        adminUsers:false,
        adminRoles:false
  }
  
  constructor(
    private router : Router, 
    private _route: ActivatedRoute, 
    private _cookieService: CookieService,
    private _commanService: CommanService ) { 
        
        this.active = this._route.snapshot["_urlSegment"].segments[0].path;
        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA') {
            this.access = {
                crops:true,
                inputs:true,
                equipments:true,
                lands:true,
                users:true,
                category:true,
                manufacturer:true,
                adminRoles:true,
                adminUsers:true
            }
        } else {
            this.access = {
                crops:actions['crops'].view,
                inputs:actions['inputs'].view,
                equipments:actions['equipments'].view,
                lands:actions['lands'].view,
                users:actions['users'].view,
                category:actions['category'].view,
                manufacturer:actions['manufacturer'].view,
                adminRoles:actions['adminRoles'].view,
                adminUsers:actions['adminUsers'].view
            }
        }
  }

  public toggled(open: boolean): void {
    // console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  ngOnInit(): void {}

  layout(key) {
      if(key == 'crops' && this.access.crops) {
           this.applyRouter(key);
      } else if(key == 'inputs' && this.access.inputs) {
           this.applyRouter(key);
      } else if(key == 'equipments' && this.access.equipments) {
           this.applyRouter(key);
      } else if(key == 'land' && this.access.lands) {
           this.applyRouter(key);
      } else if(key == 'users' && this.access.users) {
           this.applyRouter(key);
      } else if(key == 'category' && this.access.category) {
           this.applyRouter(key);
      } else if(key == 'manufacturer' && this.access.manufacturer) {
           this.applyRouter(key);
      } else if(key == 'roles' && this.access.adminRoles) {
           this.applyRouter(key);
      } else if(key == 'admin-users' && this.access.adminUsers) {
           this.applyRouter(key);
      } else {

      }
  }

  applyRouter(key) {
      this.active = key;
      let route = '/' + key + '/list';
      this.router.navigate([route]);
  }

  logout() {
    this._cookieService.removeAll();
    this.router.navigate(['/login']);
  }
}
