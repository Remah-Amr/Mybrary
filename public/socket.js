var socket = io.connect('http://localhost:4000');

socket.emit('test','yes')