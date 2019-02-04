import { NgModule } from '@angular/core';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from "../../Shared/shared.module";

import { PostRoutingModule } from './post-routing.module';
import { PostListComponent } from './Views/post-list/post-list.component';
import { PostCreateComponent } from './Views/post-create/post-create.component';


@NgModule({
  declarations: [
      PostCreateComponent,
      PostListComponent
  ],
  imports: [
    SharedModule,
    PostRoutingModule,

    TranslateModule,
    FuseSharedModule,

    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
  ]
})
export class PostModule {}
