import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostTypeListComponent } from './Views/post-type-list/post-type-list.component';
import { PostTypeCreateComponent } from './Views/post-type-create/post-type-create.component';
import { PostTypeEditComponent } from './Views/post-type-edit/post-type-edit.component';

const postRoutes: Routes = [
    { path: 'list', component: PostTypeListComponent },
    { path: 'add', component: PostTypeCreateComponent },
    { path: 'edit/:id', component: PostTypeEditComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(postRoutes)
    ],
    exports: [RouterModule]
})
export class PostTypeRoutingModule {}
