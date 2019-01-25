import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule,MatTableModule, MatIconModule, MatInputModule, MatMenuModule} from '@angular/material';
import { MatGridListModule,MatCardModule,MatChipsModule,MatPaginatorModule,MatRadioModule,MatSlideToggleModule} from '@angular/material';
import { UserRoutingModule } from './user-routing.module';
import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from "../../Shared/shared.module";
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
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatMenuModule,
    MatGridListModule,
    MatCardModule,
    MatChipsModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSlideToggleModule,
    TranslateModule,
    FuseSharedModule,
    SharedModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
  ]
})
export class UserModule {}
