var Execute = function() {
    this.platform = '';
    this.tag = '';
    this.compile = '';
    this.run = '';
};

Execute.fromRow = function(row) {
    return new Execute(row);
};

Execute.fromRows = function(rows) {
    return rows.reduce(function(dict, row) {
        var platform = row.platform;

        if(dict.undefined(info[platform]) === true) {
            dict[platform] = {};
        }

        var tag = row.tag;
        dict[platform][tag] = Execute.fromRow(row);
        return dict;
    }, {});
};
