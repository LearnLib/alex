(function () {

    describe('Project Stuff', function () {

        function createProject(){
            browser.get('http://localhost:8080/app/#/project/create');
            element(by.css('#project-name')).sendKeys('Test');
            element(by.css('#project-url')).sendKeys('http://localhost:8080/testsite');
            element(by.css('#project-create-form')).submit();
        }

        function openProject(){
            element(by.css('#view > div.view-body.ng-scope > div > div > div')).click();
        }

        function deleteProject(){
            browser.get('http://localhost:8080/app/#/project/settings');
            element(by.css('#project-edit-form > div:nth-child(6) > a:nth-child(3)')).click();
            element(by.css('body > div.modal.fade.ng-isolate-scope.in > div > div > form > div.modal-footer > button')).click();
        }

        it('should create a project', function(){
            createProject();

            var projectList = element.all(by.repeater('project in projects'));
            expect(projectList.count()).toEqual(1);

            openProject();
            deleteProject();
        });

        it('should successfully update a project', function () {
            createProject();
            openProject();

            browser.get('http://localhost:8080/app/#/project/settings');
            element(by.css('#project-name')).clear();
            element(by.css('#project-name')).sendKeys('Test Update');
            element(by.css('#project-url')).clear();
            element(by.css('#project-url')).sendKeys('http://localhost:9090');
            element(by.css('#project-edit-form')).submit();



            deleteProject();
        });

        it('should fail to update a project', function() {

        });

        it('should delete a project', function(){
            createProject();
            openProject();
            deleteProject();

            var projectList = element.all(by.repeater('project in projects'));
            expect(projectList.count()).toEqual(0);
        })
    })
}());