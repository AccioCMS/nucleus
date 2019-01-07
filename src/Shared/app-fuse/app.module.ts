import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '../@fuse/fuse.module';
import { FuseSharedModule } from '../@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule } from '../@fuse/components';

import { fuseConfig } from './fuse-config';

import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { SampleModule } from './main/sample/sample.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,  

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
    ]
})
export class AppModule
{
}
