import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '../../../@fuse/shared.module';

import { SampleComponent } from './sample.component';



import { SharedModule } from "../../../shared.module";

const routes = [
    {
        path     : '',
        component: SampleComponent
    }
];

@NgModule({
    declarations: [
        SampleComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
    ],
    exports     : [
        SampleComponent
    ]
})

export class SampleModule
{
}
