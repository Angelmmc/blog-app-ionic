<template>
  <ion-page>
    <BotonFlotanteEditar/>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="inicio" href="/paginas/inicio">
          <ion-icon aria-hidden="true" :icon="home" />
          <ion-label>Inicio</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="mi-perfil" :href="`/paginas/perfil/${id}`">
          <ion-icon aria-hidden="true" :icon="person" />
          <ion-label>Mi perfil</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="comunidad" href="/paginas/comunidad">
          <ion-icon aria-hidden="true" :icon="people" />
          <ion-label>Comunidad</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="guardados" href="/paginas/guardados">
          <ion-icon aria-hidden="true" :icon="bookmark" />
          <ion-label>Guardados</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="configuracion" href="/paginas/configuración">
          <ion-icon aria-hidden="true" :icon="cog" />
          <ion-label>Configuración</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { home, person, people, bookmark, cog } from 'ionicons/icons';
import BotonFlotanteEditar from '@/components/BotonFlotanteEditar.vue';
import storageService from '@/services/storageService';
import themeService from '@/services/themeService';
import { ref, onMounted } from 'vue';

const id = ref('');
const isLightMode = ref(false);


const getCurrentTheme = async () => {
  const theme = await themeService.getTheme();
  isLightMode.value = theme === 'light';
};

const setupThemeListener = () => {
  const observer = new MutationObserver(() => {
    isLightMode.value = document.documentElement.classList.contains('light');
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
};

onMounted(async () => {
  id.value = await storageService.getItem('id-usuario');
  
  // Inicializar el tema
  await getCurrentTheme();
  setupThemeListener();
});
</script>

<style scoped>
/* Barra de navegación - Modo oscuro por defecto */
ion-tab-bar {
  --background: #171717;
  padding: 0;
  height: calc(60px + env(safe-area-inset-bottom)); /* Altura segura */
  padding-bottom: env(safe-area-inset-bottom); 
  display: flex;
  justify-content: space-around;
}

/* Barra de navegación - Modo claro */
:root.light ion-tab-bar {
  --background: #E9EAE4;
}

/* Botones de navegación - Modo oscuro */
ion-tab-button {
  --color: #E98E87;
  --color-selected: #FFFFFF;
  --padding-bottom: calc(8px + env(safe-area-inset-bottom) / 2);
  min-width: 50px; /* Ancho mínimo para cada botón */
  flex: 1; /* Distribución equitativa del espacio */
}

/* Botones de navegación - Modo claro */
:root.light ion-tab-button {
  --color: #E98E87;
  --color-selected: #171717;
}

/* Etiquetas - Modo oscuro */
ion-label {
  color: #FFFFFF;
  font-size: 0.65em;
}

/* Etiquetas - Modo claro */
:root.light ion-label {
  color: #171717; /* Texto oscuro en modo claro */
}

/* Iconos - Modo oscuro */
ion-icon {
  color: #179ace;
  width: 1em;
  height: 1em;
}

/* Iconos seleccionados - Modo oscuro */
ion-tab-button.tab-selected ion-icon {
  color: var(--color-selected);
}

/* Iconos seleccionados - Modo claro (aplica automáticamente por la regla anterior) */
</style>