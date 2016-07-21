var bare = require('bareutil');

var Platform = function(params) {
    this.name = '';
    this.aceMode = '';
    this.extension = '';
    this.tags = [];
    this.demo = '';

    bare.obj.merge(this, params || {});
};

module.exports = Platform;
