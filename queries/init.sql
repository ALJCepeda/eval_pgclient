CREATE DATABASE eval;
\connect eval;

CREATE TABLE platform (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	aceMode TEXT NOT NULL,
	extension TEXT NOT NULL
);

INSERT INTO platform ( id, name, extension, aceMode ) VALUES
	( 'php', 'PHP', 'php', 'php' ),
	( 'nodejs', 'NodeJS', 'js', 'javascript' ),
	( 'haskell', 'Haskell', 'hs', 'haskell' ),
	( 'pascal', 'Pascal', 'pas', 'pascal'  );

CREATE TABLE version (
	platform TEXT REFERENCES platform,
	tag TEXT NOT NULL,
	enabled boolean NOT NULL default true,
	PRIMARY KEY(platform, tag)
);

INSERT INTO version ( tag, platform ) VALUES
	( '5.4', 'php' ), ( '5.5', 'php' ), ( '5.6', 'php' ), ( 'latest', 'php' ),
	( '0.12.7', 'nodejs'), ( 'latest', 'nodejs' ),
	( 'latest', 'haskell' ), ( 'latest', 'pascal' );

CREATE TABLE execute (
	platform TEXT NOT NULL,
	tag TEXT NOT NULL,
	run text NOT NULL,
	compile text,
	FOREIGN KEY(platform, tag) REFERENCES version,
	PRIMARY KEY(platform, tag)
);

INSERT INTO execute ( platform, tag, run, compile) VALUES
	( 'php', 'latest', 'php index.php', NULL ),
	( 'nodejs', 'latest', 'node index.js', NULL ),
	( 'haskell', 'latest', './app', 'ghc -o app index.hs' ),
	( 'pascal', 'latest', './index', 'fpc index.pas');

CREATE TABLE demo (
	platform TEXT NOT NULL,
	tag TEXT NOT NULL,
	extension TEXT NOT NULL,
	content TEXT NOT NULL,
	FOREIGN KEY(platform, tag) REFERENCES version,
	PRIMARY KEY(platform, tag)
);

INSERT INTO demo ( platform, tag, extension, content ) VALUES
	( 'php', 'latest', 'php', '<?php\n\techo "Hello World!";' ),
	( 'nodejs', 'latest', 'js', 'console.log("Hello World!");' ),
	( 'haskell', 'latest', 'hs', 'main = putStrLn "Hello World!";' ),
	( 'pascal', 'latest', 'pas', 'program Hello;\nbegin\n\twriteln ("Hello World!");\nend.');

CREATE TABLE project (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
	tag TEXT NOT NULL,
	save_root TEXT NOT NULL,
    created timestamp with time zone DEFAULT now(),
	FOREIGN KEY(platform, tag) REFERENCES version
);

INSERT INTO project (id, platform, tag, save_root) VALUES
	('phptest', 'php', 'latest', 'test1'),
	('nodejstest', 'nodejs', 'latest', 'test1');

CREATE TABLE save (
	id TEXT NOT NULL,
	project TEXT NOT NULL,
	parent TEXT,
	stdout TEXT NOT NULL DEFAULT '',
	stderr TEXT NOT NULL DEFAULT '',
	created timestamp with time zone DEFAULT now(),
	FOREIGN KEY(project) REFERENCES project,
	PRIMARY KEY(id, project),
	UNIQUE(id, project, parent),
	FOREIGN KEY (parent, project) REFERENCES save(id, project)
);

INSERT INTO save (id, project, parent, stdout) VALUES
	( 'test1', 'phptest', NULL, 'This is php test1' ),
	( 'test2', 'phptest', 'test1', 'This is php test2' ),
	( 'test1', 'nodejstest', NULL, 'This is nodejs test1' ),
	( 'test2', 'nodejstest', 'test1', 'This is nodejs test2');

CREATE TABLE document (
	id TEXT NOT NULL,
	save TEXT NOT NULL,
	project TEXT NOT NULL,
	extension TEXT NOT NULL,
	content TEXT NOT NULL,
	FOREIGN KEY(save, project) REFERENCES save ON DELETE CASCADE,
	PRIMARY KEY(id, extension, save, project)
);

INSERT INTO document (id, save, project, extension, content) VALUES
	('index', 'test1', 'phptest', 'php', '<?php echo "This is php test1";'),
	('index', 'test2', 'phptest', 'php', '<?php echo "This is php test2";'),
	('index', 'test1', 'nodejstest', 'js', 'console.log("This is nodejs test1");'),
	('index', 'test2', 'nodejstest', 'js', 'console.log("This is nodejs test2");');
