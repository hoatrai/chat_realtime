var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(3000, function(){ console.log('start server')});
var arrUser = [];
io.on("connection",function(socket){
	console.log('Co thang vua connect voi id='+socket.id);	
	socket.on('USER_REGISTER',function(data){
		//console.log(data);
		if(arrUser.indexOf(data) == -1){
			arrUser.push(data);
			socket.username = data;
			io.sockets.emit('USER_RESISTER_SUCCESS',{username:data,id:socket.id });
			io.to(socket.id).emit("HIDE_REGISTER");
		}else{
			socket.emit("USER_REGISTER_EXISTS",0);	
		}
	});
	
	socket.on('USER_CHAT',function(data){
		io.sockets.emit('SHOW_USER_CHAT',{message:data,username:socket.username});	
	});
	socket.on('CHOC_GHEO',function(data){
		io.to(data).emit('XU_LY_CHOC_GHEO',socket.username);	
	});
});

app.get("/",function(req,res){
	res.render("trangchu");	
});
