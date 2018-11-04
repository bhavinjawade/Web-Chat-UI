function getUrlParams(url) {
     if(!url.split("?")[1])
          url="site?id=none";
     queryString = url.split("?")[1];
     var keyValuePairs = queryString.split("&");
     var keyValue, params = {};
     keyValuePairs.forEach(function(pair) {
          keyValue = pair.split("=");
          params[keyValue[0]] = decodeURIComponent(keyValue[1]).replace("+", " ");
     });
     return params;
}
var count=0;
var total=0;
var unread=0;
var dt;var id;
$(document).ready(function() {

     var $messageForm = $('#send-message');
     var $messageBox = $('#message');

     var socket = io.connect('');

socket.on('connect_error', function() {

    console.log("Connection error!");
socket.destroy();
});

     socket.emit('client');
     id = getUrlParams(location.href);
     $("#count").html('0');
     $("#count2").html('0');
     socket.emit('user',id["id"]);
     socket.on('pubbed', function (channel,notification,date) {
          dt=moment(date,"YYYYMMDD hhmmss a").fromNow();
          $("#count").html(count);
          $("#count2").html(count);
          $("#count2").show();
          $("#ba").show();
          $("#style-3").append('<li><a href="javascript:void(0);" class="list-group-item " ><div class="media "><div class="media-body clearfix "><div class="row inRow"><div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 "><img src="assets/images/users/avatar-1.jpg" alt="" class="img-notify img-responsive  imgBorder "></div><div class="media-heading col-lg-9 col-md-9 col-sm-9 col-xs-9 lineFix"><div class="notification-text-holder col-lg-12 col-md-12 col-sm-12 col-xs-12"><p class="m-0 pull-left paragraphColor"><small>'+channel+': </small></p><span class="pull-right timeSize"><small>'+dt+'</small></span><h5 id="lineheading" class="oneLineHeading col-lg-12 col-md-12 col-sm-12 col-xs-12 ">'+notification+'</h5><div class="show-more-notification pull-right" onclick="showMore();">show more...</div></div></div></div></div></div></a> </li>');
     });
     socket.on('filling',function (co) {
          count=co;
     })
     socket.on('pubbed2', function (channel,notification,date) {
          dt=moment(date,"YYYYMMDD hhmmss a").fromNow();
          count++;
          $("#count").html(count);
          $("#count2").html(count);
          $('#notify').find('span').fadeIn();
          $("#style-3").append('<li><a href="javascript:void(0);" class="list-group-item " ><div class="media "><div class="media-body clearfix "><div class="row inRow"><div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 "><img src="assets/images/users/avatar-1.jpg" alt="" class="img-notify img-responsive  imgBorder "></div><div class="media-heading col-lg-9 col-md-9 col-sm-9 col-xs-9 lineFix"><div class="notification-text-holder col-lg-12 col-md-12 col-sm-12 col-xs-12"><p class="m-0 pull-left paragraphColor"><small>'+channel+': </small></p><span class="pull-right timeSize"><small>'+dt+'</small></span><h5 id="lineheading" class="oneLineHeading col-lg-12 col-md-12 col-sm-12 col-xs-12 ">'+notification+'</h5><div class="show-more-notification pull-right" onclick="showMore();">show more...</div></div></div></div></div></div></a> </li>');

     });
     socket.on('errormsg',function (msg) {
          console.log(msg);
          alert(msg);
     })
      $('#notify').on('click', function () {
           unread++;
           $("#count").html(count);
           $("#count2").html(count);
           if(unread%2==0){
              count=0;
              socket.emit('unread',id["id"]);
           }
      });
});
