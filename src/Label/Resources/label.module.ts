import { NgModule } from '@angular/core';

import { FuseSharedModule } from '../../Shared/@fuse/shared.module';
import { StoreModule } from "@ngrx/store";
import { labelReducer } from "./Store/label.reducers";

@NgModule({
    declarations: [
    ],
    imports: [
        FuseSharedModule,

        StoreModule.forFeature('label', labelReducer),
    ]
})
export class LabelModule {}
