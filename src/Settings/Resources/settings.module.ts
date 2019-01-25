import { NgModule } from '@angular/core';

import { MatSlideToggleModule } from '@angular/material';

import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsRoutingModule } from './settings-routing.module';

import { SharedModule } from "../../Shared/shared.module";

import { SettingsComponent } from './Views/settings/settings.component';
import { AnalyticsComponent } from './Views/analytics/analytics.component';
import { GeneralSettingsComponent } from './Views/general/general-settings.component';
import { PostTypeListComponent } from './Views/post-types/post-type-list.component';

@NgModule({
  declarations: [
    SettingsComponent,
    AnalyticsComponent,
    GeneralSettingsComponent,
    PostTypeListComponent
  ],
  imports: [
    SettingsRoutingModule,
    SharedModule,

    TranslateModule,
    FuseSharedModule,

      //Material
      MatSlideToggleModule
  ]
})
export class SettingsModule {}
