import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostListComponent } from './Views/post-list/post-list.component';
import { PostCreateComponent } from './Views/post-create/post-create.component';

const postRoutes: Routes = [
    { path: 'list', component: PostListComponent },
    { path: 'create', component: PostCreateComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(postRoutes)
  ],
  exports: [RouterModule]
})
export class PostRoutingModule {}
