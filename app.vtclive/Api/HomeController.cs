using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace app.vtclive.Api.Home
{
    [RoutePrefix("api/home")]
    public class HomeController : ApiController
    {
        private static string _playbackUrl = "http://api.vtcnews.vn/";
        [Route("menu")]
        public async Task<HttpResponseMessage> GetMenuAsync()
        {
            try
            {              
                using (var httpClient = new HttpClient())
                {
                    string url = _playbackUrl + "api/news/getcategory";
                    var responsePost = await httpClient.GetAsync(url);
                    if (responsePost.IsSuccessStatusCode)
                    {
                        string responseBody = await responsePost.Content.ReadAsStringAsync();
                        dynamic output = JsonConvert.DeserializeObject(responseBody);
                        return Request.CreateResponse(HttpStatusCode.OK, (Object)output, Configuration.Formatters.JsonFormatter);
                    }
                    else
                    {
                        return Request.CreateResponse(HttpStatusCode.InternalServerError, false);
                    }
                }
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e.Message);
            }
        }
    }
}
