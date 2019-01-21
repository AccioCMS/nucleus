import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostListComponent } from './Views/post-list/post-list.component';
import { NewPostComponent } from './Views/post-new/post-new.component';

const postRoutes: Routes = [
    { path: 'list', component: PostListComponent },
    { path: 'add', component: NewPostComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(postRoutes)
  ],
  exports: [RouterModule]
})
export class PostRoutingModule {}
