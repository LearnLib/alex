/*
 * Copyright 2018 TU Dortmund
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
 * Manages selectable entities.
 */
export class Selectable {

    /**
     * Constructor.
     *
     * @param {object[]} items The items that can be selected.
     * @param {string} key The property by which the items can be differentiated.
     */
    constructor(items, key) {
        this.items = items;
        this.key = key;
        this.selectedItems = {};
    };

    select(item) {
        this.selectedItems[item[this.key]] = item;
    }

    unselect(item) {
        delete this.selectedItems[item[this.key]];
    }

    selectAll() {
        this.items.forEach(item => this.select(item));
    }

    unselectAll() {
        this.selectedItems = {};
    }

    selectMany(items) {
        items.forEach(item => this.select(item));
    }

    unselectMany(items) {
        items.forEach(item => this.unselect(item));
    }

    toggleSelect(item) {
        this.isSelected(item) ? this.unselect(item) : this.select(item);
    }

    toggleSelectMany(items) {
        this.isAnySelectedIn(items) ? this.unselectMany(items) : this.selectMany(items);
    }

    toggleSelectAll() {
        this.isAnySelected() ? this.unselectAll() : this.selectAll();
    }

    isSelected(item) {
        return this.selectedItems[item[this.key]] != null;
    }

    isAnySelected() {
        return Object.keys(this.selectedItems).length > 0;
    }

    isAnySelectedIn(items) {
        return items.reduce((acc, item) => acc || this.isSelected(item), false);
    }

    update(item) {
        if (this.isSelected(item)) {
            this.select(item);
        }
    }

    updateAll(items) {
        this.items = items;
        this.items.forEach(item => {
            this.isSelected(item) ? this.select(item) : this.unselect(item);
        });
    }

    getSelected() {
        return Object.values(this.selectedItems);
    }
}
