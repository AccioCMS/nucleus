import { NgModule } from '@angular/core';

import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../Shared/shared.module';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

import { TagListComponent } from "./Views/tag-list/tag-list.component";
import { TagEditComponent } from "./Views/tag-edit/tag-edit.component";
import { TagRoutingModule } from "./tag-routing.module";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
@NgModule({
  declarations: [
      TagListComponent,
      TagEditComponent
  ],
  imports: [
    TagRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    SharedModule,
    TranslateModule,
    FuseSharedModule,
    FroalaEditorModule,
    FroalaViewModule
  ]
})
export class TagModule {}
