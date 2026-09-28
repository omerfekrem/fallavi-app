# Dal Akışı: Masaya Oturunca

Kısa kılavuz. Gerekçeler, görev listesi ve GitHub ayarları: [IS_PLANI.md](IS_PLANI.md).

> Komutlar Git Bash'te ve PowerShell'de aynıdır. Windows PowerShell 5.1'de `&&` olmadığı için satır satır yazıldı.
> `gh` (GitHub CLI) yoksa PR adımları GitHub web arayüzünden yapılır.
> Bir kez: `git config --global core.editor "code --wait"` (merge ve rebase mesajı Vim yerine VS Code'da açılır).
> Node sürümü `.nvmrc`'deki olmalı (A-01 ekler); farklı npm sürümleri `package-lock.json`'u gereksiz yere değiştirir.

## Dallar tek bakışta

```
master        ← yalnız development'tan sürüm PR'ı (merge commit) ve hotfix/*
development   ← özellik PR'ları (squash)
  ├── feature/<modül>-<kısa-ad>     yeni özellik        (feat)
  ├── fix/<modül>-<kısa-ad>         hata düzeltme       (fix)
  ├── chore/<konu>-<kısa-ad>        paket, config, CI   (chore; yalnız CI ise ci)
  ├── refactor/<modül>-<kısa-ad>    düzenleme           (refactor)
  ├── test/<modül>-<kısa-ad>        yalnız test         (test)
  └── docs/<konu>-<kısa-ad>         belge               (docs)
hotfix/<modül>-<kısa-ad>            yayındaki acil hata, master'dan açılır
```

Dal adı: küçük harf, tire, **Türkçe karakter yok**. Dal adın görev tablosunda yazıyor (IS_PLANI 3.4).
Modül anahtarları: `ci`, `test`, `firebase`, `nav`, `ui`, `auth`, `profile`, `new-reading`, `readings`,
`interpreter`, `notifications`, `home`, `eas`, `store`.

## 1. Oturunca, her seferinde

```bash
git status                      # temiz mi? yarım iş varsa önce onu commit'le ya da stash'le
git fetch --prune origin        # yeni dalları (ilk seferde development) tanı, silinenleri temizle
git checkout development
git pull --ff-only
npm ci                          # package-lock.json değiştiyse (kilit dosyasını değiştirmeden kurar)
```

`development` 28 Eylül'de açıldı (O-01, PR #1 ile). `git checkout development` "did not match" derse önce
`git fetch --prune origin` çalıştır. Özellik dalını `master`'dan açma.

- `git pull` sonrası `package.json`'a **native** paket geldiyse development build'i yenile: `npm run android` (ya da `npm run ios`) veya `eas build --profile development`.
- Firebase'e kota harcamadan çalışmak için ayrı bir terminalde: `npm run emulators`.

## 2. Yeni işe başlıyorum

```bash
git checkout -b feature/readings-liste
npm start
```

GitHub'da görevin issue'sunu kendine ata.

## 3. Yarım kalan işe devam ediyorum

```bash
git checkout feature/readings-liste
git fetch origin
git pull --rebase                       # yalnız başka makineden push ettiysen
git rebase origin/development           # development'taki yenilikleri al
git push --force-with-lease --force-if-includes   # dal daha önce push edildiyse
```

`--force-if-includes` şart: tek başına `--force-with-lease`, hemen önce `git fetch` yapıldığında uzakta
senin almadığın commit'i yine de ezebilir. İkisi birlikte, yerelde görmediğin uzak değişikliği korur.

**Önceki PR'ım birleşmeden ona bağlı işe başladım** (ör. A-06 review'dayken A-07). Yeni dalı önceki daldan aç:
`git checkout -b feature/readings-detay feature/readings-liste`. Önceki PR squash ile birleşince düz `git rebase origin/development` aynı değişiklikleri ikinci kez uygulamaya
çalışır ve çakışır. Onun yerine yalnız kendi commit'lerini taşı:

```bash
git fetch origin
git log --oneline origin/development..HEAD      # listede önceki işin commit'leri de var
git rebase --onto origin/development <önceki işin EN SON commit'inin kimliği>
git push --force-with-lease --force-if-includes
```

## 4. Commit

```bash
git add src/features/readings
git commit -m "feat(readings): sayfalı fal listesi sorgusu"
```

Biçim: `<tür>(<modül>): <küçük harfle başlayan kısa açıklama>`. Husky her commit'te lint-staged ve commitlint çalıştırır.

| Tür | Ne zaman |
|---|---|
| `feat` | Yeni özellik |
| `fix` | Hata düzeltme |
| `refactor` | Davranışı değiştirmeyen düzenleme |
| `test` | Yalnız test |
| `chore` | Paket, yapılandırma |
| `ci` | CI iş akışı |
| `docs` | Belge |
| `style`, `perf`, `build`, `revert` | Adı üstünde |

commitlint'in sık reddettikleri:
- Açıklama büyük harfle başlıyor: `feat(auth): Apple ile giriş` reddedilir → `feat(auth): apple ile giriş`
- Açıklama kısaltmayla başlıyor: `chore(eas): EAS preview profili` reddedilir → `chore(eas): preview profili`
- Tür yanlış: `feature(...)` değil `feat(...)`
- Başlık ya da gövdenin herhangi bir satırı 100 karakteri geçiyor
- Açıklama nokta ile bitiyor

## 5. Kalkmadan önce

İş bitmese de push et; kod yalnız senin bilgisayarında kalmasın.

```bash
npm run typecheck
npm run lint
npm test                        # A-02 birleşene kadar bu betik yok, atla
git push -u origin feature/readings-liste
gh pr create --base development --fill-first --draft   # ilk kez: taslak PR, başlık ilk commit'ten
```

## 6. İş bitti, review'a gönderiyorum

1. PR başlığı commit biçiminde olsun: `feat(readings): sayfalı Fallarım listesi` (squash sonrası commit mesajı bu olur).
   Değiştirmek için: `gh pr edit --title "feat(readings): sayfalı Fallarım listesi"`.
2. Açıklamada `Görev: A-06` ve `Closes #<issue>`; PR şablonunu doldur, UI değiştiyse ekran görüntüsü ekle.
3. Ortak dosyaya dokunduysan (IS_PLANI 3.2) diğerine haber ver.
4. Taslaktan çıkar:
   ```bash
   gh pr ready
   ```

## 7. Review yapıyorum

```bash
gh pr list
gh pr checkout 12               # PR'ı yerelde dene
npm ci
npm start
gh pr review 12 --approve       # ya da: --request-changes -b "zorunlu: ..."
git checkout development        # kendi işine dön
npm ci                          # PR paketleri değiştirdiyse, kendi dalının paketlerine dön
```

Yorumlarını **zorunlu:** / **öneri:** diye ayır. Kontrol listesi IS_PLANI 5. bölümde.

## 8. Onay geldi, birleştiriyorum

Onay ve yeşil CI'dan sonra birleştirmeyi **PR sahibi** yapar.

```bash
gh pr merge --squash --delete-branch
git checkout development
git pull --ff-only
```

Web'den birleştirdiysen yerel dalı sil: `git branch -D feature/readings-liste` (squash yüzünden `-d` çalışmaz).

## 9. Çakışma çıktı

```bash
git fetch origin
git rebase origin/development
# çakışan dosyaları düzelt, sonra:
git add <dosya>
git rebase --continue           # mesaj editörü açılırsa kaydet-kapat; vazgeçmek için: git rebase --abort
npm run typecheck
npm test                        # A-02 sonrası
git push --force-with-lease --force-if-includes
```

`package-lock.json` çakışırsa elle düzeltme:

```bash
git checkout origin/development -- package-lock.json
npm install
git add package-lock.json
git rebase --continue
```

Ortak dosyadaki çakışmada son kararı dosyanın sahibi verir; emin değilsen yazış.

## 10. Yanlışlıkla development'ta commit attım

Henüz push etmediysen (korunan dala zaten push edilemez) işi bir dala taşı, `development`'ı geri al.
`reset --hard` commit'lenmemiş değişiklikleri siler; önce `git status` temiz olmalı.

```bash
git branch feature/kurtarilan-is
git reset --hard origin/development
git checkout feature/kurtarilan-is
```

## 11. Yayında acil hata (hotfix)

```bash
git checkout master
git pull --ff-only
git checkout -b hotfix/auth-android-crash
# düzelt; app.config.ts'te version'ı 0.1.1 yap, sonra:
npm version 0.1.1 --no-git-tag-version      # package.json ve package-lock.json
git add <düzelttiğin dosyalar> app.config.ts package.json package-lock.json
git commit -m "fix(auth): android'de iptal sonrası çökme giderildi"
git push -u origin hotfix/auth-android-crash
gh pr create --base master --title "fix(auth): android'de iptal sonrası çökme giderildi"
```

Birleştirme **merge commit** ile (`gh pr merge --merge --delete-branch`). Sonra etiket, derleme ve gönderim
(IS_PLANI 6.4'ün 5. ve 6. adımları, `v0.1.1` ile). En son düzeltmeyi `development`'a geri al:

```bash
git checkout development
git pull --ff-only
git checkout -b chore/v0.1.1-geri-al
git merge --no-edit origin/master
git push -u origin chore/v0.1.1-geri-al
gh pr create --base development --title "chore: v0.1.1 düzeltmesini development'a al"
```

Bu PR da **merge commit** ile birleştirilir.

## 12. Sürüm (development → master)

Ayrıntı: IS_PLANI 6.4.

```bash
# 1. chore/surum-vX.Y.Z dalında version artırılır (v0.1.0 için gerekmez, ikisi de zaten 0.1.0), development'a PR
# 2. Toplu test: development'tan preview derlemesi + duman testi
git checkout development
git pull --ff-only
eas build --profile preview --platform android
# 3. Sürüm PR'ı; "Create a merge commit" ile birleştir, --delete-branch kullanma
gh pr create --base master --head development --title "chore(release): v0.1.0"
gh pr merge --merge             # onay ve yeşil CI'dan sonra
# 4. Etiket ve sürüm notu
gh release create v0.1.0 --target master --title "v0.1.0" --generate-notes
# 5. master'dan: Firestore kurallarını prod'a yükle, production derlemesi ve gönderim (IS_PLANI 6.4)
```

## Yapma

- `master` ya da `development`'a doğrudan push
- Çıplak `git push --force` (her zaman `--force-with-lease --force-if-includes`, o da yalnız kendi dalında)
- `git commit --no-verify`
- `.env`, `credentials/`, `google-services.json`, `GoogleService-Info.plist` commit'lemek (depo herkese açık)
- Başkasının dalına habersiz push
- `npm install <paket>` ile native paket eklemek (`npx expo install <paket>` kullan, ayrı `chore/deps-<paket>` PR'ı aç)
