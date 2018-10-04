// overwrite default redirect of form submit and instead call sendLoginDetails
$('#loginForm').submit(async e => {
    e.preventDefault();
    await fetchFrom('/login', 
        {"username": e.target.username.value, "password": e.target.password.value}, 
        function(data) {
            if (data.error) {
                console.error("Username or Password Incorrect");
                return;
            }
            console.log(data);
            setCookie("username", data.username, null);
            setCookie("token", data.token, null);
            window.location.replace("/");
        }, 
        function(err) {console.error(err);}
    );
});