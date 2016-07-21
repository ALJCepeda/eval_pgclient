var bare = require('bareutil');

var Execute = function(params) {
    this.platform = '';
    this.tag = '';
    this.compile = '';
    this.run = '';

    bare.obj.merge(this, params || {});
};



module.exports = Execute;
