SELECT  p.id as project_id,
        p.platform as project_platform,
        p.tag as project_tag,
        p.saveRoot as project_saveroot,
        s.id as save_id,
        s.parent as save_parent,
        s.stdout as save_stdout,
        s.stderr as save_stderr,
        d.id as document_id,
        d.extension as document_extension,
        d.content as document_content
FROM project p
JOIN save s ON s.project = p.id
JOIN document d ON d.project = p.id AND d.save = s.id
WHERE p.id = $1 AND s.id = $2; 
