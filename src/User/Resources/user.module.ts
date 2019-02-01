import { NgModule } from '@angular/core';

import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from "../../Shared/shared.module";

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './Views/user-list/user-list.component';
import { UserCreateComponent} from "./Views/user-create/user-create.component";
import { UserUpdateComponent} from "./Views/user-update/user-update.component";

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

@NgModule({
  declarations: [
    UserListComponent,
    UserCreateComponent,
    UserUpdateComponent
  ],
  imports: [
    UserRoutingModule,

    TranslateModule,
    FuseSharedModule,
    SharedModule,

    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
  ]
})
export class UserModule {}
