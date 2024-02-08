// const usernameInputDom = document.querySelector("#username");
// const birthDateInputDom = document.querySelector("#birthDate");
// const passwordInputDom = document.querySelector("#password");
// const emailInputDom = document.querySelector("#email");
// const profilePictureInputDom = document.querySelector("#profilePicture");
const registerButtonDom = document.querySelector("#register");
const registerFormDom = document.querySelector("#register-form");

registerButtonDom.addEventListener("click", async () => {
    registerFormDom.submit();

    // const data = new FormData();

    // data.append("username", usernameInputDom.value);
    // data.append("birthDate", birthDateInputDom.value);
    // data.append("password", passwordInputDom.value);
    // data.append("email", emailInputDom.value);
    // data.append("profilePicture", profilePictureInputDom.files[0]);

    // const promise = await fetch("http://localhost:3000/api/user/register", {
    //     method: "POST",
    //     body: data,
    // });

    // headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    // },
    // body: JSON.stringify(data),

    // if (promise.ok) {
    //     const responseData = await promise.json();
    //     console.log(responseData);
    // } else {
    //     console.error("We encountered an error: " + promise.status);
    // }
});
