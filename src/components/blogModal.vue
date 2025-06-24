<!-- components/BlogModalCustom.vue -->
<template>
  <!-- Backdrop/Overlay -->
  <div 
    v-if="isVisible"
    class="modal-backdrop" 
    :class="{ 'backdrop-visible': isExpanded }"
    @click="handleBackdropClick"
  ></div>

  <!-- Modal Content -->
  <div 
    class="custom-modal" 
    :class="{ 
      'modal-visible': isVisible,
      'modal-expanded': isExpanded 
    }"
  >
    <!-- Handle para arrastrar -->
    <div class="modal-handle" @click="toggleMenu"></div>
    
    <!-- Contenido del menú -->
    <div class="menu-container" :class="{ 'menu-visible': isExpanded }">
      <ion-grid>
        <ion-row class="ion-justify-content-around ion-align-items-center">
          <ion-col size="4" class="ion-text-center">
            <ion-icon 
              :icon="colorWand" 
              size="large" 
              @click="() => resaltarTexto()"
              class="menu-icon"
            ></ion-icon>
            <div class="menu-label">Resaltar</div>
          </ion-col>
          <ion-col size="4" class="ion-text-center">
            <ion-icon 
              @click="addBookmark"
              :icon="bookmark" 
              size="large" 
              class="menu-icon"
            ></ion-icon>
            <div class="menu-label">Bookmark</div>
          </ion-col>
          <ion-col size="4" class="ion-text-center">
            <ion-icon 
              @click="eliminarBookmark"
              :icon="trash" 
              size="large" 
              class="menu-icon"
            ></ion-icon>
            <div class="menu-label">Eliminar BM</div>
          </ion-col>
          <ion-col size="4" class="ion-text-center">
            <ion-icon 
              :icon="isJustified ?  menu : filter"
              size="large" 
              @click="cambiarJustificado()"
              class="menu-icon"
            ></ion-icon>
            <div class="menu-label">Alineación</div>
          </ion-col>
          <ion-col size="4" class="ion-text-center" v-if="props.tieneImagenes">
            <ion-icon 
              :icon="mostrarImagen === true ? image : imageOutline"
              size="large" 
              @click="mostrarOcultarImagen()"
              class="menu-icon"
            ></ion-icon>
            <div class="menu-label">Imagenes</div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, inject } from 'vue';
import { IonGrid, IonRow, IonCol, IonIcon } from '@ionic/vue';
import { colorWand, bookmark, filter, menu, image, imageOutline, trash } from 'ionicons/icons';
import { useRoute} from 'vue-router';
import axios from 'axios';
import storageService from '@/services/storageService';
import { showToast } from '@/utils/funcionToast';
import { addIcons } from 'ionicons';

const route = useRoute();
const isJustified = ref(true);
const mostrarImagen = ref(true);
const global_api = inject('global_api');
const selectedText = ref<string>('')
const savedSelection = ref<{text: string, range: Range} | null>(null)
addIcons({ bookmark });
axios.defaults.headers.common['token'] = "123";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  backdropDismiss: {
    type: Boolean,
    default: true
  },
  tieneImagenes: {
    type: Boolean,
    default: false
  },
  blogId:{
    type: String,
    default: null
  }
});

const emit = defineEmits<{
  (e: 'action', value: string): void;
  (e: 'dismiss'): void;
  (e: 'estadoImagen', value: boolean): void;
  (e: 'estadoJustificado', value: boolean): void;
}>();

const isVisible = ref(false);
const isExpanded = ref(false);
const rangy = window.rangy; 

// Extension la interfaz Window para permitir myHighlighter y rangy ya que no son nativos de TypeScript
  declare global {
    interface Window {
      myHighlighter?: any;
      rangy?: any;
    }
  }

  //Objeto para guardar los marcadores de inicio y fin del resaltado y el texto seleccionado
  const highlight = ref({
  startMarkerId: "",
  endMarkerId: "",
  selectedText: ""
  });

// Función para mostrar el modal
const showModal = async () => {
  isVisible.value = true;
  await nextTick();
  // Pequeño delay para permitir que el elemento se renderice
  setTimeout(() => {
    // El modal aparece minimizado por defecto
  }, 10);
};

// Función para ocultar el modal
const hideModal = async () => {
  isExpanded.value = false;
  // Esperar a que termine la animación antes de ocultar completamente
  setTimeout(() => {
    isVisible.value = false;
    emit('dismiss');
  }, 300);
};

// Expandir el menú
const expandMenu = () => {
  isExpanded.value = true;
};

// Minimizar el menú
const minimizeMenu = () => {
  isExpanded.value = false;
};

// Toggle del menú
const toggleMenu = () => {
  if (isExpanded.value) {
    minimizeMenu();
  } else {
    expandMenu();
  }
};

// Manejar click en el backdrop
const handleBackdropClick = () => {
  if (props.backdropDismiss) {
    if (isExpanded.value) {
      minimizeMenu();
    } else {
      hideModal();
    }
  }
};

const cambiarJustificado = () => {
  isJustified.value = !isJustified.value;
  guardarDatoStorage('isJustified', isJustified.value);
  emit('estadoJustificado', isJustified.value);
};

const mostrarOcultarImagen = () => {
  mostrarImagen.value = !mostrarImagen.value;
  guardarDatoStorage('mostrarImagen', mostrarImagen.value);
  emit('estadoImagen', mostrarImagen.value);
  minimizeMenu();
}

/*----- Funciones para la funcionalidad de subrayado de texto -----*/

/* Función para resaltar el texto seleccionado y guardar los parametros para rangy */
function resaltarTexto() {
  const selection = rangy.getSelection();
  if (!window.myHighlighter) 
  {
    window.myHighlighter = rangy.createHighlighter();
    window.myHighlighter.addClassApplier(rangy.createClassApplier('highlight', { ignoreWhiteSpace: true }));
  }

  console.log('Texto seleccionado:', selection.toString());
  if (selection.rangeCount === 0 || selection.isCollapsed) 
  {
  console.warn('No hay selección activa.');
  return;
  }
  window.myHighlighter.highlightSelection('highlight');

  const savedSelection = rangy.saveSelection(selection, true);

  highlight.value.startMarkerId = savedSelection.rangeInfos[0].startMarkerId;
  highlight.value.endMarkerId = savedSelection.rangeInfos[0].endMarkerId;
  highlight.value.selectedText = selection.toString(); 

  console.log('Marcador inicio:', savedSelection.rangeInfos[0].startMarkerId);
  console.log('Marcador fin:', savedSelection.rangeInfos[0].endMarkerId);

  rangy.getSelection().removeAllRanges();
  minimizeMenu();
  guardarResaltado();
  }

// Función para guardar el resaltado y las posiciones en la base de datos
const guardarResaltado  = async() => {

}

/*----- Funciones para la funcionalidad de bookmark -----*/
// Función para actualizar la selección de texto
   function updateSelection(): void {
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      const text = selection.toString().trim();
      if (text.length > 0) {
        selectedText.value = text;
        // Guardar una copia del range para usarlo después
        savedSelection.value = {
          text: text,
          range: selection.getRangeAt(0).cloneRange()
        };
      }
    }
  }

  // Función para agregar bookmark
  const ultimoBookmarkGuardado = ref<null | {
  texto: string,
  id: string
  }>(null);

   async function addBookmark() {;

  if (savedSelection.value && savedSelection.value.text.length > 0) {
    try {
      const bookmarkId = `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const id_usuario = await storageService.getItem('id-usuario');
      const range = savedSelection.value.range;
      const textoSeleccionado = savedSelection.value.text;

      const bookmarkData = {
        id_usuario: id_usuario,
        id_articulo: route.params.id,
        texto_bookmark: textoSeleccionado,
        marca_bookmark: bookmarkId,
        start_position: range.startOffset,
        end_position: range.endOffset,
        archivado: 0
      };

      // Simular guardado offline (opcional: almacenar en localStorage o IndexedDB)
      console.log('Bookmark simulado guardado:', bookmarkData);
      showToast("Bookmark guardado exitosamente", "success", "top");

      // Insertar ícono visual
      const icon = document.createElement('ion-icon');
      icon.setAttribute('name', 'bookmark');
      icon.setAttribute('style', 'color: #F1928D; margin-left: 5px; vertical-align: middle;');
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('slot', 'end');
      icon.setAttribute('class', 'bookmark-icon');
      icon.setAttribute('data-bookmark-id', bookmarkId);

      const endRange = range.cloneRange();
      endRange.collapse(false);
      endRange.insertNode(icon);

      // Guardar localmente (opcional: para sincronizar luego)
      ultimoBookmarkGuardado.value = {
        texto: textoSeleccionado,
        id: bookmarkId
      };

      savedSelection.value = null;
      selectedText.value = '';
    } catch (error) {
      console.error('Error al procesar bookmark:', error);
      showToast("Error al procesar bookmark", "danger", "top");
    }
  } else {
    showToast("Selecciona un texto primero", "warning", "top");
  }
}

   // Función simplificada para eliminar bookmark
  async function eliminarBookmark(): Promise<void> {
  const textoParaEliminar = savedSelection.value?.text || ultimoBookmarkGuardado.value?.texto;

  if (!textoParaEliminar || textoParaEliminar.length === 0) {
    showToast("No hay bookmark reciente ni texto seleccionado para eliminar", "warning", "top");
    return;
  }

  try {
    const id_usuario: string = await storageService.getItem('id-usuario');
    if (!id_usuario) {
      showToast("Error: No se pudo obtener el ID del usuario", "danger", "top");
      return;
    }

    const confirmar = confirm(`¿Eliminar bookmark del texto: "${textoParaEliminar.substring(0, 50)}..."?`);
    if (!confirmar) return;

    // 🧹 Eliminar ícono bookmark del DOM
    const icons = document.querySelectorAll(`ion-icon.bookmark-icon`);
    let encontrado = false;

    icons.forEach((icon) => {
      const parent = icon.parentNode;
      const previousText = icon.previousSibling?.textContent || '';

      if (previousText.includes(textoParaEliminar)) {
        icon.remove();
        encontrado = true;
      }
    });

    if (encontrado) {
      showToast("Bookmark eliminado exitosamente", "success", "top");
      savedSelection.value = null;
      selectedText.value = '';
      ultimoBookmarkGuardado.value = null;

      // Opcional: eliminar del almacenamiento local si lo guardaste antes
      // await updateStorageBookmarks(route.params.id, 'remove');
    } else {
      showToast("No se encontró un bookmark con ese texto", "warning", "top");
    }

  } catch (error) {
    console.error("Error al eliminar bookmark offline:", error);
    showToast("Error al eliminar el bookmark", "danger", "top");
  }
}


const guardarDatoStorage = async (key: string, value: any) => {
  await storageService.setItem(key, value);
};

const getDatoStorage = async () => {
  const mImagen = await storageService.getItem('mostrarImagen');
  const justified = await storageService.getItem('isJustified');
  console.log("imagen storage " + mImagen);
  console.log("imagen " + mostrarImagen.value);
  if (justified === true || justified === false) {
    isJustified.value = justified;
    emit('estadoJustificado', isJustified.value);
  } 

  if (mImagen === true || mImagen === false) {
    mostrarImagen.value = mImagen;
    emit('estadoImagen', mostrarImagen.value);      
  }
};

// Watcher para el prop isOpen
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    showModal();
  } else {
    hideModal();
  }
}, { immediate: true });

// Función para cerrar desde el componente padre
const dismiss = () => {
  hideModal();
};

// Exponer funciones al componente padre
defineExpose({
  dismiss,
  expandMenu,
  minimizeMenu,
  toggleMenu
});

onMounted(async () => {
  getDatoStorage();
  document.addEventListener('selectionchange', updateSelection);
});
</script>

<style scoped>
/* Backdrop/Overlay */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.modal-backdrop.backdrop-visible {
  opacity: 1;
  pointer-events: auto;
}

/* Modal principal */
.custom-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 16px 16px 0 0;
  z-index: 1001;
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  background: var(--ion-color-step-100, #1e1e1e);
}

/* Modal visible (aparece desde abajo) */
.custom-modal.modal-visible {
  transform: translateY(calc(100% - 25px)); /* Solo muestra el handle inicialmente , los pixeles son el tamaño del modal*/
}

/* Modal expandido */
.custom-modal.modal-expanded {
  transform: translateY(0);
}

/* Handle del modal */
.modal-handle {
  width: 40px;
  height: 4px;
  background: var(--ion-color-medium);
  border-radius: 2px;
  margin: 16px auto 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.modal-handle::before {
  content: '';
  position: absolute;
  top: -12px;
  left: -20px;
  right: -20px;
  bottom: -12px;
  /* Área de toque más grande */
}

.modal-handle:active {
  transform: scaleY(1.5);
}

/* Contenedor del menú */
.menu-container {
  padding: 16px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.menu-container.menu-visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* Iconos del menú */
.menu-icon {
  color:  #e98e87;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px;
  border-radius: 50%;
}

.menu-icon:active {
  transform: scale(0.95);
}

/* Labels del menú */
.menu-label {
  margin-top: 8px;
  font-size: 12px;
  color: white;
  font-weight: 500;
}


/* Animación adicional para entrada suave */
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(calc(100% - 60px));
  }
}

.custom-modal.modal-visible {
  animation: slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
</style>