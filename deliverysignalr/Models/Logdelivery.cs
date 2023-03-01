
namespace deliverysignalr.Models
{
    public class Logdelivery
    {
        public string _id { get; set; }
        public DateTime? createDate { get; set; }
        public string restaurantName { get; set; }
        public IEnumerable<string> logs { get; set; }
        public Dictionary<string,string> headerData{ get; set; }
    }
}
