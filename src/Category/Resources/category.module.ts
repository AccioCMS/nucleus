import { NgModule } from '@angular/core';
import {
    MatGridListModule, MatCardModule, MatChipsModule,
    MatPaginatorModule, MatTableModule, MatMenuModule,
    MatSlideToggleModule, MatSortModule
} from '@angular/material';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../Shared/shared.module';

import { CategoryRoutingModule } from './category-routing.module'
import { CategoryListComponent } from './Views/category-list/category-list.component';
import { CategoryCreateComponent } from './Views/category-create/category-create.component';
import { CategoryEditComponent } from './Views/category-edit/category-edit.component';

@NgModule({
  declarations: [
      CategoryListComponent,
      CategoryCreateComponent,
      CategoryEditComponent
  ],
  imports: [
      SharedModule,
      CategoryRoutingModule,

      MatGridListModule,
      MatCardModule,
      MatChipsModule,
      MatPaginatorModule,
      MatTableModule,
      MatMenuModule,
      MatSlideToggleModule,
      MatSnackBarModule,
      MatSortModule,
      MatAutocompleteModule,

      TranslateModule,
      FuseSharedModule,

      FroalaEditorModule,
      FroalaViewModule
  ]
})
export class CategoryModule {}
