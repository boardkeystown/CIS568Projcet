//When document is ready!
$(function () {
    //Hamburger toggle
    let drop_btn = $("#title-drop-btn");
    drop_btn.on("click", d => {
        // $("#title-drop-btn").children().toggleClass("change-drop");
        $("#title-drop-btn").toggleClass("change-drop");

        $("#extra-menu-context").toggle()
    });
    //extra context
    fetch('./assets/context.md')
        .then(response => response.text())
        .then((data) => {
            const converter = new showdown.Converter();
            // console.log(converter.getOptions())
            converter.setOption('tables', 'true');
            const html = converter.makeHtml(data);
            const content = document.getElementById("extra-menu-context")
            content.innerHTML = html;
        })

});
