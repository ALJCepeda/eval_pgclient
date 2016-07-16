var Document = require('./document');

var Project = function() {
    this.id = '';
    this.platform = '';
    this.tag = '';

    this.save = '';
    this.parent = '';

    this.documents = [];
};

Project.fromRow = function(row) {
    var project = new Project();

    project.id = row.project_id;
    project.platform = row.project_platform;
    project.tag = row.project_tag;

    project.save = row.save_id;
    project.parent = row.save_parent;

    project.documents = [Document.fromRow(row)];
    return project;
};

module.exports = Project;
