// overwrite default redirect of form submit and instead call sendLoginDetails
$('#loginForm').submit(async e => {
    e.preventDefault();
    await fetchFrom('/login', 
        {"username": e.target.username.value, "password": e.target.password.value}, 
        function(data) {console.log(data);}, 
        function(err) {console.error(err);}
    );
});