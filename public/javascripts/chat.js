var socket = io.connect();

socket.on('messeges:show', function(data) {
  var i, len, message, ref, results;
  ref = data.messages;
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    message = ref[i];
    results.push($("div#chat-area").prepend("<div>" + message.username + " : " + message.text + "</div>"));
  }
  return results;
});

socket.on('message:receive', function (data) {
  $("div#chat-area").prepend("<div>" + data.username + " : " + data.message + "</div>");
});

function send(user) {
  console.log(user);
  var msg = $("input#message").val();
  $("input#message").val("");
  socket.emit('message:send', { message: msg, username: user });
}
