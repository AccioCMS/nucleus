import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule, MatTabsModule } from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';

import { NucleusTemplateHeaderComponent } from './App/template-header/template-header.component';
import { StoreModule } from "@ngrx/store";
import { sharedReducer } from './Store/shared.reducers';

@NgModule({
    declarations: [
        NucleusTemplateHeaderComponent
    ],
    imports: [
        CommonModule,
        //Material
        MatButtonModule, 
        MatCheckboxModule, 
        MatFormFieldModule, 
        MatIconModule, 
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatExpansionModule,
        MatDividerModule,
        MatTabsModule,

        StoreModule.forFeature('shared', sharedReducer),
    ],
    exports: [
        NucleusTemplateHeaderComponent,

        //Material
        MatButtonModule, 
        MatCheckboxModule, 
        MatFormFieldModule, 
        MatIconModule, 
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatExpansionModule,
        MatDividerModule,
        MatTabsModule
    ]
})
export class SharedModule { }