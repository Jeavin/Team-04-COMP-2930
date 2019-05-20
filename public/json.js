const fs = require('fs');

fs.readFile('MY2004 Fuel Consumption Ratings 5-cycle.json', 'utf8', function readFileCallback(err, data) {
  if (err) {
    console.log(err);
  } else {
    let obj = JSON.parse(data); //now it an object
    let modelKey;

    let makeKey = obj[0].MAKE;
    let yearKey = obj[0].YEAR;
    let make = {};
    let containerObj = {};
    make[makeKey] = {};
    containerObj[yearKey] = make;
    
    for (let i = 0; i < obj.length; i++) {
      
      if (yearKey != obj[i].YEAR) {
        yearKey = obj[i].YEAR;
        makeKey = obj[i].MAKE;
        make = {};
        make[makeKey] = {};
        containerObj[yearKey] = make;
      }
      if (obj[i].MAKE != makeKey) {
        makeKey = obj[i].MAKE;
        make[makeKey] = {};
      }
      modelKey = obj[i].MODEL.toString();

      modelKey = modelKey.replace(/\./g, '_');
      modelKey = modelKey.replace('#', '_');
      modelKey = modelKey.replace(/\//g, '_');
      modelKey = modelKey + ' ' + obj[i].TRANSMISSION + ' ' + 'V' + obj[i].CYLINDERS;
      delete obj[i].YEAR;
      delete obj[i].MODEL;
      delete obj[i].MAKE;
      delete obj[i]["VEHICLE CLASS"];
      delete obj[i]["ENGINE SIZE"];
      delete obj[i]["CYLINDERS"];
      delete obj[i]["TRANSMISSION"];
      delete obj[i]["COMB (mpg)"];
      if (obj[i]["SMOG RATING"])
        delete obj[i]["SMOG RATING"];
      if (obj[i]["C02 RATING"])
        delete obj[i]["CO2 RATING"];
      make[makeKey][modelKey] = obj[i];
    }
    console.log(containerObj);
    json = JSON.stringify(containerObj);
    fs.writeFile('2004.json', json, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      }
    }); // write it back 
  }
});
