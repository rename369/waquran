const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const { body, validationResult } = require('express-validator');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const fs = require('fs');
var moment = require('moment');
const axios = require('axios');
const fetch = require('node-fetch');
var sleep = require('system-sleep');
const port = process.env.PORT || 443;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

require('events').EventEmitter.defaultMaxListeners = 17;

////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// WHATSAPP /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('message', async msg => {
  // ambil kontak
    const contact = await msg.getContact();
    const kontak = `${contact.number}`;

  // ambil body wa
    const keyword = msg.body.toLowerCase();

  // ambil konten di txt
    const satu = keyword.split('.', 1).pop(); // folder
    const dua  = keyword.split('.', 2).pop(); // surat
    const tiga = keyword.split('.', 3).pop(); // ayat

  //sleep
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    var waktuSleep = Math.floor((Math.random() * 2000) + 1000);

  // reply
    if (satu === 'salam') {
      // kirim
      var quran_error = 'quran_data/salam.txt';
      const data = fs.readFileSync(quran_error, 'utf8');
      msg.reply(data);

      // laporan
      var waktu_log = moment().format('YYYY-MM-DD hh:mm:ss')
      var pesan_lap = "WAQU - 3 : " + kontak + " : " + keyword + " : " + waktu_log + "\r\n";
      fs.appendFile('quran_data/log.txt', pesan_lap, function (err) {if (err) return console.log(err);});
      
      // console
      console.log("Keyword salam, tulis log : " + pesan_lap);
    } else if (satu === 'info') {
      // kirim
      var quran_error = 'quran_data/info.txt';
      const data = fs.readFileSync(quran_error, 'utf8');
      msg.reply(data);

      // laporan
      var waktu_log = moment().format('YYYY-MM-DD hh:mm:ss')
      var pesan_lap = "WAQU - 3 : " + kontak + " : " + keyword + " : " + waktu_log + "\r\n";
      fs.appendFile('quran_data/log.txt', pesan_lap, function (err) {if (err) return console.log(err);});
      
      // console
      console.log("Keyword info, tulis log : " + pesan_lap);
    } if (satu === 'surah') {
      // kirim
      var quran_error = 'quran_data/surah.txt';
      const data = fs.readFileSync(quran_error, 'utf8');
      msg.reply(data);

      // laporan
      var waktu_log = moment().format('YYYY-MM-DD hh:mm:ss')
      var pesan_lap = "WAQU - 3 : " + kontak + " : " + keyword + " : " + waktu_log + "\r\n";
      fs.appendFile('quran_data/log.txt', pesan_lap, function (err) {if (err) return console.log(err);});
      
      // console
      console.log("Keyword surah, tulis log : " + pesan_lap);
    } else if (satu === 'lengkap') {
    // jika satu adalah lengkap
      // selalu 3 digit number
      function digitNumber(value, padding) {
        var zeroes = new Array(padding+1).join("0");
        return (zeroes + value).slice(-padding);
      }
      const surat = digitNumber(dua,3);
      const ayat = digitNumber(tiga,3);
      try {
        // kirim judul
        var quran_data = 'quran_data/ayat/' + dua + '/name.latin.txt';
        const data_judul = fs.readFileSync(quran_data, 'utf8');
        msg.reply(data_judul + 'ayat : (' + tiga + ')');

        await sleep(waktuSleep);

        // kirim ayat
        var quran_data = 'quran_data/ayat/' + dua + '/' + tiga + '.txt';
        const data_ayat = fs.readFileSync(quran_data, 'utf8');
        msg.reply(data_ayat);

        await sleep(waktuSleep);

        // kirim terjemah
        var quran_data = 'quran_data/terjemah/' + dua + '/' + tiga + '.txt';
        const data_terjemah = fs.readFileSync(quran_data, 'utf8');
        msg.reply(data_terjemah);

        await sleep(waktuSleep);

        // kirim tafsir
        var quran_data = 'quran_data/tafsir/' + dua + '/' + tiga + '.txt';
        const data_tafsir_plain = fs.readFileSync(quran_data, 'utf8');

        // ganti \n dengan newline (enter)
        function nl2br(str){
          return str.replace(/\\n/g, `
`);
        }
        var data_tafsir=nl2br(data_tafsir_plain);
        msg.reply(data_tafsir);

        await sleep(waktuSleep);

        // kirim suara
        const fileUrl = 'https://everyayah.com/data/Alafasy_128kbps/' + surat + ayat + '.mp3';
        let mimetype;
        const attachment = await axios.get(fileUrl, {
          responseType: 'arraybuffer'
        }).then(response => {
          mimetype = response.headers['content-type'];
          return response.data.toString('base64');
        });
        const media = new MessageMedia(mimetype, attachment, 'Media');
        msg.reply(media);

        // laporan
        var waktu_log = moment().format('YYYY-MM-DD hh:mm:ss')
        var pesan_lap = "WAQU - 1 : " + kontak + " : " + keyword + " : " + waktu_log + "\r\n";
        fs.appendFile('quran_data/log.txt', pesan_lap, function (err) {if (err) return console.log(err);});
        
        // console
        console.log("Keyword lengkap, tulis log : " + pesan_lap);
      } catch (err) {
        // // kirim
        // var quran_error = 'quran_data/error.txt';
        // const data = fs.readFileSync(quran_error, 'utf8');
        // msg.reply(data);

        // // laporan
        // var waktu_log = moment().format('YYYY-MM-DD hh:mm:ss')
        // var pesan_lap = "WAQU - 0 : " + kontak + " : " + keyword + " : " + waktu_log + "\r\n";
        // fs.appendFile('quran_data/log.txt', pesan_lap, function (err) {if (err) return console.log(err);});
        
        // // console
        // console.log("Keyword salah, tulis log : " + pesan_lap);
      }
    } else if (satu === 'baca') {
    // jika satu adalah baca
      // selalu 3 digit number
      function digitNumber(value, padding) {
        var zeroes = new Array(padding+1).join("0");
        return (zeroes + value).slice(-padding);
      }
      const surat = digitNumber(dua,3);
      const ayat = digitNumber(tiga,3);
      try {
        // kirim judul
        var quran_data = 'quran_data/ayat/' + dua + '/name.latin.txt';
        const data_judul = fs.readFileSync(quran_data, 'utf8');
        msg.reply(data_judul + 'ayat : (' + tiga + ')');

        await sleep(waktuSleep);

        // kirim
        const fileUrl = 'https://everyayah.com/data/Alafasy_128kbps/' + surat + ayat + '.mp3';
        let mimetype;
        const attachment = await axios.get(fileUrl, {
          responseType: 'arraybuffer'
        }).then(response => {
          mimetype = response.headers['content-type'];
          return response.data.toString('base64');
        });
        const media = new MessageMedia(mimetype, attachment, 'Media');
        msg.reply(media);

        // laporan
        var waktu_log = moment().format('YYYY-MM-DD hh:mm:ss')
        var pesan_lap = "WAQU - 1 : " + kontak + " : " + keyword + " : " + waktu_log + "\r\n";
        fs.appendFile('quran_data/log.txt', pesan_lap, function (err) {if (err) return console.log(err);});
        
        // console
        console.log("Keyword baca, tulis log : " + pesan_lap);
      } catch (err) {
        // // kirim
        // var quran_error = 'quran_data/error.txt';
        // const data = fs.readFileSync(quran_error, 'utf8');
        // msg.reply(data);

        // // laporan
        // var waktu_log = moment().format('YYYY-MM-DD hh:mm:ss')
        // var pesan_lap = "WAQU - 0 : " + kontak + " : " + keyword + " : " + waktu_log + "\r\n";
        // fs.appendFile('quran_data/log.txt', pesan_lap, function (err) {if (err) return console.log(err);});
        
        // // console
        // console.log("Keyword salah, tulis log : " + pesan_lap);
      }
    } else if (satu === 'ayat' || satu === 'terjemah' || satu === 'tafsir') {
    // selain itu
      try {
        // kirim judul
        var quran_data = 'quran_data/ayat/' + dua + '/name.latin.txt';
        const data_judul = fs.readFileSync(quran_data, 'utf8');
        msg.reply(data_judul + 'ayat : (' + tiga + ')');

        await sleep(waktuSleep);

        // folder
        function folderSatu(str){
          return str.replace(`!`, ``);
        }
        var folder=folderSatu(satu);

        // kirim
        var quran_data = 'quran_data/' + folder + '/' + dua + '/' + tiga + '.txt';
        const dataPlain = fs.readFileSync(quran_data, 'utf8');

        // ganti \n dengan newline (enter)
        function nl2br(str){
          return str.replace(/\\n/g, `
`);
        }
        var data=nl2br(dataPlain);

        msg.reply(data);

        // laporan
        var waktu_log = moment().format('YYYY-MM-DD hh:mm:ss')
        var pesan_lap = "WAQU - 1 : " + kontak + " : " + keyword + " : " + waktu_log + "\r\n";
        fs.appendFile('quran_data/log.txt', pesan_lap, function (err) {if (err) return console.log(err);});
        
        // console
        console.log("Keyword " + satu + ", tulis log : " + pesan_lap);
      } catch (err) {
        // // kirim
        // var quran_error = 'quran_data/error.txt';
        // const data = fs.readFileSync(quran_error, 'utf8');
        // msg.reply(data);

        // // laporan
        // var waktu_log = moment().format('YYYY-MM-DD hh:mm:ss')
        // var pesan_lap = "WAQU - 0 : " + kontak + " : " + keyword + " : " + waktu_log + "\r\n";
        // fs.appendFile('quran_data/log.txt', pesan_lap, function (err) {if (err) return console.log(err);});
        
        // // console
        // console.log("Keyword salah, tulis log : " + pesan_lap);
      }
    } else if (satu === 'hadis' && dua!=='hadis' && tiga!=='hadis') {
      try {
        // ambil API
          const response = await fetch('https://wahadis-rename369.vercel.app/hadis/'+dua+'/'+tiga);
          const body = await response.text();
          var obj = JSON.parse(body);
          var hadisname = obj.name;
          var hadisnumber = obj.number;
          var hadisarab = obj.arab;
          var hadisid = obj.id;

          msg.reply(hadisname+" ("+hadisnumber+")");
          await sleep(waktuSleep);
          msg.reply(hadisarab);
          await sleep(waktuSleep);
          msg.reply(hadisid);

          // laporan
          var waktu_log = moment().format('YYYY-MM-DD hh:mm:ss')
          var pesan_lap = "WAHA - 1 : " + kontak + " : " + keyword + " : " + waktu_log + "\r\n";
          fs.appendFile('quran_data/log.txt', pesan_lap, function (err) {if (err) return console.log(err);});

          console.log("Keyword " + satu + ", tulis log : " + pesan_lap);
      } catch (err) {
      }
    } else if (satu === 'perawi') {
      // kirim
      var quran_error = 'quran_data/perawi.txt';
      const data = fs.readFileSync(quran_error, 'utf8');
      msg.reply(data);

      // laporan
      var waktu_log = moment().format('YYYY-MM-DD hh:mm:ss')
      var pesan_lap = "WAQU - 2 : " + kontak + " : " + keyword + " : " + waktu_log + "\r\n";
      fs.appendFile('quran_data/log.txt', pesan_lap, function (err) {if (err) return console.log(err);});
      
      // console
      console.log("Keyword perawi, tulis log : " + pesan_lap);
    } else {
      // do nothing
    }

});

/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// WHATSAPP OTENTIKASI ////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

client.initialize();

// Socket IO
io.on('connection', function(socket) {
  socket.emit('message', 'Membuat koneksi...');

  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', 'QR Code diterima!');
    });
  });

  client.on('ready', () => {
    socket.emit('ready', 'Whatsapp siap digunakan!');
    socket.emit('message', 'Whatsapp siap digunakan!');
  });

  client.on('authenticated', (session) => {
    socket.emit('authenticated', 'Whatsapp authenticated!');
    socket.emit('message', 'Whatsapp authenticated!');
    console.log('Session berhasil dibuat');
  });

  client.on('auth_failure', function(session) {
    socket.emit('message', 'Auth gagal, melakukan restart...');
  });

  client.on('disconnected', (reason) => {
    socket.emit('message', 'Whatsapp disconnected!');
    fs.unlinkSync(SESSION_FILE_PATH, function(err) {
        if(err) return console.log(err);
        console.log('Session file dihapus!');
    });
    client.destroy();
    client.initialize();
  });
});

const checkRegisteredNumber = async function(number) {
  const isRegistered = await client.isRegisteredUser(number);
  return isRegistered;
}

// Send message
app.post('/send-message', [
  body('number').notEmpty(),
  body('message').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
    console.log('Kosong!');
  }

  const number_user = req.body.number;
  const number = '6285708576037@c.us';
  const tambahan = req.body.message.replace(/<br>/g, "\n");
  const message =  number_user + "\n\n" + tambahan;

  client.sendMessage(number, message).then(response => {
    // kirim
    res.status(200).json({
      status: true,
      response: response
    });
    console.log('Chat Web terkirim');
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

server.listen(port, function() {
  console.log('Bot berjalan pada port : ' + port);
});
