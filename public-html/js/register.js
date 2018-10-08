// overwrite default redirect of form submit and instead call sendLoginDetails
$('#registerForm').submit(async e => {
    e.preventDefault();
    await fetchFrom('/register', 
        {"username": e.target.username.value, "password": e.target.password.value}, 
        async function(data) {
            console.log(data);
            await fetchFrom('/login', 
                {"username": e.target.username.value, "password": e.target.password.value}, 
                function(data) {
                    console.log(data);
                    setCookie("username", data.username, null);
                    setCookie("token", data.token, null);
                    window.location.replace("/");
                }, 
                function(err) {console.error(err);}
            );
        }, 
        function(err) {console.error(err);}
    );
});