SELECT e.platform, e.tag, e.run, e.compile
FROM platform p
JOIN execute e on e.platform = p.name;
