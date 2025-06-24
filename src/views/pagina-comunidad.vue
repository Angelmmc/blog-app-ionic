<template>
  <ion-page>
    <ToolBar />
    <ion-content :fullscreen="true">
      <div class="custom-title-container">
        <h1 class="custom-title">Comunidad<strong class="title-dot">.</strong></h1><br>
      </div>
      <hr class="title-divider">
      <div class="tabs-container">
        <div class="tab-option" :class="{ 'selected': selectedTab === 'seguidos' }" @click="selectedTab = 'seguidos'">Seguidos</div>
        <div class="tab-option" :class="{ 'selected': selectedTab === 'seguidores' }" @click="selectedTab = 'seguidores'">Seguidores</div>
        <div class="tab-option" :class="{ 'selected': selectedTab === 'comunidad' }" @click="selectedTab = 'comunidad'">Comunidad</div>
      </div>
      <div class="scroll-container" ref="scrollContainer">
        <ProfileConainer
        v-for="(usuario, index) in usuarios"
        :key="index"
        :id="usuario.ID_FOLLOW"
        :nombre="usuario.NOMBRE"
        :usuario="usuario.USUARIO"
        :biografia="usuario.BIOGRAFIA"
        :foto_perfil="usuario.FOTO_PERFIL"
        @click="ir_perfil(usuario.ID_FOLLOW || usuario.ID_FOLLOWER || usuario.ID)"
        />

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonContent, IonIcon, IonCard, IonGrid, IonRow, IonButton, 
  IonCol, IonAvatar, IonFab, IonFabButton } from '@ionic/vue';
import { computed, inject, onMounted, ref, watch } from 'vue';
import { pencil, add } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ToolBar from '@/components/ToolBar.vue';
import ProfileConainer from '@/components/ProfileContainer.vue';  
import storageService from '@/services/storageService';

const global_api = inject('global_api');
const global_repo_path = inject('global_repo_path');
const router = useRouter();
const idUsuario = ref('');
const scrollContainer = ref<HTMLElement | null>(null);
const selectedTab = ref('seguidos');
 axios.defaults.headers.common['token'] = "123";

 const usuarios = ref<any>({
    ID: "",
    NOMBRE: " ",
    USUARIO: "",
    BIOGRAFIA: "",
    FOTO_PERFIL: "",
  });


// Función para ir al inicio del scroll
function irAlInicio() {
  scrollContainer.value?.scrollTo({
    top: 0,
    behavior: 'auto'
  });
}


const fetchData = async (endpoint: string) => {
  try {
    console.log("Llamando a la API con el endpoint:", (global_api + endpoint));
    const response = await fetch(endpoint);
    const data = await response.json();
    usuarios.value = data.data;
    console.log("Datos obtenidos:", usuarios.value);
    irAlInicio();
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};

 const ir_perfil = async (id: string | string[]) => {
    router.push(`/paginas/perfil/${id}`);
  };

//Watcher para cambiar la llamada a la api basado en que valor del menú hay
watch(selectedTab, (Tab) => {
  let endpoint = '';

  // Definir el endpoint según el tab seleccionado
  switch (Tab) {
    case 'seguidos':
      endpoint = `/data/community_follows.json`;     
      break;
    case 'seguidores':
      endpoint = `/data/community_followers.json`;
      break;
    case 'comunidad':
      endpoint = `/data/community_community.json`;
      break;
  }

  // Llamar a la función fetchData con el endpoint correspondiente
  fetchData(endpoint);
});
      
onMounted(async () => {
  idUsuario.value = await storageService.getItem('id-usuario') || '';
  await fetchData("/data/community_follows.json"); 

});

</script>

<style scoped>
/* Estilos que respetan la clase raíz del tema */
ion-content {
  --background: var(--app-background);
}

.title-dot {
  color: #179ace;
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


/* Asegurar que la lista sea desplazable */
.scroll-container {
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto; /* Habilita el scroll vertical */
  padding-left: 3%;
  padding-right: 3%;
}

ion-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto;
}
</style>