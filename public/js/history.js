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
    let dataRow = $("<tr></tr>");
    dataRow.addClass("data-row");
    dataRow.append(createTD(date),
                   createTD(distance + " km" + "<img src=\"./images/" + transport + ".png\">"),
                   createTD(emission + " kg"));
    return dataRow;
}
function createSlideRow(start, dest, time) {
    let slideRow = $("<tr></tr>");
    slideRow.addClass("slide");

    let td = createTD("").attr("colspan", 3);
    slideRow.append(td);

    let detailsDiv = $("<div></div>");
    detailsDiv.addClass("accordion-body collapse details");
    detailsDiv.append("Start: " + start +
                      "<br/>Destination: " + dest +
                      "<br/>Time: " + time + " min");
    td.append(detailsDiv);

    return slideRow;
}
function createFooterRow(month, totalEmission) {
    let footerRow = $("<tr></tr>");
    footerRow.addClass("month-footer");

    let th1 = $("<th></th>");
    th1.html("Total (" + month + ")");
    let th2 = $("<th></th>");
    let th3 = $("<th></th>");
    th3.html(totalEmission + " kg");
    // footerRow.append($("<th>Total (" + month + ")</th>"),
    //                  $("<th></th>"),
    //                  $("<th>" + totalEmission + " kg</th>"));
    footerRow.append(th1, th2, th3);

    return footerRow;
}

$(document).ready(function () {


//TAKES USER ID FROM FIREBASE AUTHENTICATION
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

                //append month-header
                tbody.append(createHeaderRow(monthAndYear));

                let totalEmission = 0;

                yearMonthSnap.forEach(function(childSnap) {
                    let {date, destination, distance, emission, start, time, transport} = childSnap.val();

                    //append data-row
                    tbody.append(createDataRow(date, distance, transport, emission));
                    //append slide row (collapsible details panel)
                    tbody.append(createSlideRow(start, destination, time));

                    totalEmission += emission;
                });

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