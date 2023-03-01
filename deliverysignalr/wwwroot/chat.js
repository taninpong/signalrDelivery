document.addEventListener("DOMContentLoaded", () => {
    // <snippet_Connection>
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/chathub")
        .withAutomaticReconnect([0, 0, 10000])
        .configureLogging(signalR.LogLevel.Information)
        .build();
    // </snippet_Connection>
    const datalog = { restaurantName: '', logs: [] };

    // <snippet_ReceiveMessage>
    connection.on("ReceiveMessage", (user, message) => {
        const li = document.createElement("li");
        li.textContent = `${user}: ${message}`;
        datalog.logs.push(li.textContent);
        document.getElementById("messageList").appendChild(li);

        // TODO Change list li/p => li all

        //const p = document.createElement("li");
        //const date = new Date();
        //p.textContent = date.toLocaleString().concat(" Start Status SignalR : ", connection.state, " ConnectionId : " + connection.connectionId);
        //datalog.logs.push(p.textContent);
        //document.getElementById("messageList").appendChild(p);
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

    document.getElementById("senddatatodb").addEventListener("click", async () => {
        const restaurantname = document.getElementById("restaurantName").value;
        datalog.restaurantName = restaurantname;
        $.ajax({
            type: "POST",
            url: "/dlgsubmit",
            data: JSON.stringify(datalog),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (result) {
                //alert(result.message);
                //location.reload();
                //console.log("result", result);
                //result.url
                window.location = result.url;
                console.log("result", result);
            },
            error: function (er) {
                //alert(JSON.stringify(er));
                if (er == null|| er.statusText == "error") {
                    alert("please try again or check internet !!!");
                    window.location = "/home/invalid";
                } else {
                }
            }
        });
    });

    async function start() {
        //const p = document.createElement("li");
        const li = document.createElement("li");
        const date = new Date();
        li.textContent = date.toLocaleString().concat(" Start Status SignalR : ", connection.state, " ConnectionId : " + connection.connectionId);
        datalog.logs.push(li.textContent);
        document.getElementById("messageList").appendChild(li);
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
        const li = document.createElement("li");
        //const p = document.createElement("li");
        li.textContent = date.toLocaleString().concat("Disconnecting Status SignalR : ", connection.state, " ConnectionId : " + connection.connectionId);
        datalog.logs.push(li.textContent);
        document.getElementById("messageList").appendChild(li);
        await start();
    });
    // Start the connection.
    start();

    function myTimer() {
        const date = new Date();
        //const p = document.createElement("li");
        const li = document.createElement("li");
        if (connection.state != "Disconnected") {
            li.textContent = date.toLocaleString().concat(" Status SignalR : ", connection.state, " ConnectionId : " + connection.connectionId);
            datalog.logs.push(li.textContent);
            document.getElementById("messageList").appendChild(li);
        }
    }

    connection.onreconnected(() => {
        const date = new Date();
        console.log(date.toUTCString(), connection.state);
        //const p = document.createElement("li");
        const li = document.createElement("li");
        li.textContent = date.toLocaleString().concat("Reconnected Status SignalR : ", connection.state, " ConnectionId : " + connection.connectionId);
        datalog.logs.push(li.textContent);
        document.getElementById("messageList").appendChild(li);
    });

    connection.onreconnecting(() => {
        const date = new Date();
        console.log(date.toUTCString(), connection.state);
        //const p = document.createElement("li");
        const li = document.createElement("li");
        li.textContent = date.toLocaleString().concat("Reconnecting Status SignalR : ", connection.state, " ConnectionId : " + connection.connectionId);
        datalog.logs.push(li.textContent);
        document.getElementById("messageList").appendChild(li);
    });
});
