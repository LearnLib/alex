describe('LearnerResultDownloadService', () => {
    let LearnerResultDownloadService, PromptService, DownloadService, $q, $rootScope;
    let results = ENTITIES.learnResults;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        LearnerResultDownloadService = $injector.get('LearnerResultDownloadService');
        PromptService = $injector.get('PromptService');
        DownloadService = $injector.get('DownloadService');
        $q = $injector.get('$q');
        $rootScope = $injector.get('$rootScope');
    }));

    it('should download learn results as csv file', () => {
        const deffered = $q.defer();

        spyOn(DownloadService, 'downloadCsv').and.returnValue(null);
        spyOn(PromptService, 'prompt').and.returnValue(deffered.promise);

        deffered.resolve('filename');
        LearnerResultDownloadService.download(results);
        $rootScope.$digest();

        let expectedCsv = 'Project;Test No;Start Time;Step No;Algorithm;Eq Oracle;|Sigma|;#MQs;#EQs;#Symbol Calls;Duration (ms)\n';
        expectedCsv += '2;1;"2016-02-01T20:02:58.256+01:00";0;LSTAR;random_word;1;23;1;112;8868\n';
        expectedCsv += '\n';
        expectedCsv += '2;2;"2016-02-04T13:43:15.984+01:00";0;LSTAR;random_word;1;23;1;112;7718\n';
        expectedCsv += '2;2;"2016-02-04T13:43:27.932+01:00";0;LSTAR;random_word;1;20;1;108;2\n';
        expectedCsv += '\n';

        expect(PromptService.prompt).toHaveBeenCalled();
        expect(DownloadService.downloadCsv).toHaveBeenCalled();
    });
});