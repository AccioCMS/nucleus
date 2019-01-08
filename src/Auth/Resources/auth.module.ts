import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

import { LoginComponent } from "./Views/login/login.component";
import { ForgotPasswordComponent } from "./Views/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./Views/reset-password/reset-password.component";

import { AuthRoutingModule } from './auth-routing.module';

import { FuseSharedModule } from '../../Shared/@fuse/shared.module';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    AuthRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FuseSharedModule
  ]
})
export class AuthModule {}
