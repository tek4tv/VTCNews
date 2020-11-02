var div = document.getElementsByClassName('backtoHome')[0];
div.addEventListener('click', function (event) {
    var android = location.href.match(/#android$/) || navigator.userAgent.match(/Android/i) != null;
    if (android) {
        DetailActivity.onBackPress();
    }
    else {
        webkit.messageHandlers.onBackPress.postMessage('');
    }
});