
//Globals to keep track of window stacking
let windowsStack = [];
let stackUI;

//Add the rate of change scatter plot to the bar
function addToBarRateOfChange(countryAlpha2, countryName) {
    let $graphWindow = $(
        `
            <div class="float-window" id="${countryAlpha2}-scatter-drag">
            <!--NAV BAR-->
            <div class="float-window-nav">
                <!--Buttons-->
                <div class="float-window-nav-title">
                    ${countryName}
                </div>
                <div class="float-window-nav-btns">
                    <button id="${countryAlpha2}-scatter-min-btn" class="float-window-indv-buttons"> &nbsp;_&nbsp; </button>
                    <button id="${countryAlpha2}-scatter-close-btn" class="float-window-indv-buttons"> &nbsp;X&nbsp; </button>
                </div>
            </div>
            <div></div>
            <select class="dropdown" id="${countryAlpha2}-GraphMenu">
                    <option value=2>Height vs GDP in USD/CM (Line)</option>
                    <option value=4>Height vs GDP in USD/CM (Scatter)</option>
                    <option value=1>Height over GDP</optionvalue>
                    <option value=3>AVG Height over GDP with trend</optionvalue>
                    <option value=5>Height vs GDP Rate of Change</optionvalue>
            </select>
            <div class="float-window-content" id="${countryAlpha2}-scatter">
                <!--SVG GOES HERE-->
            </div>
        </div>
        `
    );

    let $windowIcon = $(
        `
        <div class="context-bar-item" id="${countryAlpha2}-scatter-icon">
            <button id="${countryAlpha2}-scatter-icon-btn" class="content-bar-item-button"> ${countryName} </button>
        </div>
        `
    );


    $("#ui-context-bar").append($windowIcon)

    $("#fooelm").append($graphWindow);

    mkLineGraph(`${countryAlpha2}`,`#${countryAlpha2}-scatter`)

    //Add to stack for set of IDS that are draggable

    windowsStack.push( `#${countryAlpha2}-scatter-drag`)
    stackUI = $(windowsStack.toLocaleString()).draggable({ stack: `.float-window`});

    // $( `#${countryAlpha2}-scatter-drag` ).draggable({ stack: `#${countryAlpha2}-scatter-drag` })
    // $( `#${countryAlpha2}-scatter-drag` ).draggable();


    $( `#${countryAlpha2}-scatter-min-btn` ).click(function () {
        let div = $(`#${countryAlpha2}-scatter-drag`);
        div.hide();
    });

    $( `#${countryAlpha2}-scatter-close-btn` ).click(function () {
        $(`#${countryAlpha2}-scatter-icon`).remove();
        $(`#${countryAlpha2}-scatter-drag`).remove();
        // Remove from set
        windowsStack = windowsStack.filter(function (value) {
            return value != `#${countryAlpha2}-scatter-drag`;
        });
        if (windowsStack.length > 0) {
            stackUI = $(windowsStack.toLocaleString()).draggable({ stack: `.float-window` });
        }
    });

    $(`#${countryAlpha2}-scatter-icon-btn`).click(function () {
        if ($(`#${countryAlpha2}-scatter-drag`).is(":hidden")===true) {
            $(`#${countryAlpha2}-scatter-drag`).show();
            return;
        }
        if ($(`#${countryAlpha2}-scatter-drag`).is(":visible")===true) {
            $(`#${countryAlpha2}-scatter-drag`).hide();
        }
    });

    //For dropdown menu
    $ (`#${countryAlpha2}-GraphMenu`).change(function(elm){
        //gets current svg for removal
        let currentSVG = $(`#${countryAlpha2}-scatter`).children("svg");

        //switch statement to decide if the window will change
        switch(elm.target.value){
            case "1":
                currentSVG.remove();
                mkScattery(`${countryAlpha2}`,`#${countryAlpha2}-scatter`)
                break;
            case "2":
                currentSVG.remove();
                mkLineGraph(`${countryAlpha2}`,`#${countryAlpha2}-scatter`)
                break;
            case "3":
                currentSVG.remove();
                mkRegression(`${countryAlpha2}`,`#${countryAlpha2}-scatter`)
                break;
            case "4":
                currentSVG.remove();
                mkScatterH(`${countryAlpha2}`,`#${countryAlpha2}-scatter`)
                break;
            case "5":
                currentSVG.remove();
                mkPlots(`${countryAlpha2}`,`#${countryAlpha2}-scatter`)
                break;
            default:
                //this case should never happen
                break;
        }
    });
}





