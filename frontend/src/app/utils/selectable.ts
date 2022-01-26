/*
 * Copyright 2015 - 2022 TU Dortmund
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

class SelectableItem<T> {
  constructor(public item: T, public selected: boolean = false) {
  }
}

/**
 * Manages selectable entities.
 */
export class Selectable<T, K> {

  private selectedItems: Map<K, SelectableItem<T>> = new Map();

  /**
   * Constructor.
   *
   * @param keyFn The property by which the items can be differentiated.
   */
  constructor(private keyFn: (item: T) => K) {
  }

  addItem(item: T) {
    this.selectedItems.set(this.keyFn(item), new SelectableItem<T>(item));
  }

  addItems(items: T[]) {
    items.forEach(i => this.addItem(i));
  }

  select(item: T) {
    this.selectedItems.get(this.keyFn(item)).selected = true;
  }

  unselect(item: T) {
    this.selectedItems.get(this.keyFn(item)).selected = false;
  }

  selectAll() {
    this.selectedItems.forEach(value => {
      value.selected = true;
    });
  }

  unselectAll() {
    this.selectedItems.forEach(value => {
      value.selected = false;
    });
  }

  selectMany(items: T[]) {
    items.forEach(item => this.select(item));
  }

  unselectMany(items: T[]) {
    items.forEach(item => this.unselect(item));
  }

  remove(item: T) {
    this.selectedItems.delete(this.keyFn(item));
  }

  removeMany(items: T[]) {
    items.forEach(i => this.remove(i));
  }

  toggleSelect(item: T) {
    if (this.isSelected(item)) {
      this.unselect(item);
    } else {
      this.select(item);
    }
  }

  toggleSelectMany(items: T[]) {
    if (this.isAnySelectedIn(items)) {
      this.unselectMany(items);
    } else {
      this.selectMany(items);
    }
  }

  toggleSelectAll() {
    if (this.isAnySelected()) {
      this.unselectAll();
    } else {
      this.selectAll();
    }
  }

  isSelected(item: T) {
    const i = this.selectedItems.get(this.keyFn(item));
    return i == null ? false : i.selected;
  }

  isAnySelected() {
    for (const item of Array.from(this.selectedItems.values())) {
      if (item.selected) {return true;}
    }
    return false;
  }

  isAnySelectedIn(items: T[]) {
    return items.reduce((acc, item) => acc || this.isSelected(item), false);
  }

  update(item: T) {
    this.selectedItems.get(this.keyFn(item)).item = item;
  }

  updateAll(items) {
    items.forEach(item => this.update(item));
  }

  getSelected(): T[] {
    return Array.from(this.selectedItems.values())
      .filter(i => i.selected)
      .map(i => i.item);
  }

  clear(): void {
    this.selectedItems = new Map<K, SelectableItem<T>>();
  }
}
