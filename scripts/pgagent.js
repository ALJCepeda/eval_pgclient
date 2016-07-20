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
    var self = this;
    return this.pg.project_insert(project.id, project.platform, project.tag)
                .then(function(count) {
                    if(val.defined(project.parent)) {
                        return self.pg.save_parent_insert(project.save, project.id, project.parent);
                    } else {
                        return self.pg.save_insert(project.save, project.id);
                    }
                }).then(function(count) {
                    return Promise.all(project.documents.map(function(document) {
                        return self.pg.document_insert(project.id, document.id, document.extension, document.content);
                    }));
                }));
};

PGAgent.prototype.projectDelete = function(project) {
    var self = this;
    return Promise.all(project.documents.map(function(document) {
        return self.pg.document_delete(project.id, document.id);
    })).then(function(result) {
        return self.pg.save_delete()
        return self.pg.project_delete(project.id);
    });
};

PGAgent.prototype.projectSelect = function(id) {
    return this.pg.project_select(id).then(Project.fromRow);
};

PGAgent.prototype.projectSelectSave = function(projectID, saveID) {
    return this.pg.project_select_save(projectID, saveID).then(Project.fromRow);
};

PGAgent.prototype.generateID = function(length) {
    var self = this;
    var id = misc.random(length, this.randomPossibles);

	return this.pg.project_id_exists(id).then(function(exists) {
		if(exists === true) {
			return self.generateID(length);
		} else {
			return id;
		}
	});

PGAgent.prototype.execute = function() {
    return this.pg.execute().then(Execute.fromRows);
};

PGAgent.prototype.platform = function() {
    return this.pg.platform().then(Platform.fromRows);
};

return info;
