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
    return this.pg.project_insert(project.id, project.platform, project.tag, project.saveRoot)
                .then(function(count) {
                    return self.pg.save_insert(project.saveRoot, project.id);
                }).then(function(count) {
                    return self.documentInsert(project);
                });
};

PGAgent.prototype.documentInsert = function(project) {
    return Promise.all(project.documents.map(function(document) {
        return self.pg.document_insert(project.id, projec.saveRoot, document.id, document.extension, document.content);
    }));
};

PGAgent.prototype.saveInsert = function(project) {
    var self = this;
    return this.pg.save_id_exists(project.save, project.id).then(function(exists) {
        if(exists === true) {
            throw new Error('Cannot insert save, already exists');
        }

        return self.pg.save_insert(project.save, project.id);
    }).then(function(count) {
        return self.documentInsert(project);
    });
};

PGAgent.prototype.projectDelete = function(project) {
    var self = this;
    return Promise.all(project.documents.map(function(document) {
        return self.pg.save_delete(project.saveRoot, project.id);
    })).then(function(result) {
        return self.pg.project_delete(project.id);
    });
};

PGAgent.prototype.projectSelect = function(id) {
    return this.pg.project_select(id).then(PGAgent.createProject);
};

PGAgent.prototype.projectSelectSave = function(projectID, saveID) {
    return this.pg.project_select_save(projectID, saveID).then(this.createProject);
};

PGAgent.prototype.generateProjectID = function(length) {
    var self = this;
    var id = misc.random(length, this.randomPossibles);

	return this.pg.project_id_exists(id).then(function(exists) {
		if(exists === true) {
			return self.generateProjectID(length);
		} else {
			return id;
		}
	});
};

PGAgent.prototype.generateSaveID = function(projectID, length) {
    var self = this;
    var id = misc.random(length, this.randomPossibles);

	return this.pg.save_id_exists(id, projectID).then(function(exists) {
		if(exists === true) {
			return self.generateSaveID(projectID, length);
		} else {
			return id;
		}
	});
};

PGAgent.prototype.execute = function() {
    return this.pg.execute().then(this.createExecute);
};

PGAgent.prototype.platform = function() {
    return this.pg.platform().then(this.createPlatform);
};

PGAgent.createDocument = function(row) {
    return new Document({
        id:row.document_id,
        extension:row.document_extension,
        content:row.document_content
    });
};

PGAgent.createProject = function(rows) {
    if(!val.array(rows) || rows.length === 0) {
        return;
    }

    var first = rows[0];
    var project = new Project({
        id:first.project_id,
        platform:first.project_platform,
        tag:first.project_tag,
        saveRoot:first.project_saveroot,
        save:first.save_id,
        parent:first.save_parent
    });

    rows.forEach(function(row) {
        project.documents.push(PGAgent.createDocument(row));
    });

    return project;
};

PGAgent.createExecute = function(rows) {
    return rows.reduce(function(dict, row) {
        var platform = row.platform;

        if(dict.undefined(info[platform]) === true) {
            dict[platform] = {};
        }

        var tag = row.tag;
        dict[platform][tag] = new Execute(row);
        return dict;
    }, {});
};

PGAgent.createPlatform = function(rows) {
    return rows.reduce(function(dict, row) {
        var id = row.platform_id;
        var tag = row.version_tag;
        var demo = row.demo_content;

        if(val.undefined(dict[id])) {
            dict[id] = new Platform({
                name:row.platform_name,
                aceMode:row.platform_acemode,
                extension:row.platform_extension
            });
        }

        dict[id].tags.push(tag);
        if(val.defined(demo)) {
            info[id].demo[tag] = demo;
        }

        return dict;
    }, {});
};

module.exports = PGAgent;
