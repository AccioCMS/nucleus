import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
import { locale as turkish } from '../../i18n/tr';

import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';

import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router";

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatSnackBar} from '@angular/material';

import { AccioDialogComponent } from "../../../../Shared/App/accio-dialog/accio-dialog.component";

@Component({
    selector   : 'language-list',
    templateUrl: './language-list.component.html',
    styleUrls  : ['./language-list.component.scss']
})
export class LanguageListComponent implements OnInit
{
    displayedColumns: string[] = ['select', 'id', 'name', 'isDefault', 'slug', 'buttons'];
    dataSource = new MatTableDataSource<any>([]);
    selection = new SelectionModel<any>(true, []);
    breadcrumbs = ['Settings', 'Languages'];
    spinner: boolean = true;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private httpClient: HttpClient,
        private router: Router,
        private route:ActivatedRoute,
        public dialog: MatDialog,
        public snackBar: MatSnackBar
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }

    ngOnInit(){
        this.httpClient.get('/admin/en/json/language/get-all')
            .map(
                (response) => {
                    this.dataSource = new MatTableDataSource<any>(response['data']);
                    this.spinner = false;
                }
            )
            .subscribe();
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    addNew(){
        this.router.navigate(['../add/'], {relativeTo: this.route});
    }

    delete(id, index){
        this.httpClient.get('/admin/en/json/language/delete/'+id)
            .map(
                (response) => {
                    this.openSnackBar(response['message'], '');
                    if(response['code'] == 200){
                        let newData = this.dataSource.data;
                        newData.splice(index, 1);
                        this.dataSource = new MatTableDataSource<any>(newData);
                    }
                }
            )
            .subscribe();
    }

    edit(id){
        this.router.navigate(['../edit/'+id], {relativeTo: this.route});
    }

    openDialog(id, index): void {
        const dialogRef = this.dialog.open(AccioDialogComponent, {
            width: '400px',
            data: {
                title: 'Delete',
                text: 'Are you sure that you want to delete this Language?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'confirm'){
                this.delete(id, index);
            }
        });
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
