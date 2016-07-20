var PGClient = require('./../scripts/pgclient');

var Promise = require('bluebird');
var tape = require('tape');
var url = 'postgres://vagrant:password@localhost/eval';

var pg = new PGClient(url);
var xtape = function(name) {
	console.log('Test (' + name + ') manually avoided');
};
/*
tape('platform', function(t) {
	pg.platform().then(function(platform) {
		t.deepEqual(
			platform,
			[
				{ 	demo_content: '<?php\\n\\techo "Hello World!";',
					demo_extension: 'php',
					platform_acemode: 'php',
					platform_extension: 'php',
					platform_id: 'php',
					platform_name: 'PHP',
					version_tag: 'latest'
			}, { 	demo_content: 'console.log("Hello World!");',
					demo_extension: 'js',
					platform_acemode: 'javascript',
					platform_extension: 'js',
					platform_id: 'nodejs',
					platform_name: 'NodeJS',
					version_tag: 'latest'
			}, { 	demo_content: 'main = putStrLn "Hello World!";',
					demo_extension: 'hs',
					platform_acemode: 'haskell',
					platform_extension: 'hs',
					platform_id: 'haskell',
					platform_name: 'Haskell',
					version_tag: 'latest'
			}, { 	demo_content: 'program Hello;\\nbegin\\n\\twriteln ("Hello World!");\\nend.',
					demo_extension: 'pas',
					platform_acemode: 'pascal',
					platform_extension: 'pas',
					platform_id: 'pascal',
					platform_name: 'Pascal',
					version_tag: 'latest'
			}, { 	demo_content: null,
					demo_extension: null,
					platform_acemode: 'php',
					platform_extension: 'php',
					platform_id: 'php',
					platform_name: 'PHP',
					version_tag: '5.5'
			}, { 	demo_content: null,
					demo_extension: null,
					platform_acemode: 'php',
					platform_extension: 'php',
					platform_id: 'php',
					platform_name: 'PHP',
					version_tag: '5.4'
			}, { 	demo_content: null,
					demo_extension: null,
					platform_acemode: 'php',
					platform_extension: 'php',
					platform_id: 'php',
					platform_name: 'PHP',
					version_tag: '5.6'
			}, { 	demo_content: null,
					demo_extension: null,
					platform_acemode: 'javascript',
					platform_extension: 'js',
					platform_id: 'nodejs',
					platform_name: 'NodeJS',
					version_tag: '0.12.7'
			} ], 'Platform information');
	}).catch(t.fail).done(t.end);
});

tape('execute', function(t) {
	pg.execute().then(function(exec) {
		t.deepEqual(
			exec,
			[ { 	compile: null,
					platform: 'php',
					run: 'php index.php',
					tag: 'latest'
			}, { 	compile: null,
					platform: 'nodejs',
					run: 'node index.js',
					tag: 'latest'
			}, { 	compile: 'ghc -o app index.hs',
					platform: 'haskell',
					run: './app',
					tag: 'latest'
			}, { 	compile: 'fpc index.pas',
					platform: 'pascal',
					run: './index',
					tag: 'latest'
			} ], 'Execution information for platforms');
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


tape('project_select', function(t) {
	pg.project_select('phptest').then(function(project) {
		t.deepEqual(
			project,
			{ 	document_content: '<?php echo "This is php test1";',
				document_extension: 'php',
				document_id: 'index',
				project_id: 'phptest',
				project_platform: 'php',
				project_tag: 'latest',
				save_id: 'test1',
				save_parent: null
			}, 'Selected phptest project'
		);

		return pg.project_select('nodejstest');
	}).then(function(project) {
		t.deepEqual(
			project,
			{ 	document_content: 'console.log("This is nodejs test1");',
				document_extension: 'js',
				document_id: 'index',
				project_id: 'nodejstest',
				project_platform: 'nodejs',
				project_tag: 'latest',
				save_id: 'test1',
				save_parent: null
			}, 'Selected nodejstest project'
		);

	}).catch(t.fail).done(t.end);
});

tape('project_save_select', function(t) {
	pg.project_save_select('phptest', 'test1').then(function(project) {
		t.deepEqual(
			project,
			{ 	document_content: '<?php echo "This is php test1";',
				document_extension: 'php',
				document_id: 'index',
				project_id: 'phptest',
				project_platform: 'php',
				project_tag: 'latest',
				save_id: 'test1',
				save_parent: null
			}, 'PHP project test1 save'
		);

		return pg.project_save_select('phptest', 'test2');
	}).then(function(project) {
		t.deepEqual(
			project,
			{ 	document_content: '<?php echo "This is php test2";',
				document_extension: 'php',
				document_id: 'index',
				project_id: 'phptest',
				project_platform: 'php',
				project_tag: 'latest',
				save_id: 'test2',
				save_parent: 'test1'
			}, 'PHP project test2 save'
		);

		return pg.project_save_select('nodejstest', 'test1');
	}).then(function(project) {
		t.deepEqual(
			project,
			{ 	document_content: 'console.log("This is nodejs test1");',
				document_extension: 'js',
				document_id: 'index',
				project_id: 'nodejstest',
				project_platform: 'nodejs',
				project_tag: 'latest',
				save_id: 'test1',
				save_parent: null
			}, 'NodeJS project test1 save'
		);

		return pg.project_save_select('nodejstest', 'test2');
	}).then(function(project) {
		t.deepEqual(
			project,
			{ 	document_content: 'console.log("This is nodejs test2");',
				document_extension: 'js',
				document_id: 'index',
				project_id: 'nodejstest',
				project_platform: 'nodejs',
				project_tag: 'latest',
				save_id: 'test2',
				save_parent: 'test1'
			}, 'NodeJS project test2 save'
		);
	}).catch(t.fail).done(t.end);
});
*/
tape('project_insert/project_delete', function(t) {
	var project = new Project({
		id:'phpInsertTest',
		platform:'PHP',
		save:'insertTest1',
		parent:null,
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
	});

	pg.project_insert(	'phpInsertTest',
						'php',
						'5.6')
	.then(function(count) {
		t.equal(count, 1, 'Inserted project phpInsertTest');
		return pg.save_insert( 	'phpInsertSave',
								'phpInsertTest',
								NULL);
	}).then(function(count) {
		t.equal(count, 1, 'Insert save phpInsertSave');
		return pg.document_insert(	'phpInsertTest',
									'index',
									'php',
									'<?php require(\'helloWorld.php\');');
	}).then(function(count) {
		t.equal(count, 1, 'Inserted document index');
		return pg.document_insert( 	'phpInsertTest',
									'helloWorld',
									'php',
									'<?php \n\techo \'Hello World!\');');
	}).then(function(count) {
		t.equal(count, 1, 'Inserted document helloWorld');
		return pg.document_delete( 	'phpInsertTest',
									'helloWorld');
	}).then(function(count) {
		t.equal(count, 1, 'Deleted document helloWorld');
		return pg.document_delete(	'phpInsertTest',
									'index');
	}).then(function(count) {
		t.equal(count, 1, 'Deleted document index');
		return pg.project_delete('phpInsertTest');
	}).then(function(count) {
		t.equal(count, 1, 'Deleted project phpInsertTest');
	}).catch(t.fail).done(t.end);
});
