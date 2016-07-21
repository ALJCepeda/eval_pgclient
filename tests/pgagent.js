var PGAgent = require('./../scripts/pgagent');

var Promise = require('bluebird');
var tape = require('tape');
var url = 'postgres://vagrant:password@localhost/eval';

var agent = new PGAgent(url);
var xtape = function(name) {
	console.log('Test (' + name + ') manually avoided');
};

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
            }, 'Selected phptest Project'
        );
    }).catch(t.fail).done(t.end);
});

tape('execute', function(t) {
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
