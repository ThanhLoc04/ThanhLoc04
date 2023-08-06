const { spawn } = require("child_process");
const chalkercli = require('chalkercli');
const { readFileSync } = require("fs-extra");
const http = require("http");
const axios = require("axios");
const semver = require("semver");
const logger = require("./utils/log");
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
// 
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  
  app.listen(port);
  console.log('Server đang chạy tại http://localhost:' + port);
  
  logger("BOT P-CODER Xin chào mọi người", "🛠 VN");
  logger("Liên hệ Facebook: https://www.facebook.com/", "Facebook");
  logger("Liên hệ Zalo: https://zalo.me/0372893007", "Zalo");
  logger("Donate momo: 0372893007 - tpbank : ... ", "DONATE");
  logger("Xin chú ý đây là file của Thanh Lộc", "CRE");
  
  const rainbow = chalkercli.rainbow('\n[=== 𝐒𝐄𝐓𝐓𝐈𝐍𝐆 𝐁𝐎𝐓 PCODER ===]\n').stop();
  rainbow.render();
  const frame = rainbow.frame(); 
  console.log(frame);
  logger("BOT THANH LỘC ĐÃ KHỞI TẠO THÀNH CÔNG", "BOT THANH LỘC");
  
  function startBot(message) {
    if (message) {
      logger(message, "BOT THANH LỘC ĐANG KHỞI ĐỘNG");
    }
  
    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "pcoder.js"], {
      cwd: __dirname,
      stdio: "inherit",
      shell: true
    });
  
    child.on("close", async (codeExit) => {
      var x = 'codeExit'.replace('codeExit', codeExit);
      if (codeExit == 1) {
        return startBot("BOT ĐANG KHỞI ĐỘNG LẠI!!!");
      } else if (x.indexOf(2) == 0) {
        await new Promise(resolve => setTimeout(resolve, parseInt(x.replace(2, '')) * 1000));
        startBot("Bot đã được kích hoạt, vui lòng đợi một chút!!!");
      } else {
        return;
      }
    });
  
    child.on("error", function (error) {
      logger("Đã xảy ra lỗi: " + JSON.stringify(error), "Khởi động");
    });
  }
  
  axios.get("https://raw.githubusercontent.com/Kenne400k/mirai/main/package.json")
    .then((res) => {
      logger(res['data']['name'], "[ TÊN PR0JECT ]");
      logger("Phiên bản: " + res['data']['version'], "[ PHIÊN BẢN ]");
      logger(res['data']['description'], "[ LƯU Ý ]");
    });

  startBot();
  
  const config = {
    status: true,
    name: 'P PROJECT'
  };
  
  function checkHost() {
    if (config.status === false) {
      return;
    }
  
    const username = process.env.REPL_OWNER;
    if (username !== undefined) {
      const urlRepl = `https://${process.env.REPL_SLUG}.${username}.repl.co`;
      logger('Bạn đang chạy bot ở đường dẫn: ' + urlRepl, 'KIỂM TRA HOST');
      if (process.env.REPLIT_CLUSTER === 'hacker') {
        logger('Bạn đang sử dụng Replit Hacker, hãy đảm bảo bật "Always On" để BOT luôn chạy!', 'KIỂM TRA HOST');
      } else {
        logger('Bạn đang sử dụng Replit thông thường, hệ thống sẽ tự động kết nối với UptimeRobot cho bạn!', 'KIỂM TRA HOST');
        connectUptime(urlRepl, username);
      }
    }
  }
  
  async function connectUptime(url, name) {
    try {
      const response = await axios.get(`https://docs-api.catteam123.repl.co/uptimerobot?url=${url}&key=${username}&monitor=${config.name}`);
      logger('Đã kết nối Uptime thành công!', 'UPTIME');
    } catch (error) {
      logger('Server Uptime gặp sự cố, không thể bật uptime cho bạn!', 'UPTIME');
    }
  }
  
  checkHost();
  
  // ----- Phần mới được thêm vào -----
  
  axios.get("https://raw.githubusercontent.com/Kenne400k/ver/main/Filever")
    .then((res) => {
      if (res.data["filev1"] !== config.version) {
        console.log("- Pcoder: đã có phiên bản mới xin vui lòng liên hệ qua zalo hoặc fb để trên");
      }
    });
  
  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }
  
  function performCalculation(num1, num2) {
    return num1 + num2;
  }
  
  function printResult(result) {
    console.log("Kết quả tính toán: " + result);
  }
  
  const randomNumber1 = generateRandomNumber();
  const randomNumber2 = generateRandomNumber();
  const sum = performCalculation(randomNumber1, randomNumber2);
  printResult(sum);
  
  // -------------------------------