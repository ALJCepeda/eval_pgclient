var Document = require('./document');
var bare = require('bareutil');

var Project = function(params) {
    this.id = '';
    this.platform = '';
    this.tag = '';

    this.saveRoot = '';
    this.save = '';
    this.parent = '';

    this.documents = [];
    bare.obj.merge(this, params || {}, { documents:Document.fromArray });
};

module.exports = Project;
