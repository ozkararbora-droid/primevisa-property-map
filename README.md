# PrimeVisa Yunanistan Emlak Haritası

GitHub Pages için hazır paket. `index.html` uygulamadır; `data.json` güncel PrimeVisa Property Master verisidir. Uygulama her açılışta `data.json` dosyasını `no-store` ile yeniden yükler. Yayımdan önce tam dosya doğrulanır. `data.last-good.json` son sağlam portföydür; harita ve teklif, ana dosya okunamazsa tarihli uyarıyla bu kopyayı açar. Kontrol: `node --test manual-stock/portfolio.test.cjs`.

Filtreler: bölge/proje/adres, fiyat, durum, firma, toplam m², yatak odası, Golden Visa ve en geç teslim. Atina merkeze ve denize uzaklık filtreleri kaldırılmıştır.
