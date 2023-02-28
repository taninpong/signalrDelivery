document.addEventListener("DOMContentLoaded", () => {
  // <snippet_Connection>
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub")
    .withAutomaticReconnect([0, 0, 10000])
    .configureLogging(signalR.LogLevel.Information)
    .build();
  // </snippet_Connection>

  // <snippet_ReceiveMessage>
  connection.on("ReceiveMessage", (user, message) => {
    const li = document.createElement("li");
    li.textContent = `${user}: ${message}`;
    document.getElementById("messageList").appendChild(li);
  });
  // </snippet_ReceiveMessage>

  document.getElementById("send").addEventListener("click", async () => {
    const user = document.getElementById("userInput").value;
    const message = document.getElementById("messageInput").value;

    // <snippet_Invoke>
    try {
      await connection.invoke("SendMessage", user, message);
    } catch (err) {
      console.error(err);
    }
    // </snippet_Invoke>
  });

  async function start() {
    try {
      await connection.start();
      setInterval(myTimer, 5000);
      console.log("SignalR Connected.");
    } catch (err) {
      console.log(err);
      setTimeout(start, 5000);
    }
  };

  connection.onclose(async () => {
    await start();
  });

  // Start the connection.
  start();

  function displayHello() {
    document.getElementById("demo").innerHTML += "Hello";
  }
  function myTimer() {
    const date = new Date();
    console.log(date.toUTCString(), connection.state);
    const p = document.createElement("li");
    //p.textContent = `${user}: ${message}`;
    p.textContent = date.toLocaleString().concat(" Status SignalR : ", connection.state);
    document.getElementById("messageList").appendChild(p);
    //document.getElementById("logdate").innerHTML = date.toUTCString();
  }
});
