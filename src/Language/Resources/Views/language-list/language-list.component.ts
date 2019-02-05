import {Component, OnDestroy, OnInit} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
import { locale as turkish } from '../../i18n/tr';

import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';

import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router";

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import {Observable, Subject} from "rxjs/index";
import { takeUntil } from 'rxjs/operators';

import { AccioDialogComponent } from "../../../../Shared/App/accio-dialog/accio-dialog.component";

import { Store } from '@ngrx/store';
import * as SharedActions from "../../../../Shared/Store/shared.actions";

@Component({
    selector   : 'language-list',
    templateUrl: './language-list.component.html',
    styleUrls  : ['./language-list.component.scss']
})
export class LanguageListComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    displayedColumns: string[] = ['select', 'id', 'name', 'isDefault', 'slug', 'buttons'];
    dataSource = new MatTableDataSource<any>([]);
    selection = new SelectionModel<any>(true, []);
    breadcrumbs = ['Settings', 'Languages'];
    spinner: boolean = true;
    deleteSpinner: boolean = false;
    mainRouteParams;

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
        public snackBar: MatSnackBar,
        private store: Store<any>

    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(){
        this.mainRouteParams = this.route.parent.parent.parent.parent.snapshot.params;

        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/language/get-all')
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    this.dataSource = new MatTableDataSource<any>(response['data']);
                    this.spinner = false;
                }
            )
            .catch((error: any) => {
                var message = error.message+' \n '+error.error.message;
                this.openSnackBar(message, 'X', 'error', 30000);

                this.spinner = false;
                return Observable.throw(error.message);
            })
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
        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/language/delete/'+id)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    if(response['code'] == 200){
                        this.openSnackBar(response['message'], 'X', 'success');
                        let newData = this.dataSource.data;
                        newData.splice(index, 1);
                        this.dataSource = new MatTableDataSource<any>(newData);

                        this.store.dispatch(new SharedActions.DeleteLanguage(id));
                    }else{
                        this.openSnackBar(response['message'], 'X', 'error', 10000);
                    }
                    this.store.dispatch(new SharedActions.SetIsLoading(false));
                }
            )
            .catch((error: any) => {
                var message = error.message+' \n '+error.error.message;
                this.openSnackBar(message, 'X', 'error', 30000);

                this.store.dispatch(new SharedActions.SetIsLoading(false));
                return Observable.throw(error.message);
            })
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
                this.store.dispatch(new SharedActions.SetIsLoading(true));
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
                this.store.dispatch(new SharedActions.SetIsLoading(true));

                let selectedData = this.selection.selected;
                var keyArray = selectedData.map(function(item) { return item["languageID"]; });
                let data = { ids: keyArray };

                this.httpClient.post('/'+this.mainRouteParams['adminPrefix']+'/json/language/bulk-deletes', data)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .map(
                        (response) => {
                            if(response['code'] == 200){
                                this.removeSelection();
                                this.openSnackBar(response['message'], 'X', 'success');

                                let newData = this.dataSource.data;
                                newData = newData.filter(item => !keyArray.includes(item.languageID) );
                                this.dataSource = new MatTableDataSource<any>(newData);

                                this.store.dispatch(new SharedActions.DeleteMupltipleLanguages(keyArray));
                            }else{
                                this.openSnackBar(response['message'], 'X', 'error', 10000);
                            }

                            this.store.dispatch(new SharedActions.SetIsLoading(false));
                        }
                    )
                    .catch((error: any) => {
                        var message = error.message+' \n '+error.error.message;
                        this.openSnackBar(message, 'X', 'error', 30000);

                        this.store.dispatch(new SharedActions.SetIsLoading(false));
                        return Observable.throw(error.message);
                    })
                    .subscribe();
            }
        });
    }

    removeSelection(){
        this.selection.clear();
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
