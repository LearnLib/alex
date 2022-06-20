/*
 * Copyright 2015 - 2022 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AfterViewInit, Component, ElementRef, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import * as ace from 'ace-builds';

@Component({
  selector: 'ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: ['./ace-editor.component.scss']
})
export class AceEditorComponent implements AfterViewInit {

  @Input() initialValue: string = '';

  @Input() theme: string = 'eclipse';

  @Input() mode: string = 'text';

  @Input() style: string = 'min-height: 200px; width:100%; overflow: auto;';

  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('editor') editor: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    ace.config.set('fontSize', '14px');
    ace.config.set('basePath', 'https://ace.c9.io/build/src-noconflict/');

    const aceEditor = ace.edit(this.editor.nativeElement);
    aceEditor.setTheme(`ace/theme/${this.theme}`);
    aceEditor.session.setMode(`ace/theme/${this.mode}`);
    aceEditor.session.setValue(this.initialValue || '');
    aceEditor.session.on('change', () => {
      this.valueChange.emit(aceEditor.getValue());
    });
  }
}
