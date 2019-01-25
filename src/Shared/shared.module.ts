import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule, MatTabsModule } from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { NucleusTemplateHeaderComponent } from './App/template-header/template-header.component';
import { AccioDialogComponent } from './App/accio-dialog/accio-dialog.component';

import { StoreModule } from "@ngrx/store";
import { sharedReducer } from './Store/shared.reducers';

@NgModule({
    declarations: [
        NucleusTemplateHeaderComponent,
        AccioDialogComponent
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
        MatDialogModule,
        MatProgressSpinnerModule,

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
        MatTabsModule,
        MatDialogModule,
        MatProgressSpinnerModule
    ],
    entryComponents: [
        AccioDialogComponent
    ]
})
export class SharedModule { }
