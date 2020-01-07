import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { MantenimientoexamenComponent } from './mantenimientoexamen/mantenimientoexamen.component';
import { RegisterComponent } from './register/register.component';
import {AuthorizatedAfterLoginGuard} from "./core/guards/authorizatedafterlogin.guard";
import {AuthorizatedGuard} from "./core/guards/authorizated.guard";
const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [ AuthorizatedAfterLoginGuard ]},
  { path: 'mantenimientotest', component: MantenimientoexamenComponent,  pathMatch: 'full' },
  { path: 'examen', component: RegisterComponent,  pathMatch: 'full' },
  { path: 'resetpassword', component: ResetPasswordComponent, canActivate: [ AuthorizatedGuard ]},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
