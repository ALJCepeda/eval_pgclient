

var Platform = function() {
    this.name = '';
    this.aceMode = '';
    this.extension = '';
    this.tags = [];
    this.demo = '';
};

Platform.fromRow = function(row) {
    return new Platform({
        name:row.platform_name,
        aceMode:row.platform_acemode,
        extension:row.platform_extension
    });
};

Platform.fromRows = function(rows) {
    return rows.reduce(function(dict, row) {
        var id = row.platform_id;
        var tag = row.version_tag;
        var demo = row.demo_content;

        if(val.undefined(dict[id])) {
            dict[id] = Platform.fromRow(row);
        }

        dict[id].tags.push(tag);
        if(val.defined(demo)) {
            info[id].demo[tag] = demo;
        }

        return dict;
    }, {});
};
module.exports = Platform;
