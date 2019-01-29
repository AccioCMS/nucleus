import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSlideToggleModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule, MatCardModule, MatChipsModule, MatPaginatorModule, MatTableModule, MatMenuModule, MatSortModule  } from '@angular/material';

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

      //Material
      MatSlideToggleModule,
      MatSnackBarModule,
      MatGridListModule,
      MatGridListModule,
      MatCardModule,
      MatChipsModule,
      MatPaginatorModule,
      MatTableModule,
      MatMenuModule,
      MatSortModule,

      TranslateModule,
      FuseSharedModule,
  ]
})
export class PostTypeModule {}
