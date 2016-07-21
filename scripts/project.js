(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['bareutil.obj', 'eval_shared.save', 'eval_shared.document'], factory);
    } else if (typeof exports === 'object') {
        var Project = factory(require('bareutil').obj, require('./save'), require('./document'));
        Project.expose = function(app, express) {
            app.use('/eval_shared.project.js', express.static(__filename));
        }

        module.exports = Project;
    } else {
        root.eval_shared.Project = factory(root.bareutil.obj, root.eval_shared.Save, root.eval_shared.Document);
    }
}(this, function (obj, Save, Document) {
    var Project = function(params) {
        this.id = '';
        this.platform = '';
        this.tag = '';

        this.save = null;
        this.documents = {};

        obj.merge(this, params || {}, { documents:Document.fromDict, save:Save.create });
    };

    Project.prototype.equal = function(b) {
        return Project.equal(this, b);
    };
    Project.prototype.identical = function(b) {
        return Project.identical(this, b);
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

    Project.identical = function(a, b) {
        return Project.equal(a, b) && a.save.equal(b.save);
    }

    return Project;
}));
