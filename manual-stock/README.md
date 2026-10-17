# PrimeVisa Master Stock bağlantısı

Bu bağlantı yalnızca Master Stock'taki mevcut durumları okur. Firma kaynaklarını taramaz ve ana tabloyu değiştirmez.

1. PrimeVisa Property Master Google tablosunda Uzantılar → Apps Script'i açın.
2. Bu klasördeki Code.gs içeriğini yeni bir betik dosyasına ekleyip kaydedin. Mevcut betikleri silmeyin.
3. Dağıt → Yeni dağıtım → Web uygulaması. Çalıştıran: Ben. Erişim: Herkes. Google'ın hesap izin adımlarını tamamlayın.
4. /exec ile biten web uygulaması URL'sini kopyalayın.
5. Haritada Güncel Stok düğmesine basıp bu adresi girin.

Yalnızca ünite kimliği ve durum dışarı verilir; komisyon ve müşteri sütunları verilmez. Ana dosyanın paylaşım ayarını değiştirmeyin. Bu web uygulaması URL'sine sahip olanlar dışarı verilen durumları okuyabilir.

Kontrol haritada açık oturumdaki tüm kayıtları eşleştirir; eksik, tekrarlanan veya tanınmayan durum varsa güncellemez ve yeşil yanmaz. Başarılı kontrolde kartlar, pinler ve bonus filtresi yenilenir. Güncelleme açık harita oturumuna aittir; karşılaştırma/PDF ve kalıcı yayımlanmış stok saatlik süreçten beslenmeye devam eder. Ana tablonun eski olabileceğini unutmayın. Yeşil renk firma teyidini değil, ana tablonun başarıyla okunmasını ifade eder.
