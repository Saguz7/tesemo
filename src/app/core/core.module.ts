import { NgModule } from '@angular/core';
import {StorageService} from "./services/storage.service";
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { SubscriptionService } from './subscription.service';
import {AuthorizatedAfterLoginGuard} from "./guards/authorizatedafterlogin.guard";
import {AuthorizatedGuard} from "./guards/authorizated.guard";

@NgModule({
  providers: [
    UserService,
    AuthService,
    SubscriptionService,
    StorageService,
    AuthorizatedAfterLoginGuard,
    AuthorizatedGuard
  ]
})
export class CoreModule {}
