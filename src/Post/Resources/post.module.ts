import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { PostRoutingModule } from './post-routing.module';
import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';

import { PostListComponent } from './Views/post-list/post-list.component';
import { PostCreateComponent } from './Views/post-create/post-create.component';

import { SharedModule } from "../../Shared/shared.module";
import { AuthInterceptor } from '../../Auth/Resources/auth.interceptor';

@NgModule({
  declarations: [
      PostCreateComponent,
      PostListComponent
  ],
  imports: [
    SharedModule,
    PostRoutingModule,

    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,

    TranslateModule,
    FuseSharedModule,

    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ]
})
export class PostModule {}
