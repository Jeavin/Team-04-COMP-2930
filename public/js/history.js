function createTD(string) {
    return $("<td>" + string + "</td>");
}

$(document).ready(function () {
    
    var userData;
    
    //TAKES USER ID FROM FIREBASE AUTHENTICATION
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log(user.uid);
            userData = firebase.database().ref().child("users/" + user.uid);
            

            userData.child("history").on("value", snap => {
                snap.forEach(function(yearMonthSnap) {
                    let monthAndYear = yearMonthSnap.key;
                    let month = monthAndYear.split(" ")[0];
                    let tbody = $("<tbody></tbody>");

                    let headerRow = $("<tr></tr>");
                    headerRow.addClass("month-header");
                    tbody.append(headerRow);

                    // let headerCell = $("<th></th>");
                    // headerCell.html(monthAndYear);
                    // headerCell.attr("colspan", 3);
                    // headerRow.append(headerCell);
                    headerRow.append($("<th colspan=\"3\">" + monthAndYear + "</th>"));

                    yearMonthSnap.forEach(function(childSnap) {
                        let {date, destination, distance, emission, start, time, transport} = childSnap.val();

                        let dataRow = $("<tr></tr>");
                        dataRow.addClass("data-row");
                        dataRow.append(createTD(date), createTD(distance + " km" + "<img src=\"../images/" + transport + ".png\">"), createTD(emission + " kg"));
                        tbody.append(dataRow);
                        dataRow.click(function() {
                            $(this).next().children("td:first").children("div:first").collapse("toggle");
                        });

                        let slideRow = $("<tr></tr>");
                        slideRow.addClass("slide");
                        tbody.append(slideRow);

                        let td = createTD("").attr("colspan", 3);
                        slideRow.append(td);

                        let detailsDiv = $("<div class=\"accordion-body collapse details\"></div>");
                        detailsDiv.append("Start: " + start + "<br/>Destination: " + destination + "<br/>Time: " + time + " min");
                        td.append(detailsDiv);
                    });

                    let footerRow = $("<tr></tr>");
                    footerRow.addClass("month-footer");

                    let totalEmission = 0;
                    tbody.children("tr.data-row").each(function() {
                        totalEmission += parseFloat($(this).children().eq(2).text().split(" ")[0]);
                    });

                    footerRow.append($("<th>Total (" + month + ")</th>"), $("<th></th>"), $("<th>" + totalEmission + " kg</th>"))
                    tbody.append(footerRow);
                    
                    $("table").append(tbody);
                    
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
                });

                //Remove loading gif
                $(".spinner-border").parent().remove();
            });
            
        } else {
            console.log("no user");
        }
    });
});