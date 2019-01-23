import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './Views/settings/settings.component';
import { AnalyticsComponent } from './Views/analytics/analytics.component';
import { GeneralSettingsComponent } from './Views/general/general-settings.component';
import { LanguageListComponent } from './Views/language/language-list.component';
import { PostTypeListComponent } from './Views/post-types/post-type-list.component';

const userRoutes: Routes = [
    { path: '', component: SettingsComponent, children: [
        { path: 'general', component: GeneralSettingsComponent },
        { path: 'analytics', component: AnalyticsComponent },
        { path: 'language', component: LanguageListComponent },
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
