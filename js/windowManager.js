//We want an item to appear on bar with name.
//if active change bar icon to bright color.
//sub window CLOSE[x] closes it "REMOVE FROM VIEW"
//sub window Min[-] closes it display none.


$("#add-button").click(function () {
    console.log("CLICK!")
    addToBar("AU")
});


//Add window to dom
function addToBar(countryAlpha2) {

    let $graphWindow = $(
        `
            <div class="float-window " id="${countryAlpha2}-scatter-drag">
            <!--NAV BAR-->
            <div class="float-window-nav">
                <!--Buttons-->

                <div class="float-window-nav-title">
                    ${countryAlpha2}-Scatter
                </div>
                <div class="float-window-nav-btns">
                    <button> [_] </button>
                    <button> [X] </button>
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

        <div class="context-bar-item">
            <button> ${countryAlpha2}-scatter </button>
        </div>
        
        `
    );


    $("#ui-context-bar").append($windowIcon)

    $("#fooelm").append($graphWindow);


    mkScatter(`${countryAlpha2}`,`#${countryAlpha2}-scatter`)

    $( `#${countryAlpha2}-scatter-drag` ).draggable()

    console.log(`${countryAlpha2}`)
    console.log(`${countryAlpha2}-scatter`)


}









