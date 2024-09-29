<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-neutral-900 p-4">
    <div class="w-full max-w-3xl mb-4">
      <div class="flex flex-row items-center mb-3">
        <button
          @click="store.isChecked = false"
          class="bg-neutral-800 text-white font-bold px-6 py-1.5 rounded-lg focus:outline-none"
        >
          Wróć
        </button>
        <div class="flex-grow flex justify-center">
          <p class="text-xl text-neutral-200 font-bold">{{ domain }}</p>
        </div>
        <div class="invisible">
          <button class="bg-neutral-800 text-white font-bold px-6 py-1.5 rounded-lg">
            Wróć
          </button>
        </div>
      </div>
      <div class="bg-neutral-800 rounded-xl shadow-2xl text-white py-6 px-6">
        <div class="flex justify-between items-center mb-2">
          <p class="text-xl md:text-2xl font-bold">Ogólny wynik:</p>
          <p class="text-xl md:text-2xl font-bold">{{ displayedGeneralScore }}/100</p>
        </div>
        <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-1000 ease-out"
            :style="{ width: `${displayedGeneralScore}%`, backgroundColor: progressColorGeneral }">
          </div>
        </div>
      </div>
    </div>

    <div class="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <!-- DNS -->
      <div class="bg-neutral-800 rounded-xl shadow-2xl text-white py-5 px-5">
        <div class="flex justify-between items-center mb-2">
          <p class="text-lg font-bold">DNS'y:</p>
          <p class="text-lg font-bold">{{ displayedDnsScore }}/100</p>
        </div>
        <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-1000 ease-out"
            :style="{ width: `${displayedDnsScore}%`, backgroundColor: progressColorDns }">
          </div>
        </div>
      </div>

      <!-- Certyfikaty -->
      <div class="bg-neutral-800 rounded-xl shadow-2xl text-white py-5 px-5">
        <div class="flex justify-between items-center mb-2">
          <p class="text-lg font-bold">Certyfikaty:</p>
          <p class="text-lg font-bold">{{ displayedCertificateScore }}/100</p>
        </div>
        <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-1000 ease-out"
            :style="{ width: `${displayedCertificateScore}%`, backgroundColor: progressColorCertificate }">
          </div>
        </div>
      </div>

      <!-- IPQS -->
      <div class="bg-neutral-800 rounded-xl shadow-2xl text-white py-5 px-5">
        <div class="flex justify-between items-center mb-2">
          <p class="text-lg font-bold">IPQS:</p>
          <p class="text-lg font-bold">{{ displayedIpqsScore }}/100</p>
        </div>
        <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-1000 ease-out"
            :style="{ width: `${displayedIpqsScore}%`, backgroundColor: progressColorIpqs }">
          </div>
        </div>
      </div>
    </div>

    <div class="bg-neutral-800 w-full max-w-3xl rounded-xl shadow-2xl p-6 text-white font-bold">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Pros -->
        <div class="break-words w-full min-w-0"> <!-- Added break-words and min-w-0 -->
          <h3 class="text-xl text-green-400 mb-2">Plusy:</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li v-for="pro in pros" :key="pro">{{ pro }}</li>
          </ul>
        </div>

        <!-- Cons -->
        <div class="break-words w-full min-w-0"> <!-- Added break-words and min-w-0 -->
          <h3 class="text-xl text-red-400 mb-2">Minusy:</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li v-for="con in cons" :key="con">{{ con }}</li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStorageStore } from "../stores/storage";
const store = useStorageStore();

const generalScore = ref(0);
const domain = ref("");
const dnsScore = ref(0);
const certificateScore = ref(0);
const ipqsScore = ref(0);
const pros = ref([]);
const cons = ref([]);

const displayedGeneralScore = ref(0);
const displayedDnsScore = ref(0);
const displayedCertificateScore = ref(0);
const displayedIpqsScore = ref(0);

const progressColorGeneral = computed(() => calculateProgressColor(displayedGeneralScore.value));
const progressColorDns = computed(() => calculateProgressColor(displayedDnsScore.value));
const progressColorCertificate = computed(() => calculateProgressColor(displayedCertificateScore.value));
const progressColorIpqs = computed(() => calculateProgressColor(displayedIpqsScore.value));

onMounted(() => {
  generalScore.value = store.generalScore;
  domain.value = store.domain;
  dnsScore.value = store.dnsScore;
  certificateScore.value = store.certificateScore;
  ipqsScore.value = store.ipqsScore;
  pros.value = store.pros;
  cons.value = store.cons;
  
  setTimeout(() => {
    animateScore(displayedGeneralScore, generalScore.value);
    animateScore(displayedDnsScore, dnsScore.value);
    animateScore(displayedCertificateScore, certificateScore.value);
    animateScore(displayedIpqsScore, ipqsScore.value);
  }, 300);
});

const calculateProgressColor = (score) => {
  const hue = (score * 120) / 100;
  return `hsl(${hue}, 100%, 50%)`;
};

const animateScore = (displayedScore, targetScore) => {
  let current = 0;
  const interval = setInterval(() => {
    if (current < targetScore) {
      current += 1;
      displayedScore.value = current;
    } else {
      clearInterval(interval);
    }
  }, 20);
};

const fadeElement = ref(null);
setTimeout(() => {
  if (fadeElement.value) {
    fadeElement.value.classList.remove("opacity-0");
    fadeElement.value.classList.add("opacity-100");
  }
}, 100);
</script>
