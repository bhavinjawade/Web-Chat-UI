function func() {
  document.getElementById("imgupload").click();
}
function openNav(open, elem) {
  if ($(elem).parent().css("height") == "400px") {
    closeNav(open, elem);
  } else {
    $(elem).parent().css({ height: "400px" });
    var ele = $(elem).parent().find(".hider");
    for (i = 0; i < ele.length; i++) {
      ele[i].style.opacity = "1";
    }
    $(elem).parent().find(".photosmallsender").css("top", "0px");
  }
}
function closeNav(open, elem) {
  var ele = $(elem).parent().find(".hider");
  for (i = 0; i < ele.length; i++) {
    ele[i].style.opacity = "0";
  }
  $(elem).parent().css({ height: "30px" });
  $("#OpenImgUpload").css("display", "none");
  console.log(elem);
  $(elem).parent().find(".photosmallsender").css("top", "30px");
}
$(document).ready(function() {
  windowHeight();
});
function windowHeight() {
  var height = window.innerHeight;
  $(".sideFriendsList").css("height", "100%");
}
var a = 0;
function openFriends() {
  if (a == 0) {
    $("#sideFriendsListId").css({ right: "0", padding: "5px" });
    $(".on-click-margin").css("margin-right", "300px");
    $(".rotate-svg").css({ transform: "rotateY(" + 180 + "deg)" });
    a = 1;
  } else if (a == 1) {
    $("#sideFriendsListId").css({ right: "-300px", padding: "0px" });
    $(".on-click-margin").css("margin-right", "0");
    $(".rotate-svg").css({ transform: "rotateY(" + 0 + "deg)" });
    a = 0;
  }
}
