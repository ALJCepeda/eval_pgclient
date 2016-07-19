var bare = require('bareutil');
var val = bare.val;
var misc = bare.misc;

var PGClient = require('./pgclient');
var Project = require('./project');
var Platform = require('./platform');
var Execute = require('./execute');
var Document = require('./document');

var PGAgent = function(url) {
    this.pg = new PGClient(url);
    this.randomPossibles = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
};

PGAgent.prototype.projectInsert = function(project) {
    return this.pg.project_insert(project.id, project.platform, project.tag)
                .then(function(result) {
                    return Promise.all(project.documents.map(function(document) {
                        return this.pg.document_insert(project.id, document.id, document.extension, document.content);
                    }.bind(this)));
                }.bind(this));
};

PGAgent.prototype.projectDelete = function(project) {
    return Promise.all(project.documents.map(function(document) {
        return this.pg.document_delete(project.id, document.id);
    }.bind(this))).then(function(result) {
        return this.pg.project_delete(project.id);
    });
};

PGAgent.prototype.projectSelect = function(id) {
    return this.pg.project_select(id).then(Project.fromRow);
};

PGAgent.prototype.projectSelectSave = function(projectID, saveID) {
    return this.pg.project_select_save(projectID, saveID).then(Project.fromRow);
};

PGAgent.prototype.generateID = function(length) {
	var id = misc.random(length, this.randomPossibles);

	return this.pg.project_id_exists(id).then(function(exists) {
		if(exists === true) {
			return this.generateID(length);
		} else {
			return id;
		}
	}.bind(this));
};

PGAgent.prototype.execute = function() {
    return this.pg.execute().then(Execute.fromRows);
};

PGAgent.prototype.platform = function() {
    return this.pg.platform().then(Platform.fromRows);
};

return info;
