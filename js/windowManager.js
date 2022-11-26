//We want an item to appear on bar with name.
//if active change bar icon to bright color.
//sub window CLOSE[x] closes it "REMOVE FROM VIEW"
//sub window Min[-] closes it display none.


$("#add-button").click(function () {
    addToBar("AU")
});


//Add window to dom
function addToBar(countryAlpha2) {

    let $graphWindow = $(
        `
            <div class="float-window" id="${countryAlpha2}-scatter-drag">
            <!--NAV BAR-->
            <div class="float-window-nav">
                <!--Buttons-->
                <div class="float-window-nav-title">
                    ${countryAlpha2}-Scatter
                </div>
                <div class="float-window-nav-btns">
                    <button id="${countryAlpha2}-scatter-min-btn"> &nbsp;_&nbsp; </button>
                    <button id="${countryAlpha2}-scatter-close-btn"> &nbsp;X&nbsp; </button>
                </div>
            </div>
            <div class="float-window-content" id="${countryAlpha2}-scatter">
                <!--SVG GOES HERE-->
            </div>
        </div>
        `
    );

    let $windowIcon = $(
        `
        <div class="context-bar-item" id="${countryAlpha2}-scatter-icon">
            <button id="${countryAlpha2}-scatter-icon-btn"> ${countryAlpha2}-scatter </button>
        </div>
        `
    );

    $("#ui-context-bar").append($windowIcon)
    $("#fooelm").append($graphWindow);


    mkScatter(`${countryAlpha2}`,`#${countryAlpha2}-scatter`)




    $( `#${countryAlpha2}-scatter-drag` ).draggable()

    $( `#${countryAlpha2}-scatter-min-btn` ).click(function () {
        let div = $(`#${countryAlpha2}-scatter-drag`);
        div.hide();
    });

    $( `#${countryAlpha2}-scatter-close-btn` ).click(function () {
        $(`#${countryAlpha2}-scatter-icon`).remove();
        $(`#${countryAlpha2}-scatter-drag`).remove();

    });

    $(`#${countryAlpha2}-scatter-icon-btn`).click(function () {
        if ($(`#${countryAlpha2}-scatter-drag`).is(":hidden")===true) {
            $(`#${countryAlpha2}-scatter-drag`).show();
            return;
        }
        if ($(`#${countryAlpha2}-scatter-drag`).is(":visible")===true) {
            $(`#${countryAlpha2}-scatter-drag`).hide();
            return;;
        }

    });

}









