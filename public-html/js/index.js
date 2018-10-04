$("#cookies").each(function( index ) {
    $(this)[0].innerHTML = `${getCookie("username")}<br />${getCookie("token")}`;
});