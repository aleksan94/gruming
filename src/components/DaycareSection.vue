<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import IconBadge from './IconBadge.vue'
import {
  DAYCARE_BRING,
  DAYCARE_DAY,
  DAYCARE_EXTRAS,
  DAYCARE_FACTS,
  DAYCARE_FAQ,
  DAYCARE_HOURS,
  DAYCARE_PLANS,
  DAYCARE_REPORT,
  DAYCARE_REQUIREMENTS,
  DAYCARE_REVIEWS,
  formatPrice,
} from '../data/salon'
</script>

<template>
  <section id="daycare" class="section">
    <div class="container stack-40">
      <div class="hero">
        <div class="section-head">
          <h2 class="h2">Детский сад для собак</h2>
          <p>
            Пока вы на работе, ваш питомец играет, гуляет и отдыхает под присмотром кинологов. А
            вечером вы получаете счастливую собаку и подробный отчёт.
          </p>
          <div class="cta">
            <a href="#contacts" class="btn btn--lg hov">Записаться на пробный день</a>
            <span class="hours"><AppIcon name="clock" :size="20" />{{ DAYCARE_HOURS }}</span>
          </div>
        </div>
        <div class="photos" aria-hidden="true">
          <span class="ph ph--a"><AppIcon name="paw" :size="48" /></span>
          <span class="ph ph--b"><AppIcon name="heart" :size="36" /></span>
          <span class="ph ph--c"><AppIcon name="sparkle" :size="36" /></span>
        </div>
      </div>

      <div class="block">
        <h3 class="h3 title">Как проходит день</h3>
        <ol class="day">
          <li v-for="s in DAYCARE_DAY" :key="s.time">
            <span class="time">{{ s.time }}</span>
            <strong>{{ s.title }}</strong>
            <p>{{ s.text }}</p>
          </li>
        </ol>
      </div>

      <div class="block">
        <h3 class="h3 title">Форматы и цены</h3>
        <div class="plans">
          <article
            v-for="p in DAYCARE_PLANS"
            :key="p.id"
            class="plan"
            :class="{ 'plan--featured': p.featured }"
          >
            <span v-if="p.featured" class="tag">Популярный</span>
            <h4 class="h3">{{ p.name }}</h4>
            <div>
              <span class="price">{{ formatPrice(p.price) }}</span>
              <span class="unit">{{ p.unit }}</span>
            </div>
            <p>{{ p.text }}</p>
            <ul class="checks">
              <li v-for="perk in p.perks" :key="perk">
                <AppIcon name="check" :size="20" />{{ perk }}
              </li>
            </ul>
          </article>
        </div>
        <ul class="extras">
          <li v-for="e in DAYCARE_EXTRAS" :key="e">{{ e }}</li>
        </ul>
      </div>

      <div class="duo">
        <div class="card-box">
          <h3 class="h3">Условия приёма</h3>
          <ul class="checks">
            <li v-for="r in DAYCARE_REQUIREMENTS" :key="r">
              <AppIcon name="check" :size="20" />{{ r }}
            </li>
          </ul>
          <p class="trial">
            Первый визит — пробный день: мы знакомимся с собакой и подбираем ей подходящую группу.
          </p>
        </div>
        <div class="card-box card-box--tint">
          <h3 class="h3">Что взять с собой</h3>
          <ul class="checks">
            <li v-for="b in DAYCARE_BRING" :key="b"><AppIcon name="paw" :size="20" />{{ b }}</li>
          </ul>
        </div>
      </div>

      <div class="block">
        <h3 class="h3 title">Безопасность и забота</h3>
        <div class="facts">
          <div v-for="f in DAYCARE_FACTS" :key="f.title" class="fact">
            <IconBadge :icon="f.icon" :tint="f.tint" :size="52" />
            <h4 class="h3">{{ f.title }}</h4>
            <p>{{ f.text }}</p>
          </div>
        </div>
      </div>

      <div class="report-row">
        <div class="section-head">
          <h3 class="h2 h2-sm">Ежедневный отчёт</h3>
          <p>
            В течение дня присылаем фото и видео, а вечером короткий итог: как ел, гулял и играл ваш
            питомец. Вы всегда знаете, что у него всё хорошо.
          </p>
        </div>
        <div class="report" aria-label="Пример отчёта">
          <div class="report-head">
            <IconBadge icon="paw" tint="butter" :size="44" />
            <div>
              <strong>Бублик · сегодня</strong>
              <span class="unit">Пример отчёта</span>
            </div>
          </div>
          <dl>
            <div v-for="r in DAYCARE_REPORT" :key="r.label">
              <dt>{{ r.label }}</dt>
              <dd>{{ r.value }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="block">
        <h3 class="h3 title">Отзывы хозяев</h3>
        <div class="reviews">
          <figure v-for="r in DAYCARE_REVIEWS" :key="r.author" class="review">
            <blockquote>{{ r.text }}</blockquote>
            <figcaption>
              <strong>{{ r.author }}</strong>
              <span>{{ r.pet }}</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <div class="block">
        <h3 class="h3 title">Частые вопросы</h3>
        <div class="faq">
          <details v-for="f in DAYCARE_FAQ" :key="f.q">
            <summary>{{ f.q }}</summary>
            <p>{{ f.a }}</p>
          </details>
        </div>
      </div>

      <div class="final">
        <h3 class="h2 h2-sm">Приходите знакомиться</h3>
        <p>Оставьте заявку, и мы позвоним, чтобы выбрать дату пробного дня.</p>
        <a href="#contacts" class="btn btn--lg hov">Записаться на пробный день</a>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 32px 48px;

  .section-head {
    flex: 1 1 400px;
    max-width: none;
  }
}

.cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 24px;
  margin-top: 8px;
}

.hours {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: var(--ink);
}

.photos {
  flex: 1 1 320px;
  display: grid;
  grid-template: repeat(2, 140px) / 1.4fr 1fr;
  gap: 16px;
}

.ph {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  color: var(--ink);

  &--a {
    grid-row: span 2;
    background: var(--peach);
  }

  &--b {
    background: var(--sky);
  }

  &--c {
    background: var(--mint);
  }
}

.block {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title {
  font-size: 26px;
}

.h2-sm {
  font-size: clamp(24px, 3vw, 32px);
}

/* Распорядок дня */
.day {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 16px;

  li {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 20px;
    border-radius: 24px;
    background: $white;
  }

  p {
    margin: 0;
    line-height: 1.5;
    color: var(--muted);
    font-size: 15px;
  }
}

.time {
  align-self: flex-start;
  padding: 4px 12px;
  border-radius: $radius-pill;
  background: var(--sun);
  font-weight: 800;
  font-size: 14px;
}

/* Тарифы */
.plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.plan {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px;
  border-radius: 28px;
  background: $white;
  border: 2px solid transparent;

  p {
    margin: 0;
    line-height: 1.5;
    color: var(--muted);
  }

  &--featured {
    border-color: var(--accent);
    box-shadow: 0 12px 28px rgb(31 58 61 / 12%);
  }
}

.tag {
  position: absolute;
  top: -14px;
  right: 24px;
  padding: 4px 14px;
  border-radius: $radius-pill;
  background: var(--accent);
  color: $white;
  font-weight: 800;
  font-size: 13px;
}

.price {
  display: block;
  font-weight: 800;
  font-size: 26px;
}

.unit {
  display: block;
  color: var(--muted);
  font-size: 15px;
}

.checks {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    line-height: 1.45;
  }

  svg {
    flex: none;
    margin-top: 1px;
    color: var(--accent);
  }
}

.extras {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  li {
    padding: 8px 16px;
    border-radius: $radius-pill;
    background: rgb(255 255 255 / 70%);
    font-weight: 700;
    font-size: 15px;
  }
}

/* Условия */
.duo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.card-box {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px;
  border-radius: 28px;
  background: $white;

  &--tint {
    background: var(--mint);
  }
}

.trial {
  margin: 0;
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--butter);
  font-weight: 700;
  line-height: 1.45;
}

/* Безопасность */
.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 16px;
}

.fact {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  border-radius: 28px;
  background: $white;

  p {
    margin: 0;
    line-height: 1.5;
    color: var(--muted);
  }
}

/* Отчёт */
.report-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 32px 48px;

  .section-head {
    flex: 1 1 360px;
  }
}

.report {
  flex: 1 1 340px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 28px;
  background: $white;

  dl {
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  dl div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 0;
    border-top: 1px solid var(--card-border);
  }

  dt {
    color: var(--muted);
  }

  dd {
    margin: 0;
    font-weight: 700;
    text-align: right;
  }
}

.report-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Отзывы */
.reviews {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.review {
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
  border-radius: 28px;
  background: $white;

  blockquote {
    margin: 0;
    line-height: 1.55;
  }

  figcaption {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  span {
    color: var(--muted);
    font-size: 15px;
  }
}

/* FAQ */
.faq {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 820px;

  details {
    padding: 0 22px;
    border-radius: 20px;
    background: $white;
  }

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 0;
    font-weight: 800;
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }

    &::after {
      content: '';
      flex: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m7 10 5 5 5-5'/%3E%3C/svg%3E")
        center / 18px no-repeat,
        rgb(0 0 0 / 6%);
      transition:
        transform 0.25s ease,
        background-color 0.25s ease;
    }

    &:hover::after {
      background-color: rgb(0 0 0 / 12%);
    }
  }

  details[open] > summary::after {
    transform: rotate(180deg);
  }

  p {
    margin: 0;
    padding-bottom: 18px;
    line-height: 1.55;
    color: var(--muted);
  }
}

.final {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: clamp(28px, 4vw, 48px) 24px;
  border-radius: 36px;
  background: var(--ink);
  color: $white;
  text-align: center;

  p {
    margin: 0;
    font-size: 18px;
    opacity: 0.85;
  }
}

@media (width <= 560px) {
  .photos {
    grid-template-rows: repeat(2, 110px);
  }

  .plan,
  .card-box {
    padding: 22px;
  }
}
</style>
