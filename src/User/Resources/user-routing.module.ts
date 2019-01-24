import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserListComponent } from './Views/user-list/user-list.component';
import { UserCreateComponent} from "./Views/user-create/user-create.component";
import { UserUpdateComponent} from "./Views/user-update/user-update.component";

const userRoutes: Routes = [
    { path: 'list', component: UserListComponent },
    { path: 'add', component: UserCreateComponent },
    { path: 'update/:id', component: UserUpdateComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(userRoutes)
  ],
  exports: [RouterModule]
})
export class UserRoutingModule {}
