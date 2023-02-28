document.addEventListener("DOMContentLoaded", () => {
    // <snippet_Connection>
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/chathub")
        .withAutomaticReconnect([0, 0, 10000])
        .configureLogging(signalR.LogLevel.Information)
        .build();
    // </snippet_Connection>

    // <snippet_ReceiveMessage>
    const li = document.createElement("li");
    connection.on("ReceiveMessage", (user, message) => {
        li.textContent = `${user}: ${message}`;
        document.getElementById("messageList").appendChild(li);
    });
    // </snippet_ReceiveMessage>

    const datalog = { restaurantName: '', logs: [] };

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

    document.getElementById("senddatatodb").addEventListener("click", async () => {
        const restaurantname = document.getElementById("restaurantName").value;
        datalog.restaurantName = restaurantname;
        //console.log("xxxx",JSON.stringify(datalog));
        //console.log("YYYY", datalog);
        $.ajax({
            type: "POST",
            url: "/dlgsubmit",
            data: JSON.stringify(datalog),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false, //_async,
            success: function (result) {
                alert(result.message);
                location.reload();
                console.log("result", result);

            }
        });
    });

    async function start() {
        const p = document.createElement("li");
        const date = new Date();
        p.textContent = date.toLocaleString().concat(" Start Status SignalR : ", connection.state, " ConnectionId : " + connection.connectionId);
        datalog.logs.push(p.textContent);
        document.getElementById("messageList").appendChild(p);
        try {
            await connection.start();
            setInterval(myTimer, 5000);
        } catch (err) {
            console.log(err);
            setTimeout(start, 5000);
        }
    };

    connection.onclose(async () => {
        //todo add log disconnect
        const date = new Date();
        console.log(date.toUTCString(), connection.state);
        const p = document.createElement("li");
        p.textContent = date.toLocaleString().concat("Disconnecting Status SignalR : ", connection.state, " ConnectionId : " + connection.connectionId);
        datalog.logs.push(p.textContent);
        document.getElementById("messageList").appendChild(p);
        await start();
    });
    // Start the connection.
    start();

    function myTimer() {
        const date = new Date();
        const p = document.createElement("li");
        if (connection.state != "Disconnected") {
            p.textContent = date.toLocaleString().concat(" Status SignalR : ", connection.state, " ConnectionId : " + connection.connectionId);
            datalog.logs.push(p.textContent);
            document.getElementById("messageList").appendChild(p);
        }
    }

    connection.onreconnected(() => {
        const date = new Date();
        console.log(date.toUTCString(), connection.state);
        const p = document.createElement("li");
        p.textContent = date.toLocaleString().concat("Reconnected Status SignalR : ", connection.state, " ConnectionId : " + connection.connectionId);
        datalog.logs.push(p.textContent);
        document.getElementById("messageList").appendChild(p);
    });

    connection.onreconnecting(() => {
        const date = new Date();
        console.log(date.toUTCString(), connection.state);
        const p = document.createElement("li");
        p.textContent = date.toLocaleString().concat("Reconnecting Status SignalR : ", connection.state, " ConnectionId : " + connection.connectionId);
        datalog.logs.push(p.textContent);
        document.getElementById("messageList").appendChild(p);
    });
});
