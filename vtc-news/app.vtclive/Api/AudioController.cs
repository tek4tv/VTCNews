using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace app.vtclive.Api.Audio
{
    [RoutePrefix("api/audio")]
    public class AudioController : ApiController
    {
        private static string _appID = "c510b118-73ba-4c17-8a06-ea96c408cdf8";        
        private static string _playbackUrl = "https://now.tek4tv.vn/";
        [Route("episode")]
        public async Task<HttpResponseMessage> GetLiveAsync()
        {
            try
            {
                var AppID = _appID;
                using (var httpClient = new HttpClient())
                {
                    string url = _playbackUrl + "api/now/v1/videos/"+AppID+ "/episode";                                      
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
