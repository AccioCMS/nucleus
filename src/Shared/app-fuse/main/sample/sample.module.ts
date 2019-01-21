import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '../../../@fuse/shared.module';

import { SampleComponent } from './sample.component';

import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule } from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';

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
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,

        //Material
        MatButtonModule, 
        MatCheckboxModule, 
        MatFormFieldModule, 
        MatIconModule, 
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatExpansionModule
    ],
    exports     : [
        SampleComponent
    ]
})

export class SampleModule
{
}
