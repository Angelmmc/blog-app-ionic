<template>
  <ion-header>
    <ion-toolbar>
      <ion-icon class="ion-icon-header" slot="end" :icon="searchOutline"></ion-icon>
      <ion-icon class="ion-icon-header" slot="end" :icon="isLightMode ? moonOutline : sunnyOutline" @click="toggleTheme()"></ion-icon>
      <ion-icon class="ion-icon-header" slot="end" :icon="notificationsOutline"></ion-icon>
      
      <ion-buttons slot="end" @click="abrirMenu()">
        <ion-button @click="abrirMenu()">
          <ion-avatar slot="end" class="foto" >
            <img alt="foto de perfil":src="`https://api.dicebear.com/7.x/pixel-art/svg?seed=`+`jfdklfjdflsk.png`" />
          </ion-avatar>
        </ion-button>
      </ion-buttons>
      <!-- Modificado para cambiar el logo según el tema -->
      <ion-img :src="isLightMode ? '/blog_logo_black.png' : '/blog_logo_white.png'" alt="logo" class="logo-centered"></ion-img>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { IonHeader, IonToolbar, IonImg, IonIcon, IonAvatar, menuController, IonButtons, IonButton} from '@ionic/vue';
import { sunnyOutline, notificationsOutline, searchOutline,moonOutline } from 'ionicons/icons';
import storageService from '@/services/storageService';
import themeService from '@/services/themeService';
import { onMounted, ref, inject, onUnmounted } from 'vue';
import axios from 'axios';

let foto_perfil_usu = ref('');
const global_api = inject('global_api');
const global_repo_path = inject('global_repo_path');
const isLightMode = ref(false);

// Función para detectar si el tema es claro
const checkTheme = () => {
  const hasLightClass = document.documentElement.classList.contains('light');
  isLightMode.value = hasLightClass;
  console.log('Theme checked:', hasLightClass ? 'light' : 'dark');
};

// Observer para detectar cambios en las clases del documentElement
let observer: MutationObserver | null = null;

const abrirMenu = async() => {
  console.log("proceso 1");
  await menuController.open('main-menu');
  console.log("proceso 2");
}

const getFotoPerfil = async() => {
  try {
    foto_perfil_usu.value = "https://i.pinimg.com/originals/01/68/18/016818cb3a69bf06480cae4a751835cb.jpg";
    console.log(foto_perfil_usu);
  } catch (error) {
    console.log(error);
  }
}

// Función para cambiar el tema
const toggleTheme = async () => {
  await themeService.toggleTheme();
  await updateThemeState();
};

// Actualiza el estado del tema
const updateThemeState = async () => {
  const theme = await themeService.getTheme();
  isLightMode.value = theme === 'light';
};

onMounted(async () => {
  getFotoPerfil();
  await themeService.initTheme();
  checkTheme();

  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        checkTheme();
      }
    });
  });
  
  // Observar cambios en el documentElement
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Configurar listener para cambios en el tema
  window.addEventListener('storage', updateThemeState);
});

onUnmounted(() => {
  // Limpiar el observer
  if (observer) {
    observer.disconnect();
  }
  
  window.removeEventListener('storage', checkTheme);
  document.removeEventListener('visibilitychange', checkTheme);
});
</script>

<style scoped>
.foto{
  width: 2em;
  height: 2em;
  margin-right: 10px;
}

.ion-icon-header{
  margin-right: 0.05vw;
  width: 1.5em;
  height: 1em;
  cursor: pointer; /* Añadir cursor pointer para indicar que es clickeable */
}

.logo-centered {
  width: 8em;
  height: 4em;
  position: absolute;
  left: 0%; 
  margin-top: -25px;
  padding: 10px;
  object-fit: contain;
}

ion-toolbar {
  --background: var(--ion-toolbar-background);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0px;
  min-height: 4em;
}

ion-icon {
  color: var(--ion-text-color); /* Usar variable para permitir cambio con el tema */
}
</style>