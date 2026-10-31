# Maitri Yoga, веб страна

Статична страна (HTML, CSS, JavaScript), без build чекор. Работи директно на GitHub Pages.

## Структура

```
index.html              страната
assets/css/style.css    сите стилови и бои (токени на врвот на фајлот)
assets/js/main.js       распоред, „Часови денес“, мандала, мобилно мени
assets/img/             лого, фотографии, favicon
.nojekyll               GitHub Pages да не ги обработува фајловите
```

## Објавување на GitHub Pages

1. На github.com направи нов repository (Public), без README.
   - Ако го правиш во организација `maitriyoga`, именувај го `maitriyoga.github.io` и адресата ќе биде `https://maitriyoga.github.io`.
   - Ако го правиш на свој профил, на пример `maitri.yoga.mk`, адресата ќе биде `https://<корисничко-име>.github.io/maitri.yoga.mk/`.
2. Качи ја **содржината** на оваа папка (Add file > Upload files): `index.html`, `README.md`, `.nojekyll` и папката `assets`. `index.html` мора да е на главното ниво.
3. Settings > Pages > Source: Deploy from a branch, Branch: `main`, папка `/ (root)` > Save.
4. По 1 до 2 минути страната е на адресата од чекор 1.

## Сопствен домен (на пример maitriyoga.mk)

1. Settings > Pages > Custom domain: внеси го доменот и Save. GitHub ќе направи фајл `CNAME`.
2. Кај регистрарот на доменот додај DNS записи:
   - за `www`: CNAME кон `<корисничко-име>.github.io`
   - за главниот домен: A записи кон 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
3. Кога DNS ќе проработи, вклучи „Enforce HTTPS“.

## Најчести измени

- Распоред и инструктори: `assets/js/main.js`, низите `MON_WED`, `TUE_THU`, `FRI`, `WEEKEND`.
- Цени: `index.html`, делот `id="clenarina"`.
- Бои: `assets/css/style.css`, блокот `:root` на врвот.
- Работилница/настан: `index.html`, делот `class="event"`.
- Контакт и линкови (Instagram, Facebook, YouTube): `index.html`, делот `id="kontakt"`.

## Да се провери пред објава

- Името на инструкторот за петочниот напреден час не е наведено.
- Работилницата „Интегративни констелации“ (31.10 и 1.11.2026) треба да се замени или тргне по датумот.
