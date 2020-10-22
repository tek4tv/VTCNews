using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace app.vtclive.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();        
        }
        public PartialViewResult HomeApp()
        {
            return PartialView("_HomeApp");
        }
        public PartialViewResult Audio()
        {
            return PartialView("_Audio");
        }
        public PartialViewResult Video()
        {
            return PartialView("_Video");
        }
        public PartialViewResult VideoDetail()
        {
            return PartialView("_VideoDetail");
        }
        public PartialViewResult AudioMusic()
        {
            return PartialView("_AudioMusic");
        }
        public PartialViewResult AudioPodcast()
        {
            return PartialView("_AudioPodcast");
        }       
        public PartialViewResult AudioBook()
        {
            return PartialView("_AudioBook");
        }
        public PartialViewResult AudioDetail()
        {
            return PartialView("_AudioDetail");
        }
        public PartialViewResult SideBar()
        {
            return PartialView("_SideBar");
        }
        public PartialViewResult NewsDetail()
        {
            return PartialView("_NewsDetail");
        }
        
    }
}
