# Yerel doğrulama — 24 Eylül 2026

- TypeScript denetimi ve Vite üretim derlemesi başarılı.
- `npm audit`: 0 güvenlik açığı. Kullanılmayan Sharp geliştirme paketi kaldırıldı.
- Derleme önizlemesi: http://127.0.0.1:5173/
- Masaüstü ve 390 px mobil tasarım görsel olarak incelendi. 320 px mobil proje penceresi de incelendi. 320/390 px genişlikte belge yatay taşma üretmedi.
- Mobil menünün açılması, bağlantı sonrası kapanması; tema geçişi ve yeniden yüklemede korunması; proje seçimi/filtreleme; detay penceresi; Escape ile kapanma; ekran galerisi; yaklaşım adımları; teknoloji sekmeleri; sertifika açılımı; e-posta kopyalama doğrulandı.
- Revizyon: Remotion tanıtımı ve paketleri kaldırıldı. Üst logo, yeşil durum noktaları ve işlevsiz çapraz oklar kaldırıldı. Koyu tema varsayılan yapıldı. Footer animasyonu, başlıktan ayrı ve taşması kırpılan bir alana alındı.
- Revizyon sonrası üretim derlemesi başarılı; masaüstü ve 390 px mobilde footer çizgilerinin başlığa ulaşmadığı doğrulandı. DOM kontrolünde işlevsiz çapraz ok, durum noktası, üst logo ve tanıtım bileşeni kalmadı. Mobil menü çalışıyor; yatay taşma yok.
- Hareket azaltma desteği kod ve CSS düzeyinde mevcut; işletim sistemi tercihi değiştirilerek ayrı bir cihaz testi yapılmadı.
- Geliştirme sunucusu (`dev`) bu sandbox'ta esbuild üst dizin erişim hatası veriyor. Üretim derlemesi/önizlemesi bu sorundan etkilenmiyor.
- Gerçek iOS/Android cihaz, canlı dağıtım, harici iletişim uygulamaları ve mesaj gönderimi test edilmedi.
- GitHub push, commit veya canlı dağıtım yapılmadı. Klasör kaynak dosyalardan hazırlanmıştır; Git klonu değildir.
