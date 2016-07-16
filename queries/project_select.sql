SELECT  p.id AS project_id,
        p.platform as project_platform,
        p.tag as project_tag,
        s.id as save_id,
        s.parent as save_parent,
        d.id as document_id,
        d.extension as document_extension,
        d.content as document_content
FROM project p
JOIN save s ON p.id = s.project AND s.parent IS NULL
JOIN document d ON p.id = d.project AND s.id = d.save
WHERE p.id = $1
