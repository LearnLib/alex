/*! Angular draganddrop v0.2.1 | (c) 2013 Greg Bergé | License MIT */

angular
.module('draganddrop', [])
.directive('draggable', draggableDirective)
.directive('drop', ['$parse', dropDirective]);

/**
 * Draggable directive.
 *
 * @example
 * <div draggable="true" effect-allowed="link" draggable-type="image" draggable-data="{foo: 'bar'}"></div>
 *
 * - "draggable" Make the element draggable. Accepts a boolean.
 * - "effect-allowed" Allowed effects for the dragged element,
     see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer#effectAllowed.28.29.
     Accepts a string.
 * - "draggable-type" Type of data object attached to the dragged element, this type
     is prefixed by "json/". Accepts a string.
 * - "draggable-data" Data attached to the dragged element, data are serialized in JSON.
     Accepts an Angular expression.
 */

function draggableDirective() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var domElement = element[0];
      var effectAllowed = attrs.effectAllowed;
      var draggableData = attrs.draggableData;
      var draggableType = attrs.draggableType;
      var draggable = attrs.draggable === 'false' ? false : true;

      // Make element draggable or not.
      domElement.draggable = draggable;

      if (! draggable) return ;

      domElement.addEventListener('dragstart', function (e) {
        // Restrict drag effect.
        e.dataTransfer.effectAllowed = effectAllowed || e.dataTransfer.effectAllowed;

        // Eval and serialize data.
        var data = scope.$eval(draggableData);
        var jsonData =  angular.toJson(data);

        // Set drag data and drag type.
        e.dataTransfer.setData('json/' + draggableType, jsonData);

        e.stopPropagation();
      });
    }
  };
}

/**
 * Drop directive.
 *
 * @example
 * <div drop="onDrop($data, $event)" drop-effect="link" drop-accept="'json/image'"
 * drag-over="onDragOver($event)" drag-over-class="drag-over"></div>
 *
 * - "drop" Drop handler, executed on drop. Accepts an Angular expression.
 * - "drop-effect" Drop effect to set,
     see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer#dropEffect.28.29.
     Accepts a string.
 * - "drop-accept" Types accepted or function to prevent unauthorized drag and drop.
 *   Accepts a string, an array, a function or a boolean.
 * - "drag-over" Drag over handler, executed on drag over. Accepts an Angular expression.
 * - "drag-over-class" Class set on drag over, when the drag is authorized. Accepts a string.
 */

function dropDirective($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var domElement = element[0];
      var dropEffect = attrs.dropEffect;
      var dropAccept = attrs.dropAccept;
      var dragOverClass = attrs.dragOverClass;

      var dragOverHandler = $parse(attrs.dragOver);
      var dropHandler = $parse(attrs.drop);

      domElement.addEventListener('dragover', dragOverListener);
      domElement.addEventListener('drop', dropListener);
      domElement.addEventListener('dragleave', removeDragOverClass);

      scope.$on('$destroy', function () {
        domElement.removeEventListener('dragover', dragOverListener);
        domElement.removeEventListener('drop', dropListener);
        domElement.removeEventListener('dragleave', removeDragOverClass);
      });

      function dragOverListener(event) {
        // Check if type is accepted.
        if (! accepts(scope.$eval(dropAccept), event)) return true;

        if (dragOverClass) element.addClass(dragOverClass);

        // Set up drop effect to link.
        event.dataTransfer.dropEffect = dropEffect || event.dataTransfer.dropEffect;

        // Call dragOverHandler
        scope.$apply(function () {
          dragOverHandler(scope, { $event: event });
        });

        // Prevent default to accept drag and drop.
        event.preventDefault();
      }

      function dropListener(event) {
        var data = getData(event);

        removeDragOverClass();

        // Call dropHandler
        scope.$apply(function () {
          dropHandler(scope, { $data: data, $event: event });
        });

        // Prevent default navigator behaviour.
        event.preventDefault();
      }

      /**
       * Remove the drag over class.
       */

      function removeDragOverClass() {
        element.removeClass(dragOverClass);
      }

      /**
       * Test if a type is accepted.
       *
       * @param {String|Array|Function} type
       * @param {Event} event
       * @returns {Boolean}
       */

      function accepts(type, event) {
        if (typeof type === 'boolean') return type;
        if (typeof type === 'string') return accepts([type], event);
        if (Array.isArray(type)) {
          return accepts(function (types) {
            return types.some(function (_type) {
              return type.indexOf(_type) !== -1;
            });
          }, event);
        }
        if (typeof type === 'function') return type(toArray(event.dataTransfer.types));

        return false;
      }

      /**
       * Get data from a drag event.
       *
       * @param {Event} event
       * @returns {Object}
       */

      function getData(event) {
        var types = toArray(event.dataTransfer.types);

        return types.reduce(function (collection, type) {
          // Get data.
          var data = event.dataTransfer.getData(type);

          // Get data format.
          var format = /(.*)\//.exec(type);
          format = format ? format[1] : null;

          // Parse data.
          if (format === 'json') data = JSON.parse(data);

          collection[type] = data;

          return collection;
        }, {});
      }

      /**
       * Convert a collection to an array.
       *
       * @param {Object} collection
       */

      function toArray(collection) {
        return Array.prototype.slice.call(collection);
      }
    }
  };
}