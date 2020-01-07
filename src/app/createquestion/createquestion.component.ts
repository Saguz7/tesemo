import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Examen} from '../models/vo/Examen';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {RespuestaVO} from '../models/vo/RespuestaVO';
import {TipoLicencia} from '../models/vo/Tipo_Licencia';
import {Categoria} from '../models/vo/Categoria';
import {PreguntaVO} from '../models/vo/PreguntaVO';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import * as N from '../graphql/mutations';
declare var M: any;
const FeedQuery = gql`
query listExams{
  examenes{
    id,nombre,descripcion,total_preguntas,calificacion_minima,tiempo_limite,estatus,createdAt
     }
  }
`;
const submitRepository = gql`
mutation uploadFile($file: Upload!) {
  uploadFile(file: $file) {
    filename
  }
}
`;
@Component({
  selector: 'app-createquestion',
  templateUrl: './createquestion.component.html',
  styleUrls: ['./createquestion.component.css']
})
export class CreateQuestionComponent implements OnInit {
  examen: any;
  examenaux: any;
  pregunta:any = new PreguntaVO();
  numeropreguntas: number;
  preguntas_generales: number;
  preguntas_especificas: number;
  preguntasacrear = new Array();
  licencias: number = 4;
  categoriapreguntas = new Array();
  arraylicencias = new Array();
  arraylicenciasboolean = new Array();
  arraylicenciasparaenviar = new Array();
  arraylicenciasparaenviaraux = new Array();
  file: any;
  pdfSrc: any;

////////////////////////////////////

  arraycategoriaslibres = new Array();
  arraycategoriaslibresparamostrar = new Array();
  auxcantidadpreguntas0: number = 0;
  auxcantidadpreguntas1: number = 0;

 ///////////////////

  mensajedeprecaucion: string;
  items: any[];
  imagenes: Observable<any>;
  n: string;
  d: string;
  tP: number;
  cM: number;
  tL: number;
  data: Observable<any>;

  listadoexamenop:boolean = true;
  crearexamenop:boolean = false;
  vermodificarexamen:boolean = false;
  verrespuestamodulo:boolean = false;
  vercrearpreguntas:boolean = false;
  vercrearexamen:boolean = false;
  postcreacionrespuestas:boolean = false;
  arrayImagen: any;

  constructor(
     private apollo?: Apollo,
    private apollo2?: Apollo

  ) { }

  ngOnInit() {
    this.arrayImagen = [];
    $(document).ready(function(){
      $('.tooltipped').tooltip();
    });
    $(document).ready(function(){
      $('.tabs').tabs();
    });
    $(document).ready(function(){
      $('.modal').modal();
    });
    this.arraycategoriaslibres = [];
    this.arraycategoriaslibresparamostrar= [];
    this.traertiposlicencias();
    this.traerexamenes();
    this.examen = new Examen();
    this.examenaux = new Examen();
   }

   seleccionarlicenciasparaenviar(id: number){
     if(this.arraylicenciasboolean[id]){
       this.arraylicenciasboolean[id] = false;
     }else{
       this.arraylicenciasboolean[id] = true;
     }
     console.log(this.arraylicenciasboolean);
   }

  crearexamen(examenaux: any){
     this.data = examenaux.examenes;
  }

  crearlicencias(licenciaaux: any){
     this.arraylicencias = licenciaaux.tiposLicencia;
     for(var i = 0; i < this.arraylicencias.length; i++){
      this.arraylicenciasboolean.push(false);
     }
  }

  pregenerales(){
     this.preguntas_especificas = this.examen.total_preguntas - this.preguntas_generales;
  }

  mostrarconfpreguntas(){
     this.crearcategorias()
  }

  crearcategorias(){
    this.apollo
      .watchQuery({
        query: gql`
        query listCategories{
             categorias{
                 id,
                 nombre,
                 descripcion,
                 estatus,
                 createdAt
                 }
              }
        `,
      })
      .valueChanges.subscribe(result => {
          this.crearcategoriasparaselect(result.data)
      });

  }

  crearcategoriasparaselect(categoriaaux: any){
     this.arraycategoriaslibres = categoriaaux.categorias;

  }
  //Funcion para crear Preguntas
  crearpreguntasfuncion(){
    this.preguntasacrear = new Array();
    console.log(this.numeropreguntas);
    for(var i= 0; i < this.numeropreguntas;i++){
      let respuestascreada = new RespuestaVO();
      respuestascreada.id = (i+1);
      respuestascreada.descripcion = "";
      respuestascreada.correcto = false;
      respuestascreada.id_pregunta = 1;
      this.preguntasacrear.push(respuestascreada);
    }
  }

  listadoexamenes(event: any){

    this.listadoexamenop = true;
    this.crearexamenop = false;
    this.verrespuestamodulo = false;
    this.vercrearpreguntas = false;

  }

  mostrarcrearexamen(){
    this.examen = new Examen();
    this.mensajedeprecaucion = "";
    this.vermodificarexamen = false;

    this.listadoexamenop = false;
    this.crearexamenop = true;
    this.verrespuestamodulo = false;
    this.vercrearpreguntas = false;

    this.traertiposlicencias();
    this.crearcategorias();

  }

  referenciaracambiodeatributos(examen: any){
    this.vermodificarexamen = true;
    this.verrespuestamodulo = false;
    this.vercrearpreguntas = false;
    this.examenaux = examen;

  }



  traertiposlicencias(){
     this.apollo.use('endpointexamen')
      .watchQuery({
        query: gql`
        query listTypesLicense{
          tiposLicencia{
            id,
            nombre,
            descripcion,
            estatus,
            createdAt
              }
          }
        `,
      })
      .valueChanges.subscribe(result => {
        this.crearlicencias(result.data)
      });
  }

  traerexamenes(){
     this.apollo.use('endpointexamen')
      .watchQuery({
        query: gql`
        query listExams{
          examenes{
            id,nombre,descripcion,total_preguntas,calificacion_minima,tiempo_limite,estatus,createdAt
             }
          }
        `,
      })
      .valueChanges.subscribe(result => {
        this.crearexamen(result.data)
      });
  }


  seleccategoriaevent(id: number){
     this.arraycategoriaslibresparamostrar.push(this.arraycategoriaslibres[id]);
     this.arraycategoriaslibres.splice(id, 1);

  }

  agregaraarrayinput(licencia: any,id: number){
    this.arraycategoriaslibres.push(licencia);
    this.arraycategoriaslibresparamostrar.splice(id, 1);
    this.cambiarmensadedeerror();
  }

  mensajedeerror(licencia: any,event: any){
    licencia.cantidadpreguntas = event.target.value;
    this.cambiarmensadedeerror();
  }

   cambiarmensadedeerror(){
     var contador = 0;

     if((this.examen.total_preguntas - contador)> 0){
       this.vercrearexamen = false;
       this.mensajedeprecaucion = "Le faltan " + (this.examen.total_preguntas - contador) + " preguntas para asignar.";
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;'+this.mensajedeprecaucion+'</div></span>';
       M.toast({html: toastHTML});
     }else{
       if((this.examen.total_preguntas - contador) == 0){
         this.vercrearexamen = true;
         this.mensajedeprecaucion = "Ya se asignaron todas las preguntas.";
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;'+this.mensajedeprecaucion+'</div></span>';
         M.toast({html: toastHTML});
       }else{
         this.vercrearexamen = false;
         this.mensajedeprecaucion = "Se ha excedido por " + ( (this.examen.total_preguntas - contador) * -1 ) + " preguntas. Favor de revisar el total de preguntas.";
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;'+this.mensajedeprecaucion+'</div></span>';
         M.toast({html: toastHTML});
       }

      }
   }

   crearexamenenviarobj(){
     this.pregunta.respuestas = this.preguntasacrear;
    }

   asignartrue(pregunta: any){
     for(var i = 0; i < this.preguntasacrear.length;i++){
       this.preguntasacrear[i].correcto = false;
     }
     pregunta.correcto = true;
     this.postcreacionrespuestas = true;
   }


  enviar(){
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
     console.log(file);
     this.file = file;
     console.log(this.file);


    }

    enviararchivos(){

       if(this.file  != null){
          this.apollo
          .mutate({
            mutation: N.SINGLE_UPLOAD,
            variables: {
              rfc: 'Hola'
            }
          }).subscribe(
            data => {
              this.agregarIDDocumentos(data,0);
             },
            err => console.log("Error al guardar el archivo.")
          );
       }
    }

    agregarIDDocumentos(data: any, i : any){

    }

}
