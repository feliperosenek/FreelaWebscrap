const cheerio = require("cheerio")
const axios = require("axios")
const fs = require('fs');
const { Telegraf } = require('telegraf');
const bot = new Telegraf("5748468540:AAGiLUhCu2ESADda6qbk9_eW6kSGcTWSivM");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


const fetchData = async (url) => {
  const result = await axios.get(url)
  return result.data
}

var whitelist = []

var array = fs.readFileSync('whitelist.txt').toString().split(",");
for (i in array) {
  whitelist.push(array[i])
}

const main = async () => {
  const content = await fetchData("https://www.workana.com/jobs?category=it-programming&has_few_bids=1&language=pt&subcategory=web-development%2Cwordpress-1%2Cothers-5")

  const $ = cheerio.load(content)

  console.log("Iniciando Freelawebscrap")

  var linkjob = ""
  var titleJob = ""
  var linkJob = []
  var titleJob = []
  var timeJob = []

  var t = 0;

  while (t < 1) {

  $(".h3.project-title").each((i, e) => {
    titles = $(e).find('span').text()
    titleJob.push(titles)
  });

  $(".project-main-details").each((i, e) => {
    times = $(e).find("span[class='date']").attr("title")
    timeJob.push(times)
  });

  $(".h3.project-title").each((i, e) => {
    linkjob = "https://www.workana.com" + $(e).find('a').attr('href')
    linkJob.push(linkjob)
  });

  var timestamp = new Date();
  var dia = timestamp.getDate();
  var hora = timestamp.getHours()
  var minuto = timestamp.getMinutes()

  if (hora <= 9) { hora = "0" + hora }
  if (minuto <= 9) { minuto = "0" + minuto }
  if (dia <= 9) { dia = "0" + dia }
  var hour = hora + ":" + minuto;

  console.log("Procurando novos jobs")

  for (var i = 0; i < titleJob.length; i++) {

    timeJobV = timeJob[i];
    timeJobV = timeJobV.split("de");
    jobTimeDay = timeJobV[0];
    jobTimeHour = timeJobV[2];



    jobTimeHour = jobTimeHour.split(" ");
    jobTimeHour = jobTimeHour[2].split(":")
    jobTimeH = jobTimeHour[0] - 3;
    jobTimeM = jobTimeHour[1]    

    if (jobTimeH <= 9) { jobTimeH = "0" + jobTimeH }

    calcH = hour.split(":");
    calcHour = jobTimeH - calcH[0]
    calcM = calcH[1] - jobTimeM;



    if (calcHour == "-1") {
      calcM = 60 - parseInt(jobTimeM) + parseInt(calcH[1]);
    }

    console.log(calcM)

    if (parseInt(jobTimeDay) == parseInt(dia) && parseInt(calcM) < 15) {
      if (parseInt(calcM) < 0) { calcM = 0; }

      var titleFilter = titleJob[i]
      var url = linkJob[i]

      titleFilter = titleFilter.toLowerCase()

      var filter = whitelist.some(t => titleFilter.includes(t));

      if (filter == true) {
        console.log("Novo JOB: " + titleJob[i])
      //  bot.telegram.sendMessage(5760605862, url)
        
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

  console.log("Aguardando nova pesquisa...")

  await delay(900000)

  }
}

main()