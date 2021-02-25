/*
 * Copyright 2015 - 2020 TU Dortmund
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

import { Component, Input, OnInit } from '@angular/core';

interface ObservationTable {
  header: any[];
  body: {
    s1: any[];
    s2: any[];
  };
}

@Component({
  selector: 'observation-table',
  templateUrl: './observation-table.component.html',
  styleUrls: ['./observation-table.component.scss']
})
export class ObservationTableComponent implements OnInit {

  /** The data to create the observation table from. */
  @Input()
  data: string;

  /** The data structure of the table. */
  table: ObservationTable;

  ngOnInit(): void {
    this.build();
  }

  /** Build the structure for the observation table. */
  build(): void {
    const rows: any[] = this.data.split('\n');  // the rows of the table
    let marker = 0;                      // a flag that is used to indicate on which set of the table I am

    if (rows.length > 1) {
      for (let i = 0; i < rows.length - 1; i++) {

        // +=====+======+ ... + is checked
        // before the third occurrence of this pattern we are in set S\Sigma
        // after that we are in set S
        if (new RegExp('^(\\+\\=+)+\\+$').test(rows[i])) {
          marker++;
          continue;
        }

        // only check each second row because all others are only separators
        if (i % 2 === 1) {

          //remove column separators and white spaces around the entry content
          rows[i] = rows[i].split('|');
          rows[i].shift();
          rows[i].pop();
          for (let j = 0; j < rows[i].length; j++) {
            rows[i][j] = rows[i][j].trim();
          }

          // fill the table
          if (i === 1) {
            this.table.header = rows[i];
          } else {

            // depending on which set of the table i am
            if (marker === 2) {
              this.table.body.s1.push(rows[i]);
            } else {
              this.table.body.s2.push(rows[i]);
            }
          }
        }
      }
    }
  }
}
