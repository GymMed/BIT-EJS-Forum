const usernameInputDom = document.getElementById("username");
const passwordInputDom = document.getElementById("password");
const loginButtonDom = document.getElementById("login");
const loginFormDom = document.getElementById("login-form");

loginButtonDom.addEventListener("click", async () => {
    loginFormDom.submit();

    //alternative without using form

    // const data = new FormData();

    // data.append("username", usernameInputDom.value);
    // data.append("password", passwordInputDom.value);

    // const promise = await fetch("http://localhost:3000/api/user/login", {
    //     method: "POST",
    //     body: data,
    // });

    // if (promise.ok) {
    //     const responseData = await promise.json();
    //     console.log(responseData);
    // } else {
    //     console.error("We encountered an error: " + promise.status);
    // }
});
