import { NgModule } from '@angular/core';
import { MatGridListModule, MatCardModule, MatChipsModule, MatPaginatorModule, MatTableModule, MatMenuModule, MatSlideToggleModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../Shared/shared.module';

import { LanguageRoutingModule } from './language-routing.module'
import { LanguageListComponent } from './Views/language-list/language-list.component';
import { LanguageCreateComponent } from './Views/language-create/language-create.component';
import { LanguageEditComponent } from './Views/language-edit/language-edit.component';

@NgModule({
  declarations: [
      LanguageListComponent,
      LanguageCreateComponent,
      LanguageEditComponent
  ],
  imports: [
      SharedModule,
      LanguageRoutingModule,

      MatGridListModule,
      MatCardModule,
      MatChipsModule,
      MatPaginatorModule,
      MatTableModule,
      MatMenuModule,
      MatSlideToggleModule,
      MatSnackBarModule,

      TranslateModule,
      FuseSharedModule,
  ]
})
export class LanguageModule {}
