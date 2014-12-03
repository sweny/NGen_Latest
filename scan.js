var mdb = require('moviedb')('fb92666a2288e824aaa575b983c6e182');
var fs = require('fs');
var databaseUrl = 'mongodb://localhost:27017/moviedb';
var collections = ["movie","genre","translations","reviews","images","trailers","similar","toprated"]
var db = require("mongojs").connect(databaseUrl, collections);
var exec = require('child_process').exec ;
var folder;

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
            processFileName(files[i]);
        }
    }
}

/*
 Input - File name rules : Movie Name (Year).Extension
 Output - JSON of moviename and Year

 */
function parse(fileName) {
    var movieName = "";
    var movieYear = "";

    var arr = fileName.split("(");
    var movieInput = {
        name: arr[0].trim(),
        year: arr[1].split(")")[0]
    };

    return movieInput;
}

function processFileName(fileName) {
    var movieInput = parse(fileName);

    mdb.searchMovie({query: movieInput.name}, function (err, res) {

        for (var i = 0; i < res.results.length; i++) {

            var release_date = res.results[i].release_date;
            var release_year = release_date.split("-")[i];
            var movie_id = res.results[i].id;
			 var id = res.results[i].id;

            if (release_year == movieInput.year) {
                /*
                    Stores a soft link of the movie source into the
                    static folder in the web server for video streaming
                */
                var source = folderPath + "/" + fileName;
                var dest = 'static/videos/' + res.results[i].id + '.mp4';
                child = exec('ln -s "' + source + '" "' + dest + '"');

               mdb.movieInfo({id: res.results[i].id}, function (err, movieres) {
				 //   console.log(movieres.id);
					//retrieve and store list of available translations
					mdb.movieTranslations({id:movieres.id}, function (err, transres) {
				   //     console.log(transres.translations);
						movieres.translations = transres.translations;
						console.log(movieres);
						db.movie.save(movieres);

					});
				});

                //retrieve Youtube link for movie trailer
                mdb.movieTrailers({id: movie_id },function(err,res){
                    var trailers = {};

                    var base_url = "http://www.youtube.com/embed/";
                    var numOfTrailers = res.youtube.length;

                    if( numOfTrailers > 0) {
                        trailers.id = movie_id;
                        trailers.videos = [];
                    }

                    for (var i = 0; i < numOfTrailers ; i++) {
                        var youtube_id = res.youtube[i].source;
                        var url = base_url + youtube_id;
                        trailers.videos.push ({
                            "url" : url,
                            "type" : res.youtube[i].type
                        });

                    }
                    console.log("Trailers:::",trailers);
                    db.trailers.save(trailers);

                });

               /*  //retrieve and store list of available translations
                mdb.movieTranslations({id: res.results[i].id}, function (err, res) {
                  //  console.log(res);
                    db.translations.save(res);
                }); */

                //retrieve and store all available images(backdrop and posters) for specific movie
                mdb.movieImages({id: res.results[i].id}, function (err, res) {
                   // console.log(res);
                    db.images.save(res);
                });
               

                mdb.movieReviews({id:movie_id},function(err,res){
                    db.reviews.save(res);
                });
				
				  mdb.movieSimilar({id: res.results[i].id}, function(err,res){
                    res.id = id;
                 //   console.log(res);
                    db.similar.save(res);
                });

                mdb.miscTopRatedMovies({}, function(err,res){
                    console.log(res);
                    db.toprated.save(res);
                });
                break;
            }
            db.close();
        }
    });
}
//this method gets all the genres present and stores it in mongodb
function getAllGenre() {
    mdb.genreList({}, function (err, res) {
        for (var i=0;i< res.genres.length;i++){
            //console.log(res);
            db.genre.save(res.genres[i], function(err, saved){
                if(err || !saved) {
                    //console.log("Error.Genre not updated in collection!!");
                    //console.log(err);
                    db.close();
                }
                else {
                    //console.log("Genre updated in database");
                }
            //db.close
            });
        }
          //  console.log("hello", res);
    });
}


var folderPath = getFolderPath();
getAllGenre();
printFileNamesInFolder(folderPath);

