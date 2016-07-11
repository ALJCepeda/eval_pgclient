SELECT
	p.id as platform_id,
	p.name as platform_name,
	p.aceMode as platform_acemode,
	p.extension as platform_extension,
	v.tag as version_tag,
	d.extension as demo_extension,
	d.content as demo_content
FROM platform p
JOIN version v ON v.platform = p.id
LEFT OUTER JOIN demo d ON d.platform = p.id AND d.tag = v.tag
WHERE v.enabled = true;
