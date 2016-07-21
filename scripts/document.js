var bare = require('bareutil');
var val = bare.val;

var Document = function(data) {
    this.id = '';
    this.extension = '';
    this.content = '';

    bare.obj.merge(this, data || {});
};

module.exports = Document;
