<template>
    <ion-page>
      <ion-content class="ion-align-items-center ion-justify-content-center" fullscreen>
        <ion-grid fixed>
            <ion-row>
                <ion-col size="12.5">
                    <ion-img src="/blog_logo_black.png" alt="logo" style="width: 50%;"></ion-img>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col size="12" class="ion-text-center">
                  <ion-text style="font-family: Roboto Serif Bold; font-size: 3.5vh;"> Solicitar código de verificación.</ion-text>
                </ion-col>
                <ion-col size="12" class="ion-text-center" style="font-size: 1.5vh; ">
                   <hr>
                    Ingresa tu email para enviar el código
                </ion-col>
            </ion-row><br><br>
            <ion-row>
                  <ion-col size="12">
                    <ion-item>
                      <ion-input v-model="correo" placeholder="Email" labelPlacement="stacked" color="medium"></ion-input>
                    </ion-item>    
                    <ion-text color="danger" v-if="errores.correo">
                      <ion-icon :icon="warning" color="danger"></ion-icon>
                      {{ errores.correo }}
                    </ion-text>              
                  </ion-col>
            </ion-row>
                <ion-row>
                  <ion-col size="12" class="ion-text-center">
                    <ion-button expand="full" fill="clear" class="ion-margin-top boton-sin-fondo" @click="showModal">
                      Ya cuento con un código
                    </ion-button>  
                    <ion-button expand="default" type="submit" class="ion-margin-top boton-con-fondo" @click="enviarTokenPorCorreo">
                      Enviar código
                    </ion-button>
                    <!-- <ion-button expand="default" type="submit" class="ion-margin-top boton-con-fondo"  @click="">
                      <ion-icon :icon="logoGoogle" slot="start" style="color: #e19693;"></ion-icon>
                      Continuar con Google
                    </ion-button>   -->   
                    <ion-button expand="full" fill="clear" class="ion-margin-top boton-sin-fondo" router-link="/recuperar-contraseña">
                      ¿No puedes acceder a tu cuenta?
                    </ion-button>
                    <ion-button expand="full" fill="clear" class="ion-margin-top boton-sin-fondo" router-link="/">
                      Iniciar sesión
                    </ion-button>           
                  </ion-col>
                </ion-row>      
        </ion-grid>
      </ion-content>
      
      <!-- Modal para solicitar el codigo de  -->
      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal" class="custom-modal">
      <ion-content class="ion-padding">
        <ion-button @click="closeModal" fill="clear" style="position: absolute; top: -5px; right: -15px; z-index: 1000;">
          <ion-icon :icon="closeCircleOutline" slot="start" style="color: #179ace; font-size: 4vh;"></ion-icon>
        </ion-button>   
        <form @submit.prevent="validarToken">
        <ion-item>
          <ion-label class="centered-label" style="font-family: Roboto Serif; font-weight: 700; font-size: 4vh;">Iniciar sesión con código</ion-label>
          <ion-label position="floating" class="centered-label">Ingresa tu código de verificación que se mandó por correo</ion-label>
          <ion-input v-model="token" type="number" placeholder="Código" required class="centered-input" ></ion-input>
        </ion-item>
          <ion-button expand="full" type="submit" class="ion-margin-top" style="--background: #179ace; color: black;">
            Confirmar
          </ion-button>
        </form>
      </ion-content>
    </ion-modal>
    </ion-page>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import { IonButton, IonItem, IonImg, IonGrid, IonRow, IonCol, IonPage, IonContent, IonInput, IonIcon, IonText, IonModal, IonHeader,IonToolbar,IonTitle, IonButtons, IonLabel, onIonViewWillEnter} from '@ionic/vue';
    import { ref,Ref,watch, inject} from 'vue';
    import { warning, logoGoogle, closeCircleOutline } from 'ionicons/icons';
    import axios from 'axios';
    import storageService from '@/services/storageService';
    import { showToast } from '@/utils/funcionToast';

    const global_api = inject('global_api');
    const correo = ref('');
    const errores = ref({correo: ''});
    const router = useRouter();
    const isModalOpen: Ref<boolean> = ref(false);
    const token = ref('');
    const intentos = ref(0);

    axios.defaults.headers.common['token'] = "123";

     // Función para resetear formulario
    const resetForm = () => {
        correo.value = '';
        errores.value = { correo: ''};
      };

      // Resetear formulario al entrar a la página
      onIonViewWillEnter(() => {
        resetForm();
      });

     // Función para validar
     const validarCampos = () => {
      errores.value = { correo: ''}; 
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correo.value.trim()) {
        errores.value.correo = 'El correo es obligatorio';
      } else if (!emailRegex.test(correo.value)) {
        errores.value.correo = 'Formato de correo inválido';
      }
      
      return !errores.value.correo; 
    };

    // Método para cerrar el modal
    const showModal = () => {
      isModalOpen.value = true;
    };

    // Método para cerrar el modal
    const closeModal = () => {
      isModalOpen.value = false;
      token.value = ''; // Resetea el código
    };

    // Función para enviar formulario principal
    const enviarTokenPorCorreo = () => {
      if (!validarCampos()) return; 
      passwordToken();
    }

    //Funcion para enviar el formulario del modal
    const validarToken = () => {
      checkToken()
      intentos.value++
    };

    //Validar que  el usuario no haya intentado ingresar su codigó más de 3 veces
    watch(intentos, (nuevoValor) =>{
      if (nuevoValor >= 3){
        closeModal()
        showToast("Exediste de 3 intentos máximo por favor intentalo más tarde","danger", "top");
      }
    })

    //Funcion para generar token y enviarlo por correo
    const passwordToken = async () => {
 
              showToast("Se ha enviado un código de inicio de sesión a tu correo electronico (Usa: 1234)","success", "top").then(() => {
                    setTimeout(() => {
                            showModal();
                          }, 3000); 
              }); 
    }

    //Función para validar el token recibido
    const checkToken = async () =>{

              if(token.value === "1234"){
                closeModal();
                const usuarioData = {
                EMAIL: "example@hotmail.com",
                NOMBRE: "Usuario Offline",
             };

      const usuarioID = 999; 

      await storageService.setItem('usuario', usuarioData);
      await storageService.setItem('id-usuario', usuarioID);
      router.replace('/paginas/inicio');
                   
              }else{
                showToast("Error: token incorrecto","danger", "top");
              }
            }
     
</script>

<style scoped>

ion-content {
  --background: #fefffa;  /* Fondo blanco, independiente del tema oscuro */
}

  ion-img {
    width: 200px;
    margin: 0 auto;
  }

  ion-grid{
    margin-top: 10vh;
  }

  ion-text {
    font-size: 0.9em;
    padding-left: 5%;
  }

  hr {
  border: none; /* Elimina el borde predeterminado */
  height: 1px; /* Altura de la línea */
  background-color: black; /* Color de fondo */
  width: 60%; /* Ancho de la línea */
  opacity: 1; /* Opacidad completa */
  margin-top: 0vh;
  margin-bottom: 1vh;
}

  .boton-con-fondo {
  width: 65%; 
  margin: 8px 0;
  color: white;
  --background: #179ace;
}

.boton-sin-fondo {
  width: 100%; 
  margin: 8px 0;
  color: black;
  text-transform: none;
  text-decoration: underline;
}

  /*Estilos del modal*/

  .custom-modal {
  --width: 95%; 
  --height: 50%; 
  --max-width: 500px; 
  --max-height: 90%; 
  --border-radius: 10px; 
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  }
  
  .centered-label {
    text-align: center;
    width: 100%;
    font-family: Monserrat;
  }

  .centered-input {
    text-align: center; 
    margin-top: 6vh ;
    border: 2px solid black; /* Borde negro */
    border-radius: 5px; /* Bordes redondeados opcionales */
    padding: 5px
  }

  </style>