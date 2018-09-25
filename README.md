# nodeTesting
Just a placeholder name until we think of a good name ;p

# Dependecies
```
sqlite3
```
# Instructions
> This will update quite often, please keep that in mind

Currently any files in `./public-html/` can be accessed by going to `http://${hostname}:${port}/${item}`.

Aside from that, `http://${hostname}:${port}/db` can be used (in combination with some GET params) to access the database for now, this *feature* will be removed later on in the dev cycle.

The app can be started by running `node app.js` in the document folder.

The DB can be populated by running `node populate.js [cd]*`, `c` to create new table, `d` to drop old table.