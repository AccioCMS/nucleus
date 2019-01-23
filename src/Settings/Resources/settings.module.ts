import { NgModule } from '@angular/core';

import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsRoutingModule } from './settings-routing.module';

import { SharedModule } from "../../Shared/shared.module";

import { SettingsComponent } from './Views/settings/settings.component';
import { AnalyticsComponent } from './Views/analytics/analytics.component';
import { GeneralSettingsComponent } from './Views/general/general-settings.component';
import { LanguageListComponent } from './Views/language/language-list.component';
import { PostTypeListComponent } from './Views/post-types/post-type-list.component';

@NgModule({
  declarations: [
    SettingsComponent,
    AnalyticsComponent,
    GeneralSettingsComponent,
    LanguageListComponent,
    PostTypeListComponent
  ],
  imports: [
    SettingsRoutingModule,
    SharedModule,

    TranslateModule,
    FuseSharedModule,
  ]
})
export class SettingsModule {}
