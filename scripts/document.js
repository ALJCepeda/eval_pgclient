var bare = require('bareutil');
var val = bare.val;

var Document = function(data) {
    this.id = '';
    this.extension = '';
    this.content = '';

    bare.obj.merge(this, data || {});
};

Document.create = function(data) {
    var doc = new Document(data);
    return doc;
};

Document.fromObj = Document.create;
Document.fromObjs = function(objs) {
    return objs.map(function(obj) {
        return Document.create(obj);
    });
};

Document.fromRow = function(row) {
    var doc = new Document();

    doc.id = row['document_id'];
    doc.extension = row['document_extension'];
    doc.content = row['document_content'];

    return doc;
};

Document.fromRows = function(rows) {
    return rows.map(function(row) {
        return Document.fromRow(row);
    });
};

module.exports = Document;
