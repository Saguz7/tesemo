import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from "../core/services/storage.service";
import {Session} from "../core/models/session.model";

import {Validators, FormGroup, FormBuilder} from "@angular/forms";
import gql from 'graphql-tag';
import {User} from "../core/models/user.model";
import {Role} from "../core/models/role.model";
declare var M: any;
import {Apollo} from 'apollo-angular';
import {KEY} from "../core/key/key-api";
import {ENCRIPT} from "../core/key/encript";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: Boolean = false;
  error: {code: number, message: string} = null;
  name: string;
  apellido: string;
  user: User;
  loged: boolean = false;
  email: any;
  password: any;
  validemail: boolean = false;

    constructor(
                  private apollo?: Apollo,
                  private storageService?: StorageService,
                  private router?: Router
              )
                {}

    ngOnInit() {
      this.user = this.storageService.getCurrentUser();
      if(this.user == null){
        document.getElementById("navesconder").style.visibility = "hidden";
        this.loged = false;
      }else{
        this.loged = true;
       }
    }
    /* Funcion que manda el correo y password para que se genere el token y el inicio de sesion, el password se encripta con una llave para que vaya encriptada*/

      login(){

        let url = KEY.HOME_URL;
        var CryptoJS = require("crypto-js");
        let encript = ENCRIPT.HOME_URL;

        var ciphertext = CryptoJS.AES.encrypt(this.password, ENCRIPT.HOME_URL).toString();
        this.submitted = true;
        this.error = null;

        this.apollo.use('endpoint2').watchQuery({
          query: gql`
          query knock_knock($email:String,$passwd:String,$tI:String){
            login(correo:$email,password:$passwd,tokenId:$tI){
              user{id,nombre,primer_apellido,segundo_apellido,correo
                centroTrabajo{id,nombre,
                  region{id,nombre,estatus,createdAt},
                  estatus,createdAt},
                  estatus,createdAt},
                  role{ id, nombre }
                  token
                }
              },
          ` ,
          variables: {
                  email: this.email,
                  passwd: ciphertext,
                  tI: KEY.HOME_URL

        }})
        .valueChanges.subscribe(result => {
          this.correctlogincheck(result.data);
         }, (error) => {
         var divisiones = error.message.split(":", 2);
         var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;'+divisiones[1]+'</div></span>';
         M.toast({html: toastHTML});
         });
     }

     /* Parseo del objeto que me regresa el mandar los parametros del login*/

       correctlogincheck(objlogin: any){

         let newseccion = new Session();
         newseccion.token = objlogin.login.token;
         let dialogeo = new Date();
         let finsession = new Date();
         finsession.setMinutes(dialogeo.getMinutes() + 120);
         newseccion.expire = finsession;

         let user = new User();
         user.id = objlogin.login.user.id
         user.nombre = objlogin.login.user.nombre;
         user.primer_apellido = objlogin.login.user.primer_apellido;
         user.segundo_apellido = objlogin.login.user.segundo_apellido;
         user.correo = objlogin.login.user.correo;
         user.password = objlogin.login.user.password;
         user.id_rol = objlogin.login.role.id;
         user.id_centro_trabajo = objlogin.login.user.centroTrabajo.id;
         user.id_region = objlogin.login.user.centroTrabajo.region.id;
         newseccion.user = user;
         this.correctLogin(newseccion);

       }

     /* Manda el objeto a guardar en el storageservice para que lo detecte*/
      private correctLogin(data: Session){
       this.storageService.setCurrentSession(data);
       window.location.href = "/examen";
      }

      verificarcorreo(){
        if (this.validateEmail(this.email)) {
         this.validemail = true;
        } else {
         this.validemail = false;
        }
      }

       validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
       }
    }
