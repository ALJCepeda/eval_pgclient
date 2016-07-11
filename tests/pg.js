var PGClient = require('./../scripts/pg');
var Promise = require('bluebird');
var tape = require('tape');
var url = 'postgres://vagrant:password@localhost/eval';

var pg = new PGClient(url);
var xtape = function(name) {
	console.log('Test (' + name + ') manually avoided');
};

var run = function() {
tape('meta', function(t) {
	pg.meta().then(function(meta) {
		t.deepEqual(
			meta,
			{	php: {
					name: 'PHP',
     				aceMode: 'php',
     				extension: 'php',
     				tags: [ 'latest', '5.5', '5.4', '5.6' ],
     				demo: { latest: '<?php\\n\\techo "Hello World!";' } },
  				nodejs: {
					name: 'NodeJS',
     				aceMode: 'javascript',
     				extension: 'js',
     				tags: [ 'latest', '0.12.7' ],
     				demo: { latest: 'console.log("Hello World!");' } },
  				haskell: {
					name: 'Haskell',
     				aceMode: 'haskell',
     				extension: 'hs',
     				tags: [ 'latest' ],
     				demo: { latest: 'main = putStrLn "Hello World!";' } },
  				pascal: {
					name: 'Pascal',
     				aceMode: 'pascal',
     				extension: 'pas',
     				tags: [ 'latest' ],
     				demo: { latest: 'program Hello;\\nbegin\\n\\twriteln ("Hello World!");\\nend.' }
			} },
			'Platform meta information');
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

tape('project_id_exists', function(t) {
	pg.project_id_exists('phptest').then(function(result) {
		t.true(result, 'Project phptest exists');

		return pg.project_id_exists('nodejstest');
	}).then(function(result) {
		t.true(result, 'Project nodejstest exists');

		return pg.project_id_exists('WONTEXISTMOO');
	}).then(function(result) {
		t.false(result, 'Project WONTEXISTMOO does not exist');
	}).catch(t.fail).done(t.end);
});

tape('project_ids_select', function(t) {
	pg.project_ids_select().then(function(ids) {
		t.deepEqual(
			ids,
			[ 'phptest', 'nodejstest' ],
			'Array of project names'
		);
	}).catch(t.fail).done(t.end);
});

tape('project_save_select', function(t) {
	pg.project_save_select('phptest', 'test1').then(function(project) {
		t.deepEqual(
			project,
			{ 	id: 'phptest',
  				saveID: 'test1',
  				parentID: '',
  				documents: [
					{ 	id: 'index',
       					extension: 'php',
       					content: '<?php echo "This is php test1";' }
			] },
			'PHP project test1 save'
		);

		return pg.project_save_select('phptest', 'test2');
	}).then(function(project) {
		t.deepEqual(
			project,
			{ 	id: 'phptest',
  				saveID: 'test2',
  				parentID: 'test1',
  				documents: [
					{ 	id: 'index',
       					extension: 'php',
       					content: '<?php echo "This is php test2";' }
			] },
			'PHP project test2 save'
		);

		return pg.project_save_select('nodejstest', 'test1');
	}).then(function(project) {
		t.deepEqual(
			project,
			{ 	id: 'nodejstest',
  				saveID: 'test1',
  				parentID: '',
  				documents: [
					{ 	id: 'index',
       					extension: 'js',
       					content: 'console.log("This is nodejs test1");' }
			] },
			'NodeJS project test1 save'
		);

		return pg.project_save_select('nodejstest', 'test2');
	}).then(function(project) {
		t.deepEqual(
			project,
			{ 	id: 'nodejstest',
  				saveID: 'test2',
  				parentID: 'test1',
  				documents: [
					{ 	id: 'index',
       					extension: 'js',
       					content: 'console.log("This is nodejs test2");' }
			] },
			'NodeJS project test2 save'
		);
	}).catch(t.fail).done(t.end);
});

/*
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
});*/

}

module.exports = {
	run:run
};
