const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Her isteğin yöntemini ve yolunu uçbirime yazdır (Ödev gereksinimi D1)
  console.log(`[${new Date().toISOString()}] ${method} ${req.url}`);

  // GET dışındaki yöntemler için 405 Method Not Allowed
  if (method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', 'Allow': 'GET' });
    res.end('405 Yalnızca GET yöntemi desteklenmektedir.');
    return;
  }

  // API Uç Noktaları
  if (pathname === '/api/etkinlikler') {
    fs.readFile(path.join(__dirname, 'etkinlikler.json'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ hata: 'Sunucu hatası' }));
        return;
      }

      let etkinlikler = JSON.parse(data);
      const turFiltresi = parsedUrl.query.tur;

      if (turFiltresi) {
        etkinlikler = etkinlikler.filter(e => e.tur === turFiltresi);
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(etkinlikler));
    });
    return;
  }

  // Tekil etkinlik isteği: /api/etkinlikler/:id
  const match = pathname.match(/^\/api\/etkinlikler\/(\d+)$/);
  if (match) {
    const id = parseInt(match[1], 10);
    fs.readFile(path.join(__dirname, 'etkinlikler.json'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ hata: 'Sunucu hatası' }));
        return;
      }

      const etkinlikler = JSON.parse(data);
      const etkinlik = etkinlikler.find(e => e.id === id);

      if (etkinlik) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(etkinlik));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ hata: 'Etkinlik bulunamadı' }));
      }
    });
    return;
  }

  // Statik Dosya Sunumu (public klasörü dışındakiler engellenmeli)
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(__dirname, 'public', filePath);

  // Güvenlik kontrolü: public klasörünün dışına çıkılmasını engelle
  const publicDir = path.join(__dirname, 'public');
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Yasaklı Erişim');
    return;
  }

  const extname = path.extname(filePath);
  let contentType = 'text/html; charset=utf-8';

  if (extname === '.css') {
    contentType = 'text/css; charset=utf-8';
  } else if (extname === '.js') {
    contentType = 'text/javascript; charset=utf-8';
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Sayfa Bulunamadı');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 İç Sunucu Hatası');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});
// Sunucu konfigürasyonu güncellendi
// Ek protokoller
