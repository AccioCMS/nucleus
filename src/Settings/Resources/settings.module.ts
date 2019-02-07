import { NgModule } from '@angular/core';

import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from "../../Shared/shared.module";

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './Views/settings/settings.component';
import { AnalyticsComponent } from './Views/analytics/analytics.component';
import { GeneralSettingsComponent } from './Views/general/general-settings.component';
import { PermalinkComponent } from './Views/permalink/permalink.component';

@NgModule({
  declarations: [
      SettingsComponent,
      AnalyticsComponent,
      GeneralSettingsComponent,
      PermalinkComponent
  ],
  imports: [
      SettingsRoutingModule,
      SharedModule,

      TranslateModule,
      FuseSharedModule,
  ]
})
export class SettingsModule {}
