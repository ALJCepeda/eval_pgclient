var tape = require('tape');
var Project = require('./../scripts/project');

var a = new Project({
	id:'phpize12',
	platform:'php',
	tag:'5.6',
	save: {
		id:'save1829',
		parent:'izesave9',
		root:'izesave9',
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
	id:'phpize12',
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
	id:'phpize12',
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
			id:'indexs',
			extension:'php',
			content:'This is a save for phpize'
		}
	}
});

/*tape('equal', function(t) {
    t.true(a.equal(b), 'Projects are equal');
	t.false(a.identical(b), 'Project don\'t have same save info');
    t.false(a.equal(c), 'Projects are not equal, minor difference');

	t.true(a.valid(), 'Project A is valid');
	t.false(b.valid('insert'), 'Project B is not valid for inserting into DB');
	t.false(c.valid(), 'Project C does not contain index file');
    t.end();
});*/

var case1 = new Project({ 	id: '0mLmz5yi', platform: 'nodejs', tag: 'latest',
  			 	save: { id: '0oAcp8ol', root: '0oAcp8ol', parent: '', output: '' },
  	 			documents:
   					{ index: { id: 'index', extension: 'js', content: 'console.log(\'Hello NodeJS!\')' } }
});

tape('cases', function(t) {
	t.true(case1.valid('insert'), 'Case1 use to be an invalid insert');
	t.end();
})
