var PGClient = require('./../index');
var Promise = require('bluebird');
var tape = require('tape');
var url = 'postgres://vagrant:password@localhost/eval';

var pg = new PGClient(url);

tape('info', function(t) {
	pg.info().then(function(info) {
		t.ok(info.PHP, 'PHP');
		t.ok(info.NodeJS, 'NodeJS');
		t.ok(info.Haskell, 'Haskell');
		t.ok(info.Pascal, 'Pascal');

		t.deepEqual(
			info.PHP.tags,
			[ 'latest', '5.6', '5.4', '5.5' ],
			'PHP tags'
		);

		t.deepEqual(
			info.NodeJS.tags,
			[ 'latest', '0.12.7' ],
			'NodeJS tags'
		);

		t.deepEqual(
			info.Haskell.tags,
			[ 'latest', '7.10.2' ],
			'Haskell tags'
		);

		t.deepEqual(
			info.Pascal.tags,
			[ 'latest', '2.6.4' ],
			'Pascal tags'
		);
	}).catch(t.fail).done(t.end);
});

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
});
