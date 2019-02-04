import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TagListComponent } from './Views/tag-list/tag-list.component-list.component';
import { UserCreateComponent} from "./Views/tag-create/tag-create.component";
import { UserUpdateComponent} from "./Views/tag-update/tag-update.component";

const tagRoutes: Routes = [
    { path: 'list', component: TagListComponent },
    // { path: 'create', component: UserCreateComponent },
    // { path: 'edit/:id', component: UserUpdateComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(userRoutes)
    ],
    exports: [RouterModule]
})
export class UserRoutingModule {}
