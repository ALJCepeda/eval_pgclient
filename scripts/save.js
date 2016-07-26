(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['bareutil.obj', 'bareutil.val'], factory);
    } else if (typeof exports === 'object') {
        var bare = require('bareutil');
        var Save = factory(bare.obj, bare.val);
        Save.expose = function(app, express) {
            app.use('/eval_shared.save.js', express.static(__filename));
        }

        module.exports = Save;
    } else {
        root.eval_shared.Save = factory(root.bareutil.obj, root.bareutil.val);
    }
}(this, function (obj, val) {
    var Save = function(data) {
        this.id = '';
        this.root = '';
        this.parent = '';
        this.output = '';

        obj.merge(this, data || {});
    };

    Save.prototype.isRoot = function() {
        return this.valid() && this.root === this.id && this.parent === '';
    };
    Save.prototype.hasParent = function() {
        return this.valid() && this.parent !== '';
    };
    Save.prototype.equal = function(b) {
        return Save.equal(this, b);
    };
    Save.prototype.valid = function() {
        return  val.string(this.id)     && this.id.length === Save.IDLength &&
                val.string(this.root)   && this.root.length === Save.IDLength &&
                val.string(this.parent) && (this.parent === '' || this.parent.length === Save.IDLength) &&
                val.string(this.output);
    };

    Save.IDLength = 8;
    Save.create = function(data) {
        return new Save(data);
    };

    Save.equal = function(a, b) {
        return  a.id === b.id &&
                a.root === b.root &&
                a.parent == b.parent &&
                a.output === b.output;
    };

    return Save;
}));
