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
            <select class="dropdown" , id="${countryAlpha2}-GraphMenu">
                    <option value=2>Line Graph</option>
                    <option value =1>Rate of Change Scatter</optionvalue>
                    <option value=4>Height vs GDP in USD/CM</option>
                    <option value=3>Linear Regression</optionvalue>
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
            default:
                //this case should never happen or i will peepee fart
                break;
        }
    });
}
/*
function addToBarHeightvsGDP(countryAlpha2) {
    let $graphWindowH = $(
        `
            <div class="float-window" id="${countryAlpha2}-scatter-drag-h">
            <!--NAV BAR-->
            <div class="float-window-nav">
                <!--Buttons-->
                <div class="float-window-nav-title">
                    ${countryAlpha2} Height v.s. GDP
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
            <button id="${countryAlpha2}-scatter-icon-btn-h" class="content-bar-item-button"> ${countryAlpha2} Height v.s. GDP </button>
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
*/







