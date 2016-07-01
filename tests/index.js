var PGClient = require('./../index');
var Promise = require('bluebird');
var tape = require('tape');
var url = 'postgres://vagrant:password@localhost/eval';

var pg = new PGClient(url);
var xtape = function(name) {
	console.log('Test (' + name + ') manually avoided');
};

tape('meta', function(t) {
	pg.meta().then(function(meta) {
		t.ok(meta.php, 'PHP');
		t.ok(meta.nodejs, 'NodeJS');
		t.ok(meta.haskell, 'Haskell');
		t.ok(meta.pascal, 'Pascal');

		t.deepEqual(
			meta.php.tags,
			[ 'latest', '5.6', '5.4', '5.5' ],
			'PHP tags'
		);

		t.deepEqual(
			meta.nodejs.tags,
			[ 'latest', '0.12.7' ],
			'NodeJS tags'
		);

		t.deepEqual(
			meta.haskell.tags,
			[ 'latest' ],
			'Haskell tags'
		);

		t.deepEqual(
			meta.pascal.tags,
			[ 'latest' ],
			'Pascal tags'
		);
	}).catch(t.fail).done(t.end);
});

tape('execute', function(t) {
	pg.execute().then(function(exec) {
		t.deepEqual(
			exec,
			{ 	php: { latest: { run: 'php index.php', compile: '' } },
  				nodejs: { latest: { run: 'node index.js', compile: '' } },
  				haskell: { latest: { run: './app', compile: 'ghc -o app index.hs' } },
  				pascal: { latest: { run: './index', compile: 'fpc index.pas' } }	},
			'Execution information for platforms'
		);
	}).catch(t.fail).done(t.end);
});

tape('projectID_exists', function(t) {
	pg.projectID_exists('PHP').then(function(result) {
		t.true(result, 'Project PHP exists');

		return pg.projectID_exists('WONTEXISTMOO').then(function(result) {
			t.false(result, 'Project WONTEXISTMOO does not exist');
		});
	}).catch(t.fail).done(t.end);
});

tape('project_ids', function(t) {
	pg.project_ids().then(function(ids) {
		t.deepEqual(
			ids,
			[ 'PHP', 'NodeJS', 'Haskell', 'Pascal' ],
			'Array of project names'
		);
	}).catch(t.fail).done(t.end);
});

tape('project_insert/project_delete', function(t) {
	var project = {
		id:'phpTest',
		platform:'PHP',
		tag:'5.6',
		documents:
		[
			{
				id:'index',
				extension:'php',
				content:'<?php require(\'helloWorld.php\');'
			}, {
				id:'helloWorld',
				extension:'php',
				content:'<?php \n\techo \'Hello World!\');'
			}
		]
	};

	pg.project_insert(project).then(function(count) {
		t.equal(count, 1, 'Inserted 1 project');
		return pg.document_insert_many(project.id, project.documents);
	}).then(function(count) {
		t.equal(count, 2, 'Inserted 2 documents');
		return pg.document_delete_many(project.id, project.documents);
	}).then(function(count) {
		t.equal(count, 2, 'Deleted 2 documents');
		return pg.project_delete(project);
	}).then(function(count) {
		t.equal(count, 1, 'Deleted 1 project');
	}).catch(t.fail).done(t.end);
});
