(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['bareutil.obj', 'eval_shared.document'], factory);
    } else if (typeof exports === 'object') {
        var Project = factory(require('bareutil').obj, require('./document'));
        Project.expose = function(app, express) {
            app.use('/eval_shared.project.js', express.static(__filename));
        }

        module.exports = Project;
    } else {
        root.eval_shared.Project = factory(root.bareutil.obj, root.eval_shared.Document);
    }
}(this, function (obj, Document) {
    var Project = function(params) {
        this.id = '';
        this.platform = '';
        this.tag = '';

        this.saveRoot = '';
        this.save = '';
        this.parent = '';

        this.documents = {};
        obj.merge(this, params || {}, { documents:Document.fromDict });
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

    return Project;
}));
