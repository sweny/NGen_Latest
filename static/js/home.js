$( document ).ready(function() {
    //call the mongodb to get the info
	//homeajax.getAllMovies();
	homeajax.getAllGenre();
	
});

function populateUI(data,status,jXHR){
	//data will have the result json
	//iterate over the result json
	for(int i=0;i<data.length;i++){
		//set image src path
		var img_id= "#i"+i;
		$(img_id).attr("src",data[i].poster_path);
	}
}

function populateGenre(data, s, xph){	
	  $('#genreValue').find("option:gt(0)").remove();	  
	for (var i=0; i< data.length; i++ ) {			
		var K=$('<option/>').append(data[i]).val(data[i]);		
		$("#genreValue").append(K);
  }
}