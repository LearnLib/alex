(function() {

	angular
		.module('weblearner.directives')
		.directive('downloadTestResultsAsCsv', [ 
             'PromptService', downloadTestResultsAsCsv 
         ]);

	function downloadTestResultsAsCsv(PromptService) {
		
		var directive = {
			restrict: 'A',
			scope: {
				testResults: '='
			},
			link: link
		};
		return directive;
		
		//////////
		
		function link(scope, el, attrs) {
						
			el.on('click', promptFilename);
			
			//////////
			
			function promptFilename() {
				if (angular.isDefined(scope.testResults)) {
	                PromptService.prompt('Enter a name for the csv file.', {
	                    regexp: /^[a-zA-Z0-9\.\-,_]+$/,
	                    errorMsg: 'The name may not be empty and only consist of letters, numbers and the symbols ",._-".'
	                }).then(download);
				}
			}
			
			function download(filename) {
				
				var csv = 'data:text/csv;charset=utf-8,';
				var a;
				var results;

				if (angular.isDefined(scope.testResults)){

					if (angular.isArray(scope.testResults)) {
						results = scope.testResults;
					} else {
						return;
					}
					
					csv += testResultsToCSV(results);
					
					// create new link element with downloadable csv
					a = document.createElement('a');
					a.style.display = 'none';
					a.setAttribute('href', csv);
					a.setAttribute('target', '_blank');
	                a.setAttribute('download', filename + '.csv');
          	        
	                // append link to the dom, fire click event and remove it
	                document.body.appendChild(a);
          	        a.click();
          	        document.body.removeChild(a);
				}
			}
			
			function testResultsToCSV(testResults) {
				
				var csv = '"Type";"Project";"TestNo";"StepNo";"Algorithm";"EqOracle";"Sybols";"Resets";"Duration (ms)"%0A';
								
				_.forEach(testResults, function(result){

					csv += '"' + result.type + '";';
					csv += '"' + result.project + '";';
					csv += '"' + result.testNo + '";';
					csv += '"' + result.stepNo + '";';
					csv += '"' + result.configuration.algorithm + '";';
					csv += '"' + result.configuration.eqOracle.type + '";';
					csv += '"' + result.sigma.length + '";';
					csv += '"' + result.amountOfResets + '";';
					csv += '"' + result.duration + '"%0A';
				});
				
				return csv;
			}
		}
	}
}());