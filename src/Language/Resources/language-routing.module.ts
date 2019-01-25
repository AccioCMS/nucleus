import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LanguageListComponent } from './Views/language-list/language-list.component';
import { LanguageCreateComponent } from './Views/language-create/language-create.component';
import { LanguageEditComponent } from './Views/language-edit/language-edit.component';

const postRoutes: Routes = [
    { path: 'list', component: LanguageListComponent },
    { path: 'add', component: LanguageCreateComponent },
    { path: 'edit/:id', component: LanguageEditComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(postRoutes)
    ],
    exports: [RouterModule]
})
export class LanguageRoutingModule {}
