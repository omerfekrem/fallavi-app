# Birlikte Çalışma Kuralları

İki kişilik ekip için hafif ama güvenli bir akış.

## Branch'ler

```
main        → Mağazaya çıkan kod. Doğrudan push YASAK.
develop     → Birleşme noktası. Doğrudan push YASAK.
feature/*   → Yeni özellik       (feature/fal-yukleme)
fix/*       → Hata düzeltme      (fix/apple-giris-crash)
chore/*     → Bağımlılık, config (chore/expo-guncelleme)
```

## Günlük akış

```bash
git checkout develop && git pull
git checkout -b feature/kisa-aciklama
# ... çalış, küçük commit'ler at ...
git fetch origin && git rebase origin/develop   # develop'taki yenilikleri al
git push -u origin feature/kisa-aciklama
# GitHub'da develop'a PR aç → diğer kişi review eder → "Squash and merge"
```

Sürüm çıkarken: `develop` → `main` PR'ı açılır, merge sonrası `v0.2.0` gibi tag atılır.

## Commit mesajları (Conventional Commits, husky ile zorunlu)

```
feat(auth): apple ile giriş eklendi
fix(profile): boş isimde çökme giderildi
chore(deps): expo sdk güncellendi
refactor(firebase): okuma yardımcıları ayrıldı
docs: kurulum adımları güncellendi
```

## GitHub ayarları (repo sahibi bir kez yapar)

Settings → Branches → `main` ve `develop` için kural ekle:
- Require a pull request before merging (1 onay)
- Require status checks to pass → `check` (CI)
- Require branches to be up to date

`.github/CODEOWNERS` içindeki kullanıcı adlarını kendi adlarınızla değiştirin.

## Çakışmayı azaltmak için

- Aynı anda aynı feature klasöründe çalışmayın; işleri `features/` bazında bölün.
- `app.config.ts`, `package.json`, `firestore.rules` değişikliklerini ayrı, küçük PR'larla yapın ve karşı tarafa haber verin.
- Yeni paket eklerken `npx expo install <paket>` kullanın (sürüm uyumu için).
- `package-lock.json` çakışırsa: kendi `package.json` değişikliğinizi koruyup `npm install` ile lock'u yeniden üretin.
- `ios/` ve `android/` klasörleri repoda yok; `npx expo prebuild --clean` ile üretilir. Native değişiklik gerekiyorsa config plugin yazın.
