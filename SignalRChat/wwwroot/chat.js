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
        //TODO   Add log  start
        const date = new Date();
        console.log(date.toUTCString(), "Start connect Signalr");
        const p = document.createElement("li");
        //p.textContent = `${user}: ${message}`;
        p.textContent = date.toLocaleString().concat("Start Status SignalR : ", connection.state, "ConnectionId : " + connection.connectionId);
        document.getElementById("messageList").appendChild(p);

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

    function myTimer() {
        const date = new Date();
        console.log(date.toUTCString(), connection.state);
        const p = document.createElement("li");
        //p.textContent = `${user}: ${message}`;
        p.textContent = date.toLocaleString().concat(" Status SignalR : ", connection.state, "ConnectionId : " + connection.connectionId);
        document.getElementById("messageList").appendChild(p);
        //document.getElementById("logdate").innerHTML = date.toUTCString();
    }

    connection.onreconnected(() => {
        const date = new Date();
        console.log(date.toUTCString(), connection.state);
        const p = document.createElement("li");
        //p.textContent = `${user}: ${message}`;
        p.textContent = date.toLocaleString().concat("Reconnect Status SignalR : ", connection.state, "ConnectionId : " + connection.connectionId);
        document.getElementById("messageList").appendChild(p);
        //console.log(connection.state)
    })
    //function onreconnected(callback: (connectionId?: string) => void)
});
