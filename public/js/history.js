function createTD(string) {
    return $("<td>" + string + "</td>");
}
function createHeaderRow(monthAndYear) {
    let headerRow = $("<tr></tr>");
    headerRow.addClass("month-header");

    let th = $("<th></th>");
    th.attr("colspan", 3);
    th.html(monthAndYear);

    headerRow.append(th);

    return headerRow;
}
function createDataRow(date, distance, transport, emission) {
    transport = (transport == "transit") ? transport : "car";
    let dataRow = $("<tr></tr>");
    dataRow.addClass("data-row");
    dataRow.append(createTD(date),
                   createTD(distance + "<img src=\"./images/" + transport + ".png\" class=\"transportationImg\">"),
                   createTD(emission + " kg"));
    return dataRow;
}
function createSlideRow(start, dest, time) {
    let slideRow = $("<tr></tr>");
    slideRow.addClass("slide");

    let td = createTD("").attr("colspan", 3);
    slideRow.append(td);

    let detailsDiv = $("<div></div>");
    detailsDiv.addClass("accordion-body collapse details pt-2 pb-2");

    detailsDiv.append(createAddressDisplayDiv("Start: ", start));

    // let arrowImg = $("<img></img>");
    // arrowImg.attr("src", "./images/Arrow.png");
    // detailsDiv.append(arrowImg);

    detailsDiv.append(createAddressDisplayDiv("Destination: ", dest));

    //p element for displaying time
    let timeP = $("<p></p>");
    timeP.addClass("mb-0 pr-3 text-right");
    let timeImg = $("<img></img>");
    timeImg.attr("src", "./images/clock.png");
    timeImg.addClass("mr-2")
    timeP.append(timeImg);
    timeP.append(time);

    detailsDiv.append(timeP);

    td.append(detailsDiv);

    return slideRow;
}
function createColDiv(col, text) {
    let div = $("<div></div>");
    div.addClass("col-" + col);
    div.text(text);
    return div;
}
function createLabelDiv(text) {
    let label = createColDiv(2, text);
    label.addClass("font-weight-bold text-left");
    return label;
}
function createAddressDiv(text) {
    let address = createColDiv(12, text);
    address.addClass("col-sm-8 text-left pl-5");
    return address;
}
function createAddressDisplayDiv(labelTxt, address) {
    let div = $("<div></div>");
    div.addClass("row mb-3");

    div.append(createColDiv(1, "").addClass("col-sm-2"));
    div.append(createLabelDiv(labelTxt));
    div.append(createAddressDiv(address));

    return div;
}
function createFooterRow(month, totalEmission) {
    let footerRow = $("<tr></tr>");
    footerRow.addClass("month-footer");

    totalEmission = totalEmission.toFixed(2);

    let th1 = $("<th></th>");
    th1.html("Total (" + month + ")");
    let th2 = $("<th></th>");
    let th3 = $("<th></th>");
    th3.html(totalEmission + " kg");

    footerRow.append(th1, th2, th3);

    return footerRow;
}

$(document).ready(function () {


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user.uid);
        let userData = firebase.database().ref().child("users/" + user.uid);
        

        userData.child("history").on("value", snap => {
            
            $("table").children("tbody").remove();

            snap.forEach(function(yearMonthSnap) {
                let monthAndYear = yearMonthSnap.key;
                let month = monthAndYear.split(" ")[0];
                let year = monthAndYear.split(" ")[1];
                let tbody = $("<tbody></tbody>");
                tbody.attr("id", month + year);

                let totalEmission = 0;

                yearMonthSnap.forEach(function(childSnap) {
                    let {date, destination, distance, emission, start, time, transport} = childSnap.val();

                    //prepend slide row (collapsible details panel)
                    tbody.prepend(createSlideRow(start, destination, time));

                    //prepend data-row (data row goes above slide row)
                    tbody.prepend(createDataRow(date, distance, transport, emission));

                    totalEmission += emission;
                });

                //prepend month-header
                tbody.prepend(createHeaderRow(monthAndYear));

                //append month-footer (displays total emissions for the month)
                tbody.append(createFooterRow(month, totalEmission));
                
                $("table").append(tbody); 
            });
            //click listeners
            $(".data-row").click(function() {
                $(this).next().children("td:first").children("div:first").collapse("toggle");
            });
            $('.collapse').on('hide.bs.collapse', function() {
                $(this).parent().parent().prev().css("background-color", "white");
            });
            $('.collapse').on('hidden.bs.collapse', function() {
                $(this).parent().css("border-top", "none");
            });
            $('.collapse').on('show.bs.collapse', function() {
                // $('.collapse.in').collapse('hide');
                $(this).parent().css("border-top", "1px solid #dee2e6");
                $(this).parent().parent().prev().css("background-color", "#ececec");
            });
            $('.collapse').on('showen.bs.collapse', function() {
                $(this).css("height", "100%");
            });

            //Remove loading gif
            $(".spinner-border").parent().remove();
        });
        
    } else {
        $(".spinner-border").parent().remove();

        let notSignedInDiv = $("<div></div>");
        notSignedInDiv.addClass("container-fluid text-center mt-5");
        notSignedInDiv.text("You need to be signed in in order to view your history.")
        $("table").after(notSignedInDiv);
    }
});


});