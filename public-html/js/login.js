$('form').submit(function(e) {
    e.preventDefault();
    sendLoginDetails(e.target);
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = `${cname}=${cvalue}; ${expires};path=/`;
}

function sendLoginDetails(obj) {
    let name = obj.children.username.value,
        pass = obj.children.password.value;
    postData(`/login`, {"username": name, "password": pass})
    .then(data => loggedIn(name, data)) // JSON-string from `response.json()` call
    .catch(error => console.error(error));
  
  function postData(url = ``, data = {}) {
    // Default options are marked with *
      return fetch(url, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, same-origin, *omit
          headers: {
              "Content-Type": "application/json; charset=utf-8",
              // "Content-Type": "application/x-www-form-urlencoded",
          },
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer", // no-referrer, *client
          body: JSON.stringify(data), // body data type must match "Content-Type" header
      })
      .then(response => response.json()); // parses response to JSON
  }
}

function loggedIn(username, data) {
    console.log("got a response", data)
    if (data.error) {
        console.log("Username or password incorrect") // TODO: implement login failed
    } else if (data.token) {
        // set log in cookies
        setCookie('username', username, 1);
        setCookie('token', data.token, 1);
        console.log(document.cookie);
    }
}