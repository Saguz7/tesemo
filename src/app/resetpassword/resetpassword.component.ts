import {Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from "../core/services/storage.service";
import {Session} from "../core/models/session.model";
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Role} from "../core/models/role.model";
import {User} from "../core/models/user.model";
import {ENCRIPT} from "../core/key/encript";
declare var M: any;
const submitRepository = gql`
mutation updUsuario_password($i:ID,$passwd:String){
  modificarPassword(id:$i,password:$passwd){
    estatus
    }
  }
  `;
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public password: string;
  public passwordconf: string;
  valid: boolean = false;
  public user: User;

  constructor(
    private storageService?: StorageService, private apollo?: Apollo
  )
              {}
  ngOnInit() {
     this.user = this.storageService.getCurrentUser();
   }


   cambiarcontrasenia(){
     var CryptoJS = require("crypto-js");
     let encript = ENCRIPT.HOME_URL;
     var ciphertext = CryptoJS.AES.encrypt(this.password, ENCRIPT.HOME_URL).toString();
     this.apollo.use('endpoint2').mutate({
     mutation: submitRepository,
     variables: {
       i: this.user.id,
       passwd: ciphertext
     }
     }).subscribe(({ data }) => {
       M.toast({html: 'Se ha cambiado la contraseña'});
       this.storageService.logout();
       window.location.href = "/login";
     },(error) => {
       var divisiones = error.message.split(":", 2);
       M.toast({html: divisiones[1]})
      });
   }


   validpassword(){
     var pass = (<HTMLInputElement>document.getElementById("password")).value;
     var pass2 = (<HTMLInputElement>document.getElementById("passwordconf")).value;
     if(pass == pass2){
       this.valid = true;
     }else{
       this.valid = false;
     }
   }
}
