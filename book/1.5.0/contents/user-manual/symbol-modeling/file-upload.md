# Uploading files

A special functionality we want to present here is the upload of files to the target application via an action, since there is no dedicated action for that.
For this to work, two requirements have to be met:

1. All files have to be uploaded into ALEX first.
2. The file upload only works with native `<input type="file">` elements.
3. The execution of JavaScript has the be enabled by the targeted web driver.

![Files 1](assets/file-upload/1.jpg)

For uploading files into ALEX, navigate to the *files* page by clicking on the corresponding item in the sidebar <span class="label">1</span>.
Then click on <span class="label">2</span> to open a native file choosing dialog or drag and drop files directly in that element.

![Files 2](assets/file-upload/2.jpg)

Then, click on the upload button <span class="label">3</span> to start the upload.
The progress indicator indicates how much of a file has already been uploaded.

![Files 3](assets/file-upload/3.jpg)

Once the upload is completed, the files are displayed in a list.

![Files 4](assets/file-upload/4.jpg)

In order to upload a specific file to the target application, create a *fill input* action and insert the selector of the corresponding input field.
As the value, enter **\{\{\\filename.ext\}\}** where *filename.ext* should be the exact name of the file you uploaded to ALEX.

## Downloading files

Once you have uploaded a file, you can also download it again.
Therefor, click on the corresponding menu item in the dropdown menu of a file.
