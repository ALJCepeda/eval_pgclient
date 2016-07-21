var tape = require('tape');
var Project = require('./../scripts/project');

var a = new Project({
	id:'phpize',
	platform:'php',
	tag:'5.6',
	saveRoot:'izesave',
	save:'save1',
	parent:'izesave',
	documents: {
		index: {
			id:'index',
			extension:'php',
			content:'This is a save for phpize'
		}
	}
});

var b = new Project({
	id:'phpize',
	platform:'php',
	tag:'5.6',
	saveRoot:'izesave',
	save:'save2',
	parent:'save1',
	documents: {
		index: {
			id:'index',
			extension:'php',
			content:'This is a save for phpize'
		}
	}
});

var c = new Project({
	id:'phpize',
	platform:'php',
	tag:'5.6',
	saveRoot:'izesave',
	save:'save2',
	parent:'save1',
	documents: {
		index: {
			id:'index',
			extension:'php',
			content:'This is a save for phpizes'
		}
	}
});

tape('equal', function(t) {
    t.true(a.equal(b), 'Projects are equal');
    t.false(a.equal(c), 'Projects are not equal, minor difference');
    t.end();
});
