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
            let cookieDays = null;
            if (e.target.remember.checked) {
                cookieDays = 30;
            }
            setCookie("username", data.username, cookieDays);
            setCookie("token", data.token, cookieDays);
            window.location.replace("/");
        }, 
        function(err) {console.error(err);}
    );
});