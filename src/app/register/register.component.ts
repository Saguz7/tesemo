  import { ComponentRef, ComponentFactoryResolver,ChangeDetectorRef, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter ,ElementRef} from "@angular/core";
  import {PersonaVO} from '../models/vo/PersonaVO';
  import { Observable } from 'rxjs';
  import { pluck } from 'rxjs/operators';
  import { ActivatedRoute, Router} from '@angular/router';
  import { map } from 'rxjs/operators';
  import gql from 'graphql-tag';
  import { TestComponent } from '../test/test.component';
  import {BuscarExamen} from '../models/vo/BuscarExamen';
  import {Examen} from '../models/vo/Examen';
  import {Apollo} from 'apollo-angular';
  import {ExamenVO} from '../models/vo/ExamenVO';
  import {PreguntaVO} from '../models/vo/PreguntaVO';
  import {RespuestaVO} from '../models/vo/RespuestaVO';
  import {ExamenContestadoVO} from '../models/vo/ExamenContestadoVO';
  import {PregAsigResp} from '../models/vo/PregAsigResp';
  import * as M from '../graphql/mutations';
  import {User} from "../core/models/user.model";
  import {StorageService} from "../core/services/storage.service";

  const feedQuery = gql`
  query listExams{
    examenes{
      id,nombre,descripcion,total_preguntas,calificacion_minima,tiempo_limite,estatus,createdAt
      }
    }
    `;
 @Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild("video")
  public video: ElementRef;

  @ViewChild("canvas")
  public canvas: ElementRef;
  public captures: Array<any>;
  descripcion: string;
  imagen: File;
  fileToUpload: File = null;
  selecetdFile : File;
  imagePreview: string;
  personaVO: any;
  variable: boolean = false;
  persona: any;
  imagenes: Observable<any>;
  imagenesAux: Observable<any>;
  registroabuscar: string;
  examenes: any;
  horaempiezoexamen: string;
  diaempiezoexamen: string;
  horaterminoexamen: string;
  puntero: number = 1;
  acumuladorsegundos: number = 0;
  acumuladorminutos: number = 0;
  public user: User;
  mostrarexamenes: boolean = false;
  advertenciaCURP: boolean = false;
  mostrartBtnSelTest: boolean = false;
  tomarfoto: boolean = false;
  banderacurpcorrecta: boolean = false;
  quitartodo: boolean = true;
  mostrarbotonrealizarexamen: boolean = false;
  ejemplo: boolean = false;
  quitarempezar: boolean = false;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  curp: string;
  id: number;
  curpenviar: string;
  public mostrartest:boolean = false;
  configuracionExamen: any = {};

  examen: ExamenVO;
  preguntas: PreguntaVO[];
  respuestas1: RespuestaVO[];
  respuestas2: RespuestaVO[];
  respuestas3: RespuestaVO[];

  preguntaobjamostrar: PreguntaVO;
  respuestasobjamostrar: RespuestaVO[];
  examenContestadoalmomento: any;
  confExamen: Observable<any>;
  @Input() IModel: any;
  @Input() NameComponet: any;
  @ViewChild('viewContainerRef', { read: ViewContainerRef })  VCR: ViewContainerRef;
  index: number = 0;
  componentsReferences = [];
  array: any;
    cars: any[];

    images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor(
    private CFR: ComponentFactoryResolver,
    private apollo?: Apollo,
    private _route?: ActivatedRoute,
    private _router?: Router,
    private storageService?: StorageService
    ) {
    this.captures = [];
   }

  ngOnInit() {

    this.array = [
      {nombre:"Examen Licencia Tipo A"},
      {nombre:"Examen Licencia Tipo B"},
      {nombre:"Examen Licencia Tipo C"}
    ];
    document.getElementById("divheader1").style.backgroundColor ="white";
    $('.carousel.carousel-slider').carousel({
          fullWidth: true,
          indicators: false
       });

       $('.moveNextCarousel').click(function(e){
     e.preventDefault();
     e.stopPropagation();
     $('.carousel').carousel('next');
  });

  // move prev carousel
  $('.movePrevCarousel').click(function(e){
     e.preventDefault();
     e.stopPropagation();
     $('.carousel').carousel('prev');
  });
    this.user = this.storageService.getCurrentUser();
    this.cars = [
                {vin: 'r3278r2', year: 2010, brand: 'Audi', color: 'Black'},
                {vin: 'jhto2g2', year: 2015, brand: 'BMW', color: 'White'},
                {vin: 'h453w54', year: 2012, brand: 'Honda', color: 'Blue'},
                {vin: 'g43gwwg', year: 1998, brand: 'Renault', color: 'White'},
                {vin: 'gf45wg5', year: 2011, brand: 'VW', color: 'Red'},
                {vin: 'bhv5y5w', year: 2015, brand: 'Jaguar', color: 'Blue'},
                {vin: 'ybw5fsd', year: 2012, brand: 'Ford', color: 'Yellow'},
                {vin: '45665e5', year: 2011, brand: 'Mercedes', color: 'Brown'},
                {vin: 'he6sb5v', year: 2015, brand: 'Ford', color: 'Black'}
            ];

    this.examenes = [
      {nombre:"Examen Licencia Tipo A",descripcion:"Examen de ejemplo",total_preguntas:"4",calificacion_minima:1,tiempo_limite:3},
      {nombre:"Examen Licencia Tipo B",descripcion:"Examen de ejemplo 2",total_preguntas:"2",calificacion_minima:2,tiempo_limite:2}
    ]

    this.persona = new PersonaVO();
    this.nombre = "Ejemplo";
    this.descripcion = "Ejemplo";
    this.persona.nombre = 'CESAR';
    this.persona.primer_apellido = 'SANTIAGO';
    this.persona.segundo_apellido = 'GUZMAN';
     this.persona.curp = "SAGC940106HOCNZS00";
     this.persona.correo = 'cesarsantiagoguzman@gmail.com';
     this.persona.telefono = '9515932305';


    $(document).ready(function(){
      $('.collapsible').collapsible();
    });

  }


  //Traemos los examenes disponibles

  traerexamenes(){

    /*
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
     */

     this.examenes = [
       {nombre:"Examen Licencia Tipo A",descripcion:"Examen de ejemplo",total_preguntas:"4",calificacion_minima:1,tiempo_limite:3},
       {nombre:"Examen Licencia Tipo B",descripcion:"Examen de ejemplo 2",total_preguntas:"2",calificacion_minima:2,tiempo_limite:2}
     ]

  }



  //GuardarObjetoDeConfiguracionExamen

  configuExamen(configuraciondelexamen: any){
    this.configuracionExamen = configuraciondelexamen.examen;
  }

  //Guardamos una lista de objetos

  guardarExamenes(examenestipo: any){
    this.examenes = examenestipo.examenes;
    this.imagenes = this.imagenesAux;
  }

  crearexamen(examenaux: any){
     this.examenes = examenaux.examenes;
  }
  ////Metodo upvote para agregar

  upvote() {
     this.nombre = this.persona.nombre;
     this.nombre = this.persona.nombre;
  }

  //Metodo que mandara el objeto PersonaVO por medio de HHTPREQUEST

  registrardatos() {

    if(this.captures[0]==null){
      alert("Favor de tomarse la foto");
     }else{

         this.onTest();
    }
    this.enviaralExamen();
  }

  onTest(): void{
    this.upPerson();
  }

  enviaralExamen(): void{
    this.quitartodo = false;
    this.mostrartest = true;
    this.ejemplo = true;

    this.createComponent();
  }


  //Metodo para tomar foto de la camara web, y la guarda en una variable que se estara reemplazando cada vez que se lanze este evento

  public capture() {
      var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);
      this.captures[0] = this.canvas.nativeElement.toDataURL("image/png");
      this.imagen = this.captures[0];
      var imagefile = this.dataURLtoFile(this.imagen, 'image/png');
      var blob = imagefile.slice(0, imagefile.size, 'image/png');
      var newFile = new File([blob], 'name.png', {type: 'image/png'});
         this.apollo
         .mutate({
           mutation: M.SINGLE_UPLOAD,
           variables: {
             file: newFile
           }
         }).subscribe(
           data => {
             console.log('upload successfully');
           },
           err => console.log(err)
         );
      this.tomarfoto = true;
      this.mostrarboton();


    //  uploader: FileUploader = new FileUploader({ url: "http://localhost:4200/", removeAfterUpload: false, autoUpload: true });


   }

     dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

   mostrarboton(){
     /*
     if((this.banderacurpcorrecta == true) && (this.tomarfoto == true)){
       this.mostrartBtnSelTest = true;
     }else{
       this.mostrartBtnSelTest = false;
     }

     */

     this.mostrartBtnSelTest = true;

    }


   //Metodo para verificar la curp
   verificarCURP(){
     var regex =
                     "[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}" +
                     "(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])" +
                     "[HM]{1}" +
                     "(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)" +
                     "[B-DF-HJ-NP-TV-Z]{3}" +
                     "[0-9A-Z]{1}[0-9]{1}$";
                          let regexp = new RegExp(regex);
                          if(regexp.test(this.persona.curp)){
                            this.banderacurpcorrecta = true;
                            this.advertenciaCURP = false;

                            this.mostrarboton()
                             //Aqui mandaria a llamar para ver si la CURP no tiene bloqueo
                          }else{
                            this.advertenciaCURP = true;
                            this.mostrartBtnSelTest = false;

                          }
   }

   //Metodo que muestra la camara web en pantalla

  public ngAfterViewInit() {
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
              this.video.nativeElement.srcObject = stream;
              this.video.nativeElement.play();
          });
      }
  }

  beforemostrarexamenes(){

    this.mostrartBtnSelTest = false;

    this.mostrarexamenes = true;
    this.vercarousel();
    this.traerexamenes();
  }


      vercarousel(){
        this.variable = true;


  $(function(){ $('.carousel.carousel-slider').carousel({full_width: true,indicators: true}); });

  this.pintarIndicadores();

      }

      pintarIndicadores(){
        var indicatorActive;
        var indicator;
        var delayInMilliseconds = 100; //1 second
          setTimeout(function(
          ) {
            indicatorActive =  ( document.getElementsByClassName("indicator-item active"));
            indicator  =  ( document.getElementsByClassName("indicator-item"));

            for(var i=0;i< indicatorActive.length;i++){
              console.log(indicatorActive[i]);
              indicatorActive[i].style.backgroundColor = "000";
            }

            for(var i=0;i< indicator.length;i++){
              console.log(indicator[i]);
              indicator[i].style.backgroundColor = "000";

            }

          }, delayInMilliseconds);


      }


  aftermostrarexamenes(){
    this.mostrarexamenes = false;

  }

  //Metodo para guardar la foto


    ///guardar foto
/*
onFileUpload(event){
this.selecetdFile = event.target.files[0];
const reader = new FileReader();
reader.onload = () => {
this.imagePreview = reader.result;
};
reader.readAsDataURL(this.selecetdFile);
}
OnUploadFile() {
//Upload file here send a binary data
this.http.post(‘yourdomain.com/file-upload’, this.selectedFile)
.subscribe(…);
}

*/

  //Metodo para guardar una persona
  upPerson() {
     this.nombre = this.persona.nombre;
    this.primer_apellido = this.persona.primer_apellido;
    this.segundo_apellido = this.persona.segundo_apellido;
    this.curp = this.persona.curp;
  }

  //Sobreescribir curp
   sobreescribircurp(curpenvi: string){
     this.curpenviar = curpenvi;
      this.enviaralExamen();
   }

   //Seleccion de examen
   seleccionarExamen(exsel: any){
     console.log(exsel);
      this.configuracionExamen = exsel;
      this.mostrarbotonrealizarexamen = true;
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


          this.recibirDatos();
   }


   recibirDatos(){
      this.id = 1;
     this.curp = "SAGC940106HOCNZS00";
   }


       createComponent() {
                  let componentFactory = this.CFR.resolveComponentFactory(TestComponent);
                  let componentRef: ComponentRef<any> = this.VCR.createComponent(componentFactory);
                  let currentComponent = componentRef.instance;
                  currentComponent.selfRef = currentComponent;
                  currentComponent.index = ++this.index;
                  currentComponent.persona = this.persona;
                  currentComponent.configuracionExamen = this.configuracionExamen;

                  currentComponent.compInteraction = this;
                  this.componentsReferences.push(componentRef);
                }





}
