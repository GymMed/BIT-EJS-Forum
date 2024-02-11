initLiking();

function initLiking() {
    const thumbsUpList = document.querySelectorAll(".like-fetch");
    const thumbsDownList = document.querySelectorAll(".dislike-fetch");

    thumbsUpList.forEach((element) => {
        element.onmouseenter = (event) => {
            const likeDom = event.target.querySelector(".thumbs-up");
            likeDom.classList.toggle("bi-hand-thumbs-up");
            likeDom.classList.toggle("bi-hand-thumbs-up-fill");
        };
        element.onmouseleave = (event) => {
            const likeDom = event.target.querySelector(".thumbs-up");
            likeDom.classList.toggle("bi-hand-thumbs-up-fill");
            likeDom.classList.toggle("bi-hand-thumbs-up");
        };
    });

    thumbsDownList.forEach((element) => {
        element.parentNode.onmouseenter = (event) => {
            const dislikeDom = event.target.querySelector(".thumbs-down");
            dislikeDom.classList.toggle("bi-hand-thumbs-down");
            dislikeDom.classList.toggle("bi-hand-thumbs-down-fill");
        };
        element.parentNode.onmouseleave = (event) => {
            const dislikeDom = event.target.querySelector(".thumbs-down");
            dislikeDom.classList.toggle("bi-hand-thumbs-down-fill");
            dislikeDom.classList.toggle("bi-hand-thumbs-down");
        };
    });
}
