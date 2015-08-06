Template.explore.events({
    "keyup #search-box": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        ModelSearch.search(text);
    }, 200),

    "keyup #search-user-box": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        UserSearch.search(text);
    }, 200),
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
