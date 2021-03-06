﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }
        public PartialViewResult SideBar()
        {
            return PartialView("_SideBar");
        }
        public PartialViewResult SelectedMenu()
        {
            return PartialView("_SelectedMenu");
        }
        public PartialViewResult MenuPodcast()
        {
            return PartialView("_MenuPodcast");
        }
    }
}
