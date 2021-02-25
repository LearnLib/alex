/*
 * Copyright 2015 - 2021 TU Dortmund
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

import { Injectable } from '@angular/core';
import * as SvgSaver from 'svgsaver';

/**
 * The service that helps with downloading various kind of files.
 */
@Injectable()
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
    document.body.appendChild(a);
    a.setAttribute('href', href);
    a.setAttribute('download', filename + '.' + fileExtension);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Downloads a javascript object as a json file.
   *
   * @param obj The javascript object or array.
   * @param filename The name of the file to download.
   */
  downloadObject(obj: any, filename: string): void {
    const href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj, null, 2));
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
      for (const row of rows) {
        const tds = row.querySelectorAll('td');
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
   * @param filename The name of the file to download.
   */
  downloadHypothesisAsSvg(svg: any, filename: string): void {
    const panningRectEl = svg.querySelector('.panning-rect');
    const originalWidth = panningRectEl.getAttributeNS(null, 'height');
    const originalHeight = panningRectEl.getAttributeNS(null, 'height');

    panningRectEl.setAttributeNS(null, 'width', '0');
    panningRectEl.setAttributeNS(null, 'height', '0');

    // copy svg to prevent the svg being clipped due to the window size
    const svgCopy = svg.cloneNode(true);
    const g = svg.querySelector('g');
    const transform = g.getAttribute('transform');
    g.removeAttribute('transform');

    // set proper xml attributes for downloadable file
    svgCopy.setAttribute('version', '1.1');
    svgCopy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    svgCopy.querySelectorAll('.edge > path').forEach(p => {
      p.setAttributeNS(null, 'fill', 'none');
      p.setAttributeNS(null, 'stroke', '#000');
    });

    const dimension = g.getBoundingClientRect();

    svgCopy.setAttributeNS(null,'width', '' + dimension.width);
    svgCopy.setAttributeNS(null,'height', '' + dimension.height);
    svgCopy.querySelector('g').removeAttribute('transform');

    const svgSaver = new SvgSaver();
    svgSaver.asSvg(svgCopy, filename + '.svg');

    g.setAttribute('transform', transform);
    panningRectEl.setAttributeNS(null, 'width', '' + originalWidth);
    panningRectEl.setAttributeNS(null, 'height', '' + originalHeight);
  }

  downloadSvg(svg: any, filename: string) {
    const svgSaver = new SvgSaver();
    svgSaver.asSvg(svg, filename + '.svg');
  }

  downloadZipFromBlob(data: Blob, filename: string) {
    const href = URL.createObjectURL(data);
    this.download(filename, 'zip', href);
  }
}
