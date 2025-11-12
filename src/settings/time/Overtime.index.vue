<template>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-2">Live Data dari Server</h2>
        <div v-if="liveData">
            <p><strong>Timestamp:</strong></p>
            <p><strong>Message:</strong> </p>
            <p><strong>Value:</strong> {{ liveData }}</p>
        </div>
        <div v-else>
            <p>Menunggu data...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface LiveData {
    timestamp: string;
    message: string;
    value: number;
}

const liveData = ref<LiveData | null>(null);
let eventSource: EventSource | null = null;

onMounted(() => {
    // Membuat koneksi SSE
    eventSource = new EventSource("http://localhost:7000/live-data");

    // Mendengarkan pesan (event default adalah "message")
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        liveData.value = data;
        console.log("Data dari SSE:", data);
    };

    // Event jika terjadi error / koneksi putus
    eventSource.onerror = (err) => {
        console.error("SSE Error:", err);
    };
});

onUnmounted(() => {
    // Tutup koneksi jika component di-unmount
    if (eventSource) {
        eventSource.close();
        console.log("SSE connection closed");
    }
});
</script>
