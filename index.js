var fs = require('fs'),
    request = require('request'),
    xmlParse = require('xml2js'),
    peersXML, seedsXML, completedXML, uptimeXML, torrentsXML, now = Date.now();

// Edit with your link and location of json file
var link = 'https://tracker.babico.name.tr/stats?mode=everything',
    json_loc = '/home/ubuntu/webserver/files/tracker-json/tracker.json';

request(link, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        xmlParse.parseString(body, function (error, result) {
            if (error) console.log(error);

            var jsonStr = JSON.stringify(result);
            var jsonObj = JSON.parse(jsonStr);

            uptimeXML = jsonObj.stats.uptime[0];
            peersXML = jsonObj.stats.peers[0].count[0];
            seedsXML = jsonObj.stats.seeds[0].count[0];
            completedXML = jsonObj.stats.completed[0].count[0];
            torrentsXML = jsonObj.stats.torrents[0].count_mutex[0];
        })
    }
    fs.readFile(json_loc, 'utf8', function readFileCallback(err, data) {
        if (fs.existsSync(json_loc)) {
            if (fs.existsSync(json_loc)) {
                fs.writeFile(json_loc, '{"data":[]}', 'utf8', function(err, data) { if(err) console.log(err) });
                toJson(data);
            } else {
                toJson(data);
            }
        }
    })

    function toJson(data) {
        var obj = JSON.parse(data);
        obj.data.push({
            serverUptime: parseInt(uptimeXML),
            time: now,
            peers: parseInt(peersXML),
            seeds: parseInt(seedsXML),
            torrents: parseInt(torrentsXML),
            completed: parseInt(completedXML)
        });

        json = JSON.stringify(obj);
        fs.writeFile(json_loc, json, 'utf8', function (err, data) {
            if (err) console.log(err)
        });
    }
})
