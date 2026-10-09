<script setup lang="ts">
import { reactive, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import IconBadge from './IconBadge.vue'
import MapSketch from '../assets/illustrations/map-sketch.svg?component'
import { CONTACTS, TOPICS } from '../data/salon'

const form = reactive({ name: '', contact: '', topic: TOPICS[0], message: '', agree: true })
const error = ref('')
const sent = ref(false)
const mapLoaded = ref(false)

function send() {
  if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) {
    error.value = 'Заполните имя, контакт и сообщение.'
    return
  }
  if (!form.agree) {
    error.value = 'Нужно согласие на обработку персональных данных.'
    return
  }
  error.value = ''
  sent.value = true
}

function writeAgain() {
  sent.value = false
  form.message = ''
  error.value = ''
}
</script>

<template>
  <section id="contacts" class="section section--tall">
    <div class="container stack-40">
      <div class="section-head">
        <h2 class="h2">Контакты</h2>
        <p>Приходите в гости или напишите нам. Ответим в рабочее время.</p>
      </div>

      <div class="layout">
        <div class="info">
          <ul>
            <li v-for="c in CONTACTS" :key="c.label">
              <IconBadge :icon="c.icon" :tint="c.tint" :size="48" />
              <div>
                <span class="label">{{ c.label }}</span>
                <span class="value" :class="{ wrap: c.wrap }">{{ c.value }}</span>
              </div>
            </li>
          </ul>
          <div class="map">
            <MapSketch
              v-show="!mapLoaded"
              class="map-layer"
              role="img"
              aria-label="Схема расположения салона"
            />
            <iframe
              class="map-layer map-frame"
              :class="{ loaded: mapLoaded }"
              src="https://yandex.ru/map-widget/v1/?ll=37.369368%2C55.819233&z=17&pt=37.369368%2C55.819233%2Cpm2rdm"
              title="Расположение салона на Яндекс Картах"
              allowfullscreen
              @load="mapLoaded = true"
            />
          </div>
        </div>

        <div class="card form">
          <form v-if="!sent" novalidate @submit.prevent="send">
            <h3>Напишите нам</h3>
            <div class="field">
              <label for="f-name">Имя</label>
              <input
                id="f-name"
                v-model="form.name"
                class="input"
                type="text"
                autocomplete="name"
                placeholder="Как к вам обращаться"
              />
            </div>
            <div class="field">
              <label for="f-contact">Телефон или e-mail</label>
              <input
                id="f-contact"
                v-model="form.contact"
                class="input"
                type="text"
                autocomplete="email"
                placeholder="Куда ответить"
              />
            </div>
            <div class="field">
              <label for="f-topic">Тема</label>
              <select id="f-topic" v-model="form.topic" class="input topic">
                <option v-for="t in TOPICS" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div class="field">
              <label for="f-msg">Сообщение</label>
              <textarea
                id="f-msg"
                v-model="form.message"
                class="input msg"
                rows="4"
                placeholder="Расскажите, чем помочь"
              />
            </div>
            <div class="agree">
              <input id="f-agree" v-model="form.agree" type="checkbox" />
              <label for="f-agree">Согласен на обработку персональных данных</label>
            </div>
            <p v-if="error" role="alert" class="alert">{{ error }}</p>
            <button type="submit" class="btn btn--lg hov">Отправить сообщение</button>
          </form>

          <div v-else class="done">
            <span class="done-icon"><AppIcon name="check" :size="32" /></span>
            <h3>Сообщение отправлено</h3>
            <p>Спасибо, {{ form.name }}! Мы ответим вам в рабочее время на {{ form.contact }}.</p>
            <button type="button" class="btn btn--outline hov" @click="writeAgain">
              Написать ещё
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.map {
  position: relative;
  width: 100%;
  height: 360px;
  overflow: hidden;
  border-radius: 32px;
}

.map-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
}

.map-frame {
  opacity: 0;
  transition: opacity 0.3s;
}

.map-frame.loaded {
  opacity: 1;
}

.layout {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: flex-start;
}

.info {
  flex: 1 1 400px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

li {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

li > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.label {
  font-size: 14px;
  color: var(--muted);
}

.value {
  font-weight: 800;
  font-size: 18px;
  line-height: 1.4;
}

.value.wrap {
  overflow-wrap: anywhere;
}

.form {
  flex: 1 1 400px;
  min-width: 0;
}

form,
.done {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.done {
  align-items: flex-start;
}

h3 {
  margin: 0;
  font-family: var(--font-head);
  font-weight: 700;
  font-size: 24px;
}

.topic {
  padding: 0 14px;
}

.msg {
  min-height: 120px;
  padding: 14px 18px;
  line-height: 1.5;
  resize: vertical;
}

.agree {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.agree input {
  width: 22px;
  height: 22px;
  margin: 2px 0 0;
  flex: none;
  accent-color: var(--accent);
}

.agree label {
  font-size: 15px;
  line-height: 1.5;
  color: var(--muted);
}

.done p {
  margin: 0;
  line-height: 1.6;
  color: var(--muted);
}

.done-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--mint);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
