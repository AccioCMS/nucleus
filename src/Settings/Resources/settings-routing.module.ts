import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './Views/settings/settings.component';
import { AnalyticsComponent } from './Views/analytics/analytics.component';
import { GeneralSettingsComponent } from './Views/general/general-settings.component';
import { PermalinkComponent } from './Views/permalink/permalink.component';

import {LanguageModule} from "../../Language/Resources/language.module";

const userRoutes: Routes = [
    { path: '', component: SettingsComponent, children: [
        { path: '', redirectTo: 'general', pathMatch: 'full' },
        { path: 'general', component: GeneralSettingsComponent },
        { path: 'analytics', component: AnalyticsComponent },
        { path: 'language', loadChildren: () => LanguageModule },
        { path: 'permalinks', component: PermalinkComponent },
    ]}
];

@NgModule({
  imports: [
    RouterModule.forChild(userRoutes)
  ],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
