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
    deleteSpinner: boolean = false;

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
                    if(response['code'] == 200){
                        this.openSnackBar(response['message'], 'X', 'success');
                        let newData = this.dataSource.data;
                        newData.splice(index, 1);
                        this.dataSource = new MatTableDataSource<any>(newData);
                    }else{
                        this.openSnackBar(response['message'], 'X', 'error', 10000);
                    }
                    this.deleteSpinner = false;
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
                this.deleteSpinner = true;
                this.delete(id, index);
            }
        });
    }

    openSnackBar(message: string, action: string, type: string, duration: number = 2000) {
        let bgClass = [''];
        if(type == 'error'){
            bgClass = ['red-snackbar-bg'];
        }else if(type == 'success'){
            bgClass = ['green-snackbar-bg'];
        }

        this.snackBar.open(message, action, {
            duration: duration,
            panelClass: bgClass,
        });
    }

    bulkDelete(){
        const dialogRef = this.dialog.open(AccioDialogComponent, {
            width: '400px',
            data: {
                title: 'Delete',
                text: 'Are you sure that you want to delete these Languages?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'confirm'){
                this.deleteSpinner = true;

                let selectedData = this.selection.selected;
                var keyArray = selectedData.map(function(item) { return item["languageID"]; });
                let data = { ids: keyArray };

                this.httpClient.post('/admin/json/language/bulk-deletes', data)
                    .map(
                        (response) => {
                            if(response['code'] == 200){
                                this.removeSelection();
                                this.openSnackBar(response['message'], 'X', 'success');

                                let newData = this.dataSource.data;
                                newData = newData.filter(item => !keyArray.includes(item.languageID) );
                                this.dataSource = new MatTableDataSource<any>(newData);
                            }else{
                                this.openSnackBar(response['message'], 'X', 'error', 10000);
                            }
                            this.deleteSpinner = false;
                        }
                    )
                    .subscribe();
            }
        });
    }

    removeSelection(){
        this.selection.clear();
    }
}
