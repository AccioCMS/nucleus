import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';

import { AuthModule } from "../Auth/Resources/auth.module";
import { HeaderComponent } from "./Header/header.component";

import { DashboardComponent } from "./App/Dashboard/daashboard.component";
import { LoginComponent } from "../Auth/Resources/Views/login/login.component";
import { NucleusComponent } from "./App/nucleus.component";

//Fuse
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from './@fuse/fuse.module';
import { FuseSharedModule } from './@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule } from './@fuse/components';

import { fuseConfig } from './app-fuse/fuse-config';

import { LayoutModule } from './app-fuse/layout/layout.module';
import { SampleModule } from './app-fuse/main/sample/sample.module';

import { AppComponent } from './app-fuse/app.component';

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
        DashboardComponent,
        //AppComponent
    ],
    imports: [
        CommonModule,
        AuthModule,
        RouterModule.forChild(nucleusRoutes),

        //Fuse imports
        BrowserAnimationsModule,
        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,

        // App modules
        LayoutModule,
        SampleModule

    ],
    exports: [
        AuthModule,
        RouterModule
    ]
})
export class MainModule { }