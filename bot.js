const puppeteer = require('puppeteer');
const jsdom = require("jsdom");
const {
  JSDOM
} = jsdom;
const { Telegraf } = require('telegraf');
const bot = new Telegraf("5748468540:AAGiLUhCu2ESADda6qbk9_eW6kSGcTWSivM");
var fs = require('fs');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

var verTitle = []

var pup = async () => {

  try {

    bot.telegram.sendMessage(5760605862,"Iniciando FreelaWebscrapper")
    console.log("Iniciando FreelaWebscrapper")

    let options = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
       ignoreDefaultArgs: ['--disable-extensions'],
    };

    let browser = await puppeteer.launch(options);
    var whitelist = [] 
    
    var array = fs.readFileSync('whitelist.txt').toString().split(",");
    for(i in array) {
      whitelist.push(array[i])
    }

    var t = 0;

    while (t < 1) {

      let page = await browser.newPage();
      let page2 = await browser.newPage();

      page.goto("https://www.workana.com/jobs?category=it-programming&language=pt&subcategory=web-development%2Cothers-5"),{
        waitUntil: 'networkidle2'
      };

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
        
        timeJobV = timeJobV.split(" ");
        jobTimeDay = timeJobV[0];
        jobTimeHour =  timeJobV[3];

        jobTimeHour = jobTimeHour.split(":");
        jobTimeH = jobTimeHour[0]-3;
        jobTimeM = jobTimeHour[1]
        
        if(jobTimeH <=9){jobTimeH="0"+jobTimeH}
        calcH = hour.split(":");
        calcHour = jobTimeH - calcH[0]
        calcM= calcH[1] - jobTimeM; 

        if(calcHour == "-1"){
        calcM = 60 - parseInt(jobTimeM) + parseInt(calcH[1]);         
        }       

        if(parseInt(jobTimeDay) == parseInt(dia) && verTitle.includes(titleJob[i].textContent) == false){
          if(parseInt(calcM) < 0){calcM = 0;}

          var titleFilter = titleJob[i].textContent
          var url =  "https://www.workana.com"+linkJob[i].href   
          
          titleFilter = titleFilter.toLowerCase()
      
          var filter = whitelist.some(t => titleFilter.includes(t));
         
          if(filter == true){
            console.log("Novo JOB: " + titleJob[i].textContent)
            bot.telegram.sendMessage(5760605862,url)
            verTitle.push(titleJob[i].textContent); 
          }
         }
      }       
      
      url = "";
      titleFilter = "";
      titleJob = []
      timeJob = []
      linkJob = []
      timeJobV = ""
      jobTimeDay = ""
      jobTimeHour = ""
      jobTimeH = ""
      jobTimeM = ""
      calcH = ""
      calcHour = ""
      calcM = ""
      
      page.close();
      page2.close();
      await delay(900000)     
    }

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = pup