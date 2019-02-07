import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TranslateModule } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import 'hammerjs';

import { FuseModule } from './@fuse/fuse.module';
import { FuseSharedModule } from './@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule } from './@fuse/components';

import { LayoutModule } from './app-fuse/layout/layout.module';
import { SampleModule } from './app-fuse/main/sample/sample.module';
import { VerticalLayout1Module } from './app-fuse/layout/vertical/layout-1/layout-1.module';
import { AuthModule } from "../Auth/Resources/auth.module";
import { UserModule } from '../User/Resources/user.module';
import { CategoryModule } from '../Category/Resources/category.module';
import { CustomFieldModule } from '../CustomField/Resources/customFields.module';
import { LanguageModule } from '../Language/Resources/language.module';
import { MediaModule } from '../Media/Resources/media.module';
import { MenuModule } from '../Menu/Resources/menu.module';
import { PostModule } from '../Post/Resources/post.module';
import { PostTypeModule } from '../PostType/Resources/post-type.module';
import { SettingsModule } from '../Settings/Resources/settings.module';
import { TagModule } from '../Tag/Resources/tag.module';
import { LabelModule } from '../Label/Resources/label.module';

import { DashboardComponent } from "./App/Dashboard/daashboard.component";
import { LoginComponent } from "../Auth/Resources/Views/login/login.component";
import { NucleusComponent } from "./App/nucleus.component";
import { UpdateLanguageRedirectComponent } from "./App/update-language-redirect/update-language-redirect.component";

import { fuseConfig } from './app-fuse/fuse-config';
import { SharedModule } from './shared.module';

import { HttpClientModule} from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';

import { AuthGuard } from "../Auth/Resources/auth-guard.service";
import {AuthInterceptor} from "../Auth/Resources/auth.interceptor";

const nucleusRoutes: Routes = [
    { path: 'admin/login', component: LoginComponent },
    { path: 'auth', loadChildren: () => AuthModule },
    { path: ':adminPrefix/:lang', component: NucleusComponent, /*canActivate: [AuthGuard],*/ children: [
        { path: '', component: DashboardComponent },
        { path: 'fuse', loadChildren: () => SampleModule },
        { path: 'user', loadChildren: () => UserModule },
        { path: 'custom-fields', loadChildren: () => CustomFieldModule },
        { path: 'language', loadChildren: () => LanguageModule },
        { path: 'menu', loadChildren: () => MenuModule },
        { path: 'post-type', loadChildren: () => PostTypeModule },
        { path: 'post-type/category', loadChildren: () => CategoryModule },
        { path: 'post-type/tag', loadChildren: () => TagModule },
        { path: 'posts/:post_type', loadChildren: () => PostModule },
        { path: 'settings', loadChildren: () => SettingsModule },
        { path: 'update-language', component: UpdateLanguageRedirectComponent },
    ] },
];

@NgModule({
    declarations: [
        NucleusComponent,
        DashboardComponent,
        UpdateLanguageRedirectComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(nucleusRoutes),

        //Fuse imports
        BrowserAnimationsModule,
        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,

        // App modules
        LayoutModule,
        SampleModule,
        VerticalLayout1Module,

        AuthModule,
        UserModule,
        CategoryModule,
        CustomFieldModule,
        LanguageModule,
        MediaModule,
        MenuModule,
        PostModule,
        PostTypeModule,
        SettingsModule,
        TagModule,
        LabelModule,
        BrowserModule,
        HttpClientModule
    ],

    exports: [
        AuthModule,
        RouterModule,
    ],
    providers: [
        AuthGuard,
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    ]
})
export class MainModule { }
