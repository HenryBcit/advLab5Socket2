const port = process.env.PORT || 10000;
const server = require("http").Server();

var io = require("socket.io")(server);

var allrooms = {};

io.on("connection", function(socket){
    
    socket.on("joinroom", function(data){
        socket.join(data);
        socket.myRoom = data;
        
        if(!allrooms[data]){
            allrooms[data] = {
                users:[],
                q:{}
            };
        }
        console.log(data,"joinroom");
    });
    
    socket.on("qsubmit", function(data){
        //tell everybody there's a new question
        console.log(data);
        allrooms[socket.myRoom].q = data;
        socket.to(socket.myRoom).emit("newq", data);
    });
    
    socket.on("answer", function(data){
        var msg = "Wrong!"
        if(allrooms[socket.myRoom].q.a == data){
           msg = "You got it!";
        }
        socket.emit("result", msg)
    });
    
    socket.on("disconnect", function(){
        
    })
});

server.listen(port, (err)=>{
    if(err){
        console.log(err);
        return false;
    }
    
    console.log("Port is running");
})