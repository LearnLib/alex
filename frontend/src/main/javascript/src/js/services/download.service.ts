/*
 * Copyright 2015 - 2019 TU Dortmund
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

import * as angular from 'angular';

/**
 * The service that helps with downloading various kind of files.
 */
export class DownloadService {

  /**
   * Downloads a file.
   *
   * @param filename The name of the file.
   * @param fileExtension The file extension of the file.
   * @param href The contents of the href attribute which holds the data of the file.
   */
  download(filename: string, fileExtension: string, href: string): void {

    // create new link element with downloadable content
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.setAttribute('download', filename + '.' + fileExtension);
    a.click();
  }

  /**
   * Downloads a javascript object as a json file.
   *
   * @param obj The javascript object or array.
   * @param filename The name of the file to download.
   */
  downloadObject(obj: any, filename: string): void {
    const href = 'data:text/json;charset=utf-8,' + encodeURIComponent(angular.toJson(obj, true));
    this.download(filename, 'json', href);
  }

  /**
   * Downloads plain text as a file.
   *
   * @param filename The name of the file.
   * @param extension The file extension.
   * @param text The text to download.
   */
  downloadText(filename: string, extension: string, text: string): void {
    const href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
    this.download(filename, extension, href);
  }

  /**
   * Downloads the table.
   *
   * @param table The table to download.
   * @param filename The name of the file to download.
   */
  downloadTableEl(table: Element, filename: string): void {
    const head = table.querySelectorAll('thead th');
    const rows = table.querySelectorAll('tbody tr');
    let csv = '';

    // add entries from table head
    if (head.length > 0) {
      for (let i = 0; i < head.length; i++) {
        csv += head[i].textContent.replace(',', ' ') + (i === head.length - 1 ? '\n' : ',');
      }
    }

    // add entries from table row
    if (rows.length > 0) {
      for (let i = 0; i < rows.length; i++) {
        var tds = rows[i].querySelectorAll('td');
        if (tds.length > 0) {
          for (let j = 0; j < tds.length; j++) {
            csv += tds[j].textContent.replace(',', ' ') + (j === tds.length - 1 ? '\n' : ',');
          }
        }
      }
    }

    this.downloadCsv(csv, filename);
  }

  /**
   * Downloads csv formatted data.
   *
   * @param data The csv formatted data.
   * @param filename The name of the file.
   */
  downloadCsv(data: string, filename: string): void {
    const href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
    this.download(filename, 'csv', href);
  }

  /**
   * Downloads xml formatted data.
   *
   * @param data The xml formatted data.
   * @param filename The name of the file.
   */
  downloadXml(data: string, filename: string): void {
    const href = 'data:text/xml;charset=utf-8,' + encodeURIComponent(data);
    this.download(filename, 'xml', href);
  }

  /**
   * Downloads the svg.
   *
   * @param svg The svg element to download.
   * @param adjustSize If the svg content should be resized to the svg element dimensions.
   * @param filename The name of the file to download.
   */
  downloadSvgEl(svg: any, adjustSize: boolean, filename: string): void {
    // copy svg to prevent the svg being clipped due to the window size
    const svgCopy = svg.cloneNode(true);
    const g = svg.querySelector('g');

    // set proper xml attributes for downloadable file
    svgCopy.setAttribute('version', '1.1');
    svgCopy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    if (adjustSize) {
      const scale = g.getScreenCTM().inverse().multiply(svg.getScreenCTM()).a;
      const dimension = g.getBoundingClientRect();
      const width = Math.ceil(dimension.width / scale) + 20;    // use 20px as offset
      const height = Math.ceil(dimension.height / scale) + 20;

      svgCopy.setAttribute('width', width);
      svgCopy.setAttribute('height', height);
      svgCopy.querySelector('g').setAttribute('transform', 'translate(10,10)');
    }

    // create serialized string from svg element and encode it in
    // base64 otherwise the file will not be completely downloaded
    // what results in errors opening the file
    const svgString = new XMLSerializer().serializeToString(svgCopy);
    const href = 'data:image/svg+xml;base64,\n' + window.btoa(svgString);

    this.download(filename, 'svg', href);
  }
}
