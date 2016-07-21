var bare = require('bareutil');
var val = bare.val;

var Document = function(data) {
    this.id = '';
    this.extension = '';
    this.content = '';

    bare.obj.merge(this, data || {});
};

Document.fromArray = function(objs) {
    return objs.map(function(obj) {
        return new Document(obj);
    });
};

module.exports = Document;
