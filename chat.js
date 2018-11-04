//Dependencies
//Extra common Declarations
var express = require('express');
var redis=require('redis');
var mysql = require('mysql');
var pub=redis.createClient();//another redis client to publish data and do other functions
var moment = require('moment');//its the dependency for date
var formatted = moment().format('YYYYMMDD hhmmss a');//example format 20170608 102933 am
var request = require('request');
var m=0;//used to save hash keys for channels messages and time in socket.on('publishing')
const apiurl="https://www.viral9.com/viral9_api/external_api/user_search?s=";//API URL for details
//Declaring Dependencies for client
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(8000);//hosting on localhost:8000

//mysql configuration
var pool = mysql.createPool({
     host: "localhost",
     user: "root",
     password: "",
     database:"messagedb",
     charset : 'utf8mb4'
});

//SQL commands run
function runquery(running,query,callback) {
     var c=[],d=[];
     pool.getConnection(function(err, connection) {
          if(err) {
               console.log(err);
               callback(true);
               return;
          }
          if(running=="command"){
               var sql = query;
               connection.query(sql, function(err, results) {
                    connection.release(); // always put connection back in pool after last query
                    if(err) {
                         console.log(err);
                         callback(false);
                         return;
                    }
                    callback(true);
               });
          }
          else{
               var sql = query;
               connection.query(sql, function(err, results) {
                    connection.release(); // always put connection back in pool after last query
                    if(err) {
                         console.log(err);
                         callback(false);
                         return;
                    }
                    for(var num=0;num<results.length;num++){
                         d=[];
                         for(var attr in results[num]){
                              d.push(results[num][attr]);
                         }
                         c.push(d);
                    }
                    callback(c);
               });
          }
     });
}

//static path for client
app.use(express.static(__dirname));
app.use("/assets/css",  express.static(__dirname + '/assets/css'));
app.use("/assets/js", express.static(__dirname + '/assets/js'));
app.use("/assets/images",express.static(__dirname + '/assets/images'))
app.use("/assets/images/gallery",express.static(__dirname + '/assets/images/gallery'))
//Hosting file on localhost:8000
app.get('/', function(req, res){
     res.sendFile(__dirname + '/chatapp.html');
});

//API response
function search(query,callback) {//it gives the search result in an array of arrays ex. a[0]=[1234,'first_name','last_name','email']
var url=apiurl+query;// makes the final search url
var a=[];//array to return
var b=[];//array that stores actual info
request(url, (error, response, body)=> {
     if (!error && response.statusCode === 200) {
          var fbResponse = JSON.parse(body);
          if(fbResponse.status==0){
               callback(false);
          }
          else {
               if(fbResponse.response.length>1){
                    for(var i=0;i<fbResponse.response.length;i++){
                         b=[];
                         for(var attr in fbResponse.response[i]){
                              b.push(fbResponse.response[i][attr]);
                         }
                         a.push(b);
                    }
                    callback(a);
               }
               else {
                    for(var attr in fbResponse.response){
                         b.push(fbResponse.response[attr]);
                    }
                    a.push(b);
                    callback(a);
               }
          }
     }
     else {
          callback(false);
     }
});
}
io.sockets.on('connection', function(socket){

     socket.redisClient =  redis.createClient();
     var user,to;
     socket.on('login',function (id) {
          user=id;
          socket.redisClient.subscribe('user'+user);
          console.log("user:"+user+" in");
     })
     socket.on('connectuser',function (connid) {
          console.log("connected to:"+connid);

          to=connid;
          runquery('retrieve',"SELECT senderid,recieverid,message,time from messages where senderid="+user+" and recieverid="+to+" or senderid="+to+" and recieverid="+user+" order by time",function (result) {
               if(result){
                    socket.emit('retrieval',result);
               }
          });
     })
     socket.on('disconnect',function () {
          socket.redisClient.unsubscribe('user'+user);
          socket.redisClient.quit();
     })
     socket.on('SendingMessage',function (x) {
          runquery('command',"Insert into messages(senderid,recieverid,message) values("+user+","+to+",'"+x+"')",function (result) {
               if(result){
                    pub.publish('user'+to,user+'usersending'+x);
               }
          });
     })
     socket.redisClient.on('message',function (channel,notification) {
          var info=notification.split('usersending');
          socket.emit('recievedmessage',info[0],info[1]);
     })
});
