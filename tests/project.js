var tape = require('tape');
var Project = require('./../scripts/project');

var a = new Project({
	id:'phpize',
	platform:'php',
	tag:'5.6',
	save: {
		id:'save1',
		parent:'izesave',
		root:'izesave',
		output:''
	},
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
	save: {
		id:'save2',
		parent:'save1',
		root:'izesave',
		output:''
	},
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
	save: {
		id:'save2',
		parent:'save1',
		root:'izesave',
		output:''
	},
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
	t.false(a.identical(b), 'Project don\'t have same save info');
    t.false(a.equal(c), 'Projects are not equal, minor difference');
    t.end();
});
