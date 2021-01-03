var socket = io();

socket.on('cdata', function(data) {
  let format = JSON.stringify(data);
  format.split(",").join(",<br/>");
  format.split("}").join("}<br/>");
  format.split("{").join("{<br/>");
  document.getElementById("rawdata").innerHTML = format;

});
