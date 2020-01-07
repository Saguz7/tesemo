import { Component, OnInit, Input  } from '@angular/core';
 import {ExamenVO} from '../models/vo/ExamenVO';
import {PreguntaVO} from '../models/vo/PreguntaVO';
import {RespuestaVO} from '../models/vo/RespuestaVO';
import {PregAsigResp} from '../models/vo/PregAsigResp';
import {ExamenContestadoVO} from '../models/vo/ExamenContestadoVO';
import {PersonaVO} from '../models/vo/PersonaVO';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  mensaje: any;
 // const URL = '/api/';
  @Input() persona: PersonaVO;
  @Input() configuracionExamen: any;

  @Input() ejemplo: boolean;
  @Input() cambio: boolean;


  cols: any[];
  items: any[];
  tamanio: number;
  preguntaamostrar: any;
  numeropreguntas: any[];
  puntero: number = 1;

  acumuladorsegundos: number = 0;
  acumuladorminutos: number = 0;


  horaempiezoexamen: string;
  diaempiezoexamen: string;
  horaterminoexamen: string;

  /////////////// QUERYS

  curp: string;
  id: number;
  tiempo: any;

 /////////////////////// Creacion de variables para la creacion de Examen
  examen: ExamenVO;
  preguntas: PreguntaVO[];
  respuestas1: RespuestaVO[];
  respuestas2: RespuestaVO[];
  respuestas3: RespuestaVO[];

  preguntaobjamostrar: PreguntaVO;
  respuestasobjamostrar: RespuestaVO[];
  examenContestadoalmomento: any;

  mostrarcorrectas:boolean = false;
  mostrarbotonsiguiente:boolean = false;
  mostrarresultadosboton:boolean = false;
   mostrar:boolean = false;

    quitarpararesultados:boolean = true;
    siaprobo:boolean = false;
    mostrartest:boolean = false;


      public hora:number = 0;
      public minutos:number = 0;
      public segundos:number = 0;

      public con=0;
      public colection:Array<any> = [];
      public contador:any;
      public contador2:any;
      public hora2:number = 0;
      public minutos2:number = 0;
      public segundos2:number = 0;

      public horatext:any;
      public minutosext:string;
      public segundosext:string;

      imagenes: Observable<any>;
      confExamen: Observable<any>;


  constructor(  ) {

  }

  ngOnInit() {




    console.log(this.persona);
    // this.start_cronometro();
    // this.contador_regresivo()

    this.examenContestadoalmomento = new ExamenContestadoVO();
    var auxiliarexamen = [];

    let respuesta1A: RespuestaVO;
    respuesta1A = new RespuestaVO();
    respuesta1A.id = 1;
    respuesta1A.descripcion = "Opcion A";
    respuesta1A.correcto = true;
    respuesta1A.id_pregunta = 1;

    let respuesta1B: RespuestaVO;
    respuesta1B = new RespuestaVO();
    respuesta1B.id = 2;
    respuesta1B.descripcion = "Opcion B";
    respuesta1B.correcto = false;
    respuesta1B.id_pregunta = 1;

   this.respuestas1 = [respuesta1A,respuesta1B];

   let pregunta1: PreguntaVO;
   pregunta1 = new PreguntaVO();
   pregunta1.id = 2;
   pregunta1.descripcion= "Ejemplo de pregunta 1, respuesta correcta A"
   pregunta1.ruta = "";
   pregunta1.respuestas = this.respuestas1;

let respuesta2A: RespuestaVO;
respuesta2A = new RespuestaVO();
respuesta2A.id = 3;
respuesta2A.descripcion = "Verdadero";
respuesta2A.correcto = false;
respuesta2A.id_pregunta = 2;

let respuesta2B: RespuestaVO;
respuesta2B = new RespuestaVO();
respuesta2B.id = 4;
respuesta2B.descripcion = "Falso";
respuesta2B.correcto = true;
respuesta2B.id_pregunta = 2;
this.respuestas2 = [respuesta2A,respuesta2B];

let pregunta2: PreguntaVO;
pregunta2 = new PreguntaVO();
pregunta2.id = 1;
pregunta2.descripcion= "Ejemplo de pregunta 2, respuesta correcta Falso"
pregunta2.ruta = "https://www.google.com/logos/doodles/2019/elena-cornaro-piscopias-373rd-birthday-5158686585520128.4-s.png";
pregunta2.respuestas = this.respuestas2;


//////////////////////////////////++++

let respuesta3A: RespuestaVO;
respuesta3A = new RespuestaVO();
respuesta3A.id = 5;
respuesta3A.descripcion = "A";
respuesta3A.correcto = false;
respuesta3A.id_pregunta = 3;

let respuesta3B: RespuestaVO;
respuesta3B = new RespuestaVO();
respuesta3B.id = 6;
respuesta3B.descripcion = "B";
respuesta3B.correcto = true;
respuesta3B.id_pregunta = 3;

let respuesta3C: RespuestaVO;
respuesta3C = new RespuestaVO();
respuesta3C.id = 7;
respuesta3C.descripcion = "C";
respuesta3C.correcto = false;
respuesta3C.id_pregunta = 3;
this.respuestas3 = [respuesta3A,respuesta3B,respuesta3C];

let pregunta3: PreguntaVO;
pregunta3 = new PreguntaVO();
pregunta3.id = 3;
pregunta3.descripcion= "Ejemplo de pregunta 3, respuesta correcta b"
pregunta3.ruta = "";
pregunta3.respuestas = this.respuestas3;


////////////////////////////

   this.preguntas = [pregunta1,pregunta2,pregunta3];

    this.examen = new ExamenVO();
    this.examen.id = 1;
    this.examen.descripcion = "Examen para Licencia Tipo A";
    this.examen.tiempolimite = "1";
    this.examen.calificacion_minima = 50.0;
    this.examen.total_preguntas = 3;
    this.examen.preguntas = this.preguntas;

    this.preguntaobjamostrar = this.examen.preguntas[0];

    this.respuestasobjamostrar = this.examen.preguntas[0].respuestas;

    this.crearrelacionespreguntasrespuestasasociadas();

    this.recibirDatos();

  }

  recibirDatos(){
    console.log("-----Empieza proceso para obtener datos mediantes parametros-------");
     this.id = 1;
    this.curp = "SAGC940106HOCNZS00";



     console.log(this.imagenes);


  }

  crearrelacionespreguntasrespuestasasociadas(){
    var auxiliarexamen = [];
    for (var paso = 0; paso < this.examen.total_preguntas; paso++) {
           let auxpregresp: PregAsigResp;
           auxpregresp = new PregAsigResp();
           auxpregresp.id_pregunta = paso;
           auxpregresp.id_respuestaasignada = null;
           auxiliarexamen.push(auxpregresp);
      };
        this.examenContestadoalmomento =  auxiliarexamen;
  }

  cambiarpreguntamostrada(pregunta: number){

    ///Aqui mando a guardar la respuesta seleccionada por el usuario
    //Igual manda a pedir las respuesats correctas invalidando el codigo siguiente
       if(this.examenContestadoalmomento[pregunta-1].id_respuestaasignada!=null){

         if(pregunta == this.examen.total_preguntas){
           this.mostrarresultadosboton = true;
           this.mostrarcorrectas = true;


         }else{
           this.mostrarbotonsiguiente = true;
           this.mostrarcorrectas = true;
         }

            this.examenContestadoalmomento[pregunta-1].tiempo = this.minutos + ":" + this.segundos;
            this.puntero=this.puntero + 1;
            if(pregunta==1){
              this.examenContestadoalmomento[pregunta-1].minuto = this.minutos;
              this.acumuladorminutos = this.acumuladorminutos + this.minutos;
              this.examenContestadoalmomento[pregunta-1].segundo = this.segundos;
              this.acumuladorsegundos = this.acumuladorsegundos +  this.segundos;
            }else{
              this.examenContestadoalmomento[pregunta-1].minuto = this.minutos -   this.acumuladorminutos;
              this.acumuladorminutos = this.acumuladorminutos + (this.minutos -   this.acumuladorminutos);

              this.examenContestadoalmomento[pregunta-1].segundo = this.segundos - this.acumuladorsegundos;
              this.acumuladorsegundos = this.acumuladorsegundos +  (this.segundos - this.acumuladorsegundos);

             }
            this.examenContestadoalmomento[pregunta-1].tiempo = this.examenContestadoalmomento[pregunta-1].minuto + ":" +  this.examenContestadoalmomento[pregunta-1].segundo;

      }else{
         alert("Selecciona una opcion para continuar");
    }
  }

  botonsiguiente(pregunta: number){
    this.preguntaobjamostrar = this.examen.preguntas[pregunta-1];
    this.respuestasobjamostrar = this.examen.preguntas[pregunta-1].respuestas;
    this.mostrarbotonsiguiente = false;
    this.mostrarcorrectas = false;

    if(pregunta == this.examen.total_preguntas){
      this.mostrarbotonsiguiente = false;
      this.mostrarresultadosboton = false;

    }

  }

  asignarrespuestaalobjelegida(pregunta: number, elegida: number){
     this.examenContestadoalmomento[pregunta-1].id_respuestaasignada = elegida;
  }

  guardarresultadosycalcular(){
    console.log( this.acumuladorminutos);
    console.log(this.acumuladorsegundos);
    this.examenContestadoalmomento[this.examen.total_preguntas-1].minuto = this.minutos - this.acumuladorminutos ;
    this.examenContestadoalmomento[this.examen.total_preguntas-1].segundo = this.segundos - this.acumuladorsegundos;
  this.examenContestadoalmomento[this.examen.total_preguntas-1].tiempo = this.examenContestadoalmomento[this.examen.total_preguntas-1].minuto + ":" +  this.examenContestadoalmomento[this.examen.total_preguntas-1].segundo;

     var contadordebuenas = 0;

    for(var i = 0; i < this.examen.total_preguntas; i++) {
      if(this.examen.preguntas[i].respuestas[this.examenContestadoalmomento[i].id_respuestaasignada]!=undefined){
        if(this.examen.preguntas[i].respuestas[this.examenContestadoalmomento[i].id_respuestaasignada].correcto == true){
           contadordebuenas = contadordebuenas + 1;
        }
      }

    }

    for(var i = 0; i < this.examen.total_preguntas; i++) {
       console.log(this.examen.preguntas[i]);
       console.log(this.examenContestadoalmomento[i]);

    }


    var porcentaje = contadordebuenas * 10 / this.examen.total_preguntas;

    Math.round(porcentaje);

    porcentaje =Math.round(porcentaje);

    console.log(porcentaje);
    this.tiempo = this.minutos + ":" + this.segundos;

    if(porcentaje>=this.examen.calificacion_minima){
      this.mensaje = "Aprobado";
       this.siaprobo = true;
    }else{
      this.mensaje = "No Aprobado";
      this.siaprobo = false;
    }

    this.quitarpararesultados = false;

    this.stopTerminoElExamen();
  }

// Inicio de cronometro, en este mismo se va a cambiar el this.minutos == 1 por la constante del examen this.examen.tiempolimite = "1";

  start_cronometro(){
    if(this.contador == undefined) {
        this.contador = setInterval(()=> {

          if(this.minutos == this.configuracionExamen.tiempo_limite){
            this.stop();
          }
                this.segundos += 1;
                if (this.segundos == 60) {
                    this.segundos = 0;
                    this.minutos += 1;
                    if (this.minutos == 60) {
                        this.minutos = 0;
                        this.hora += 1;
                        if (this.hora = 24) {
                            this.hora = 0;
                        }
                    }
                }
            }
            , 1000);
    }
  }

  ////////


       contador_regresivo() {

         if(this.contador2 == undefined) {
             this.contador2 = setInterval(()=> {
               if (this.segundos2 > 0 && this.segundos2 <= 60) {
                   this.segundos2--;
               } else {

                   if (this.minutos2 > 0 && this.minutos2 <= 60) {
                       this.minutos2--;
                       this.segundos2 = 59;
                    } else {
                         //alert("Tiempo Finalizado");
                   }
               }
                 }
                 , 1000);
         }
       }

  //Detiene el cronometro y manda los resultados a guardar





  stop(){
    alert("Se acabo el tiempo del examen");
    console.log(this.hora + ":"+this.minutos +":" +this.segundos);
      clearInterval(this.contador);
      this.hora = this.hora;
      this.minutos = this.minutos;
      this.segundos = 0;
      this.contador = null;
      this.guardarsinterminarexamen();



  }


  stopTerminoElExamen(){
       clearInterval(this.contador);
      this.hora = this.hora;
      this.minutos = this.minutos;
      this.segundos = 0;
      this.contador = null;



  }


  guardarsinterminarexamen(){

    var contadordebuenas = 0;

   for(var i = 0; i < this.examen.total_preguntas; i++) {
     if(this.examen.preguntas[i].respuestas[this.examenContestadoalmomento[i].id_respuestaasignada]!=undefined){
       if(this.examen.preguntas[i].respuestas[this.examenContestadoalmomento[i].id_respuestaasignada].correcto == true){
          contadordebuenas = contadordebuenas + 1;
       }
     }

   }

   if(this.examen.calificacion_minima<=contadordebuenas){
     this.mensaje = "Aprobado";
   }else{
     this.mensaje = "No Aprobado";
   }

    for(var i = 0; i < this.examen.total_preguntas; i++) {
       console.log(this.examen.preguntas[i]);
       console.log(this.examenContestadoalmomento[i]);

    }

    this.quitarpararesultados = false;


  }

  empezarexamen(){
    console.log("[[[[[[[[[[[[[[[[[[[[[this.configuracionExamen]]]]]]]]]]]]]]]]]]]]]");
    console.log(this.configuracionExamen);
    this.minutos2 = this.configuracionExamen.tiempo_limite;
    this.examen.calificacion_minima = this.configuracionExamen.calificacion_minima;
    this.mostrartest = true;
    this.start_cronometro();
    this.contador_regresivo()


        let fechaActual = new Date();
      let dia = fechaActual.getDate().toString();
      let mes = (fechaActual.getMonth() + 1).toString();
      let anio = fechaActual.getFullYear().toString();
      let hora = fechaActual.getHours().toString();
      let minutos = fechaActual.getMinutes().toString();
      let segundos = fechaActual.getSeconds().toString();
        console.log(anio + "-" + mes + "-" + dia);

        this.diaempiezoexamen = anio + "-" + mes + "-" + dia;
        this.horaempiezoexamen = hora + ":" + minutos + ":" + segundos;
        console.log(hora + ":" + minutos + ":" + segundos);

        let finexamen = new Date();

        finexamen.setMinutes(fechaActual.getMinutes() + 30);

        let horatermino = finexamen.getHours().toString();
        let minutostermino = finexamen.getMinutes().toString();
        let segundostermino = finexamen.getSeconds().toString();

        this.horaterminoexamen = horatermino + ":" + minutostermino + ":" + segundostermino;

        console.log(horatermino + ":" + minutostermino + ":" + segundostermino);


  }





}
