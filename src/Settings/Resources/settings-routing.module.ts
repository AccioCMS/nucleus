import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './Views/settings/settings.component';
import { AnalyticsComponent } from './Views/analytics/analytics.component';
import { GeneralSettingsComponent } from './Views/general/general-settings.component';
import { PostTypeListComponent } from './Views/post-types/post-type-list.component';

import {LanguageModule} from "../../Language/Resources/language.module";

const userRoutes: Routes = [
    { path: '', component: SettingsComponent, children: [
        { path: 'general', component: GeneralSettingsComponent },
        { path: 'analytics', component: AnalyticsComponent },
        { path: 'language', loadChildren: () => LanguageModule },
        { path: 'post-type', component: PostTypeListComponent },
    ]}

];

@NgModule({
  imports: [
    RouterModule.forChild(userRoutes)
  ],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
