import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatTabsModule,
    MatSlideToggleModule} from '@angular/material';

import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import {
    MatGridListModule,
    MatCardModule,
    MatChipsModule,
    MatPaginatorModule,
    MatTableModule,
    MatMenuModule,
    MatSortModule
} from '@angular/material';

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
        MatRadioModule,
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
        MatProgressBarModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatGridListModule,
        MatCardModule,
        MatChipsModule,
        MatPaginatorModule,
        MatTableModule,
        MatMenuModule,
        MatSortModule,

        StoreModule.forFeature('shared', sharedReducer),
    ],
    exports: [
        NucleusTemplateHeaderComponent,

        //Material
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,
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
        MatProgressBarModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatGridListModule,
        MatCardModule,
        MatChipsModule,
        MatPaginatorModule,
        MatTableModule,
        MatMenuModule,
        MatSortModule,
    ],
    entryComponents: [
        AccioDialogComponent
    ]
})
export class SharedModule { }
