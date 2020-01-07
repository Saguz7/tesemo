import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule , ReactiveFormsModule}   from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { GraphqlModule } from './graphql/graphql.module';
import { MantenimientoexamenComponent } from './mantenimientoexamen/mantenimientoexamen.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import * as $ from "jquery";
import { LoginComponent } from './login/login.component';
import { CreateTetsComponent } from './createtets/createtets.component';
import { CreateQuestionComponent } from './createquestion/createquestion.component';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import { TestComponent } from './test/test.component';
import {CarouselModule} from 'primeng/carousel';
import { UICarouselModule } from "ui-carousel";
 @NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MantenimientoexamenComponent,
    CreateTetsComponent,
    CreateQuestionComponent,
    RegisterComponent,
    TestComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    FormsModule,
    AppRoutingModule,
    GraphqlModule,
    HttpClientModule,
    ButtonModule,
    TableModule,
    CarouselModule,
    UICarouselModule 
  ],
  entryComponents: [
  TestComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
