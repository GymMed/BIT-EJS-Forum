tinymce.init({
    selector: "textarea#text-editor", // change this value according to your HTML
    plugins: "lists link image table code help wordcount",
    setup: function (editor) {
        editor.on("keyup", () => {
            document.getElementById("preview").innerHTML = editor.getContent();
        });
        editor.on("change", () => {
            document.getElementById("preview").innerHTML = editor.getContent();
        });
    },
});
