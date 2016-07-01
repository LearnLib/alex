describe('formatEqOracle', () => {
    let $filter;
    let eqOracleType;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$filter_, _eqOracleType_) => {
        $filter = _$filter_;
        eqOracleType = _eqOracleType_;
    }));

    it('should correctly formal all eq oracle types', () => {
        let result = $filter('formatEqOracle')(eqOracleType.RANDOM);
        expect(result).toEqual('Random Word');

        result = $filter('formatEqOracle')(eqOracleType.COMPLETE);
        expect(result).toEqual('Complete');

        result = $filter('formatEqOracle')(eqOracleType.SAMPLE);
        expect(result).toEqual('Sample');

        result = $filter('formatEqOracle')(eqOracleType.WMETHOD);
        expect(result).toEqual('W-Method');
    });

    it('should leave the input as it is if no oracle is found', () => {
        const oracle = 'unknown_oracle';
        const result = $filter('formatEqOracle')(oracle);
        expect(result).toEqual(oracle);
    })
});


describe('formatWebBrowser', () => {
    let $filter;
    let webBrowser;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$filter_, _webBrowser_) => {
        $filter = _$filter_;
        webBrowser = _webBrowser_;
    }));

    it('should correctly formal all eq web browser types', () => {
        let result = $filter('formatWebBrowser')(webBrowser.HTMLUNITDRIVER);
        expect(result).toEqual('HTML Unit Driver');

        result = $filter('formatWebBrowser')(webBrowser.FIREFOX);
        expect(result).toEqual('Firefox');

        result = $filter('formatWebBrowser')(webBrowser.CHROME);
        expect(result).toEqual('Chrome');
    });

    it('should leave the input as it is if no web browser is found', () => {
        const browser = 'unknown_browser';
        const result = $filter('formatWebBrowser')(browser);
        expect(result).toEqual(browser);
    })
});


describe('formatAlgorithm', () => {
    let $filter;
    let learnAlgorithm;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$filter_, _learnAlgorithm_) => {
        $filter = _$filter_;
        learnAlgorithm = _learnAlgorithm_;
    }));

    it('should correctly formal all algorithm types', () => {
        let result = $filter('formatAlgorithm')(learnAlgorithm.LSTAR);
        expect(result).toEqual('L*');

        result = $filter('formatAlgorithm')(learnAlgorithm.DHC);
        expect(result).toEqual('DHC');

        result = $filter('formatAlgorithm')(learnAlgorithm.TTT);
        expect(result).toEqual('TTT');

        result = $filter('formatAlgorithm')(learnAlgorithm.DISCRIMINATION_TREE);
        expect(result).toEqual('Discrimination Tree');
    });

    it('should leave the input as it is if no algorithm is found', () => {
        const algorithm = 'unknown_algorithm';
        const result = $filter('formatAlgorithm')(algorithm);
        expect(result).toEqual(algorithm);
    })
});

describe('formatMilliseconds', () => {
    let $filter;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$filter_) => {
        $filter = _$filter_;
    }));

    it('should correctly format everything less than a minute', () => {
        expect($filter('formatMilliseconds')(5000)).toEqual('5s');
        expect($filter('formatMilliseconds')(500)).toEqual('0s');
    });

    it('should correctly format everything less than an hour more than a minute', () => {
        expect($filter('formatMilliseconds')(60000)).toEqual('1min 0s');
        expect($filter('formatMilliseconds')(65000)).toEqual('1min 5s');
        expect($filter('formatMilliseconds')(3599999)).toEqual('59min 59s');
    });

    it('should correctly format everything more than an hour', () => {
        expect($filter('formatMilliseconds')(3600000)).toEqual('1h 0min 0s');
        expect($filter('formatMilliseconds')(3605000)).toEqual('1h 0min 5s');
        expect($filter('formatMilliseconds')(4200000)).toEqual('1h 10min 0s');
    })
});