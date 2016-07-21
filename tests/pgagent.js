var PGAgent = require('./../scripts/pgagent');

var Promise = require('bluebird');
var tape = require('tape');
var url = 'postgres://vagrant:password@localhost/eval';

var agent = new PGAgent(url);
var xtape = function(name) {
	console.log('Test (' + name + ') manually avoided');
};

tape('projectSelect', function(t) {
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
    });
});
