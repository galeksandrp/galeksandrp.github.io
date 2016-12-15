var queries = {};
location.search.substring(1).split('&').forEach(function(query) {
  var parts = query.split('=');
  queries[parts[0]] = parts[1];
});
$('#state').val(queries.state);
if (queries.access_token) localStorage.ACCESS_TOKEN = queries.access_token;
$('#url').submit(function() {
  if (localStorage.ACCESS_TOKEN) {
    $.post('https://api.github.com/repos/EFForg/https-everywhere/forks?access_token=' + localStorage.ACCESS_TOKEN, function(bodyFork) {
      $.ajax({
        url: 'https://shrouded-coast-75617.herokuapp.com/requests',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify({
          "state": $('#state').val(),
          "login": bodyFork.owner.login,
          "request": {
            "message": $('#state').val() + " Override the commit message: this is an api request",
            "branch": "template-api",
            "config": {
              "env": {
                "global": [
                  "DOMAIN=" + $('#state').val(),
                  "GITHUB_NAME=" + bodyFork.owner.login,
                  "ISSUE=" + 3, {
                    "secure": localStorage.ACCESS_TOKEN
                  }
                ]
              }
            }
          }
        }),
        headers: {
          "Travis-API-Version": 3
        }
      }).done(function(data) {
        $('body').append('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
      });
    }).fail(function(){
      delete localStorage.ACCESS_TOKEN;
      $('#url').submit();
    });
    return false;
  }
});
