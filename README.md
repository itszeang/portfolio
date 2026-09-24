# Burak Alp Yahşi — portfolyo

React, TypeScript ve Vite. Şu an **tasarımsız iskelet** hâlinde: sayfa, tüm içeriği sade HTML olarak basıyor. Yeni tasarım bunun üzerine kurulacak.

## İçerik tek yerde

Sitedeki her metin, bağlantı ve görsel yolu `src/content.ts` dosyasında:

| Bölüm | Ne var |
|---|---|
| `site` | Başlık, açıklama, alan adı, telif satırı |
| `person` | Selamlama, ana başlık, tanıtım, biyografi, diller, müsaitlik |
| `contact`, `socials` | E-posta, telefon, GitHub (iki hesap), X |
| `services` | Hizmet kategorileri: kapsam, hedef kitle, örnek proje |
| `projects`, `otherWork` | ReviewMS, Boyut Atla, OfflineScholar, ARKUN + diğer repolar; canlı ve kaynak kodu bağlantıları, ReviewMS ekran görüntüleri |
| `approach` | Çalışma yaklaşımı, 4 adım |
| `experience`, `education`, `certificates`, `stack` | Deneyim, eğitim, sertifikalar, teknolojiler |
| `ui` | Buton ve küçük etiket yazıları |
| `archive` | Önceki tasarımlarda kullanılıp çıkarılan metinler |

Görseller `public/images/` içinde. SEO etiketleri ve yapılandırılmış veri `index.html` içinde (içerik değişirse orayı da güncelle).

## Altyapı (tasarımdan bağımsız, korunuyor)

- `npm run build`: istemci paketini derler, sayfayı sunucu tarafında render edip `dist/index.html` içine yazar (`src/entry-server.tsx`, `scripts/prerender.mjs`). JavaScript olmadan da tüm içerik görünür.
- `public/robots.txt`, `public/sitemap.xml`, `public/og.png` (paylaşım görseli; yeni tasarıma göre yenilenmeli).
- Yazı tipi: Geist ve Geist Mono (`@fontsource-variable`).

## Çalıştırma

```bash
npm ci
npm run dev        # http://127.0.0.1:5173
npm run build && npm run preview
```

## Önceki tasarım

Silinen cam efektli tasarım (parçacık girdabı, cam butonlar, dock, hizmet sekmeleri) git geçmişinde `958a703` commit'inde duruyor. Bir parçasını geri almak için: `git show 958a703:src/components/dock.tsx`.
