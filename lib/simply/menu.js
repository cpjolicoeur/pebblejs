var util2 = require('util2');
var myutil = require('myutil');
var simply = require('simply');

var Emitter = require('emitter');
var Window = require('simply/window');

var Menu = function(menuDef) {
  this._sections = {};
  this.state = menuDef || {};
};

util2.inherit(Menu, Window);

util2.copy(Emitter.prototype, Menu.prototype);

Menu.prototype_prop = function() {
  return simply.menu.apply(this, arguments);
};

Menu.prototype.action = function() {
  throw new Error("Menus don't support action bars.");
};

var getMetaSection = function(sectionIndex) {
  return (this._sections[sectionIndex] || ( this._sections[sectionIndex] = {} ));
};

var targetType = {
  menu: 1,
  section: 2,
  item: 3,
};

var isEnumerable = function(x, isArray) {
  if (isArray) {
    return (x instanceof Array);
  } else {
    return (typeof x === 'number' || x instanceof Array);
  }
};

var getSections = function(target) {
  var sections = this.state.sections;
  if (isEnumerable(sections, target > targetType.menu)) {
    return sections;
  }
  if (typeof sections === 'function') {
    this.sectionsProvider = this.state.sections;
    delete this.state.sections;
  }
  if (this.sectionsProvider) {
    sections = this.sectionsProvider.call(this);
    if (sections) {
      return (this.state.sections = sections);
    }
  }
};

var getSection = function(e) {
  var sections = getSections.call(this, targetType.section);
  var section;
  if (sections) {
    section = sections[e.section];
    if (section) {
      return section;
    }
  }
  if (this.sectionProvider) {
    section = this.sectionProvider.call(this, e);
    if (section) {
      if (!(sections instanceof Array)) {
        sections = this.state.sections = [];
      }
      return (sections[e.section] = section);
    }
  }
};

var getItems = function(e, target) {
  var section = getSection.call(this, e);
  if (!section) { return; }
  if (isEnumerable(section.items, target > targetType.section)) {
    return section.items;
  }
  if (typeof section.items === 'function') {
    this._sections[e.section] = section.items;
    delete section.items;
  }
  var itemsProvider = getMetaSection.call(this, e.section).items || this.itemsProvider;
  if (itemsProvider) {
    var items = itemsProvider.call(this, e);
    if (items) {
      return (section.items = items);
    }
  }
};

var getItem = function(e) {
  var items = getItems.call(this, e, targetType.item);
  var item;
  if (items) {
    item = items[e.item];
    if (item) {
      return item;
    }
  }
  var section = getSection.call(this, e);
  var itemProvider = getMetaSection.call(this, e.section).item || this.itemProvider;
  if (itemProvider) {
    item = itemProvider.call(this, e);
    if (item) {
      if (!(section.items instanceof Array)) {
        section.items = [];
      }
      return (section.items[e.item] = item);
    }
  }
};

Menu.prototype._menu = function() {
  var sections = getSections.call(this, targetType.menu);
  this.state.sections = sections;
  if (isEnumerable(sections)) {
    if (typeof sections === 'number') {
      this.state.sections = new Array(sections);
    }
    return simply.menu.call(this);
  }
};

Menu.prototype._section = function(e) {
  var section = getSection.call(this, e);
  if (section) {
    if (!(section.items instanceof Array)) {
      section.items = getItems.call(this, e, targetType.section);
    }
    if (isEnumerable(section.items)) {
      if (typeof section.items === 'number') {
        section.items = new Array(section.items);
      }
      return simply.menuSection.call(this, e.section, section);
    }
  }
};

Menu.prototype._item = function(e) {
  var item = getItem.call(this, e);
  if (item) {
    return simply.menuItem.call(this, e.section, e.item, item);
  }
};

Menu.prototype.sections = function(sections) {
  if (typeof sections === 'function') {
    this.sectionsProvider = sections;
    return this;
  }
  this.state.sections = sections;
  this._menu();
  return this;
};

Menu.prototype.section = function(sectionIndex, section) {
  if (typeof sectionIndex === 'object') {
    sectionIndex = sectionIndex.section;
  } else if (typeof sectionIndex === 'function') {
    this.sectionProvider = sectionIndex;
    return this;
  }
  var sections = this.state.sections;
  if (sections instanceof Array) {
    sections[sectionIndex] = section;
  }
  this._section({ section: sectionIndex });
  return this;
};

Menu.prototype.items = function(sectionIndex, items) {
  if (typeof sectionIndex === 'object') {
    sectionIndex = sectionIndex.section;
  } else if (typeof sectionIndex === 'function') {
    this.itemsProvider = sectionIndex;
    return this;
  }
  if (typeof items === 'function') {
    getMetaSection.call(this, sectionIndex).items = items;
    return this;
  }
  var section = getSection.call(this, { section: sectionIndex });
  if (section) {
    if (items) {
      section.items = items;
    } else {
      return section.items;
    }
  }
  this._section({ section: sectionIndex });
  return this;
};

Menu.prototype.item = function(sectionIndex, itemIndex, item) {
  if (typeof sectionIndex === 'object') {
    item = itemIndex || item;
    itemIndex = sectionIndex.item;
    sectionIndex = sectionIndex.section;
  } else if (typeof sectionIndex === 'function') {
    this.itemProvider = sectionIndex;
    return this;
  }
  if (typeof itemIndex === 'function') {
    item = itemIndex;
    itemIndex = null;
  }
  if (typeof item === 'function') {
    getMetaSection.call(this, sectionIndex).item = item;
    return this;
  }
  if (item) {
    var section = getSection.call(this, { section: sectionIndex });
    if (section.items instanceof Array) {
      section.items[itemIndex] = item;
    }
  } else {
    return getItem.call(this, { section: sectionIndex, item: itemIndex });
  }
  this._item({ section: sectionIndex, item: itemIndex });
  return this;
};

module.exports = Menu;