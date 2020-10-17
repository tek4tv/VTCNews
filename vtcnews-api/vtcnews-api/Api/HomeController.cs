using GenLinkImage;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace app.vtclive.Api.Home
{
    
    [RoutePrefix("api/home")]
    public class HomeController : ApiController
    {
        private static string _playbackUrl = "http://api.vtcnews.vn/";
        [Route("news/menu")]
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
        [Route("news/getarticlehot")]
        public async Task<HttpResponseMessage> GetGetarticlehotAsync()
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    string url = _playbackUrl + "api/news/getarticlehot";
                    var responsePost = await httpClient.GetAsync(url);
                    if (responsePost.IsSuccessStatusCode)
                    {
                        string responseBody = await responsePost.Content.ReadAsStringAsync();

                        dynamic outputs = JsonConvert.DeserializeObject(responseBody);
                        foreach(var output in outputs)
                        {
                            output.image16_9 = "https://image.vtc.vn/resize/" + LinkImg.GetStringEncryptImage("crop_480x270", (string)output.imageUrl) + "/" + (string)output.imageUrl;
                            output.image2_3 = "https://image.vtc.vn/resize/" + LinkImg.GetStringEncryptImage("crop_480x720", (string)output.imageUrl) + "/" + (string)output.imageUrl;
                            output.image1_1 = "https://image.vtc.vn/resize/" + LinkImg.GetStringEncryptImage("crop_500x500", (string)output.imageUrl) + "/" + (string)output.imageUrl;
                        }
                        return Request.CreateResponse(HttpStatusCode.OK, (Object)outputs, Configuration.Formatters.JsonFormatter);
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
        [Route("news/getchannelhot")]
        public async Task<HttpResponseMessage> GetChannelHotAsync()
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    string url = _playbackUrl + "api/news/getchannelhot";
                    var responsePost = await httpClient.GetAsync(url);
                    if (responsePost.IsSuccessStatusCode)
                    {
                        string responseBody = await responsePost.Content.ReadAsStringAsync();

                        dynamic outputs = JsonConvert.DeserializeObject(responseBody);
                        foreach (var output in outputs)
                        {
                            output.image16_9 = "https://image.vtc.vn/resize/" + LinkImg.GetStringEncryptImage("crop_480x270", (string)output.imageUrl) + "/" + (string)output.imageUrl;
                            output.image2_3 = "https://image.vtc.vn/resize/" + LinkImg.GetStringEncryptImage("crop_480x720", (string)output.imageUrl) + "/" + (string)output.imageUrl;
                            output.image1_1 = "https://image.vtc.vn/resize/" + LinkImg.GetStringEncryptImage("crop_500x500", (string)output.imageUrl) + "/" + (string)output.imageUrl;
                        }
                        return Request.CreateResponse(HttpStatusCode.OK, (Object)outputs, Configuration.Formatters.JsonFormatter);
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
        [Route("news/GetArticleSuggestionHome")]
        public async Task<HttpResponseMessage> GetArticleSuggestionHomeAsync()
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    string url = _playbackUrl + "api/news/GetArticleSuggestionHome";
                    var responsePost = await httpClient.GetAsync(url);
                    if (responsePost.IsSuccessStatusCode)
                    {
                        string responseBody = await responsePost.Content.ReadAsStringAsync();

                        dynamic outputs = JsonConvert.DeserializeObject(responseBody);
                        foreach (var output in outputs)
                        {
                            output.image16_9 = "https://image.vtc.vn/resize/" + LinkImg.GetStringEncryptImage("crop_480x270", (string)output.imageUrl) + "/" + (string)output.imageUrl;
                            output.image2_3 = "https://image.vtc.vn/resize/" + LinkImg.GetStringEncryptImage("crop_480x720", (string)output.imageUrl) + "/" + (string)output.imageUrl;
                            output.image1_1 = "https://image.vtc.vn/resize/" + LinkImg.GetStringEncryptImage("crop_500x500", (string)output.imageUrl) + "/" + (string)output.imageUrl;
                        }
                        return Request.CreateResponse(HttpStatusCode.OK, (Object)outputs, Configuration.Formatters.JsonFormatter);
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
        [Route("news/GetVideoHome")]
        public async Task<HttpResponseMessage> GetVideoHomeAsync()
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    string url = _playbackUrl + "api/news/GetVideoHome";
                    var responsePost = await httpClient.GetAsync(url);
                    if (responsePost.IsSuccessStatusCode)
                    {
                        string responseBody = await responsePost.Content.ReadAsStringAsync();

                        dynamic outputs = JsonConvert.DeserializeObject(responseBody);
                        foreach (var output in outputs)
                        {
                            output.image16_9 = "https://image.vtc.vn/resize/" + LinkImg.GetStringEncryptImage("crop_480x270", (string)output.imageUrl) + "/" + (string)output.imageUrl;
                            output.image2_3 = "https://image.vtc.vn/resize/" + LinkImg.GetStringEncryptImage("crop_480x720", (string)output.imageUrl) + "/" + (string)output.imageUrl;
                            output.image1_1 = "https://image.vtc.vn/resize/" + LinkImg.GetStringEncryptImage("crop_500x500", (string)output.imageUrl) + "/" + (string)output.imageUrl;
                        }
                        return Request.CreateResponse(HttpStatusCode.OK, (Object)outputs, Configuration.Formatters.JsonFormatter);
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
