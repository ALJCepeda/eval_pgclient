var bare = require('bareutil');
var val = bare.val;
var obj = bare.obj;

var Document = function(data) {
    this.id = '';
    this.extension = '';
    this.content = '';

    bare.obj.merge(this, data || {});
};

Document.fromDict = function(dict) {
    return obj.reduce(dict, function(result, doc) {
        result[doc.id] = new Document(doc);
        return result;
    }, {});
};

module.exports = Document;
