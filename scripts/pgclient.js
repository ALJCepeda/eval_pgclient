var pg = require('pg');
var File = require('./file');
var Promise = require('bluebird');
var Project = require('./project');
var bare = require('bareutil');
var misc = bare.misc;
var val = bare.val;

/* Read sql file and delivers query */
var SQL = new File(__dirname + '/../queries', 'sql');

/* Wrapper around PG for app specific queries */
var PGClient = function(url) {
	this.url = url;
};

/* PSQL related semantic closures */
var rowCount = function(result) { return result.rowCount; };
var getRows = function(result) { return result.rows; };
var getFirstRow = function(result) { return result.rows[0]; };

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

/*
##############Section begins query specific operations
*/
PGClient.prototype.document_insert = function(projectID, documentID, extension, content) {
	return this.query('document_insert',[ projectID, documentID, extension, content ])
				.then(rowCount);
};

PGClient.prototype.document_delete = function(projectID, documentID) {
	return this.query('document_delete',[ projectID, documentID ])
				.then(rowCount);
};

PGClient.prototype.project_id_exists = function(id) {
	return this.query('project_id_exists', [id])
				.then(rowCount)
				.then(function(count) {
					return count > 0;
			});
}

PGClient.prototype.project_insert = function(id, platform, tag) {
	return this.query('project_insert', [ id, platform, tag ])
				.then(rowCount);
};

PGClient.prototype.project_delete = function(id) {
	return this.query('project_delete',[ id ])
				.then(rowCount);
};

PGClient.prototype.project_ids_select = function() {
	return this.query('project_ids_select')
				.then(getRows)
				.map(function(row) {
					return row.id;
				});
};

PGClient.prototype.project_select = function(projectID) {
    return this.query('project_select', [ projectID ])
                .then(getFirstRow);
};

PGClient.prototype.project_save_select = function(projectID, saveID) {
    return this.query('project_save_select', [ projectID, saveID ])
            	.then(getFirstRow);
};

PGClient.prototype.execute = function() {
	return this.query('execute')
				.then(getRows);
};

PGClient.prototype.platform = function() {
	return this.query('platform')
				.then(getRows);
};

module.exports = PGClient;
