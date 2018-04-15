SearchSource.defineSource("modelFiles", searchText => {
  const options = {
    sort: {
      timeUploaded: -1
    },
    limit: 5
  };

  if (searchText) {
    const regExp = buildRegExp(searchText);
    const selector = {
      name: regExp
    };
    return ModelFiles.find(selector, options).fetch();
  }
  return ModelFiles.find({}, options).fetch();
});

SearchSource.defineSource("users", searchText => {
  const options = {
    sort: {
      createdAt: -1
    },
    limit: 5
  };

  if (searchText) {
    const regExp = buildRegExp(searchText);
    const selector = {
      "profile.name": regExp
    };
    return Meteor.users.find(selector, options).fetch();
  }
  return Meteor.users.find({}, options).fetch();
});

SearchSource.defineSource("objFiles", (searchText, options) => {
  if (searchText) {
    const regExp = buildRegExp(searchText);
    const selector = {
      "original.name": regExp,
      gFile: options.gFile
    };
    return OBJFiles.find(selector).fetch();
  }
  return OBJFiles.find({
    gFile: options.gFile
  }).fetch();
});

function buildRegExp(searchText) {
  const words = searchText.trim().split(/[ \-:]+/);
  const exps = _.map(words, word => `(?=.*${word})`);
  const fullExp = `${exps.join("")}.+`;
  return new RegExp(fullExp, "i");
}
