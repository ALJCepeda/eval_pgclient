var PGAgent = require('./../scripts/pgagent');

var Promise = require('bluebird');
var tape = require('tape');
var url = 'postgres://vagrant:password@localhost/eval';

var agent = new PGAgent(url);
var xtape = function(name) {
	console.log('Test (' + name + ') manually avoided');
};

xtape('execute', function(t) {
    agent.execute().then(function(executeInfo) {
        t.deepEqual(
            executeInfo,
            {   php: {  latest: {   platform: 'php',
                                    tag: 'latest',
                                    compile: null,
                                    run: 'php index.php' }
                },
                nodejs: {   latest: {   platform: 'nodejs',
                                        tag: 'latest',
                                        compile: null,
                                        run: 'node index.js' }
                },
                haskell: {  latest: {   platform: 'haskell',
                                        tag: 'latest',
                                        compile: 'ghc -o app index.hs',
                                        run: './app'    }
                },
                pascal: {   latest: {   platform: 'pascal',
                                        tag: 'latest',
                                        compile: 'fpc index.pas',
                                        run: './index'  }
                }
        }, 'Selected execute info' );
    }).catch(t.fail).done(t.end);
});

xtape('platform', function(t) {
    agent.platform().then(function(platformInfo) {
        t.deepEqual(
            platformInfo,
            {   php: {  name: 'PHP',
                        aceMode: 'php',
                        extension: 'php',
                        tags: [ 'latest', '5.5', '5.4', '5.6' ],
                        demo: ''
                },
                nodejs: {   name: 'NodeJS',
                            aceMode: 'javascript',
                            extension: 'js',
                            tags: [ 'latest', '0.12.7' ],
                            demo: ''
                },
                haskell: {  name: 'Haskell',
                            aceMode: 'haskell',
                            extension: 'hs',
                            tags: [ 'latest' ],
                            demo: ''
                },
                pascal: {   name: 'Pascal',
                            aceMode: 'pascal',
                            extension: 'pas',
                            tags: [ 'latest' ],
                            demo: ''
                }
        }, 'Selected platform info');
    }).catch(t.fail).done(t.end);
});

xtape('projectSelect', function(t) {
    agent.projectSelect('phptest').then(function(project) {
        t.deepEqual(
            project,
            {   id: 'phptest',
                platform: 'php',
                tag: 'latest',
                saveRoot: 'test1',
                save: 'test1',
                parent: null,
                documents:[
                    {   id: 'index',
                        extension: 'php',
                        content: '<?php echo "This is php test1";' }
                ]
            }, 'Selected Project \'phptest\''
        );
    }).catch(t.fail).done(t.end);
});

tape('projectSaveSelect', function(t) {
    agent.projectSaveSelect('test2', 'phptest').then(function(project) {
        t.deepEqual(
			project,
			{ 	id: 'phptest',
  				platform: 'php',
  				tag: 'latest',
  				saveRoot: 'test1',
  				save: 'test2',
  				parent: 'test1',
  				documents: [
					{ 	id: 'index',
       					extension: 'php',
       					content: '<?php echo "This is php test2";' }
				]
		}, 'Selected save \'test2\' of project \'phptest\'');
    }).catch(t.fail).done(t.end);;
})
