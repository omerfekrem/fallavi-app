# Fallavi

React Native (Expo + TypeScript) · Firebase Auth + Firestore · Google & Apple ile giriş

## Klasör yapısı

```
fallavi/
├── app.config.ts            # Expo yapılandırması (plugin'ler, bundle id, firebase dosyaları)
├── eas.json                 # EAS Build profilleri (development / preview / production)
├── firebase.json            # Firebase CLI + emülatör ayarları
├── firebase/
│   ├── firestore.rules      # Güvenlik kuralları (varsayılan: her şey kapalı)
│   └── firestore.indexes.json
├── credentials/             # (gitignore) google-services.json, GoogleService-Info.plist
├── assets/                  # ikon, splash, fontlar
├── docs/
│   └── FIREBASE_MALIYET.md  # Ücretsiz kotada kalma rehberi
├── .github/                 # CI, PR şablonu, CODEOWNERS, issue şablonları
└── src/
    ├── app/                 # expo-router ekranları (dosya = rota)
    │   ├── _layout.tsx      # Provider'lar + oturum yönlendirmesi
    │   ├── (auth)/login.tsx # Giriş ekranı
    │   └── (app)/index.tsx  # Giriş sonrası ana ekran
    ├── features/            # Özellik bazlı modüller (her biri kendi içinde bağımsız)
    │   ├── auth/            # components / hooks / services / index.ts
    │   └── profile/
    ├── components/ui/       # Paylaşılan, iş mantığı içermeyen UI parçaları
    ├── lib/firebase/        # Firebase başlatma, koleksiyon isimleri, yardımcılar
    ├── providers/           # AuthProvider, QueryProvider
    ├── theme/               # Renk, boşluk, tipografi
    ├── config/              # env.ts
    ├── types/
    └── utils/
```

**Kural:** Ekranlar (`src/app`) ince kalır; iş mantığı `features/*/services` ve `hooks` içinde.
Bir feature başka bir feature'a sadece onun `index.ts` dosyası üzerinden erişir.
Firestore'a doğrudan sadece `services/*Repository.ts` dosyaları dokunur.

## İlk kurulum (her iki geliştirici)

```bash
git clone <repo-url> && cd fallavi
npm install
npx expo install --fix          # paket sürümlerini kurulu Expo SDK'ya hizalar
cp .env.example .env            # değerleri takım arkadaşından al
mkdir credentials               # google-services.json + GoogleService-Info.plist buraya
npm install -g firebase-tools
cp .firebaserc.example .firebaserc
```

> Bu proje native modül (Firebase, Google Sign-In) kullandığı için **Expo Go ile çalışmaz**.
> Bir kere development build alınır, sonrasında JS değişiklikleri anında yansır.

```bash
npm run ios        # veya: npm run android   (ilk seferde native derleme yapar)
npm start          # sonraki günlerde sadece bu
```

Ya da bulutta: `npx eas build --profile development --platform all`

## Firebase kurulumu (bir kez, projeyi açan kişi yapar)

1. [Firebase Console](https://console.firebase.google.com) → iki proje aç: `fallavi-dev` ve `fallavi-prod`. Planı **Spark (ücretsiz)** bırak.
2. Her projeye iOS (`com.fallavi.app`) ve Android (`com.fallavi.app`) uygulaması ekle; config dosyalarını indir.
3. Android için SHA-1 parmak izi ekle (Google girişi için zorunlu):
   `cd android && ./gradlew signingReport` veya `eas credentials`.
4. **Authentication → Sign-in method:** Google ve Apple'ı etkinleştir.
5. Apple için: Apple Developer'da App ID'ye "Sign in with Apple" yeteneğini aç.
6. **Firestore Database** oluştur → konum olarak `eur3` veya `europe-west1` seç (Türkiye'ye yakın, sonradan değiştirilemez).
7. Kuralları yükle: `npm run deploy:rules`
8. `.env` içindeki `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`: Google Cloud Console → APIs & Services → Credentials → "Web client (auto created by Google Service)".

### Gizli dosyaların paylaşımı
`credentials/` ve `.env` **asla** repoya girmez. Parola yöneticisinde paylaşılan bir kasa kullanın.
EAS build'lerinde bu dosyalar "file secret" olarak yüklenir:

```bash
eas env:create --name GOOGLE_SERVICES_JSON --type file --value ./credentials/google-services.json
eas env:create --name GOOGLE_SERVICES_PLIST --type file --value ./credentials/GoogleService-Info.plist
```

## Geliştirmede Firebase emülatörü (kota harcamaz)

```bash
npm run emulators      # Auth + Firestore yerel olarak, arayüz: http://localhost:4000
```
`.env` içinde `EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true` iken uygulama gerçek Firebase yerine buna bağlanır.

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm start` | Metro'yu dev client ile başlatır |
| `npm run ios` / `android` | Native build + çalıştır |
| `npm run typecheck` | TypeScript kontrolü |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run emulators` | Firebase emülatörleri |
| `npm run deploy:rules` | Firestore kurallarını + indeksleri yükler |

Detaylar: [CONTRIBUTING.md](CONTRIBUTING.md) · [docs/FIREBASE_MALIYET.md](docs/FIREBASE_MALIYET.md)
