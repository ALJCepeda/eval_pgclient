var Document = require('./document');
var bare = require('bareutil');

var Project = function(params) {
    this.id = '';
    this.platform = '';
    this.tag = '';

    this.saveRoot = '';
    this.save = '';
    this.parent = '';

    this.documents = {};
    bare.obj.merge(this, params || {}, { documents:Document.fromDict });
};

Project.prototype.equal = function(b) {
    return Project.equal(this, b);
};

Project.equal = function(a, b) {
    if( a.id !== b.id ||
        a.platform !== b.platform ||
        a.tag !== b.tag ) {
            return false;
        }

    for(var docID in a.documents) {
        if(a.documents[docID].equal(b.documents[docID]) === false) {
            return false;
        }
    }

    return true;
}
module.exports = Project;
