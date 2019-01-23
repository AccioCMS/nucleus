import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule } from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';

import { NucleusTemplateHeaderComponent } from './App/template-header/template-header.component';

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
        MatDividerModule
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
        MatDividerModule
    ]
})
export class SharedModule { }
