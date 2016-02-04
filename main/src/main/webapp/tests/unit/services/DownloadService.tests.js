describe('DownloadService', () => {
    let DownloadService, $document;
    let document;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        DownloadService = $injector.get('DownloadService');
        $document = $injector.get('$document');
        document = $document[0];
    }));

    // cannot really test DownloadService.download directly
    // it('should download something given as a href', () => {});

    it('should download an object as json file', () => {
        spyOn(DownloadService, 'download').and.returnValue(null);

        const obj = {
            propA: 'a',
            propB: 'b'
        };

        DownloadService.downloadObject(obj, 'filename');

        expect(DownloadService.download).toHaveBeenCalledWith(
            'filename',
            'json',
            'data:text/json;charset=utf-8,' + encodeURIComponent(angular.toJson(obj))
        );
    });

    it('should download a table by its selector as csv file', () => {
        spyOn(DownloadService, 'download').and.returnValue(null);
        spyOn(DownloadService, 'downloadCsv').and.callThrough();

        const div = document.createElement('div');
        div.innerHTML = `
            <table id="table">
                <thead><tr><th>a</th><th>b</th></tr></thead>
                <tbody><tr><td>c</td><td>d</td></tr></tbody>
            </table>
        `;

        const csv = "a,b\nc,d\n";

        document.body.appendChild(div);
        DownloadService.downloadTable('#table', 'filename');
        expect(DownloadService.downloadCsv).toHaveBeenCalledWith(csv, 'filename');
        document.body.removeChild(div);
    });

    it('should download a table by its parent selector as csv file', () => {
        spyOn(DownloadService, 'download').and.returnValue(null);
        spyOn(DownloadService, 'downloadCsv').and.callThrough();

        const div = document.createElement('div');
        div.setAttribute('id', 'tableParent');
        div.innerHTML = `
            <table>
                <thead><tr><th>a</th><th>b</th></tr></thead>
                <tbody><tr><td>c</td><td>d</td></tr></tbody>
            </table>
        `;

        const csv = "a,b\nc,d\n";

        document.body.appendChild(div);
        DownloadService.downloadTable('#tableParent', 'filename');
        expect(DownloadService.downloadCsv).toHaveBeenCalledWith(csv, 'filename');
        document.body.removeChild(div);
    });

    it('should not download a table if none is there', () => {
        spyOn(DownloadService, 'download').and.returnValue(null);
        spyOn(DownloadService, 'downloadCsv').and.callThrough();

        const div = document.createElement('div');
        div.setAttribute('id', 'tableParent');

        document.body.appendChild(div);
        DownloadService.downloadTable('#tableParent', 'filename');
        expect(DownloadService.downloadCsv).not.toHaveBeenCalled();
        document.body.removeChild(div);
    });

    it('should download a csv formatted string as a csv file', () => {
        spyOn(DownloadService, 'download').and.returnValue(null);

        const csv = "a;b\nc;d";

        DownloadService.downloadCsv(csv, 'filename');
        expect(DownloadService.download).toHaveBeenCalledWith(
            'filename',
            'csv',
            'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
        );
    });

    it('should download an svg element by its selector as svg file', () => {
        spyOn(DownloadService, 'download').and.returnValue(null);

        const svg = document.createElement('svg');
        svg.setAttribute('id', 'testSvg');

        document.body.appendChild(svg);

        DownloadService.downloadSvg('#testSvg', false, 'filename');
        svg.setAttribute('version', '1.1');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

        expect(DownloadService.download).toHaveBeenCalledWith(
            'filename',
            'svg',
            'data:image/svg+xml;base64,\n' + window.btoa(new XMLSerializer().serializeToString(svg))
        );

        document.body.removeChild(svg);
    });

    it('should download an svg element by its parent selector as svg file', () => {
        spyOn(DownloadService, 'download').and.returnValue(null);

        const svg = document.createElement('svg');
        const div = document.createElement('div');
        div.setAttribute('id', 'svgParent');
        div.appendChild(svg);

        document.body.appendChild(div);

        DownloadService.downloadSvg('#svgParent', false, 'filename');
        svg.setAttribute('version', '1.1');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

        expect(DownloadService.download).toHaveBeenCalledWith(
            'filename',
            'svg',
            'data:image/svg+xml;base64,\n' + window.btoa(new XMLSerializer().serializeToString(svg))
        );

        document.body.removeChild(div);
    });

    it('should not download tan svg element if none is found', () => {
        spyOn(DownloadService, 'download').and.returnValue(null);

        const div = document.createElement('div');
        div.setAttribute('id', 'svgParent');

        document.body.appendChild(div);
        DownloadService.downloadSvg('#svgParent', false, 'filename');
        expect(DownloadService.download).not.toHaveBeenCalled();
        document.body.removeChild(div);
    });

    it('should download an svg and adjust its size', () => {
        // TODO
    })
});