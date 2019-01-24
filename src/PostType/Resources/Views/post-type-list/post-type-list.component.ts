import { Component, OnInit, Inject } from '@angular/core';

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
    selector   : 'post-type-list',
    templateUrl: './post-type-list.component.html',
    styleUrls  : ['./post-type-list.component.scss']
})
export class PostTypeListComponent implements OnInit
{
    displayedColumns: string[] = ['select', 'id', 'name', 'slug', 'buttons'];
    dataSource = new MatTableDataSource<any>([]);
    selection = new SelectionModel<any>(true, []);

    breadcrumbs = ['Post Types', 'List'];

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
        this.httpClient.get('/admin/en/json/post-type/get-all')
            .map(
                (response) => {
                    this.dataSource = new MatTableDataSource<any>(response['data']);
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

    loadData(){
        this.httpClient.get('/admin/en/json/post-type/get-all')
            .map(
                (response) => {
                    this.dataSource = new MatTableDataSource<any>(response['data']);
                }
            )
            .subscribe();
    }

    delete(id, index){
        this.httpClient.get('/admin/en/json/post-type/delete/'+id)
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

    addNew(){
        this.router.navigate(['../add/'], {relativeTo: this.route});
    }

    openDialog(id, index): void {
        const dialogRef = this.dialog.open(AccioDialogComponent, {
            width: '400px',
            data: {
                title: 'Delete',
                text: 'Are you sure that you want to delete this Post Type?'
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
