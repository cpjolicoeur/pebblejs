var util2 = require('lib/util2');
var myutil = require('lib/myutil');
var Propable = require('ui/propable');
var StageElement = require('ui/element');

var textProps = [
  'text',
  'font',
  'color',
  'textOverflow',
  'textAlign',
  'time',
  'timeUnits',
];

var defaults = {
  backgroundColor: 'clear',
  borderColor: 'clear',
  color: 'white',
};

var Text = function(elementDef) {
  StageElement.call(this, elementDef);
  myutil.shadow(defaults, this.state);
  this.state.type = 3;
};

util2.inherit(Text, StageElement);

Propable.makeAccessors(textProps, Text.prototype);

module.exports = Text;
