var pg = require('pg');
var File = require('./file');
var Promise = require('bluebird');
var bare = require('bareutil');
var misc = bare.misc;
var val = bare.val;

/* Read sql file and delivers query */
var SQL = new File(__dirname + '/../queries', 'sql');

/* Wrapper around PG for app specific queries */
var PGClient = function(url) {
	this.url = url;
	this.random_possibles = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
};

/* PSQL related semantic closures */
var rowCount = function(result) { return result.rowCount; };
var rowCount_reduce = function(pre, result) { return pre + rowCount(result); };
var rows = function(result) { return result.rows; };
var rows_map = function(result) { return rows(result); };

/* Reads SQL file and performs query with parameterized args */
PGClient.prototype.query = function(name, args) {
	var self = this;
	args  = args || [];

	return SQL.read(name).then(function(query) {
		return new Promise(function(resolve, reject) {
			pg.connect(self.url, function(err, client, done) {
				if(err) return reject(err);

				client.query(query, args, function(err, result) {
					if(err) return reject(err);

					done();
					resolve(result);
				});
			});
		});
	});
};

/*  Does query over multi-dimensional array */
PGClient.prototype.query_many = function(name, multiArgs) {
	var self = this;
	multiArgs = multiArgs || [[]];

	return SQL.read(name).then(function(query) {
		var promises = [];

		multiArgs.forEach(function(args) {
			var promise = self.query(name, args);
			promises.push(promise);
		});

		return Promise.all(promises);
	});
};

/*
##############Section begins query specific operations
*/
PGClient.prototype.document_insert_many = function(projectID, documents) {
	var multiArgs = documents.map(function(document) {
		return [ projectID, document.id, document.extension, document.content ];
	});

	return this.query_many('document_insert', multiArgs).reduce(rowCount_reduce, 0);
};

PGClient.prototype.document_delete_many = function(projectID, documents) {
	var multiArgs = documents.map(function(document) {
		return [ projectID, document.id ];
	});

	return this.query_many('document_delete', multiArgs).reduce(rowCount_reduce, 0);
};

PGClient.prototype.document_insert = function(projectID, document) {
	return this.query('document_insert',
		[ 	projectID,
			document.id,
			document.extension,
			document.content ]).then(rowCount);
};

PGClient.prototype.document_delete = function(projectID, document) {
	return this.query('document_delete',
		[ 	projectID,
			document.id ]).then(rowCount);
};

PGClient.prototype.generateID = function(length) {
	return misc.random(length, this.random_possibles);
}
PGClient.prototype.projectID_generate = function(length) {
	var id = this.generateID(length)

	return this.projectID_exists(id).then(function(exists) {
		if(exists === true) {
			return this.projectID_generate(length);
		} else {
			return id;
		}
	}.bind(this));
};

PGClient.prototype.project_id_exists = function(projectID) {
	return this.query('project_id_exists', [projectID])
		.then(rowCount)
		.then(function(count) {
			return count > 0;
	});
}

PGClient.prototype.project_exists = function(project) {
	return this.projectID_exists(project.id);
};

PGClient.prototype.project_insert = function(project) {
	return this.query('project_insert',
		[ 	project.id,
			project.platform,
			project.tag ]).then(rowCount);
};

PGClient.prototype.project_delete = function(project) {
	return this.query('project_delete',
		[ project.id ]).then(rowCount);
};

PGClient.prototype.project_ids_select = function() {
	return this.query('project_ids_select')
			.then(rows)
			.map(function(row) {
				return row.id;
			});
};

PGClient.prototype.project_save_select = function(project_id, save_id) {
    return this.query('project_save_select', [ project_id, save_id ])
            .then(rows)
            .reduce(function(project, row) {
                if(val.undefined(project.id)) {
                    project = {
                        id:row.project_id,
                        saveID:row.save_id,
                        parentID:row.save_parent || '',
                        documents:[]
                    };
                }

                project.documents.push({
                    id:row.document_id,
                    extension:row.document_extension,
                    content:row.document_content
                });

                return project;
            }, {});
};

PGClient.prototype.execute = function() {
	return this.query('execute')
            .then(rows)
            .reduce(function(info, row) {
        		var platformlc = row.platform.toLowerCase();

        		if(val.undefined(info[platformlc]) === true) {
        			info[platformlc] = {};
        		}

        		var tag = row.tag;
        		info[platformlc][tag] = {
        			run:row.run,
        			compile:row.compile || ''
        		};

        		return info;
        	}, {});
};

PGClient.prototype.meta = function() {
	return this.query('meta').then(rows).reduce(function(info, row) {
		     var id = row.platform_id;

			if(val.undefined(info[id])) {
				info[id] = {
                    name:row.platform_name,
					aceMode:row.platform_acemode,
					extension:row.platform_extension,
                    tags:[],
					demo:{}
				};
			}

            info[id].tags.push(row.version_tag);

            if(val.defined(row.demo_content)) {
                info[id].demo[row.version_tag] = row.demo_content;
            }

            return info;
    }, {});
};

module.exports = PGClient;
