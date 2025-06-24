<template>
  <ion-page>
    <ToolBar :mostrarExtras="true" :tiene-imagenes="tieneImagenes" @estado-imagen="cambiarEstadoImagen" @estado-justificado="cambiarEstadoJustificado"/>
    <ion-content>
      <!-- Loader mientras los datos se cargan -->
      <div v-if="loading" class="loader-container">
        <div class="loader"></div>
        <p>Cargando contenido...</p>
      </div>
      <!-- Mostrar contenido solo cuando no está cargando -->
      <ion-grid v-else >
        <!-- Contenedor scroll del blog para capturar progreso de lectura -->
        <div v-if="blog" class="my-scroll-container" ref="miDiv" @scroll="handleScroll">
          <Transition name="fade-slide-down" appear>
            <ion-row v-show="!loading">
              <ion-col>
                <strong class="titulo">{{ blog.TITULO }}</strong><br>
                <ion-text class="descripcion">{{blog.DESCRIPCION}}</ion-text>
              </ion-col>
            </ion-row>
          </Transition>

          <Transition name="fade-slide-left" appear>
            <ion-row v-show="!loading" class="contenedor-info-autor">
              <ion-col size="2">
                <ion-avatar>
                  <img alt="foto de perfil":src="`https://api.dicebear.com/7.x/pixel-art/svg?seed=`+blog.FOTO_PERFIL" />
                </ion-avatar>
              </ion-col>
              <ion-col size="10"  :style="{
                        marginTop:
                          blog.BIOGRAFIA && blog.BIOGRAFIA.length > 230 ? '0.3%'
                          : blog.BIOGRAFIA && blog.BIOGRAFIA.length > 150 ? '2.1%'
                          : blog.BIOGRAFIA && blog.BIOGRAFIA.length > 100 ? '2.4%'
                          : blog.BIOGRAFIA && blog.BIOGRAFIA.length > 50 ? '2.7%'
                          : '2.9%' 
                        }" @click="ir_perfil(blog.AUTHOR)">
                <ion-row>
                  <ion-col size="12">
                    <b class="nom-usu">{{ blog.USUARIO }}</b>
                  </ion-col>
                </ion-row>
                <ion-row class="contenedor-biografia">
                  <ion-col size="12">
                    <p class="biografia">{{ blog.BIOGRAFIA }}</p>
                  </ion-col>
                </ion-row>
              </ion-col>
            </ion-row>
          </Transition>

          <Transition name="scale-width" appear>
            <ion-row v-show="!loading" class="double-line"
            :style="{
                      marginTop: 
                        !blog.BIOGRAFIA || blog.BIOGRAFIA.length === 0 ? '0vh' :
                        blog.BIOGRAFIA.length > 230 ? '10vh' :
                        blog.BIOGRAFIA.length > 150 ? '9vh' :
                        blog.BIOGRAFIA.length > 100 ? '5.5vh' :
                        blog.BIOGRAFIA.length > 50 ? '3.5vh' :
                        '3vh'
                    }">
            </ion-row>
          </Transition>

          <Transition name="fade" appear>
            <ion-row v-show="!loading">
              <ion-col size="12" class="icon-container">
                <ion-icon :icon="playCircleOutline"></ion-icon>
                <ion-icon :icon="shareSocialOutline"></ion-icon>
              </ion-col>
            </ion-row>
          </Transition>

          <Transition name="scale-width" appear>
            <ion-row v-show="!loading" class="double-line2"></ion-row>
          </Transition>

          <div :class="{
                        'fade-in-progreso': mostrandoProgreso,
                        'fade-out-progreso': !mostrandoProgreso
                      }"
                      class="floating-text">
          {{ progresoDeLectura + '%' }}
          </div>

          <Transition name="fade-slide-up" appear>
            <ion-row v-show="!loading" class="contenedor-blog" :style="{ textAlign: estadoJustificado ? 'justify' : 'left' }">
              <ion-col>
                <div v-show="estadoImagen">
                  <div v-html="blog.CONTENIDO"></div>
                </div>
                <div v-show="!estadoImagen">
                  <div v-html="contenidoSinImagenes"></div>
                </div>
              </ion-col>
            </ion-row>
          </Transition>

          <!-- Botón emergente que sale al seleccionar texto -->
          <button v-if="mostrarBotonResaltar"
          :style="{
                    position: 'absolute',
                    top: posicionBoton.y + 'px',
                    left: posicionBoton.x + 'px',
                    zIndex: 9999
                  }"
          class="btn-resaltar"><ion-icon  :icon="colorWand" class="menu-icon" onclick=""></ion-icon>
        </button>
        </div>
        
        <Transition name="fade-slide-up" appear>
          <ion-row v-show="!loading" class="titulo2">
            <ion-col>
              <h1 style="font-family: 'Tinos'; text-align: center; font-size: 21.65px;">MAS blogS</h1>
            </ion-col>
          </ion-row>
        </Transition>
        
        <Transition name="fade" appear>
          <hr v-show="!loading">
        </Transition>
        
        <!-- Loader para la sección de más blogs si están cargando por separado -->
        <div v-if="loadingRelated" class="loader-container-small">
          <div class="loader-small"></div>
        </div>
        
        <!-- Lista de blogs relacionados -->
        <TransitionGroup 
          v-else 
          name="list-stagger" 
          tag="div" 
          class="contenedor-mas-blogs"
        >
          <ion-row v-for="(relatedBlog, index) in blogs" :key="relatedBlog.ID" class="blog-item" :style="{ '--index': index }">
            <ion-col size="12">
              <ExploreContainerAlternativo 
                :id="relatedBlog.ID"
                :fecha="formatearFecha(relatedBlog.FECHA_CREACION)"
                :titulo="relatedBlog.TITULO"
                :foto_perfil="relatedBlog.FOTO_PERFIL"
                :usuario="relatedBlog.USUARIO"
                :descripcion="relatedBlog.DESCRIPCION"
                :color="relatedBlog.VALOR_HEX"
                :likes="relatedBlog.LIKES"
                :tiempo_lectura="Math.ceil(relatedBlog.TIEMPO_LECTURA)"
                @click="handleClick(relatedBlog.ID)"
              />
            </ion-col>
          </ion-row>
        </TransitionGroup>
      </ion-grid>
    
      <!-- Área para abrir el menú de opciones -->
    <BlogModal 
    v-if="blog"
    :is-open="showModal"
    @estado-justificado="cambiarEstadoJustificado" 
    @estado-imagen="cambiarEstadoImagen"
    :tiene-imagenes="tieneImagenes" 
     :blog-id="blog.ID || null"
    />

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { shareSocialOutline, playCircleOutline, colorWand} from 'ionicons/icons';
  import { IonPage, IonContent, IonAvatar, IonText, IonCol, IonIcon, IonRow, IonGrid, onIonViewWillLeave} from '@ionic/vue';
  import { ref, onMounted, computed, watch, onBeforeUnmount, inject } from 'vue';
  import axios from 'axios';
  import { useRoute, useRouter} from 'vue-router';
  import ToolBar from '@/components/ToolBar.vue';
  import ExploreContainerAlternativo from '@/components/ExploreContainerAlternativo.vue';
  import BlogModal from '@/components/blogModal.vue';
  import storageService from '@/services/storageService';

  const global_api = inject('global_api');
  const global_repo_path = inject('global_repo_path');

  const route = useRoute();
  const router = useRouter();
  const blogs = ref<any[]>([]);
  const estadoImagen = ref(true);
  const estadoJustificado = ref(true);
  const loading = ref(true);
  const loadingRelated = ref(true);
  const miDiv = ref<HTMLDivElement | null>(null)
  const progresoDeLectura = ref()
  const mostrandoProgreso = ref(false)
  const intervalId = ref<ReturnType<typeof setInterval> | null>(null);
  let tiempoScroll: ReturnType<typeof setTimeout> | number = -1

  const showModal = ref(true);

  const mostrarBotonResaltar = ref(false);
  const posicionBoton = ref({ x: 0, y: 0 });

  // Estado para controlar si estamos en una transición
  const isTransitioning = ref(false);

  // Blog inicial vacío con propiedades definidas para evitar errores
  const blog = ref<any>({
    ID: "",
    TITULO: " ",
    DESCRIPCION: "",
    CONTENIDO: "",
    USUARIO: "",
    BIOGRAFIA: "",
    FOTO_PERFIL: "",
    AUTHOR: ""
  });

  // Remover imágenes del contenido
  const contenidoSinImagenes = computed(() => {
    if (!blog.value.CONTENIDO) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = blog.value.CONTENIDO;
    const imgs = tempDiv.getElementsByTagName('img');
    while (imgs.length > 0) {
      imgs[0].remove();
    }
    return tempDiv.innerHTML;
  });

  // Computed para verificar si hay imágenes en el contenido
  const tieneImagenes = computed(() => {
    if (!blog.value.CONTENIDO) return false;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = blog.value.CONTENIDO;
    return tempDiv.getElementsByTagName('img').length > 0;
  });

  // Configurar axios
  axios.defaults.headers.common['token'] = "123";
  
  // Obtener datos del blog desde la API
  const fetchData = async (id: string | string[]) => {
    // Activar estados de carga
    loading.value = true;
    loadingRelated.value = true;
    
    try {
      // Obtener detalles del blog actual
      const response = await fetch("/data/single_blog.json");
      const data = await response.json();
      blog.value = data.data;
      console.log("Blog obtenido:", blog.value);
      
      // Después de obtener los detalles principales, desactivamos el loader principal
      loading.value = false;
      
      // Obtener blogs relacionados (más blogs)
      const response2 = await fetch("/data/blogs.json");
      const data2 = await response2.json();
      blogs.value = data2.data;
      if (data && data2) {
        // Añadimos un pequeño timeout para que la animación de los blogs se vea mejor
        setTimeout(() => {
          blogs.value = data2.data.slice(0, 5);
          loadingRelated.value = false;
        }, 300);
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      // Incluso en caso de error, desactivamos los loaders para no bloquear la UI
      blog.value = {
        ID: "",
        TITULO: "Error al cargar",
        DESCRIPCION: "No se pudo obtener la información del blog",
        CONTENIDO: "<p>Hubo un problema al cargar este contenido. Por favor, intenta nuevamente.</p>",
        USUARIO: "",
        BIOGRAFIA: "",
        FOTO_PERFIL: "",
        AUTHOR: ""
      };
      loading.value = false;
      loadingRelated.value = false;
    }
  }; 

  const ir_perfil = async (id: string | string[]) => {
    router.push(`/paginas/perfil/${id}`);
  };

  // Gestionar clic en blog relacionado con animación de salida
  const handleClick = (id: number) => {
    if (isTransitioning.value) return;
    isTransitioning.value = true;
    
    // Primero activamos una clase en el body para la animación de salida
    document.body.classList.add('page-transition-out');
    
    // Esperamos a que la animación termine antes de navegar
    setTimeout(() => {
      // Activar loader antes de navegar
      loading.value = true;
      loadingRelated.value = true;
      
      // Usar window.location.href para forzar una recarga completa de la página
      window.location.href = `/paginas/blog/${id}`;
    }, 300);
  };

  function formatearFecha(fechaStr: string) {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return `${fecha.getDate()} de ${["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][fecha.getMonth()]} de ${fecha.getFullYear()}`;
  }

  function cambiarEstadoImagen(valor: boolean) {
    estadoImagen.value = valor;
  }

  function cambiarEstadoJustificado(valor: boolean) {
    estadoJustificado.value = valor;
  }

  // Función para manejar el scroll y calcular el progreso de lectura
  const handleScroll = () => {
  const el = miDiv.value
  if (!el) return

  const scrollTop = el.scrollTop
  const scrollHeight = el.scrollHeight
  const clientHeight = el.clientHeight
  

  const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100
  progresoDeLectura.value = Math.min(Math.round(scrollPercent), 100)

  // Mostrar el indicador con animación de entrada
  mostrandoProgreso.value = true

  // Limpiar el timeout anterior, si existe
  if (tiempoScroll !== -1) clearTimeout(tiempoScroll)

  // Establecer un nuevo timeout para ocultar
  tiempoScroll = setTimeout(() => {
    mostrandoProgreso.value = false
  }, 2000)

}

  const guardarProgreso = async() => {
    let id_usuario = await storageService.getItem('id-usuario')

    let progreso = progresoDeLectura.value;
    console.log("Progreso de lectura:", progreso)

    const post_data = {
            id_usuario: id_usuario,
            id_articulo: route.params.id,
            progreso_lectura: progreso
        };
   
  }

  // Al montar el componente, añadimos una clase al body para la animación de entrada
  onMounted(async () => {
    // Asegurarnos de que ya no existan clases de transición previas
    document.body.classList.remove('page-transition-in', 'page-transition-out');
    
    // Añadir clase de transición de entrada
    document.body.classList.add('page-transition-in');
    
    const blogId = route.params.id;
    await fetchData(blogId);
    
    // Quitamos la clase después de que termine la animación

    intervalId.value = setInterval(() => {
    guardarProgreso();
  }, 5000);
  });

  // Limpiamos las clases de animación si el componente se desmonta
  onBeforeUnmount(() => {
    document.body.classList.remove('page-transition-in', 'page-transition-out');

    if (intervalId.value !== null) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }

    //document.removeEventListener('selectionchange', updateSelection);
  });

  // Observar cambios en el parámetro de ID de la ruta para recargar datos
  watch(
    () => route.params.id,
    (newId, oldId) => {
      if (newId !== oldId) {
        // Aplicar transición de salida al cambiar de artículo
        document.body.classList.remove('page-transition-in');
        document.body.classList.add('page-transition-out');
        
        setTimeout(() => {
          // Recargar datos
          fetchData(newId);
          
          // Aplicar transición de entrada
          document.body.classList.remove('page-transition-out');
          document.body.classList.add('page-transition-in');
          
          // Quitar clase de transición después de un tiempo
          setTimeout(() => {
            document.body.classList.remove('page-transition-in');
          }, 800);
        }, 300);
      }
   }
  );
</script>

<style>
  /* Estilos globales para las transiciones de página */
  body.page-transition-in {
    animation: fadeIn 0.5s ease forwards;
    background-color: #383737 !important; /* Color gris en vez de negro */
  }
  
  body.page-transition-out {
    animation: fadeOut 0.3s ease forwards;
    background-color: #383737 !important; /* Color gris en vez de negro */
  }
  
  :root.light body.page-transition-in,
  :root.light body.page-transition-out {
    background-color: #E9EAE4 !important; 
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
</style>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap');

  ion-content {
    /* El modo oscuro se mantiene sin cambios */
    --background: #383737 !important;
    --color: var(--ion-text-color);
  }
  
  :root.light ion-content {
    --background: #E9EAE4 !important; 
    --color: #121212;
  }

  ion-grid {
    padding-left: 8%;
    padding-right: 8%;
    padding-top: 8%;
  }

  /* Resto de estilos sin cambios */
  .titulo, .descripcion, .biografia, .nom-usu {
    font-family: 'Tinos';
    line-height: 1;
    display: block;
  }

  .titulo{
    font-size: 20px;
  }

  .descripcion {
    font-size: 13px;
    margin-top: -4%;
  }

  .biografia {
    font-size: 13px;
  }

  .nom-usu{
    font-size: 15px;
    text-transform: capitalize;
  }

  .contenedor-info-autor {
    margin-top: -9px;
    margin-left: -13px;
    height: 60px;
  }

  .contenedor-biografia {
    margin-top: -6%;
  }

  .double-line, .double-line2{
    height: 0.8px;
    width: 98%;
    background-color: var(--ion-text-color);
    margin-left: 5px;
  }

  .double-line{
    margin-top: -7px;
  }
 
  .contenedor-blog {
    font-size: 14px;
    font-family: 'Roboto';
    line-height: 1.5;
    margin-top: -5px;
    user-select: text;
    -webkit-user-select: text;
  }

  .foto-perfil {
    width: 31px;
    height: 31px;
    margin-top: 25%;
    margin-left: 25%;
  }

 
  .icon-container {
    display: flex;
    justify-content: flex-end; 
    gap: 3px; 
    padding-right: 10px; 
  }

  .titulo2{
    margin-top: 10px;
  }

  .contenedor-mas-blogs {
    margin-top: -40px;
  }

  /* Hacer que las imágenes sean responsivas */
  :deep(img) {
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
  }

  /* Clase para exceptuar una imagen como la foto de perfil*/
  :deep(img.imagen-especial) {
    max-width: initial !important;
    height: initial !important;
    display: initial !important;
    margin: initial !important;
  }

  hr {
    border: none; /* Elimina el borde predeterminado */
    height: 0.1px; /* Altura de la línea */
    background-color: var(--ion-text-color);
    width: 55%;
    opacity: 1;
    margin-top: -10px;
  }

  /* Loader para la pantalla completa */
  .loader-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #383737 !important; /* Usar explícitamente el color gris */
    z-index: 999;
    color: var(--ion-text-color);
  }

  :root.light .loader-container {
    background-color: #E9EAE4 !important; /* Usar color claro en modo claro */
  }

  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid #F1928D;
    border-bottom-color: transparent;
    border-radius: 50%;
    animation: rotation 1s linear infinite;
    margin-bottom: 16px;
  }

  .loader-container-small {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    width: 100%;
  }

  .loader-small {
    width: 24px;
    height: 24px;
    border: 3px solid #F1928D;
    border-bottom-color: transparent;
    border-radius: 50%;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Estilo de la barra de progreso de lectura */

  .floating-text {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  padding: 5px 6px;
  border-radius: 8px;  
  z-index: 1000;
  left: 0;
  padding-left: 10px; /* Opcional */
  top: 12vh;
}

.fade-in-progreso {
  opacity: 1;
  transition: opacity 0.3s ease-in;
}

.fade-out-progreso {
  opacity: 0;
  transition: opacity 0.3s ease-out;
}

  .menu-container {
  z-index: 1000;
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 10px;
  left: 2px; 
  top: 18vh;
}

.menu-item {
width: 3vh;
height: 3vh;
display: flex;
align-items: center;
justify-content: center;
background-color: #171717;
border-radius: 3px;
}

.menu-icon {
  font-size: 2vh;
  color: white;
  display: block;
  margin: auto; 
}

  /* Transiciones para elementos individuales */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .fade-slide-down-enter-active,
  .fade-slide-down-leave-active {
    transition: all 0.5s ease-out;
  }
  
  .fade-slide-down-enter-from,
  .fade-slide-down-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }
  
  .fade-slide-up-enter-active,
  .fade-slide-up-leave-active {
    transition: all 0.5s ease-out;
  }
  
  .fade-slide-up-enter-from,
  .fade-slide-up-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  
  .fade-slide-left-enter-active,
  .fade-slide-left-leave-active {
    transition: all 0.5s ease-out;
  }
  
  .fade-slide-left-enter-from,
  .fade-slide-left-leave-to {
    opacity: 0;
    transform: translateX(-30px);
  }
  
  /* Animación escalonada para la lista de blogs */
  .list-stagger-enter-active {
    transition: all 0.5s ease;
    transition-delay: calc(0.1s * var(--index));
  }
  
  .list-stagger-leave-active {
    transition: all 0.3s ease;
  }
  
  .list-stagger-enter-from,
  .list-stagger-leave-to {
    opacity: 0;
    transform: translateX(-20px);
  }
  
  .blog-item {
    will-change: opacity, transform;
  }

  .my-scroll-container {
  max-height: 80vh;
  overflow-y: scroll; 
}

</style>