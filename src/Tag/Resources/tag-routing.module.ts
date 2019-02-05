import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TagListComponent } from "./Views/tag-list/tag-list.component";
import { TagEditComponent} from "./Views/tag-edit/tag-edit.component";

const tagRoutes: Routes = [
    { path: 'list/:id', component: TagListComponent },
    // { path: 'create', component: UserCreateComponent },
    { path: 'edit/:id', component: TagEditComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(tagRoutes)
    ],
    exports: [RouterModule]
})
export class TagRoutingModule {}
