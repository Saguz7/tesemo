import { Component, OnInit } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';

import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/core/user.service';
import {StorageService} from "./core/services/storage.service";
import {User} from "./core/models/user.model";
declare var M: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit  {
  logged: boolean = false;
   loged: boolean = false;
  public user: User;

  constructor(private storageService: StorageService) {}

     ngOnInit() {
        this.user = this.storageService.getCurrentUser();
         if(this.user == null){
          this.loged = false;
         }else{
          this.loged = true;
        }
         $(".dropdown-trigger").dropdown();
         $(document).ready(function(){
           $('.sidenav').sidenav();
         });

     }

     mandarmenu(){
        var elem= document.querySelector('.modal');
        var instance = M.Sidenav.getInstance(elem);
        instance.open();
     }

     public logout(): void{
       this.storageService.logout();
       window.location.href = "/";
     }
   }
