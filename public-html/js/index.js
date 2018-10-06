$("#cookies").each(function( index ) {
    $(this)[0].innerHTML = `${getCookie("username")}<br />${getCookie("token")}`;
});

$(".logout").click(function(e) {
    e.preventDefault();
    fetchFrom('/logout', 
        {"username": getCookie("username"), "token": getCookie("token")}, 
        function(data) {
            eraseCookie("username");
            eraseCookie("token");
            window.location.reload(true);
        }, 
        function(err) {
            console.error(err);
        }
    );
})