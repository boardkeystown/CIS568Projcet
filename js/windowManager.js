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
                    <button id="${countryAlpha2}-scatter-min-btn" class="float-window-indv-buttons"> &nbsp;_&nbsp; </button>
                    <button id="${countryAlpha2}-scatter-close-btn" class="float-window-indv-buttons"> &nbsp;X&nbsp; </button>
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
            <button id="${countryAlpha2}-scatter-icon-btn" class="content-bar-item-button"> ${countryAlpha2}-scatter </button>
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

function addToBarH(countryAlpha2) {

    let $graphWindowH = $(
        `
            <div class="float-window" id="${countryAlpha2}-scatter-drag-h">
            <!--NAV BAR-->
            <div class="float-window-nav">
                <!--Buttons-->
                <div class="float-window-nav-title">
                    ${countryAlpha2}-Scatter
                </div>
                <div class="float-window-nav-btns">
                    <button id="${countryAlpha2}-scatter-min-btn-h" class="float-window-indv-buttons"> &nbsp;_&nbsp; </button>
                    <button id="${countryAlpha2}-scatter-close-btn-h" class="float-window-indv-buttons"> &nbsp;X&nbsp; </button>
                </div>
            </div>
            <div class="float-window-content" id="${countryAlpha2}-scatter-h">
                <!--SVG GOES HERE-->
            </div>
        </div>
        `
    );

    let $windowIconH = $(
        `
        <div class="context-bar-item" id="${countryAlpha2}-scatter-icon-h">
            <button id="${countryAlpha2}-scatter-icon-btn-h" class="content-bar-item-button"> ${countryAlpha2}-scatter </button>
        </div>
        `
    );

    $("#ui-context-bar").append($windowIconH)
    $("#fooelm").append($graphWindowH);


    mkScatterH(`${countryAlpha2}`,`#${countryAlpha2}-scatter-h`)




    $( `#${countryAlpha2}-scatter-drag-h` ).draggable()

    $( `#${countryAlpha2}-scatter-min-btn-h` ).click(function () {
        let div = $(`#${countryAlpha2}-scatter-drag-h`);
        div.hide();
    });

    $( `#${countryAlpha2}-scatter-close-btn-h` ).click(function () {
        $(`#${countryAlpha2}-scatter-icon-h`).remove();
        $(`#${countryAlpha2}-scatter-drag-h`).remove();

    });

    $(`#${countryAlpha2}-scatter-icon-btn-h`).click(function () {
        if ($(`#${countryAlpha2}-scatter-drag-h`).is(":hidden")===true) {
            $(`#${countryAlpha2}-scatter-drag-h`).show();
            return;
        }
        if ($(`#${countryAlpha2}-scatter-drag-h`).is(":visible")===true) {
            $(`#${countryAlpha2}-scatter-drag-h`).hide();
            return;;
        }

    });

}








