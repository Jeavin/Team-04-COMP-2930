var today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, 0);
  const day = `${today.getDate()}`.padStart(2, 0);
  const stringToday = [year, month, day].join('-');
  console.log(stringToday);
  document.getElementById("curdate").innerHTML = stringToday;
