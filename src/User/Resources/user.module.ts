import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

import { UserRoutingModule } from './user-routing.module';
import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';

import { UserListComponent } from './Views/user-list/user-list.component';

@NgModule({
  declarations: [
    UserListComponent
  ],
  imports: [
    UserRoutingModule,
    
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,

    TranslateModule,
    FuseSharedModule,
  ]
})
export class UserModule {}
