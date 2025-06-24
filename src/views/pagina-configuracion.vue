 <template>
 <ion-page>
    <IonHeader>
      <ToolBar />
    </IonHeader>
    <ion-content :fullscreen="true">
      <div class="custom-title-container">
        <h1 class="custom-title">Configuración<strong class="title-dot">.</strong></h1><br>
      </div>
      <hr class="title-divider">
      
      <!-- Empty state -->
      <div class="empty-state">
        <ion-icon :icon="hammerOutline" size="large"></ion-icon>
        <h2>Sección en construcción</h2>
        <p>Esta sección no pudo ser contemplada durante la duración del proyecto.</p>
      </div>
      <!-- Blogs guardados -->
      <div  class="scroll-container" ref="scrollContainer">
        <ExploreContainer
          v-for="(blog, index) in blogsGuardados"
          :key="blog.ID"
          :id="blog.ID"
          :fecha="formatearFecha(blog.FECHA_CREACION || blog.FECHA_PUBLICACION)"
          :titulo="blog.TITULO"
          :foto_perfil="blog.FOTO_PERFIL"
          :usuario="blog.USUARIO"
          :descripcion="blog.DESCRIPCION"
          :color="blog.ID_COLOR || '2'"
          :likes="blog.LIKES"
          :comentarios="blog.COMENTARIOS"
          :tiempo_lectura="Math.ceil(blog.TIEMPO_LECTURA)"
          :vistas="blog.VISTAS"
          @click="handleClick(blog.ID)"
          @bookmark-removed="handleBookmarkRemoved"
        />
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { IonPage, IonContent, IonHeader, IonSpinner, IonIcon, onIonViewWillEnter } from '@ionic/vue';
import { hammerOutline } from 'ionicons/icons';
import { ref, onMounted, onBeforeUnmount, inject } from 'vue';
import { useRouter } from 'vue-router';
import ExploreContainer from '@/components/ExploreContainer.vue';
import ToolBar from '@/components/ToolBar.vue';
import axios from 'axios';
import storageService from '@/services/storageService';
import themeService from '@/services/themeService';
const global_api = inject('global_api');
const router = useRouter();
// Estados reactivos
const blogsGuardados = ref<any[]>([]);
const loading = ref(true);
const scrollContainer = ref<HTMLElement | null>(null);
const isLightMode = ref(false);
// Función para actualizar el estado del tema
const updateThemeState = async () => {
  const theme = await themeService.getTheme();
  isLightMode.value = theme === 'light';
};
// Configurar headers de axios
axios.defaults.headers.common['token'] = "123";
// Función para obtener los blogs guardados del usuario
const fetchBlogsGuardados = async () => {
  try {
    loading.value = true;
    
    const userId = await storageService.getItem('id-usuario');
    if (!userId) return;
    
    const response = await axios.get(`${global_api}blog/guardados?id=${userId}`);
    
    // Obtener los blogs de la respuesta
    const blogs = response.data?.data || response.data || [];
    
    // Filtrar solo los blogs no archivados
    blogsGuardados.value = blogs.filter((blog: any) => 
      blog.ARCHIVADO === 0 || blog.ARCHIVADO === '0' || !blog.ARCHIVADO
    );
    
    scrollToTop();
    
  } catch (error) {
    console.error('Error al obtener blogs guardados:', error);
    blogsGuardados.value = [];
  } finally {
    loading.value = false;
  }
};
const scrollToTop = () => {
  scrollContainer.value?.scrollTo({ top: 0, behavior: 'auto' });
};
// Función para manejar cuando se elimina un bookmark
const handleBookmarkRemoved = (blogData: any) => {
  blogsGuardados.value = blogsGuardados.value.filter(blog => blog.ID !== blogData.id);
};
// Función para manejar el click en un blog
const handleClick = (id: number) => {
  router.push(`/paginas/blog/${id}`);
};
// Función para formatear fechas
const formatearFecha = (fechaStr: string) => {
  const fecha = new Date(fechaStr);
  return `${fecha.getDate()} de ${["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][fecha.getMonth()]} de ${fecha.getFullYear()}`;
};
// Cargar datos al montar el componente
onIonViewWillEnter(async () => {
  await fetchBlogsGuardados();
  await updateThemeState();
  window.addEventListener('storage', updateThemeState);
});
onBeforeUnmount(() => {
  window.removeEventListener('storage', updateThemeState);
});
</script>
<style scoped>
/* Usar los mismos estilos que la página de Inicio */
.scroll-container {
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
  padding-left: 3%;
  padding-right: 3%;
}
ion-content {
  --background: #363636;
}
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
  color: white;
}
:root.light .custom-title {
  color: #121212;
}
.title-dot {
  color: #E19693;
}
.title-divider {
  border: none;
  height: 1px;
  background-color: var(--ion-text-color);
  width: 95%;
  opacity: 0.5;
  margin-top: -1vh;
  margin-bottom: 2vh;
}
/* Estados de loading y empty */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 16px;
}
.loading-container p {
  color: white;
  font-family: 'Roboto', sans-serif;
}
:root.light .loading-container p {
  color: #121212;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  padding: 32px;
  gap: 16px;
}
.empty-state ion-icon {
  color: #ccc;
  margin-bottom: 16px;
}
:root.light .empty-state ion-icon {
  color: #999;
}
.empty-state h2 {
  color: white;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  margin: 0;
}
:root.light .empty-state h2 {
  color: #121212;
}
.empty-state p {
  color: white;
  opacity: 0.7;
  font-family: 'Roboto', sans-serif;
  line-height: 1.5;
  max-width: 300px;
}
:root.light .empty-state p {
  color: #121212;
}
/* Animación suave */
.scroll-container {
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>