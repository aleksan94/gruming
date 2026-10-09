<template>
  <section class="section hero">
    <div class="container row">
      <div class="text">
        <h1>Груминг, после которого хвост виляет сам</h1>
        <p>
          Уютный салон для собак и кошек. Спокойный подход, мягкая косметика и мастера, которые
          никуда не торопятся.
        </p>
        <div class="actions">
          <a href="#booking" class="btn btn--lg hov">Записаться онлайн</a>
          <a href="#live" class="btn btn--lg btn--outline hov">Смотреть трансляцию</a>
        </div>
        <ul class="tags">
          <li class="tint-mint">Собаки и кошки</li>
          <li class="tint-butter">Мягкая косметика</li>
          <li class="tint-sky">Трансляция из зала</li>
        </ul>
      </div>
      <div class="art">
        <svg
          viewBox="0 0 520 440"
          role="img"
          aria-label="Улыбающаяся собака в голубой бандане и белая кошка"
        >
          <circle cx="270" cy="230" r="205" fill="#DDF1E8" />
          <circle cx="440" cy="88" r="52" fill="#FFD66B" />
          <circle cx="70" cy="122" r="30" fill="#FFE1D6" />
          <ellipse cx="270" cy="408" rx="205" ry="18" fill="#BFE0D0" />
          <g>
            <path
              d="M452 372 Q508 360 494 296"
              fill="none"
              stroke="#E4EBEF"
              stroke-width="24"
              stroke-linecap="round"
            />
            <ellipse cx="388" cy="338" rx="72" ry="72" fill="#E4EBEF" />
            <path d="M334 208 L338 148 L378 186 Z" fill="#F4F7F9" />
            <path d="M440 208 L436 148 L396 186 Z" fill="#F4F7F9" />
            <path d="M345 190 L346 164 L364 183 Z" fill="#FFC9C4" />
            <path d="M429 190 L428 164 L410 183 Z" fill="#FFC9C4" />
            <circle cx="387" cy="236" r="62" fill="#F4F7F9" />
            <path
              d="M362 230 q9 -10 18 0"
              fill="none"
              stroke="#1F3A3D"
              stroke-width="4"
              stroke-linecap="round"
            />
            <path
              d="M394 230 q9 -10 18 0"
              fill="none"
              stroke="#1F3A3D"
              stroke-width="4"
              stroke-linecap="round"
            />
            <path d="M380 248 L394 248 L387 257 Z" fill="#F29A9A" />
            <path
              d="M387 257 q-6 8 -14 4 M387 257 q6 8 14 4"
              fill="none"
              stroke="#1F3A3D"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              d="M344 250 l-24 -4 M344 258 l-24 6 M430 250 l24 -4 M430 258 l24 6"
              fill="none"
              stroke="#9BB0B3"
              stroke-width="2.5"
              stroke-linecap="round"
            />
            <circle cx="354" cy="252" r="9" fill="#FFC9C4" opacity="0.7" />
            <circle cx="420" cy="252" r="9" fill="#FFC9C4" opacity="0.7" />
          </g>
          <g>
            <ellipse cx="205" cy="338" rx="96" ry="78" fill="#F2C98B" />
            <ellipse cx="160" cy="398" rx="32" ry="17" fill="#F5D6A1" />
            <ellipse cx="252" cy="398" rx="32" ry="17" fill="#F5D6A1" />
            <path d="M146 266 Q205 304 264 266 L205 336 Z" fill="#7FC4E8" />
            <ellipse
              cx="132"
              cy="196"
              rx="27"
              ry="54"
              transform="rotate(14 132 196)"
              fill="#C98F4E"
            />
            <ellipse
              cx="278"
              cy="196"
              rx="27"
              ry="54"
              transform="rotate(-14 278 196)"
              fill="#C98F4E"
            />
            <circle cx="205" cy="200" r="80" fill="#F5D6A1" />
            <ellipse cx="205" cy="226" rx="40" ry="30" fill="#FFF1D6" />
            <ellipse cx="205" cy="212" rx="14" ry="10" fill="#1F3A3D" />
            <circle cx="174" cy="184" r="8" fill="#1F3A3D" />
            <circle cx="236" cy="184" r="8" fill="#1F3A3D" />
            <circle cx="177" cy="181" r="2.6" fill="#FFFFFF" />
            <circle cx="239" cy="181" r="2.6" fill="#FFFFFF" />
            <path
              d="M190 236 q15 14 30 0"
              fill="none"
              stroke="#1F3A3D"
              stroke-width="4"
              stroke-linecap="round"
            />
            <path d="M199 242 q6 20 12 0 Z" fill="#FF9FA8" />
            <circle cx="150" cy="218" r="11" fill="#FFB8A8" opacity="0.55" />
            <circle cx="260" cy="218" r="11" fill="#FFB8A8" opacity="0.55" />
          </g>
          <g fill="#FFFFFF" stroke="#8CCBE6" stroke-width="3" opacity="0.95">
            <circle cx="92" cy="300" r="22" />
            <circle cx="64" cy="352" r="12" />
            <circle cx="118" cy="244" r="9" />
            <circle cx="470" cy="190" r="14" />
          </g>
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  padding: clamp(24px, 5vw, 56px) var(--gutter) clamp(48px, 7vw, 88px);
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 40px;
}

.text {
  flex: 1 1 420px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h1 {
  margin: 0;
  font-family: var(--font-head);
  font-weight: 700;
  font-size: clamp(34px, 5.6vw, 66px);
  line-height: 1.1;
  text-wrap: balance;
}

p {
  margin: 0;
  font-size: clamp(17px, 1.6vw, 20px);
  line-height: 1.6;
  color: var(--muted);
  max-width: 520px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tags li {
  padding: 8px 16px;
  border-radius: $radius-pill;
  font-weight: 700;
  font-size: 15px;
}

.tint-mint {
  background: var(--mint);
}

.tint-butter {
  background: var(--butter);
}

.tint-sky {
  background: var(--sky);
}

.art {
  flex: 1 1 360px;
  min-width: 0;
  max-width: 560px;
  margin-inline: auto;
}

.art svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
