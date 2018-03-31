/*
 * Copyright 2016 TU Dortmund
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

/**
 * The service that helps with downloading various kind of files.
 */
export class DownloadService {

    /**
     * Constructor.
     *
     * @param $document
     */
    // @ngInject
    constructor($document) {
        this.document = $document[0];
    }

    /**
     * Downloads a file.
     *
     * @param {string} filename - The name of the file.
     * @param {string} fileExtension - The file extension of the file.
     * @param {string} href - The contents of the href attribute which holds the data of the file.
     */
    download(filename, fileExtension, href) {

        // create new link element with downloadable content
        const a = this.document.createElement('a');
        a.style.display = 'none';
        a.setAttribute('href', href);
        a.setAttribute('download', filename + '.' + fileExtension);
        a.click();
    }

    /**
     * Downloads a javascript object as a json file.
     *
     * @param {object} obj - The javascript object or array.
     * @param {string} filename - The name of the file to download.
     */
    downloadObject(obj, filename) {
        const href = 'data:text/json;charset=utf-8,' + encodeURIComponent(angular.toJson(obj));
        this.download(filename, 'json', href);
    }

    /**
     * Downloads plain text as a file.
     *
     * @param {string} filename - The name of the file.
     * @param {string} extension - The file extension.
     * @param {string} text - The text to download.
     */
    downloadText(filename, extension, text) {
        const href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
        this.download(filename, extension, href);
    }

    /**
     * Downloads the table given by the selector. The selector can also be a parent element of the table.
     * It is then searched for child elements that are table elements.
     *
     * @param {string} selector - The selector of a table or a parent of a table.
     * @param {string} filename - The name of the file to download.
     */
    downloadTable(selector, filename) {
        let table = null;
        const tableCandidate = this.document.querySelector(selector);
        if (tableCandidate.nodeName.toLowerCase() !== 'table') {
            table = tableCandidate.querySelector('table');
            if (table === null) return;
        } else {
            table = tableCandidate;
        }

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
     * @param {string} data - The csv formatted data.
     * @param {string} filename - The name of the file.
     */
    downloadCsv(data, filename) {
        const href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
        this.download(filename, 'csv', href);
    }

    /**
     * Downloads xml formatted data.
     *
     * @param {string} data - The xml formatted data.
     * @param {string} filename - The name of the file.
     */
    downloadXml(data, filename) {
        const href = 'data:text/xml;charset=utf-8,' + encodeURIComponent(data);
        this.download(filename, 'xml', href);
    }

    /**
     * Downloads the svg given as the selector. The selector can also be a parent element of the svg.
     * It is then searched for child elements that are svg elements.
     *
     * @param {string} selector - The selector of the svg or an parent of the svg.
     * @param {boolean} adjustSize - If the svg content should be resized to the svg element dimensions.
     * @param {string} filename - The name of the file to download.
     */
    downloadSvg(selector, adjustSize, filename) {
        let svg = null;
        const svgCandidate = this.document.querySelector(selector);
        if (svgCandidate.nodeName.toLowerCase() !== 'svg') {
            svg = svgCandidate.querySelector('svg');
            if (svg === null) return;
        } else {
            svg = svgCandidate;
        }

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
