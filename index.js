var yandex = new JSO({
    client_id: '9b24befae37e42678a83d84af48a0e61',
    authorization: 'https://oauth.yandex.ru/authorize'
});
yandex.callback();

$('#yandex').click(function (e) {
    e.preventDefault();
    yandex.getToken(function (token) {
        console.log("I got the token: ", token);
    });
});
