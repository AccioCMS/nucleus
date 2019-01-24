import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';

@Component({
  selector     : 'nucleus-template-header',
  templateUrl  : './template-header.component.html',
  styleUrls    : ['./template-header.component.scss'],
})

export class NucleusTemplateHeaderComponent implements OnInit{
    @Output() saveClicked = new EventEmitter<any>();
    @Output() cancelClicked = new EventEmitter<any>();

    @Input('breadcrumbs') breadcrumbs: [];
    @Input('showSaveBtn') showSaveBtn: [];
    @Input('saveBtnData') saveBtnData: [];
    @Input('showCancelBtn') showCancelBtn: [];
    @Input('cancelBtnData') cancelBtnData: [];

    ngOnInit(){

    }

    onSave(){
        this.saveClicked.emit();
    }

    onCancel(){
        this.cancelClicked.emit();
    }
}
