var PGClient = require('./../index');
var Promise = require('bluebird');
var tape = require('tape');
var url = 'postgres://vagrant:password@localhost/eval';

var pg = new PGClient(url);
var xtape = function(name) {
	console.log('Test (' + name + ') manually avoided');
};

xtape('meta', function(t) {
	pg.meta().then(function(info) {
		t.ok(info.php, 'PHP');
		t.ok(info.nodejs, 'NodeJS');
		t.ok(info.haskell, 'Haskell');
		t.ok(info.pascal, 'Pascal');

		t.deepEqual(
			info.php.tags,
			[ 'latest', '5.6', '5.4', '5.5' ],
			'PHP tags'
		);

		t.deepEqual(
			info.nodejs.tags,
			[ 'latest', '0.12.7' ],
			'NodeJS tags'
		);

		t.deepEqual(
			info.haskell.tags,
			[ 'latest' ],
			'Haskell tags'
		);

		t.deepEqual(
			info.pascal.tags,
			[ 'latest' ],
			'Pascal tags'
		);
	}).catch(t.fail).done(t.end);
});

xtape('execute', function(t) {
	pg.execute().then(function(info) {
		console.log(info);
	});
});

tape('project_exist', function(t) {
	pg.project_exist('PHPS').then(function(result) {
		console.log(result);
	});
});

/*
tape('project_names', function(t) {
	pg.project_names().then(function(names) {
		t.deepEqual(
			names,
			[ 'PHP', 'NodeJS', 'Haskell', 'Pascal' ],
			'Array of project names'
		);
	}).catch(t.fail).done(t.end);
});

tape('project_insert/project_delete', function(t) {
	var project = {
		name:'phpTest',
		platform:'PHP',
		tag:'5.6',
		documents:
		[
			{
				name:'index',
				extension:'php',
				content:'<?php require(\'helloWorld.php\');'
			}, {
				name:'helloWorld',
				extension:'php',
				content:'<?php \n\techo \'Hello World!\');'
			}
		]
	};

	pg.project_insert(project).then(function(count) {
		t.equal(count, 1, 'Inserted 1 project');
		return pg.document_insert_many(project.name, project.documents);
	}).then(function(count) {
		t.equal(count, 2, 'Inserted 2 documents');
		return pg.document_delete_many(project.name, project.documents);
	}).then(function(count) {
		t.equal(count, 2, 'Deleted 2 documents');
		return pg.project_delete(project);
	}).then(function(count) {
		t.equal(count, 1, 'Deleted 1 project');
	}).catch(t.fail).done(t.end);
});*/
