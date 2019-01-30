import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryListComponent } from './Views/category-list/category-list.component';
import { CategoryCreateComponent } from './Views/category-create/category-create.component';
import { CategoryEditComponent } from './Views/category-edit/category-edit.component';

const postRoutes: Routes = [
    { path: 'list/:id', component: CategoryListComponent },
    { path: 'create/:id', component: CategoryCreateComponent },
    { path: 'edit/:id', component: CategoryEditComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(postRoutes)
    ],
    exports: [RouterModule]
})
export class CategoryRoutingModule {}
