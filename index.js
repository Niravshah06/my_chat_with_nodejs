var app = require('express')();
var bodyParser= require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

let connectetUSer=[];


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine','ejs');
io.on('connection', function(socket){
    
    //console.log(i+'user connected');
    let name=socket.handshake.query.userName;
   
    connectetUSer.push(name);
    socket.broadcast.emit('chat message',name+": Connected")
    myObj = { "Ucount":connectetUSer.length, "Users":connectetUSer };
    io.emit('uc', myObj);

       
   


    socket.on('disconnect', function(){

        let name=socket.handshake.query.userName;
       
		let userIndex = connectetUSer.indexOf(socket.handshake.query.userName);
		 if (userIndex != -1) {
            connectetUSer.splice(userIndex, 1);
            myObj = { "Ucount":connectetUSer.length, "Users":connectetUSer };
            io.emit('uc', myObj);
            io.emit('chat message', name+": left");
		 }


       
       
    });
    socket.on('chat message', function(msg){
        
        // sending to all clients except sender
        let name=socket.handshake.query.userName
        io.emit('chat message', name+": "+msg);
                
            });


            socket.on('user typing', function(){
                let name=socket.handshake.query.userName
                socket.broadcast.emit('user is typing', name);
                        
                    });

                    socket.on('noLongerTypingMessage', function(){
                        let name=socket.handshake.query.userName
                        socket.broadcast.emit('user is not typing', name);
                                
                            });
  });

  

app.get('/', function(req, res){
    res.sendFile(__dirname + '/name.html');
    
});


app.post('/chat',function(req,res){
    res.render('index',{
        name:(req.body.username)
    })
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});