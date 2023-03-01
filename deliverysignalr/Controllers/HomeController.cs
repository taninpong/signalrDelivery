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

        public IActionResult Invalid()
        {
            return View();
        }
        public IActionResult Success()
        {
            return View();
        }



        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost("[action]")]
        public IActionResult dlgsubmit([FromBody] Logdelivery logsdeli)
        {
            try
            {
                MongoClient dbClient = new MongoClient("mongodb://manabackofficedev:l2mLDYnN9kTZXi3eBbYK08am7dpHIjJyMW4jPuLkOT7gMqXvmSygysBGdZ3PqwBYJ3uUoHVrS25TFC0NchAx8w==@manabackofficedev.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@manabackofficedev@");
                var database = dbClient.GetDatabase("delilogs");
                var collection = database.GetCollection<Logdelivery>("logs");
                var logs = logsdeli;
                var headerData = GetAllHeaders();
                logsdeli._id = Guid.NewGuid().ToString();
                logsdeli.createDate = DateTime.UtcNow;
                logsdeli.headerData = headerData;
                collection.InsertOne(logs);
                return Ok(new { message = "OK", url = "/home/success" });
            }
            catch (Exception)
            {
                return Ok(new { message = "error", url = "/home/invalid" });
            }
            //if (isSuccess == true)
            //{
            //    //https://siganlrdelii.azurewebsites.net/home/success
            //    url = "/home/success";
            //}
            //else
            //{
            //    //https://siganlrdelii.azurewebsites.net/home/invalid
            //    url = "/home/invalid";
            //}
            //return Ok(new { message = "OK", url = url });
        }

        //[HttpGet("GetAllHeaders")]
        private Dictionary<string, string> GetAllHeaders()
        {
            Dictionary<string, string> requestHeaders =
               new Dictionary<string, string>();
            foreach (var header in Request.Headers)
            {
                requestHeaders.Add(header.Key, header.Value);
            }
            return requestHeaders;
        }

        [HttpGet("GetHeaderData")]
        public ActionResult<string> GetHeaderData(string headerKey = "sec-ch-ua-platform")
        {
            Request.Headers.TryGetValue(headerKey, out var headerValue);
            return Ok(headerValue);
        }
    }
}