using Microsoft.AspNetCore.SignalR;
namespace SignalRChat.Hubs;

public class ChatHub : Hub
{
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    public async Task GetLog(string user, string message)
    {
        //var connection = new Microsoft.AspNetCore.SignalR.hubconn
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
