using deliverysignalr.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections;
using System.Diagnostics;
namespace deliverysignalr.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }


        //[HttpGet("[action]")]
        //public IActionResult dlgsubmit(string restaurantName)
        //{
        //    return View("index");
        //}


        [HttpPost("[action]")]
        public IActionResult dlgsubmit([FromBody] logsdeli logsdeli)
        {
            MongoClient dbClient = new MongoClient("mongodb://manabackofficedev:l2mLDYnN9kTZXi3eBbYK08am7dpHIjJyMW4jPuLkOT7gMqXvmSygysBGdZ3PqwBYJ3uUoHVrS25TFC0NchAx8w==@manabackofficedev.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@manabackofficedev@");
            var database = dbClient.GetDatabase("delilogs");
            var collection = database.GetCollection<logsdeli>("logs");
            logsdeli._id = Guid.NewGuid().ToString();
            logsdeli.createDate = DateTime.UtcNow;
            var logs = logsdeli;
            collection.InsertOne(logs);
            return Ok(new {message= "OK" });
        }



        public class logsdeli
        {
            public string _id { get; set; }
            public DateTime? createDate { get; set; }
            public string restaurantName { get; set; }
            public IEnumerable<string> logs { get; set; }
        }

    }
}