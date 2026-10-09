<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import TeamSection from './components/TeamSection.vue'
import BookingSection from './components/BookingSection.vue'
import LiveSection from './components/LiveSection.vue'
import ContactsSection from './components/ContactsSection.vue'
import AppFooter from './components/AppFooter.vue'
import ScrollTopButton from './components/ScrollTopButton.vue'
import CallbackWidget from './components/CallbackWidget.vue'
</script>

<template>
  <div id="top">
    <AppHeader />
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TeamSection />
      <BookingSection />
      <LiveSection />
      <ContactsSection />
    </main>
    <AppFooter />
    <ScrollTopButton />
    <CallbackWidget />
  </div>
</template>
