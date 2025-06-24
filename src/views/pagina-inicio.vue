<template>
  <ion-page>
    <IonHeader>
      <ToolBar />
    </IonHeader>
    <ion-content :fullscreen="true">
      <div class="custom-title-container">
        <h1 class="custom-title">Inicio<strong class="title-dot">.</strong></h1><br>
      </div>
      <hr class="title-divider">
      <div class="tabs-container">
        <div class="tab-option" :class="{ 'selected': selectedTab === 'parati' }" @click="selectedTab = 'parati'">Para ti</div>
        <div class="tab-option" :class="{ 'selected': selectedTab === 'siguiendo' }" @click="selectedTab = 'siguiendo'">Siguiendo</div>
        <div class="tab-option" :class="{ 'selected': selectedTab === 'highlights' }" @click="selectedTab = 'highlights'">Highlights</div>
      </div>
      <div class="scroll-container" ref="scrollContainer">
        <ExploreContainer
          v-for="(blog, index) in blogs"
          :key="index"
          :id="blog.ID"
          :fecha="formatearFecha(blog.FECHA_CREACION || blog.FECHA_PUBLICACION)"
          :titulo="blog.TITULO"
          :foto_perfil="blog.FOTO_PERFIL"
          :usuario="blog.USUARIO"
          :descripcion="blog.DESCRIPCION"
          :color="blog.ID_COLOR"
          :likes="blog.LIKES"
          :comentarios="blog.COMENTARIOS"
          :tiempo_lectura="Math.ceil(blog.TIEMPO_LECTURA)"
          :vistas="blog.VISTAS"
          @click="handleClick(228)"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonHeader } from '@ionic/vue';
import { ref, onMounted, onBeforeUnmount, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import ExploreContainer from '@/components/ExploreContainer.vue';
import axios from 'axios';
import ToolBar from '@/components/ToolBar.vue';
import storageService from '@/services/storageService';
import themeService from '@/services/themeService';

const global_api = inject('global_api');
const router = useRouter();
const selectedTab = ref('parati');
const blogs = ref<any[]>([]);
const loading = ref(true);
const scrollContainer = ref<HTMLElement | null>(null);
const id = ref(null);
const currentBlogIndex = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);
const swipeThreshold = 50; // Reducir el umbral para que sea más sensible
const swipeIndicator = ref(false);
const swipeDirection = ref('');

const isLightMode = ref(false); // Estado para controlar el tema
const loadingSwipe = ref(false); // Estado para el loader

// Función para actualizar el estado del tema
const updateThemeState = async () => {
  const theme = await themeService.getTheme();
  isLightMode.value = theme === 'light';
};

axios.defaults.headers.common['token'] = "123";

// Obtener artículos desde API
const fetchData = async (endpoint: string) => {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    blogs.value = data.data; // Guardar datos en el estado
    console.log("Datos obtenidos:", blogs.value);
    scrollToTop();
  } catch (error) {
    console.error("Error al obtener datos:", error);
  } finally {
    loading.value = false;
  }
};

const scrollToTop = () => {
  scrollContainer.value?.scrollTo({ top: 0, behavior: 'auto' });
};
// Función para abrir un blog aleatorio
const openRandomBlog = () => {
  if (blogs.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * blogs.value.length);
    currentBlogIndex.value = randomIndex;
    const randomBlogId = blogs.value[randomIndex].ID;
    router.push(`/paginas/blog/${randomBlogId}`);
  } else {
    console.error("No hay blogs disponibles para seleccionar aleatoriamente");
  }
};

// Función para mostrar el indicador de swipe y el loader
const showSwipeIndicator = async (direction: string) => {
  swipeDirection.value = direction;
  swipeIndicator.value = true;
  loadingSwipe.value = true;

  // Simular tiempo de carga
  await new Promise((resolve) => setTimeout(resolve, 1000));

  swipeIndicator.value = false;
  loadingSwipe.value = false;
};

//Manejo de Swipe

const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0].clientX;
};
const handleTouchEnd = (event: TouchEvent) => {
  touchEndX.value = event.changedTouches[0].clientX;
  handleSwipe();
};
const handleSwipe = () => {
  const swipeDistance = touchEndX.value - touchStartX.value;

  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {
      navigateToPreviousBlog();
      showSwipeIndicator('right');
    } else {
      navigateToNextBlog();
      showSwipeIndicator('left');
    }
  }
};

// Funciones para navegación
const navigateToNextBlog = () => {
  if (blogs.value.length > 0) {
    currentBlogIndex.value = (currentBlogIndex.value + 1) % blogs.value.length;
    const nextBlogId = blogs.value[currentBlogIndex.value].ID;
    router.push(`/paginas/blog/${nextBlogId}`);
  }
};

const navigateToPreviousBlog = () => {
  if (blogs.value.length > 0) {
    currentBlogIndex.value = (currentBlogIndex.value - 1 + blogs.value.length) % blogs.value.length;
    const prevBlogId = blogs.value[currentBlogIndex.value].ID;
    router.push(`/paginas/blog/${prevBlogId}`);
  }
};

onMounted(async () => {
  await fetchData("/data/blogs.json"); 
  id.value = await storageService.getItem('id-usuario'); //Obtener el id de usuario para consultas  
  openRandomBlog();  // Abrir automáticamente un blog aleatorio
  
  // Obtener el estado inicial del tema
  await updateThemeState();
  
  // Añadir event listeners al documento para capturar swipes en cualquier lugar
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchend', handleTouchEnd);
  
  // Escuchar los cambios en el tema
  window.addEventListener('storage', updateThemeState);
});

onBeforeUnmount(() => {
  document.removeEventListener('touchstart', handleTouchStart);
  document.removeEventListener('touchend', handleTouchEnd);
  window.removeEventListener('storage', updateThemeState);
});

//Watcher para cambiar la llamada a la api basado en que valor del menú hay
watch(selectedTab, (Tab) => {
  let endpoint = '';

  // Definir el endpoint según el tab seleccionado
  switch (Tab) {
    case 'siguiendo':
      endpoint = `/data/blogs_follows.json`;     
      break;
    case 'parati':
      endpoint = `/data/blogs.json`;
      break;
    case 'highlights':
      endpoint = `/data/blogs_highlights.json`;
      break;
  }

  // Llamar a la función fetchData con el endpoint correspondiente
  fetchData(endpoint);
});

const handleClick = (id: number) => {
  router.push(`/paginas/blog/${id}`);
};

function formatearFecha(fechaStr: string) {
  const fecha = new Date(fechaStr);
  return `${fecha.getDate()} de ${["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][fecha.getMonth()]} de ${fecha.getFullYear()}`;
}
</script>

<style scoped>
.scroll-container {
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
  padding-left: 3%;
  padding-right: 3%;
}

ion-content {
  --background: #363636; /* Mantener el fondo original en modo oscuro */
}

/* Estilos específicos para modo claro */
:root.light ion-content {
  --background: #E9EAE4 !important; 
}

.custom-title-container {
  width: 100%;
  display: flex;
  justify-content: left;
  margin-left: 2vh;
}

.custom-title {
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  color: white; /* Color original en modo oscuro */
}

:root.light .custom-title {
  color: #121212; /* Texto oscuro en modo claro */
}

.title-dot {
  color: #179ace;
}

ion-button {
  margin: 0 5px;
}

.tabs-container {
  display: flex;
  justify-content: space-between;
  border-radius: 15px;
  padding: 5px;
  margin: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #E9EAE4; 
  color: black; /* Mantener el color original */
  transform: scale(0.9); /* Escala el contenedor al 90% de su tamaño */
  transform-origin: center; /* Asegura que la escala se aplique desde el centro */
  font-family: 'Roboto', sans-serif;
}

.tab-option {
  flex: 1;
  text-align: center;
  padding: 10px 15px;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tab-option.selected {
  background-color: #179ace;
  color: white;
}

.title-divider {
  border: none; /* Elimina el borde predeterminado */
  height: 1px; /* Altura de la línea */
  background-color: var(--ion-text-color); /* Color de fondo adaptativo */
  width: 95%; /* Ancho de la línea */
  opacity: 0.5; /* Opacidad moderada */
  margin-top: -1vh;
  margin-bottom: 2vh;
}

/* Estilo de botón flotante */
ion-fab-button {
  --background: #179ace; /* Color de fondo */
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra opcional */
}

ion-fab-button ion-icon {
  color: white; /* Color del icono */
  font-size: 24px; /* Tamaño opcional */
}

/* Estilos para el indicador de swipe */
.swipe-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(225, 150, 147, 0.8);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fade-in-out 0.8s ease;
}

.swipe-indicator ion-icon {
  font-size: 28px;
  color: white;
}

@keyframes fade-in-out {
  0% { opacity: 0; }
  30% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0; }
}

.loader {
  display: block;
  --height-of-loader: 4px;
  --loader-color: #0071e2;
  width: 130px;
  height: var(--height-of-loader);
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;
}

.loader::before {
  content: "";
  position: absolute;
  background: var(--loader-color);
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  border-radius: 30px;
  animation: moving 1s ease-in-out infinite;
}

@keyframes moving {
  50% {
    width: 100%;
  }
  100% {
    width: 0;
    right: 0;
    left: unset;
  }
}
</style>
