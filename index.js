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

oauth.foursquare = new JSO({
    client_id: 'JKMKVHCEQN5BZWUMLSPXYMTYHBU2SJPRBEXKKPBJ2TE0A32E',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://foursquare.com/oauth2/authorize'
});

oauth.se = new JSO({
    client_id: '5395',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://stackexchange.com/oauth/dialog',
    scopes: { request: ["identity"]}
});

oauth.soundcloud = new JSO({
    client_id: 'ab84c960be9df98238ddad588fbfd19d',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://soundcloud.com/connect'
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
