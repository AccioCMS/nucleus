import { NgModule } from '@angular/core';

import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsRoutingModule } from './settings-routing.module';

import { SharedModule } from "../../Shared/shared.module";

import { GeneralSettingsComponent } from './Views/general/general-settings.component';

@NgModule({
  declarations: [
    GeneralSettingsComponent
  ],
  imports: [
    SettingsRoutingModule,
    SharedModule,

    TranslateModule,
    FuseSharedModule,
  ]
})
export class SettingsModule {}
