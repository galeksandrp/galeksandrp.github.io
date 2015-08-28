//Test
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
    authorization: 'https://stackexchange.com/oauth/dialog'
});

oauth.soundcloud = new JSO({
    client_id: 'ab84c960be9df98238ddad588fbfd19d',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://soundcloud.com/connect'
});

oauth.dailymotion = new JSO({
    client_id: '0a47e42a3aef3a73242c',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://www.dailymotion.com/oauth/authorize'
});

oauth.amazon = new JSO({
    client_id: 'amzn1.application-oa2-client.926f5cc7d32a47a29a14e42020a19483',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://www.amazon.com/ap/oa',
    scopes: { request: ["profile"]}
});

oauth.imgur = new JSO({
    client_id: '25f8af90453ce51',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://api.imgur.com/oauth2/authorize'
});

oauth.reddit = new JSO({
    client_id: 'Zno0N0yNCNNS-A',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://www.reddit.com/api/v1/authorize',
    scopes: { request: ["identity"]}
});

oauth.google = new JSO({
    client_id: '893544438802-504jj931rhe33gkkdd1drtaiae0llpe9.apps.googleusercontent.com',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://accounts.google.com/o/oauth2/auth',
    scopes: { request: ["openid", "email"]}
});

oauth.twitch = new JSO({
    client_id: '7ic8qlzky9pn3f7v9wz388synbdy64i',
    redirect_uri: "https://galeksandrp.github.io",
    authorization: 'https://api.twitch.tv/kraken/oauth2/authorize'
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
