//To get user parameters via GET
function getUrlParams(url) {
  if (!url.split("?")[1]) url = "site?id=none";
  queryString = url.split("?")[1];
  var keyValuePairs = queryString.split("&");
  var keyValue,
    params = {};
  keyValuePairs.forEach(function(pair) {
    keyValue = pair.split("=");
    params[keyValue[0]] = decodeURIComponent(keyValue[1]).replace("+", " ");
  });
  return params;
}
var id,
  socket,
  connectedto = [];
$(document).ready(function() {
  id = getUrlParams(location.href);
  id = id["id"];
  $("#chat0").hide();
  $("#chat1").hide();
  $("#chat2").hide();
  socket = io.connect("http://192.168.2.44:8000");

  socket.emit("login", id);

  socket.on("recievedmessage", function(from, message) {
    from = parseInt(from);
    insertChat(from, message, boxes.indexOf(from));

    var val = $("#u" + from + "").text();
    var changed = parseInt(val);
    changed += 1;

    $("#u" + from).html(changed);
  });
  socket.on("retrieval", function(array) {
    for (var num = 0; num < array.length; num++) {
      if (array[num][0] == id) {
        insertChat("me", array[num][2], boxes.indexOf(array[num][1]));
      } else {
        insertChat("other", array[num][2], boxes.indexOf(array[num][0]));
      }
    }
  });
});
function closeing(value) {
  $('#chat'+value).hide();
 }
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

//-- No use time. It is a javaScript effect.
function insertChat(who, text, val) {
  var control = "";
  var date = formatAMPM(new Date());
  if (who == "me") {
    control =
      '<div class="chatmsgsender hider pull-right"  data-toggle="tooltip" data-placement="bottom" title="' +
      date +
      '" style="opacity: 1;"><p class="msgtext">' +
      text +
      "</p></div>" +
      '<div class="seen hider hider pull-right " id="seen" style="display:none"><p class="msgtext">seen</p></div>';
  } else {
    control =
      '<div class="chatmsgreciever hider pull-left"  data-toggle="tooltip" data-placement="bottom" title="' +
      date +
      '" style="opacity: 1;"><p class="msgtext">' +
      text +
      "</p></div>";
  }
  $("#chatareaid" + val).append(control);
  $("#chatareaid" + val).animate(
    {
      scrollTop: $("#chatareaid" + val).prop("scrollHeight")
    },
    0
  );
}
var num = 0,
  boxes = [],close=[];
function con(name, id1) {
  var val = num % 3;
  if (boxes.indexOf(id1) == -1) {
    $("#user_name" + val).text(name);
    $("#user_name" + val).append('<span style="position: absolute;top:12px"> <span class="online" style="background-color: grey ;height: 10px;width: 10px;border-radius: 50%"></span></span>');
    $("#user_name" + val).append('<span style="position: absolute;top:12"> <span class="online" style="background-color: rgb(66, 183, 42);height: 10px;width: 10px;border-radius: 50%"></span></span>');

    if (num < 3) {
      connectedto.push(id1);
      boxes.push(id1);
      close.push(id1);
    } else {
      connectedto[val] = id1;
      boxes[val] = id1;
      close[val]=id1;
    }
    socket.emit("connectuser", id1, function(err) {
      socket.emit("login", id);
    });

     $('#chat'+val).find(".chathead").trigger('click');
     
    $("#chat" + val).show();

    
    $("#chatareaid" + val).empty();
    num++;
  } else {
    val=boxes.indexOf(id1);
     $('#chat'+val).find(".chathead").trigger('click');
  }

  openFriends();

}

function send(value) {
  var message = $("#msg" + value).val();
  if (message != "") {
    socket.emit("SendingMessage", message);
    $("#msg" + value).val("");
    insertChat("me", message, value);
    $("#seen").hide();
  }
}