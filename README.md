# Burak Alp Yahşi — Türkçe portfolyo

Burak Alp Yahşi için yerel portfolyo yenilemesi. React, TypeScript, Vite ve Motion kullanır. GitHub'a gönderilmedi; canlı site değiştirilmedi. Varsayılan tema koyudur; kullanıcı açık temayı seçerse tercihi korunur.

## Çalıştırma

Node.js 22 veya daha yeni desteklenen bir sürüm ile bu klasörde terminal aç:

```powershell
npm.cmd ci --cache ./work/npm-cache
npm.cmd run dev
```

Adres: http://127.0.0.1:5173/

```powershell
npm.cmd run build
npm.cmd run preview
```

Derleme `dist/` klasörüne çıkar. 5173 portunda mevcut önizleme çalışıyorsa ikinci sunucu için `npm.cmd run dev -- --port 5174` kullanılabilir.

Bu Codex oturumunun Windows sandbox'ında `dev` komutunun bağımlılık taraması üst dizin erişimi nedeniyle engellendi. Üretim derlemesi ve `preview` doğrulandı. Aynı hatayı görürsen `npm.cmd run build` ardından `npm.cmd run preview` kullan; kaynak değişikliğinden sonra yeniden derle ve tarayıcıyı yenile. `ONIZLE.cmd` bu iki adımı çalıştırır. Geliştirme sunucusunun normal Windows terminalinde çalışması ayrıca doğrulanmalıdır.

## Ön render (JS'siz içerik) ve SEO

`npm run build` önce istemci paketini derler, sonra `src/entry-server.tsx` ile sayfayı sunucu tarafında render eder ve `scripts/prerender.mjs` bu HTML'i `dist/index.html` içine yazar. Tarayıcı bu HTML'i `hydrateRoot` ile devralır. Böylece JavaScript çalıştırmayan tarayıcılar, bağlantı önizlemeleri ve tarayıcı botları tüm içeriği görür. `index.html` içinde canonical, Open Graph/Twitter etiketleri, `og.png` ve Person yapılandırılmış verisi; `public/` içinde `robots.txt` ve `sitemap.xml` bulunur.

## İçerik ve tasarım

- `src/data.ts`: hizmet kategorileri, projeler, deneyim ve sertifikalar. Hizmet metinleri, maddeleri ve örnek proje bağlantıları `services` dizisindedir.
- `src/App.tsx`: Türkçe sayfa bölümleri, proje filtreleri ve detay penceresi.
- `src/style.css`: renkler, tipografi, açık/koyu tema ve responsive düzen.
- `src/components/motion.tsx`: 21st.dev üzerinden seçilen dört animasyonun uyarlaması.
- `src/components/effects.tsx`: hero arka planındaki parçacık girdabı (21st.dev Aether Vortex uyarlaması), cam kartlardaki spotlight için pointer dinleyicisi ve kaydırma çubuğu. Girdap hareket azaltma tercihinde tek kare çizer; ekran dışında ve arka plan sekmesinde durur. Hero zemini CSS gradyan + SVG gren dokusudur.
- `public/images/`: orijinal portfolyodaki altı gerçek ReviewMS ekran görüntüsünün WebP sürümleri. Ürün ekranlarının kendi İngilizce metinleri korunmuştur; site arayüzü Türkçedir.

Hero: satır girişleri ve değiştirilebilir ürün vitrini. Projeler: kaydırmaya bağlı perspektif, kategori filtreleri ve ekran galerisi. Yaklaşım: etkileşimli dört adım. Deneyim: dolan zaman çizgisi. Hakkımda: kelime bazlı görünürlük ve teknoloji sekmeleri. İletişim: başlığın üstünde sınırlandırılmış SVG çizgileri ve e-posta kopyalama. Üst logo, işlevsiz dekoratif oklar ve yeşil durum noktaları kaldırıldı. Remotion tanıtımı, bileşen dosyası ve npm bağımlılıkları kaldırıldı.

Klavye odağı, Escape ile kapanan diyalog/menü, hareket azaltma tercihi ve ekran okuyucu etiketleri bulunur. Yazı tipleri yerelden sunulur; analitik, form servisi veya gizli anahtar gerektirmez.

## Kaynak ve teslim sınırı

İçerik kaynağı: https://github.com/itszeang/portfolio

İncelenen kaynak commit: `192ebd8cf484ddea549b588db5c6f3a83afdde30`.

Bu ortamda Git HTTPS yardımcı programı çalışmadığı için kaynak dosyası GitHub'dan indirildi; bu klasör bir Git klonu değildir ve Git geçmişi içermez. Orijinal HTML `work/original-index.html` içinde korunur. Yayınlama veya GitHub'a taşıma ayrı bir adımdır. `node_modules/`, `dist/`, `work/` ve yerel skill dosyaları kaynak teslimi için gerekli değildir.

21st.dev bileşenleri ve lisans bilgileri için `THIRD_PARTY_NOTICES.md` dosyasına bak.
