document.getElementById('sign-in-btn')
.addEventListener('click', function(e){
    e.preventDefault();

    // 1. get username
    const userNameId = document.getElementById("username");
    const userName = userNameId.value;

    // 2. get password
    const passwordId = document.getElementById("password");
    const password = passwordId.value;

    // 3. check username and password
    if(userName === "admin" && password === "admin123"){
        alert("Login Successful");

        // redirect to home page
        window.location.assign("./home.html");
    }
    else{
        alert("Login Failed");
    }
});