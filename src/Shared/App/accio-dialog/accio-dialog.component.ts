import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, Inject} from "@angular/core";

@Component({
    selector: 'accio-dialog',
    template: `
        <h1 mat-dialog-title>{{ data.title | translate }}</h1>
        <div mat-dialog-content>
            <p>{{ data.text | translate }}</p>
        </div>
        <div mat-dialog-actions style="float:right">
            <button mat-button [mat-dialog-close]="'cancel'">{{ 'no' | translate }}</button>
            <button mat-button color="accent" [mat-dialog-close]="'confirm'" cdkFocusInitial>{{ 'confirm' | translate }}</button>
        </div>
    `
})
export class AccioDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<AccioDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {}
    )
    {}
}
