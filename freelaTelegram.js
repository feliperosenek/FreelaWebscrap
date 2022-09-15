const puppeteer = require('puppeteer');
const jsdom = require("jsdom");
const {
  JSDOM
} = jsdom;
const https = require("https")
var cmd = require('node-cmd');
const { Console } = require('console');
const api = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const { ifError } = require('assert');
const { Telegraf } = require('telegraf');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function freelaWebscrap() {

  try {
    let options = {
      defaultViewport: {
        width: 1366,
        height: 768,
      },
      headless: true,
    };

    const bot = new Telegraf("5748468540:AAGiLUhCu2ESADda6qbk9_eW6kSGcTWSivM");

    let browser = await puppeteer.launch(options);
    let newJob = 0;
    var arrayDescJob = [];
    var arrayLinkJob = [];
    var arrayTimeJob = [];
    var arrayTitleJob = [];
    var whitelist = []

    var fs = require('fs');
    var array = fs.readFileSync('whitelist.txt').toString().split(",");
    for(i in array) {
      whitelist.push(array[i])
    }

    var t = 0;
    while (t < 1) {

      let page = await browser.newPage();
      let page2 = await browser.newPage();

      page.goto("https://www.workana.com/jobs?category=it-programming&has_few_bids=1&language=pt&subcategory=web-development%2Cwordpress-1%2Cothers-5");
      await delay(10000)

      pageData = await page.evaluate(() => document.querySelector('*').outerHTML);
      dom = new JSDOM(pageData);

      titleJob = dom.window.document.querySelectorAll(".h3.project-title");
      timeJob = dom.window.document.querySelectorAll("span[class='date']");
      descJob = dom.window.document.querySelectorAll(".html-desc.project-details");
      linkJob = dom.window.document.querySelectorAll(".h3.project-title > a");

            var timestamp = new Date();
            var dia = timestamp.getDate();
            var hora = timestamp.getHours()
            var minuto = timestamp.getMinutes()

            if(hora <=9){hora="0"+hora}
            if(minuto <=9){minuto="0"+minuto}
            if(dia <=9){dia="0"+dia}
            var hour = hora+":"+minuto;    
     
      for (var i = 0; i < titleJob.length; i++) {
        
        timeJobV = timeJob[i].title;
        timeJobV = timeJobV.split("de");
        jobTimeDay = timeJobV[0];
        jobTimeHour =  timeJobV[2];
        jobTimeHour = jobTimeHour.split(" ")

        jobTimeHour = jobTimeHour[2].split(":");
        jobTimeH = jobTimeHour[0]-3;
        jobTimeM = jobTimeHour[1]
        
        if(jobTimeH <=9){jobTimeH="0"+jobTimeH}
        calcH = hour.split(":");
        calcHour = jobTimeH - calcH[0]
        calcM= calcH[1] - jobTimeM; 

        if(calcHour == "-1"){
        calcM = 60 - parseInt(jobTimeM) + parseInt(calcH[1]);         
        }

        if(parseInt(jobTimeDay) == parseInt(dia) && parseInt(calcM) < 15){
          if(parseInt(calcM) < 0){calcM = 0;}
      
          arrayTitleJob.push(titleJob[i].textContent);
          arrayTimeJob.push(calcM);
          arrayDescJob.push(descJob[i].textContent);
          arrayLinkJob.push(linkJob[i].href)

          var titleFilter = titleJob[i].textContent
          var descFilter = descJob[i].textContent
          var url =  "https://www.workana.com/"+linkJob[i].href   
          
          titleFilter = titleFilter.toLowerCase()
      
          var filter = whitelist.some(t => titleFilter.includes(t));
         
          if(filter == true){
            bot.telegram.sendMessage(5760605862,url)
          }

                    
         }
      }
   
      
      page.close();
      page2.close();
      await delay(900000)

    }

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

freelaWebscrap();