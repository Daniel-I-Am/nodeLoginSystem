// overwrite default redirect of form submit and instead call sendLoginDetails
$('form').submit(function(e) {
    e.preventDefault();
    sendLoginDetails(e.target);
});

// set a cookie based on cookie name, value and expiry time
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays /*days*/ *24 /*hours*/ *60 /*minutes*/ *60 /*seconds*/ *1000 /*miliseconds*/ ));
    var expires = "expires="+ d.toUTCString();
    // set a new cookie, specified by function
    document.cookie = `${cname}=${cvalue}; ${expires};path=/`;
}

// function to send login details (as json) to the remote server
function sendLoginDetails(obj) {
    // collect username and password
    let name = obj.children.username.value,
        pass = obj.children.password.value;
    // call postData with the URL `/login` (our API) and data based on input fields
    postData(`/login`, {"username": name, "password": pass})
    // with any received data, call loggedIn
    .then(data => loggedIn(name, data)) // JSON-string from `response.json()` call
    // if there's errors, log them. TODO: error handling
    // these errors can include something like `remote server unreachable`
    .catch(error => console.error(error));
  
    //
    function postData(url = ``, data = {}) {
        return fetch(url, {
            method: "POST", // send as post data (so users can't accidently copy-paste their log in details and login details cannot be intercepted as easily (security))
            /* 
             * One small note on that, yeah no... when we're not using a secure protocol (https) it doesn't matter.
             * It still helps make sure the general user doesn't copy paste their login details, but it doesn't help much in security.
             * It's like sparing a cent on a million dollar loss. It's just not the thing you should be focussing on.
             * 
             * TODO: Let'sEncrypt this shit
             * 
             * When we're using HTTPS protocol, it should be a hell of a lot better. That fixes that million dollar loss.
             * It still better to save the cent, extra security is always better. Just good practice to keep these things in mind though.
             */
            mode: "cors",
            cache: "no-cache", // don't cache the returned data, every login we want to check whether the data is valid
            credentials: "same-origin",  // same origin blocks attackers from executing arbitrary code if a packet is intercepted
            headers: {
                "Content-Type": "application/json; charset=utf-8", // define content and encoding type
            },
            redirect: "follow", // follow any redirects remote host makes (should be none, but this is default behaviour)
            referrer: "no-referrer", 
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        .then(response => response.json()); // parses response to JSON
    }
}

// once we logged in, we get that JSON back from the server with details
function loggedIn(username, data) {
    // we log the response, debug
    console.log("got a response", data)
    // if there's an error we should notify the user. NYI
    if (data.error) {
        console.log("Username or password incorrect") // TODO: implement login failed
    // if there was no error, check if there is a token present in the return
    } else if (data.token) {
        // set log in cookies
        setCookie('username', username, 1);
        setCookie('token', data.token, 1);
        // log the cookies
        console.log(document.cookie);
        // redirect back to home page (for now)
        window.location.replace('/');
        // we should somehow notify the user of a successful login
        // TODO: ^^
    }
}