<template>
  <div id="vue-app-verificar">
    <div v-if="mensaje !== ''">
      <h1>{{ mensaje }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from '@/utils/funcionToast';

const router = useRouter();
const mensaje = ref('');

const verificarCuenta = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    mensaje.value = "Token no proporcionado.";
    showToast("Token no válido", "danger", "middle");
    return;
  }

  // Simulación de verificación local (offline)
  if (token === "demo123") {
    mensaje.value = "Cuenta validada correctamente.";
    showToast("Cuenta validada. Por favor inicia sesión", "success", "middle").then(() => {
      setTimeout(() => {
        router.push('/');
      }, 3000);
    });
  } else {
    mensaje.value = "Token inválido.";
    showToast("Error de verificación: token inválido", "danger", "middle");
  }
};

onMounted(() => {
  verificarCuenta();
});
</script>
