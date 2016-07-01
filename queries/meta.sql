SELECT
	p.id,
	p.aceMode,
	p.extension,
	v.tag,
	pj.id as project_id,
	d.id as document_id,
	d.extension,
	d.content
FROM platform p
JOIN version v ON v.platform = p.id
LEFT OUTER JOIN project pj ON p.id = pj.platform AND v.tag = pj.tag AND pj.demo = true
LEFT OUTER JOIN document d ON pj.id = d.project
