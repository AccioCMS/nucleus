import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, Inject} from "@angular/core";

@Component({
    selector: 'accio-dialog',
    template: `
        <h1 mat-dialog-title>{{ data.title }}</h1>
        <div mat-dialog-content>
            <p>{{ data.text }}</p>
        </div>
        <div mat-dialog-actions style="float:right">
            <button mat-button [mat-dialog-close]="'cancel'">No</button>
            <button mat-button color="accent" [mat-dialog-close]="'confirm'" cdkFocusInitial>Confirm</button>
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
