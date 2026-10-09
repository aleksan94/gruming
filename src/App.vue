<script setup>
import AppHeader from './components/AppHeader.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import BookingSection from './components/BookingSection.vue'
import LiveSection from './components/LiveSection.vue'
import ContactsSection from './components/ContactsSection.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div id="top">
    <AppHeader />
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <BookingSection />
      <LiveSection />
      <ContactsSection />
    </main>
    <AppFooter />
  </div>
</template>
