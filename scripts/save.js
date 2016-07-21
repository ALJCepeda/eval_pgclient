(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['bareutil.obj'], factory);
    } else if (typeof exports === 'object') {
        var Save = factory(require('bareutil').obj);
        Save.expose = function(app, express) {
            app.use('/eval_shared.save.js', express.static(__filename));
        }

        module.exports = Save;
    } else {
        root.eval_shared.Save = factory(root.bareutil.obj);
    }
}(this, function (obj) {
    var Save = function(data) {
        this.id = '';
        this.root = '';
        this.parent = '';
        this.output = '';

        obj.merge(this, data || {});
    };

    Save.prototype.equal = function(b) {
        return Save.equal(this, b);
    };

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
