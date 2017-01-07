var filter_array, text;

Template.explore.events({
    'keyup .search-textbox': _.throttle(function(e){
	searchQuery = e.currentTarget.value.trim();
        ModelSearch.search(searchQuery);
	UserSearch.search(searchQuery);
	if(searchQuery.length < 1){
		$('.result-container').css('display', 'none');
	} else{
		$('.result-container').css('display', 'block');
	}
	}, 200),

    "change .filter-select": function(e) {
        var newValue = $(e.target).val();
        text = document.getElementById('selected-filters');
        var add_text = document.createTextNode(newValue+ " + ");
        text.appendChild(add_text);
    },

    'click #undo-latest': function(e) {
        var filters = document.getElementById('selected-filters').innerHTML;
        var filter_array = filters.split(" + ");
        var text="";
        filter_array.pop();
        var text = filter_array.join(" + ").toString();
        document.getElementById('selected-filters').innerHTML = text;
    },

    'click #save-btn': function(e, t){     
        filter_array = text.innerHTML.split(" + ");    
        alert(filter_array);
        text.innerHTML = "";
    }   

});


var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['name', 'about'];
var user_fields = ['profile.name', 'profile.bio'];

ModelSearch = new SearchSource('modelFiles', fields, options);
UserSearch = new SearchSource('users', user_fields, options);

Template.searchResult.helpers({
  getModels: function() {
    return ModelSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "$&")
      },
      sort: {timeUploaded: -1}
    });
  },

  isLoading: function() {
    return ModelSearch.getStatus().loading;
  }
});


Template.searchUserResult.helpers({
    getUsers: function() {
    return UserSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "$&")
      },
      sort: {createdAt: -1}
    });
  },
  
  isLoading: function() {
    return UserSearch.getStatus().loading;
  }
})


Template.searchResult.rendered = function() {
  ModelSearch.search('');
};

Template.searchUserResult.rendered = function() {
  UserSearch.search('');
};

Template.exploreResult.helpers({
    /**
     * models helper finds all the models from the database and then sorts
     * them in reverse chronological order. 
     */
    models: function() 
    {    
    var currentUser = Meteor.user();
    var audience = ['public', 'followers'];
    model = ModelFiles.find({ converted:true, audience: {$in: audience},  owner: {$in: currentUser.profile.following}}, {sort: {timeUploaded: -1}});
    if (model.count()) {
        return model;
    } else {
        return false;
    } 
    }
}); 
