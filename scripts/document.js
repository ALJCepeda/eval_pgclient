var bare = require('bareutil');
var val = bare.val;

var Document = function() {
    this.id = '';
    this.extension = '';
    this.content = '';
};

Document.fromRow = function(row) {
    var doc = new Document();

    doc.id = row['document_id'];
    doc.extension = row['document_extension'];
    doc.content = row['document_content'];

    return doc;
};

Document.fromRows = function(rows) {
    var documents = [];

    rows.forEach(function(row) {
        documents.push(Document.fromRow(row));
    });

    return documents;
};

module.exports = Document;
