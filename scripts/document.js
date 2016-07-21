var bare = require('bareutil');
var val = bare.val;
var obj = bare.obj;

var Document = function(data) {
    this.id = '';
    this.extension = '';
    this.content = '';

    bare.obj.merge(this, data || {});
};

Document.prototype.equal = function(b) {
    return Document.equal(this, b);
};

Document.fromDict = function(dict) {
    return obj.reduce(dict, function(result, doc) {
        result[doc.id] = new Document(doc);
        return result;
    }, {});
};

Document.equal = function(a, b) {
    return  a.id === b.id &&
            a.extension === b.extension &&
            a.content === b.content;
};

module.exports = Document;
