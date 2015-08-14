var oauth = {};

oauth.yandex = new JSO({
    client_id: '9b24befae37e42678a83d84af48a0e61',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://oauth.yandex.ru/authorize'
});

oauth.yahoo = new JSO({
    client_id: 'dj0yJmk9QmFib084MmlGRE9oJmQ9WVdrOVlVSmtZazQ0TkRJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1lZA--',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://api.login.yahoo.com/oauth2/request_auth'
});

oauth.mailru = new JSO({
    client_id: '736537',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://connect.mail.ru/oauth/authorize'
});

oauth.microsoft = new JSO({
    client_id: '000000004412EF8C',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://login.live.com/oauth20_authorize.srf',
    scopes: { request: ["wl.basic"]}
});

oauth.facebook = new JSO({
    client_id: '262075790583187',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://graph.facebook.com/oauth/authorize'
});

oauth.dropbox = new JSO({
    client_id: 'hebivxy4rc29kmk',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://www.dropbox.com/1/oauth2/authorize'
});

oauth.vk = new JSO({
    client_id: '4579406',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://oauth.vk.com/authorize'
});

oauth.bitbucket = new JSO({
    client_id: 'k28MBYhr4QpUXWxfdm',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://bitbucket.org/site/oauth2/authorize'
});

oauth.instagram = new JSO({
    client_id: '54c328e90f7b469f9aa8f5c09e3f6b42',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://instagram.com/oauth/authorize'
});

oauth.vimeo = new JSO({
    client_id: '5feac1737a66b1ea904d9711188030e1adbfd5dd',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://api.vimeo.com/oauth/authorize'
});

oauth.dailymotion = new JSO({
    client_id: '0a47e42a3aef3a73242c',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://www.dailymotion.com/oauth/authorize'
});

oauth.foursquare = new JSO({
    client_id: 'JKMKVHCEQN5BZWUMLSPXYMTYHBU2SJPRBEXKKPBJ2TE0A32E',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://foursquare.com/oauth2/authorize'
});

oauth.reddit = new JSO({
    client_id: 'v7jW1C3OV-Y8kA',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://www.reddit.com/api/v1/authorize'
});

oauth.se = new JSO({
    client_id: '5395',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://stackexchange.com/oauth/dialog',
    scopes: { request: ["identity"]}
});
oauth.yandex.callback();

for (service in oauth) {
  $('#auth').append('<li><a href="#' + service + '" id="' + service + '">' + service + '</li>');
} 

$('li a').click(function (e) {
    e.preventDefault();
    oauth[$(this).attr('id')].getToken(function (token) {
        console.log("I got the token: ", token);
    });
});