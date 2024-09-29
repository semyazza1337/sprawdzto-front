<template>
  <div>
    <div class="flex justify-center items-center min-h-screen">
      <div
        ref="fadeElement"
        class="bg-gray-300 shadow-2xl rounded-2xl py-5 px-8 transition-opacity opacity-0 duration-1000"
      >
        <div class="flex flex-col gap-3 justify-center items-center">
          <p class="text-xl text-neutral-900 font-bold">Sprawdź sklep:</p>

          <!-- Conditional rendering: Spinner when loading, input and button when not -->
          <div v-if="loading" class="flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-gray-800"></div>
          </div>

          <div class="flex flex-col gap-3" v-else>
            <input
              v-model="shop"
              class="rounded-lg px-3 py-1 bg-gray-100 focus:outline-none"
              type="text"
              placeholder="URL sklepu"
              @keydown.enter="checkShop"
            />
            <button
              @click="checkShop"
              class="bg-neutral-800 text-white font-bold px-6 py-1.5 rounded-lg focus:outline-none"
            >
              Sprawdź!
            </button>
          </div>

          <p v-if="isChecked" class="text-green-500 font-bold mt-2">Sklep jest prawidłowy!</p>
          <p v-if="errorMessage" class="text-red-500 font-bold mt-2">{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Render ScoreView only if valid shop -->
    <ScoreView
      v-if="isChecked"
      :generalScore="generalScore"
      :dnsScore="dnsScore"
      :certificateScore="certificateScore"
      :ipqsScore="ipqsScore"
      :pros="pros"
      :cons="cons"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStorageStore } from "../stores/storage";
import ScoreView from './ScoreView.vue';

// Pinia store
const store = useStorageStore();
const isChecked = computed(() => store.isChecked);

// Data for scores and pros/cons
const shop = ref("");
const errorMessage = ref("");
const loading = ref(false); // New loading state

// Function to check the shop
const checkShop = async () => {
  errorMessage.value = ""; // Clear any previous error messages
  loading.value = true; // Set loading to true

  if (!shop.value) {
    errorMessage.value = "Wprowadź URL sklepu.";
    loading.value = false; // Reset loading when there's an error
    return;
  }

  try {
    const domain = shop.value.match(/^(?:https?:\/\/)?(?:www\.)?([^\/:]+)/i)?.[1] || ""; // Extract domain without "http(s)" and "www"
    const response = await fetch(`https://hackyeah.tomekb530.me/api/v1/gemini?website=${domain}`);

    if (response.ok) {
      let data = await response.json();
      if(data[0]){
        data = data[0]; // Adjust based on your API response structure
      }
      
      // Assuming valid response includes scores
      if (data && !data.error) {
        store.setChecked(true);
        store.setValue("domain", domain);
        store.setValue("generalScore", data.average);
        store.setValue("dnsScore", data.whois);
        store.setValue("certificateScore", data.ssl);
        store.setValue("ipqsScore", data.ipqs);
        store.setValue("pros", data.pros);
        store.setValue("cons", data.cons);
      } else {
        errorMessage.value = "Nie znaleziono danych dla podanej domeny.";
        store.setChecked(false);
      }
    } else {
      errorMessage.value = "Wystąpił błąd podczas pobierania danych.";
      store.setChecked(false);
    }
  } catch (error) {
    errorMessage.value = "Error: " + error.message;
    store.setChecked(false);
  } finally {
    loading.value = false; // Set loading to false when the request is complete
  }
};

// For fade-in effect
const fadeElement = ref(null);
setTimeout(() => {
  if (fadeElement.value) {
    fadeElement.value.classList.remove("opacity-0");
    fadeElement.value.classList.add("opacity-100");
  }
}, 100);
</script>
