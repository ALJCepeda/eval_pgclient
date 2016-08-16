(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['bareutil.val', 'bareutil.obj'], factory);
    } else if (typeof exports === 'object') {
        var Document = factory(require('bareutil').val, require('bareutil').obj);
        Document.expose = function(app, express) {
            app.use('/eval_shared.document.js', express.static(__filename));
        }

        module.exports = Document;
    } else {
        root.eval_shared.Document = factory(root.bareutil.val, root.bareutil.obj);
    }
}(this, function (val, obj) {
    var Document = function(data) {
        this.id = '';
        this.extension = '';
        this.content = '';

        obj.merge(this, data || {});
        this.content = this.content.replace(/\\n/g,'\n').replace(/\\t/g,'\t');
    };

    Document.prototype.equal = function(b, strict) {
        return Document.equal(this, b, strict);
    };
    Document.prototype.valid = function(b) {
        return  val.string(this.id)         && this.id !== '' &&
                val.string(this.extension)  && this.extension !== '' &&
                val.string(this.content)    && this.content !== '';
    };
    Document.fromDict = function(dict) {
        return obj.reduce(dict, function(result, doc) {
            result[doc.id] = new Document(doc);
            return result;
        }, {});
    };

    Document.equal = function(a, b, strict) {
        var isEqual = a.extension === b.extension && a.content === b.content;

        if(strict === true) {
            return isEqual && a.id === b.id;
        }

        return isEqual;
    };

    return Document;
}));
