import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralSettingsComponent } from './Views/general/general-settings.component';

const userRoutes: Routes = [
    { path: 'general', component: GeneralSettingsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(userRoutes)
  ],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
