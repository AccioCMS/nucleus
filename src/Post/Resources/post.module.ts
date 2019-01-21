import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

import { PostRoutingModule } from './post-routing.module';
import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';

import { PostListComponent } from './Views/post-list/post-list.component';
import { NewPostComponent } from './Views/post-new/post-new.component';

import { SharedModule } from "../../Shared/shared.module";

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

@NgModule({
  declarations: [
    PostListComponent,
    NewPostComponent
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
  ]
})
export class PostModule {}
