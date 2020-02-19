import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent {

  @Input()
  folders: any[];

  @Input()
  getFolderTextFn: (_: any) => string;

  @Input()
  getFileTextFn: (_: any) => string;

  @Input()
  getFilesFn: (_: any) => any[];

  @Input()
  getFoldersFn: (_: any) => any[];

  @Output()
  selectFolder: EventEmitter<any>;

  @Output()
  selectFile: EventEmitter<any>;

  constructor() {
    this.folders = [];
    this.getFolderTextFn = (_) => '';
    this.getFileTextFn = (_) => '';
    this.getFilesFn = (_) => [];
    this.getFoldersFn = (_) => [];
    this.selectFolder = new EventEmitter<any>();
    this.selectFile = new EventEmitter<any>();
  }
}
