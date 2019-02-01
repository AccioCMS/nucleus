import { NgModule } from '@angular/core';

import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../Shared/shared.module';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

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

      TranslateModule,
      FuseSharedModule,

      FroalaEditorModule,
      FroalaViewModule,
      NgxMatSelectSearchModule
  ]
})
export class CategoryModule {}
