import { NgModule } from '@angular/core';

import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../Shared/shared.module';

import { PostTypeRoutingModule } from './post-type-routing.module';
import { PostTypeListComponent } from './Views/post-type-list/post-type-list.component';
import { PostTypeCreateComponent } from './Views/post-type-create/post-type-create.component';
import { PostTypeEditComponent } from './Views/post-type-edit/post-type-edit.component';

@NgModule({
  declarations: [
      PostTypeListComponent,
      PostTypeCreateComponent,
      PostTypeEditComponent
  ],
  imports: [
      SharedModule,
      PostTypeRoutingModule,

      TranslateModule,
      FuseSharedModule,
  ]
})
export class PostTypeModule {}
