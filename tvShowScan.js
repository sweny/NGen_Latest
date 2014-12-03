var mdb = require('moviedb')('fb92666a2288e824aaa575b983c6e182');
var db = require('./tvDB.js');
var fs = require('fs');
var exec = require('child_process').exec ;


function getFolderPath() {
    var folderPath = "";
    process.argv.forEach(function (val, index, array) {
        if (index == 2) {
            folderPath = val;
        }
    });
    folder = folderPath;
    return folderPath;
}

function printFileNamesInFolder(folderPath) {
    fs.readdir(folderPath, readdirCallback);
}

function readdirCallback(err, files) {
    if (err !== null) {
        //console.log(err);
    } else {
        for (var i in files) {
            //console.log(files[i]);
            parseTvShow(files[i]);
        }
    }
}

/*
	TV Show should have the format of 
	ShowName - S**E**
	And should be kept in separate directory (TVSHOWS)
*/
function parseTvShow(fileName) {
	console.log("TvShow Name::",fileName);

	//fileName = fileName.toLowerCase();
	var tvShowRegex = "([^\-]+)\- +s([0-9]+)e([0-9]+)\.(.+)";
	tvshow = fileName.match(tvShowRegex);



	if(tvshow.length < 5) {
		console.log("fileName:: ",fileName,"does not comply to standards");
	} else {
		var tvshowName = tvshow[1];
		var tvShowSeason = tvshow[2];
		var tvShowEpisode = tvshow[3];
		var tvshowExt = tvshow[4];
		var tvShowID = "";
	
		mdb.searchTv({query: tvshowName }, function(err, res){
			if(res.results.length > 0) {
				tvShowID = res.results[0].id;
				
				mdb.tvInfo({id: tvShowID }, function(err, res){
					db.saveTvShow(res);
				});

				console.log("id ::", tvShowID,"::",tvShowSeason,"::",tvShowEpisode);

				//Store tv Show Information
				var tvShowInfo = {
					tvShowID : tvShowID,
					tvShowSeason : parseInt(tvShowSeason),
					tvShowEpisode : parseInt(tvShowEpisode)

				};

				/*
                    Stores a soft link of the tv Show source into the
                    static folder in the web server for video streaming
                */

                /*var source = folderPath + "/" + fileName;
                var dest = 'static/tvShows/' + tvShowInfo.tvShowID + "_" + tvShowInfo.tvShowSeason + "_" + tvShowInfo.tvShowEpisode ;
                child = exec('ln -s "' + source + '" "' + dest + '"');*/


				db.saveTvCollection(tvShowInfo);

				//Season Information 
				mdb.tvSeasonInfo({id: tvShowID,  season_number : tvShowSeason }, function(err, res){
					var season_info = {
						tvShowID : tvShowID,
						season_number : res.season_number,
						season_info : res
					}
					db.saveTvSeasons(season_info);
					//console.log(season_info);

				});
			
				//Save Episode Information to the DB
				mdb.tvEpisodeInfo({id : tvShowID, season_number : tvShowSeason , episode_number:tvShowEpisode }, function(err, res){
					var episode_info = {
						air_date : res.air_date,
						name : res.name,
						overview : res.overview,
						season_number : res.season_number,
						episode_number : res.episode_number,
						episode_id : res.id,
						tvShowID : tvShowID,
						still_path : res.still_path
					};

					 db.saveTvEpisodes(episode_info);
				});
				
			}	
		});  	
	}
}


/*var folderPath = getFolderPath();
printFileNamesInFolder(folderPath);*/

 

parseTvShow("The Big Bang Theory - s01e01.mkv")
parseTvShow("The Big Bang Theory - s02e01.mkv")
parseTvShow("The Big Bang Theory - s02e04.mkv")
parseTvShow("The Big Bang Theory - s02e05.mkv")
parseTvShow("Castle - s02e01.mkv");
parseTvShow("Castle - s04e02.mkv");
parseTvShow("Castle - s02e03.mkv");
parseTvShow("Castle - s03e03.mkv");
parseTvShow("Castle - s04e03.mkv");

parseTvShow("Castle - s01e03.mkv");
parseTvShow("Castle - s05e03.mkv");
parseTvShow("Castle - s06e03.mkv");
parseTvShow("Castle - s07e03.mkv");


parseTvShow("Friends - s04e03.mkv");
parseTvShow("Episodes - s01e02.mkv");
parseTvShow("Episodes - s01e02.mkv");

parseTvShow("Breaking Bad - s01e01.mkv");
parseTvShow("Game Of Thrones  - s01e01.mkv");

