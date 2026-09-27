# Firebase'i Ücretsiz Kotada Tutmak

Spark (ücretsiz) planda kredi kartı yok, yani sürpriz fatura da yok: kota dolarsa o gün
istekler reddedilir. Hedef, kotaya hiç yaklaşmamak.

> Kota rakamları zamanla değişebilir; güncel değerleri Firebase fiyatlandırma sayfasından kontrol edin.
> Yazıldığı dönemde Firestore için günlük yaklaşık 50K okuma, 20K yazma, 20K silme ve 1 GiB depolama ücretsizdi.

## Projede zaten yapılanlar

| Önlem | Nerede | Kazanç |
|---|---|---|
| Offline persistence + 50 MB önbellek | `lib/firebase/index.ts` | Tekrar okumalar cihazdan gelir |
| Önce önbellek, sonra sunucu okuma | `getDocCacheFirst` | Önbellekten okuma kotadan düşmez |
| React Query `staleTime` | `QueryProvider.tsx` | Ekran değişiminde tekrar sorgu yok |
| Uygulama öne gelince yeniden çekme kapalı | `refetchOnWindowFocus: false` | Gereksiz okuma yok |
| Profil sadece ilk kayıtta yazılıyor | `ensureUserProfile` | Her girişte yazma yok |
| Auth durumu Firestore'dan değil Auth'tan | `AuthProvider` | Auth dinleyicisi ücretsiz |
| Sıkı güvenlik kuralları, `list` kapalı | `firestore.rules` | Kötüye kullanımla kota eritilemez |
| Dev ortamında emülatör | `.env` | Geliştirme hiç kota harcamaz |
| Ayrı dev ve prod projeleri | README | Test verisi prod kotasını yemez |

## Kod yazarken uyulacak kurallar

1. **Her liste sorgusunda `limit()`**. Varsayılan `DEFAULT_PAGE_SIZE = 20`. Sonsuz kaydırmada `startAfter` ile sayfalayın.
2. **`onSnapshot` sadece gerçekten canlı olması gereken yerde.** Tek seferlik veri için `getDoc`/`getDocs`. Dinleyiciyi `useEffect` cleanup'ında mutlaka kapatın.
3. **Sayım için `getCountFromServer`** kullanın; dokümanları çekip `length` almayın (1000 doküman = 1000 okuma, count ise çok daha ucuz).
4. **Denormalize edin.** Bir listede kullanıcı adı gösterecekseniz her satır için `users` dokümanı okumayın; adı zaten o dokümana yazın.
5. **Sık değişen sayaçları tek dokümanda tutmayın** (saniyede 1 yazma sınırı). Gerekirse dağıtık sayaç.
6. **Toplu yazmalar için `writeBatch`** — 500'e kadar işlem, tek ağ turu.
7. **Görselleri Firestore'a koymayın.** Doküman boyutu sınırı 1 MiB. Görseller için Firebase Storage (Spark'ta kısıtlı olabilir, güncel durumu kontrol edin) veya Cloudinary gibi ücretsiz katmanı olan bir servis.
8. **Gereksiz indeks oluşturmayın.** Her bileşik indeks depolama ve yazma maliyeti ekler.
9. **Cloud Functions Spark planda yok.** İş mantığını istemcide + güvenlik kurallarında tutun.

## İzleme

- Firebase Console → Firestore → **Usage** sekmesini haftada bir kontrol edin.
- İleride Blaze'e geçerseniz: Google Cloud Console → Billing → **Budgets & alerts** ile düşük bir bütçe (ör. 1 USD) ve e-posta uyarısı kurun.
- Kötüye kullanım riski artarsa **App Check** ekleyin (istekler sadece sizin uygulamanızdan gelsin).
