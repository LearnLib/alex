# angular-draganddrop
[![Build Status](https://travis-ci.org/neoziro/angular-draganddrop.svg?branch=master)](https://travis-ci.org/neoziro/angular-draganddrop)
[![Dependency Status](https://david-dm.org/neoziro/angular-draganddrop.svg?theme=shields.io)](https://david-dm.org/neoziro/angular-draganddrop)
[![devDependency Status](https://david-dm.org/neoziro/angular-draganddrop/dev-status.svg?theme=shields.io)](https://david-dm.org/neoziro/angular-draganddrop#info=devDependencies)

Drag and drop directives for Angular using native HTML5 API.

## Install

### Using bower

```sh
bower install angular-draganddrop
```

### Using npm

```sh
npm install angular-draganddrop
```

## Usage

HTML :

```html
<!-- Load files. -->
<script src="angular.js"></script>
<script src="angular-draganddrop.js"></script>

<div ng-controller="DragDropCtrl">

  <!-- Draggable element. -->
  <div draggable="true" effect-allowed="copy" draggable-type="custom-object" draggable-data="{foo: 'bar'}"></div>

  <!-- Dropzone element. -->
  <div drop="onDrop($data, $event)" drop-effect="copy" drop-accept="'json/custom-object'" drag-over="onDragOver($event)" drag-over-class="drag-over-accept"></div>

</div>
```

JavaScript :

```js
angular.module('controllers.dragDrop', ['draganddrop'])
.controller('DragDropCtrl', function ($scope) {

  // Drop handler.
  $scope.onDrop = function (data, event) {
    // Get custom object data.
    var customObjectData = data['json/custom-object']; // {foo: 'bar'}

    // Get other attached data.
    var uriList = data['text/uri-list']; // http://mywebsite.com/..

    // ...
  };

  // Drag over handler.
  $scope.onDragOver = function (event) {
    // ...
  };
});
```

### "draggable" directive

- "draggable" Make the element draggable. Accepts a boolean.
- "effect-allowed" Allowed effects for the dragged element, see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer#effectAllowed.28.29. Accepts a string.
- "draggable-type" Type of data object attached to the dragged element, this type is prefixed by "json/". Accepts a string.
- "draggable-data" Data attached to the dragged element, data are serialized in JSON. Accepts an Angular expression.

The draggable directive serializes data as JSON and prefix the specified type with "json/".

### "drop" directive

- "drop" Drop handler, executed on drop. Accepts an Angular expression.
- "drop-effect" Drop effect to set, see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer#dropEffect.28.29. Accepts a string.
- "drop-accept" Types accepted or function to prevent unauthorized drag and drop. Accepts a string, an array, a function or a boolean.
- "drag-over" Drag over handler, executed on drag over. Accepts an Angular expression.
- "drag-over-class" Class set on drag over, when the drag is authorized. Accepts a string.

The drop directive automatically unserializes data with the "json" format, other data are not formatted.

## Browsers support

[All navigators that support the native HTML5 API](http://caniuse.com/dragndrop) should be supported.

Tested on Firefox 24+, Chrome 31+.

## License

MIT
