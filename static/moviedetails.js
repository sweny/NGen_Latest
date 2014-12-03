
$( document ).ready(function() {
    
	getMovie();
	var id = window.location.href.split("#")[1];
	var trailer_url = "/trailer.html#" + id;
	var movie_url = "/movie.html#" + id;
	//console.log("url:"+url);
	$("#movieLink").attr('href',movie_url);
	$("#movieTrailerLink").attr('href',trailer_url);
	//getMovieList();
	getSimilarMovies();
	
});

function getMovie(){
	var id = window.location.href.split("#")[1];
	var url = "/movie/" + id;
	$.get(url,function(data){
		var movies = JSON.parse(data);
		movies = movies.movies;;
		$("#movie_poster").attr('src',"http://image.tmdb.org/t/p/w300"+movies[0].poster_path );
		$("#movie_title").text(movies[0].original_title);
		$("#movie_desc").text(movies[0].overview);
		//production_house language_set
		$("#release_date").text(movies[0].release_date);
		$("#runtime").text(movies[0].runtime+" mins");
		var genreSet = movies[0].genres;
		for(var i=0;i<genreSet.length;i++){		
			var genreValue = " ";
			genreValue += genreSet[i].name;
			$("#genre_set").append(genreValue);
		}
		var prodCompSet = movies[0].production_companies;
		for(var i=0;i<prodCompSet.length;i++){		
			var prodCompValue = " ";
			prodCompValue += prodCompSet[i].name;
			$("#production_house").append(prodCompValue);
		}
		var langSet = movies[0].translations;
		for(var i=0;i<langSet.length;i++){		
			var langValue = " ";
			langValue += langSet[i].name;
			var lang_url = "/movie/translations/"+id+"/"+langSet[i].iso_639_1;
			
			$("#language_set").append("<a onclick=\"showTranslations(this);\" href=\"javascript:void(0);\" id="+lang_url+">"+langValue+"</a>");
		//	$("#language_set").append("<a   href=\"#\" id="+langValue+">"+langValue+"</a>");
		}
		
		
	});
}

function  showTranslations(el) {  
	//console.log("id "+el.id);
	getTranslatedMovie(el.id);
}


function getTranslatedMovie(lang_url){
	
	$.get(lang_url,function(data){
		var movies = JSON.parse(data);
		movies = movies.movies;
		$("#movie_poster").attr('src',"http://image.tmdb.org/t/p/w300"+movies[0].poster_path );
		$("#movie_title").text(movies[0].title);
		$("#movie_desc").text(movies[0].overview);
		//production_house language_set
		$("#release_date").text(movies[0].release_date);
		$("#runtime").text(movies[0].runtime+" mins");
		$("#genre_set").text("");
		var genreSet = movies[0].genres;
		for(var i=0;i<genreSet.length;i++){		
			var genreValue = " ";
			genreValue += genreSet[i].name;
			$("#genre_set").append(genreValue);
		}
		var prodCompSet = movies[0].production_companies;
		for(var i=0;i<prodCompSet.length;i++){		
			var prodCompValue = " ";
			prodCompValue += prodCompSet[i].name;
			$("#production_house").append(prodCompValue);
		}
		
	});
}

function getSimilarMovies(){
	var id = window.location.href.split("#")[1];
	var url = "/movie/similar/" + id;
	
	$.get(url,function(data){
		var movies = JSON.parse(data);
		movies = movies.similar;
		for (var i = 0 ; i< movies.length ; i++) {
		
			if(i >= 6) {
				break;
			}
			var div = "<div class=\"element col-sm-4   gall branding\">"
			div += "<img id=\"i0\"	class=\"img-responsive picsGall \""+
			"src=http://image.tmdb.org/t/p/w500"+movies[i].poster_path + " alt=\""+movies[i].original_title +"\" />"			
			+"<div class=\"view project_descr \"> <h3 style='color: white;'>"+movies[i].original_title+"</h3>"
			+" <ul> "
			+" <li><i class=\"fa fa-eye\"></i> "
			+movies[i].vote_count
			+" </li><li><a class=\"heart\" href=\"#\"> "
			+" <i class=\"fa-heart-o\"></i> "
			+ movies[i].vote_average
			+" </a></li></ul></div></div> ";
			$("#similarcollection").append(div);
		}
	});
}

function getMovieDetails() {
	var id = window.location.href.split("#")[1];
	var url = "/movies/" + id;
	 
	var videoUrl = '/videos/' + id + '.mp4';

	$.get(url,function(data){
		//console.log("data", data);
		var movies = JSON.parse(data);
		movies = movies.movie_details;
		$("#movieDesc").html(movies.vidoeDesc);
		$("#movieVideo").html('<source src="' + videoUrl + '" type="video/mp4"></source>');
		$('#movieVideo').get(0).play();
		console.log("Dec....",movies.vidoeDesc);
	});
}


