<template>
  <ion-grid>
    <ion-card 
      :class="{
        'color-1': color === '1', 
        'color-2': color === '2', 
        'color-3': color === '3',
        [textClass]: true
      }">
      <ion-card-content>
        <ion-img src="/flecha-correcta.png" alt="logo"></ion-img>
        <ion-card-subtitle class="sub">Publicado el {{ fecha }}</ion-card-subtitle>
        <ion-card-title style="font-family: 'Roboto Serif', serif">
          {{ titulo }}
        </ion-card-title>
        <ion-chip color="gray">
          <ion-avatar>
             <img alt="foto de perfil":src="`https://api.dicebear.com/7.x/pixel-art/svg?seed=`+foto_perfil" />
          </ion-avatar>
          <ion-label style="font-family: 'Roboto', serif">Un Blog de <u>{{ usuario }}</u></ion-label>
        </ion-chip>
        <ion-card-subtitle>{{ descripcion }}</ion-card-subtitle>
        <ion-row class="icon-container">
          
          <ion-col class="left-icons">
            <IonIcon :icon="heartOutline" />
            <ion-label class="numeros">{{ likes }}</ion-label>
            <IonIcon :icon="chatboxEllipsesOutline" />
            <ion-label class="numeros">{{ comentarios }}</ion-label>
            <!-- Ícono de bookmark con funcionalidad de guardar/eliminar -->
            <IonIcon 
              :icon="isBookmarked ? bookmark : bookmarkOutline" 
              :class="{ 
                'bookmarked': isBookmarked, 
                'saving': isSaving,
                'bookmark-icon': true
              }"
              @click.stop="handleBookmarkToggle"
            />
          </ion-col>

          <ion-col class="right-icons" size="auto">
            <ion-label class="numeros">{{ tiempo_lectura }} min</ion-label>
            <div class="line"></div>
            <ion-label class="numeros">{{ vistas }} Lecturas</ion-label>
          </ion-col>
        </ion-row>
      </ion-card-content>
    </ion-card>
  </ion-grid>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonChip, IonCardSubtitle, IonLabel, IonAvatar, IonImg, IonCardTitle, IonGrid, IonIcon, IonCol, IonRow } from '@ionic/vue';
import { heartOutline, chatboxEllipsesOutline, bookmarkOutline, bookmark } from 'ionicons/icons';
import { computed, inject, ref, onMounted} from 'vue';
import axios from 'axios';
import storageService from '@/services/storageService';

const global_repo_path = inject('global_repo_path');
const global_api = inject('global_api');

// Estados para el bookmark
const isBookmarked = ref(false);
const isSaving = ref(false);
const isLoading = ref(true);

const props = defineProps({
  id: [String, Number],
  fecha: String,
  titulo: String,
  foto_perfil: String,
  usuario: String,
  descripcion: String,
  color: String,
  likes: String,
  comentarios: String,
  tiempo_lectura: Number,
  vistas: String,
  forceTheme: {
    type: String,
    default: null
  }
});

const textClass = computed(() => {
  return props.color === '2' || props.color == undefined ? 'black-text' : 'white-text';
});

/*----- Funciones para la funcionalidad de guardado -----*/
const checkIfBookmarked = async () => {
  try {
    const userId = await storageService.getItem('id-usuario');
    
    if (!userId || !props.id) {
      isLoading.value = false;
      return;
    }
    const savedBlogs = await storageService.getItem(`blogs-guardados-${userId}`) || [];
    const isCurrentBlogSaved = savedBlogs.includes(props.id.toString());
    isBookmarked.value = isCurrentBlogSaved;
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const updateStorageBookmarks = async (blogId: string | number, action: 'add' | 'remove') => {
  try {
    const userId = await storageService.getItem('id-usuario');
    if (!userId) return;
    const storageKey = `blogs-guardados-${userId}`;
    let savedBlogs = await storageService.getItem(storageKey) || [];
    
    if (!Array.isArray(savedBlogs)) {
      savedBlogs = [];
    }
    const blogIdStr = blogId.toString();
    if (action === 'add') {
      if (!savedBlogs.includes(blogIdStr)) {
        savedBlogs.push(blogIdStr);
        await storageService.setItem(storageKey, savedBlogs);
      }
    } else if (action === 'remove') {
      const index = savedBlogs.indexOf(blogIdStr);
      if (index > -1) {
        savedBlogs.splice(index, 1);
        await storageService.setItem(storageKey, savedBlogs);
      }
    }
  } catch (error) {
  }
};
const handleBookmarkToggle = async (event: Event) => {
  event.preventDefault();
  event.stopPropagation();

  if (isSaving.value || isLoading.value || !props.id) return;

  try {
    isSaving.value = true;

    // Obtener el ID del usuario (opcional si lo necesitas para lógica interna)
    const userId = await storageService.getItem('id-usuario');
    if (!userId) return;

    // Solo cambia el estado visual y lo guarda en localStorage (opcional)
    isBookmarked.value = !isBookmarked.value;

    await updateStorageBookmarks(props.id, isBookmarked.value ? 'add' : 'remove');

  } catch (error) {
    // Error silencioso
  } finally {
    isSaving.value = false;
  }
};

// Verificar el estado al montar el componente
onMounted(() => {
  checkIfBookmarked();
});
</script>

<style scoped>
ion-card {
  margin-bottom: -10px;
  border-radius: 15px;
  height: auto;
  box-shadow: inset 0px 5px 5px rgba(0, 0, 0, 0.2);
  font-family: 'Roboto', sans-serif;
}


.color-1 {
  background-color: #585656 !important;
}

.color-2 {
  background-color: #E9EAE4 !important; 
}

.color-3 {
  background-color: #E19693 !important;
}

ion-avatar {
  --border-radius: 8px;
}

ion-card-title {
  font-size: 14px;
  font-family: 'Times New Roman', Times, serif;
}

ion-card-subtitle {
  font-size: 12px;
}

.sub{
  margin-top: 12px;
}

ion-label {
  font-size: 10px;
}

ion-chip {
  margin-left: -5px;
}

ion-avatar {
  width: 23px;
  height: 23px;
}

ion-img{
  right: 10px;
  position: absolute;
  width: 20px;
  margin-top: -5px;
  margin-right: 5px;
}

.icon-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.left-icons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.right-icons {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
}

.line {
  width: 1px;
  height: 16px;
  background-color: gray;
  margin: 0 8px;
}

.white-text ion-card-title {
  color: white /* Título completamente blanco */
}

.white-text ion-card-subtitle,
.white-text ion-label {
  color: rgba(255, 255, 255, 0.8); 
}

.white-text ion-card-subtitle.sub {
  color: rgba(255, 255, 255, 0.75); 
}

.black-text ion-card-title {
  color: #333; /* Título oscuro */
}

.black-text ion-card-subtitle,
.black-text ion-label {
  color: rgba(0, 0, 0, 0.8); 
}

.black-text ion-card-subtitle.sub {
  color: rgba(0, 0, 0, 0.75); 
}

.black-text u {
  color: #555; /* Color para el texto subrayado */
}

/* Estilos para el ícono de bookmark */
.bookmark-icon {
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 2px;
  border-radius: 4px;
}
.bookmark-icon:hover {
  transform: scale(1.15);
  background-color: rgba(225, 150, 147, 0.1);
}
.bookmarked {
  color: #179ace !important;
  animation: bookmarkSaved 0.4s ease;
}
.saving {
  opacity: 0.6;
  animation: pulse 1.5s infinite;
  pointer-events: none; /* Evitar clicks durante la carga */
}
/* Animaciones */
@keyframes bookmarkSaved {
  0% { 
    transform: scale(1); 
  }
  50% { 
    transform: scale(1.2); 
    color: #E19693;
  }
  100% { 
    transform: scale(1); 
  }
}
@keyframes pulse {
  0% { 
    opacity: 0.6; 
  }
  50% { 
    opacity: 1; 
  }
  100% { 
    opacity: 0.6; 
  }
}
</style>