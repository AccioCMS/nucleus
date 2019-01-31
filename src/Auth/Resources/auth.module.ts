import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { LoginComponent } from "./Views/login/login.component";
import { ForgotPasswordComponent } from "./Views/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./Views/reset-password/reset-password.component";

import { AuthRoutingModule } from './auth-routing.module';

import { FuseSharedModule } from '../../Shared/@fuse/shared.module';

import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from "@ngrx/store";

import { authReducer } from './Store/auth.reducers';


@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
      AuthRoutingModule,

      //Material
      MatButtonModule,
      MatCheckboxModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatProgressBarModule,

      FuseSharedModule,
      HttpClientModule,

      StoreModule.forFeature('auth', authReducer),
  ]
})
export class AuthModule {}
