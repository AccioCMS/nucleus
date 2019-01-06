import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { AuthModule } from "../Auth/Resources/auth.module";
import { HeaderComponent } from "./Header/header.component";

import { NucleusComponent } from '../Shared/App/nucleus.component';

const nucleusRoutes: Routes = [
    { path: 'admin', component: NucleusComponent, children: [
        {path: 'login', loadChildren: () => AuthModule } 
    ] },
];

@NgModule({
    declarations: [
        HeaderComponent,
        NucleusComponent
    ],
    imports: [
        AuthModule,
        RouterModule.forRoot(nucleusRoutes)
    ],
    exports: [
        AuthModule,
        HeaderComponent,
        RouterModule
    ],
})
export class MainModule { }