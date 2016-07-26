(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['bareutil.obj', 'bareutil.val', 'eval_shared.save', 'eval_shared.document'], factory);
    } else if (typeof exports === 'object') {
        var bare = require('bareutil');
        var Project = factory(bare.obj, bare.val, require('./save'), require('./document'));
        Project.expose = function(app, express) {
            app.use('/eval_shared.project.js', express.static(__filename));
        }

        module.exports = Project;
    } else {
        root.eval_shared.Project = factory( root.bareutil.obj,
                                            root.bareutil.val,
                                            root.eval_shared.Save,
                                            root.eval_shared.Document);
    }
}(this, function (obj, val, Save, Document) {
    var Project = function(params) {
        this.id = '';
        this.platform = '';
        this.tag = '';

        this.save = null;
        this.documents = {};

        obj.merge(this, params || {}, { documents:Document.fromDict, save:Save.create });
    };

    Project.prototype.hasRecord = function() {
        return this.valid() && this.id !== '' && this.save.valid();
    };
    Project.prototype.equal = function(b) {
        return Project.equal(this, b);
    };
    Project.prototype.identical = function(b) {
        return Project.identical(this, b);
    };
    Project.prototype.valid = function(action) {
        if( val.string(this.platform)   && this.platform !== '' &&
            val.string(this.tag)        && this.tag !== '' ) {

            var hasIndex = false;
            var docsValid = obj.every(this.documents, function(doc, docID) {
                if(docID === 'index') { hasIndex = true; }
                return doc.valid();
            });

            var insertValid = true;
            if(action === 'insert') {
                insertValid =   val.defined(this.save) &&
                                this.save.valid() &&
                                val.string(this.id) &&
                                this.id.length === Project.IDLength;
            }

            return docsValid && hasIndex && insertValid;
        }

        return false;
    };

    Project.IDLength = 8;
    Project.equal = function(a, b) {
        if( a.id !== b.id ||
            a.platform !== b.platform ||
            a.tag !== b.tag ) {
                return false;
            }

        for(var docID in a.documents) {
            if( val.undefined(b.documents[docID]) === true ||
                a.documents[docID].equal(b.documents[docID]) === false ) {
                return false;
            }
        }

        return true;
    }

    Project.identical = function(a, b) {
        return Project.equal(a, b) && a.save.equal(b.save);
    }

    return Project;
}));
