
<template>
  <ion-page>
    <ion-header>
      <ToolBar />
    </ion-header>

    <ion-content class="ion-padding">
      <div class="custom-title-container">
        <h1 class="custom-title">
          {{ esMiPerfil ? 'Mi Perfil' : 'Perfil' }}
          <strong style="color: #179ace">.</strong></h1><br>
      </div>
      <hr class="title-divider">
      <ion-card class="profile-card" v-if="usuario">
        <ion-grid>
          <ion-row>
            <ion-col size="4">
              <ion-avatar>
               <img alt="foto de perfil":src="`https://api.dicebear.com/7.x/pixel-art/svg?seed=`+usuario.FOTO_PERFIL" />
              </ion-avatar>
            </ion-col>
            <ion-col size="8">
              <ion-row>
                <ion-col size="10">
                  <h2 class="nombre">{{ usuario.NOMBRE }}</h2> 
                </ion-col>
                <ion-col size="2">
                  <ion-fab-button style v-if="esMiPerfil" @click="">
                    <ion-icon :icon="pencil"></ion-icon>
                  </ion-fab-button>
                </ion-col>
              </ion-row>
              <ion-row style="margin-top: -4%;">
                <ion-col>
                  <p class="usuario">@{{ usuario.USUARIO }}</p>
                </ion-col>
              </ion-row>
              <ion-row style="margin-top: -3%;">
                <ion-col size="4">
                  <ion-button fill="solid" size="small" class="opciones">{{totalSeguidores}} <br> Seguidores</ion-button>
                </ion-col>
                <ion-col size="4">
                  <ion-button fill="solid" size="small" class="opciones">{{totalBlogs}} <br> Blogs</ion-button>
                </ion-col>
                <ion-col size="4">
                  <ion-button v-if="esMiPerfil" fill="solid" size="small"@click="" style="--background: white; --color: #179ace" class="opciones">Borradores</ion-button>
                  <ion-button v-else fill="solid" size="small" @click="" class="opciones">Seguir</ion-button>
                </ion-col>
              </ion-row>
            </ion-col>
          </ion-row>
          <ion-row style="margin-top: -3%;">
            <p class="biografia">{{ usuario.BIOGRAFIA }}</p>
          </ion-row>
        </ion-grid>
      </ion-card>

      <!-- Contenedor de scroll igual que en la página de inicio -->
      <div class="scroll-container" ref="scrollContainer">
        <div v-if="blogs.length === 0" class="ion-text-center no-blogs-message">
          ¡Ups! Este escritor aún no ha publicado un blog 📝
        </div>
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
          @click="handleClick(blog.ID)"
          class="explore-item"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonContent, IonIcon, IonCard, IonGrid, IonRow, IonButton, IonCol, IonAvatar, IonFabButton} from '@ionic/vue';
import { computed, inject, onMounted, ref } from 'vue';
import { pencil } from 'ionicons/icons';
import { useRoute, useRouter  } from 'vue-router';
import axios from 'axios';
import ToolBar from '@/components/ToolBar.vue'; 
import ExploreContainer from '@/components/ExploreContainer.vue';
import storageService from '@/services/storageService';

const global_repo_path = inject('global_repo_path');
const route = useRoute();
const router = useRouter();
const usuarioID = route.params.id;
const totalSeguidores = ref(0);
const totalBlogs = ref(0);
const currentBlogIndex = ref(0);
const idSession = ref('');
const esMiPerfil = computed(() => idSession.value == usuarioID);
const scrollContainer = ref<HTMLElement | null>(null);

const usuario = ref<any>({
    ID: "",
    NOMBRE: "",
    BIOGRAFIA: "",
    FOTO_PERFIL: "",
    USUARIO: "",
  });

const blogs = ref<any[]>([]);
   
axios.defaults.headers.common['token'] = "123";

function irAlInicio() {
  scrollContainer.value?.scrollTo({
    top: 0,
    behavior: 'auto'
  });
}

//Obtener la informacion de usuario
const getUsuario = async () => {
  if (usuarioID == "57"){
  try {
    const response = await fetch("/data/user_data.json");
    const data = await response.json();
    usuario.value = data.data;
    console.log('Usuario:', usuario.value);
  }
  catch (error) {
    console.error('Error al obtener el usuario:', error);
  }
} else {
    try {
      const response = await fetch(`data/user_data_dummy.json`);
      const data = await response.json();
      usuario.value = data.data;
      console.log('Usuario:', usuario.value);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  }
}

//Obtener los articulos del usuario
const getArticulos = async () => {
  if(usuarioID == "57"){
  try {
    const response = await fetch("/data/user_blogs.json");
    const data = await response.json();
    blogs.value = data.data;
    totalBlogs.value = data.data.length;
    blogs.value = data.data;
    console.log("blogs", data.data);
    console.log('total blogs:', totalBlogs.value);
    irAlInicio(); // Ir al inicio al cargar nuevos artículos
  }
  catch (error) {
    console.error('Error al obtener el usuario:', error);
  }
}
}

const getTotalSeguidores = async() => {
  const response = await fetch("/data/followers.json");
  const data = await response.json();
  if (data && data.count !== undefined) {
    totalSeguidores.value = data.count;
  } else {
    console.error("La respuesta no contiene la propiedad count", data);
    totalSeguidores.value = 0;
  }
}

const handleClick = (id: number) => {
  // Actualizar el índice actual basado en el ID del blog seleccionado
  const index = blogs.value.findIndex(blog => blog.ID === id);
  if (index !== -1) {
    currentBlogIndex.value = index;
  }
  router.push(`/paginas/blog/${id}`);
};

function formatearFecha(fechaStr: string) {
  const fecha = new Date(fechaStr);
  return `${fecha.getDate()} de ${["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][fecha.getMonth()]} de ${fecha.getFullYear()}`;
}
      
onMounted(async () => {
  idSession.value = await storageService.getItem('id-usuario');
  getUsuario();
  getTotalSeguidores();
  getArticulos();
});

</script>

<style scoped>
/* Estilos que respetan la clase raíz del tema */
ion-content {
  --background: var(--app-background);
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
  color: var(--app-text-color);
}

.title-divider {
  border: none;
  height: 1px;
  background-color: var(--app-text-color);
  width: 95%;
  opacity: 0.5;
  margin-top: -1vh;
  margin-bottom: 2vh;
}

.profile-card {
  background-color: var(--app-background);
  color: var(--app-text-color);
  box-shadow: none;
  border: none;
}

.nombre {
  margin: 0;
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--app-text-color);
}

.usuario {
  margin: 0.2rem 0;
  color: gray;
}

.biografia {
  font-size: 0.8rem;
  line-height: 1.6;
  text-align: justify;
  font-family: 'Roboto';
  color: var(--app-text-color);
}

.no-blogs-message {
  color: var(--app-text-color);
}

.opciones {
  --background: #179ace;
  --color: white;
  --border-radius: 6px;
  width: 108%;
  height: 25px;
  font-size: 0.5em;
}

ion-fab-button {
  --background: #179ace;
  width: 25px;
  height: 25px;
  margin-top: -2px;
  margin-left: -10px;
}

ion-icon {
  width: 15px;
  height: 15px;
}

:root.light ion-icon {
    color: #ffffff;
  }

/* Asegurar que la lista sea desplazable igual que en la página de inicio */
.scroll-container {
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto; /* Habilita el scroll vertical */
  padding-left: 3%;
  padding-right: 3%;
}

/* Asegurar que la lista sea desplazable dentro del ion-content */
.scroll-container {
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto; /* Habilita el scroll vertical */
  padding-left: 3%;
  padding-right: 3%;
}

/* Ajustar el tamaño y estilo de las tarjetas para que coincidan con pagina-inicio */
:deep(.explore-item) {
  transform: scale(0.9);
  transform-origin: center top;
  margin-bottom: -15px; /* Compensar la escala para juntar más las tarjetas */
}

:deep(.explore-item ion-card) {
  --background: #E9EAE4;
  background-color: #E9EAE4;
  border-radius: 10px;
  margin: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Asegurar que todos los elementos internos tengan el color de fondo correcto */
:deep(.explore-item ion-card-content),
:deep(.explore-item ion-item),
:deep(.explore-item .item-native),
:deep(.explore-item .item-inner) {
  --background: #E9EAE4;
  background-color: #E9EAE4;
  --ion-item-background: #E9EAE4;
}
</style>