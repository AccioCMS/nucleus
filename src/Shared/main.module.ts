import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { AuthModule } from "../Auth/Resources/auth.module";
import { HeaderComponent } from "./Header/header.component";

import {DashboardComponent} from "./App/Dashboard/daashboard.component";
import {LoginComponent} from "../Auth/Resources/Views/login/login.component";
import {NucleusComponent} from "./App/nucleus.component";

const nucleusRoutes: Routes = [
    { path: 'admin', component: NucleusComponent, children: [
        {path: '', component: DashboardComponent},
        // { path: 'login', loadChildren: () => AuthModule }
    ] },
    {path: 'admin/login', component: LoginComponent },
];

@NgModule({
    declarations: [
        HeaderComponent,
        NucleusComponent,
        DashboardComponent
    ],
    imports: [
        AuthModule,
        RouterModule.forChild(nucleusRoutes)
    ],
    exports: [
        AuthModule,
        RouterModule
    ],
})
export class MainModule { }