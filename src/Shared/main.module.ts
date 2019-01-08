import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from './@fuse/fuse.module';
import { FuseSharedModule } from './@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule } from './@fuse/components';

import { LayoutModule } from './app-fuse/layout/layout.module';
import { SampleModule } from './app-fuse/main/sample/sample.module';
import { AuthModule } from "../Auth/Resources/auth.module";
import { VerticalLayout1Module } from './app-fuse/layout/vertical/layout-1/layout-1.module';

import { DashboardComponent } from "./App/Dashboard/daashboard.component";
import { LoginComponent } from "../Auth/Resources/Views/login/login.component";
import { NucleusComponent } from "./App/nucleus.component";

import { fuseConfig } from './app-fuse/fuse-config';

const nucleusRoutes: Routes = [
    { path: 'admin/login', component: LoginComponent },
    { path: 'auth', loadChildren: () => AuthModule },
    { path: 'test', component: NucleusComponent, children: [
        { path: '', component: DashboardComponent },
        { path: 'fuse', loadChildren: () => SampleModule },
    ] },
];

@NgModule({
    declarations: [
        NucleusComponent,
        DashboardComponent
    ],
    imports: [
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
        SampleModule,
        VerticalLayout1Module
    ],
    exports: [
        AuthModule,
        RouterModule
    ]
})
export class MainModule { }