var homeajax = (function (){
	return{
		getAllMovies:function(){				
    	    var uri='';
    	    $.ajax({
	    	    	type:'GET',	
	    	    	contentType:'application/json',	
	    	    	url:uri,
	    	    	success:populateUI
    	    	});
    	},getAllGenre:function(){				
    	    var uri='http://127.0.0.1:3000/allgenres';
    	    $.ajax({
	    	    	type:'GET',	
	    	    	contentType:'application/json',	
	    	    	url:uri,
	    	    	success:populateGenre
    	    	});
    	}	
	};
})();