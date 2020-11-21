using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace app.vtclive.Controllers
{
    public class VideoDetailController : Controller
    {
        // GET: VideoDetail
        public ActionResult Index(string ID)
        {
            return View();
        }
    }
}