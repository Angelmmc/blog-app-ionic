<template>
  <ion-page>
    <ion-content class="ion-align-items-center ion-justify-content-center" fullscreen>
      <ion-grid fixed>
          <ion-row>
              <ion-col size="12">
                <ion-img src="/blog_logo_black.png" alt="logo"></ion-img>
              </ion-col>
          </ion-row>
          <ion-row class="ion-text-center" style="margin-top: -3%;">
              <ion-col size="12" >
                <h1 class="titulo-iniciar-sesion">Iniciar Sesión</h1>
              </ion-col>
          </ion-row>
          <hr class="linea">
          <ion-row class="ion-text-center">
            <ion-col>
              <p class="segundo-texto">Inicia sesión con tu cuenta</p>
            </ion-col>
          </ion-row>
          <ion-row class="ion-text-center" style="margin-top: -3%">
          </ion-row><br>
          <ion-row>
                <ion-col size="12">
                  <ion-item>
                    <ion-input v-model="correo" placeholder="Email"></ion-input>
                  </ion-item>    
                  <ion-text color="danger" v-if="errores.correo">
                    <ion-icon :icon="warning" color="danger"></ion-icon>
                    {{ errores.correo }}
                  </ion-text>              
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col size="12">
                  <ion-item>
                    <ion-input v-model="contraseña" type="password" placeholder="Password" maxlength="16">
                      <ion-input-password-toggle slot="end" color="dark"></ion-input-password-toggle>
                    </ion-input>
                  </ion-item>
                  <ion-text color="danger" v-if="errores.contraseña">
                    <ion-icon :icon="warning" color="danger"></ion-icon>
                    {{ errores.contraseña }}
                  </ion-text>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <ion-item lines="none">
                    <ion-checkbox slot="start"></ion-checkbox>
                    <ion-label class="label-checkbox">Recordar mi sesión</ion-label>
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row class="ion-text-center">
                <ion-col>
                  <ion-button expand="default" type="submit" class="ion-margin-top boton-iniciar" @click="enviarFormulario">
                    Iniciar sesión
                  </ion-button>    
                </ion-col>
              </ion-row>
              <ion-row class="ion-text-center">
                <ion-col>
                  <!-- <ion-button expand="default" type="submit" class="ion-margin-top boton-google">
                    <ion-icon :icon="logoGoogle" slot="start" style="color: #e19693;"></ion-icon>
                    Continuar con Google
                  </ion-button> -->  
                </ion-col>
              </ion-row>
              <ion-row class="ion-text-center">
                <ion-col>
                  <router-link class="ion-margin-top subrayados" to="/login-token">
                    <u style="font-weight: bold; font-size: 14px;">Iniciar sesión con código</u>
                  </router-link>  
                </ion-col>
              </ion-row><br>
              <ion-row class="ion-text-center">
                <ion-col>
                  <router-link class="ion-margin-top subrayados"to="/recuperar-contraseña">
                    <u style="font-size: 14px;">¿No puedes acceder a tu cuenta?</u>
                  </router-link>
                </ion-col>
              </ion-row>
              <ion-row class="ion-text-center">
                <ion-col>
                  <router-link class="ion-margin-top subrayados"to="/registro">
                    <p style="font-size: 12px;">¿No tienes una cuenta? <u>Registrate</u></p>
                  </router-link>       
                </ion-col>
              </ion-row>
              
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { IonButton, IonItem, IonImg, IonGrid, IonRow, IonCol, IonPage, IonContent, IonInput, IonIcon, IonText, IonInputPasswordToggle, toastController, onIonViewWillEnter} from '@ionic/vue';
  import { ref, watch, inject } from 'vue';
  import { warning, logoGoogle } from 'ionicons/icons';
  import axios from 'axios';
  import storageService from '@/services/storageService';
  import {showToast} from '@/utils/funcionToast';

  const global_api = inject('global_api');
  const correo = ref('');
  const contraseña= ref('');
  const errores = ref({ correo: '', contraseña: '' });
  const enviado = ref(false);
  const router = useRouter();
  const isBloqueado = ref(null);

  axios.defaults.headers.common['token'] = "123";
  
  // Función para resetear formulario
  const resetForm = () => {
    correo.value = '';
    contraseña.value = '';
    errores.value = { correo: '', contraseña: '' };
  };

  // Resetear formulario al entrar a la página
  onIonViewWillEnter(() => {
    checkSesion();
    resetForm();
  });

  // Función para validar
  const validarCampos = () => {
    errores.value = { correo: '', contraseña: '' }; 

    if (!contraseña.value.trim()) errores.value.contraseña = 'La contraseña es obligatoria';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo.value.trim()) {
      errores.value.correo = 'El correo es obligatorio';
    } else if (!emailRegex.test(correo.value)) {
      errores.value.correo = 'Formato de correo inválido';
    }
    
    return !errores.value.correo && !errores.value.contraseña; 
  };

  // Función para enviar formulario
  const enviarFormulario = () => {
    enviado.value = true
    if (!validarCampos()) return; 

    //checkUserBloqueado(); 
    login(); // Llamar a la función de login directamente en modo offline
  }

  // Observar cambios en los campos despues de la primera vez que ya envio el formulario
  watch([correo, contraseña], () => {
    if (enviado.value) validarCampos();
  });

  const login = async () => {
  try {
    // Usuario y contraseña fijos
    const usuarioFijo = "example@hotmail.com";
    const contraseñaFija = "123456";

    if (correo.value === usuarioFijo && contraseña.value === contraseñaFija) {
      const usuarioData = {
        EMAIL: usuarioFijo,
        NOMBRE: "Usuario Offline",
      };

      const usuarioID = 999; 

      await storageService.setItem('usuario', usuarioData);
      await storageService.setItem('id-usuario', usuarioID);
      router.replace('/paginas/inicio');
    } else {
      showToast("Correo o contraseña incorrectos (modo offline)", 'danger', "top");
    }
  } catch (error) {
    console.error("Error en el login offline:", error);
  }
};


  //Valida si ya existen datos de usuario en almacenamiento local y manda al inicio
  const checkSesion = async () => {
  const usuario = await storageService.getItem("usuario");
  const idUsuario = await storageService.getItem("id-usuario");

  if (usuario && idUsuario) 
  {
    console.log("Sesión válida", { usuario, idUsuario });
    router.replace('/paginas/inicio');
  }
  };

   
</script>

<style scoped>
ion-img {
  width: 65%;
  margin: 0 auto;
}

ion-grid{
padding-top: 40px;
}

ion-text {
  font-size: 0.9em;
  padding-left: 5%;
}

.titulo-iniciar-sesion {
  font-family: 'Roboto Serif Bold';
  font-size: 30px;
}

.linea{
  height: 1.5px;
  background-color: black;
  width: 53%;
  margin: 0 auto;
}

.segundo-texto {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
}

.label-checkbox {
  font-size: 15px;
  font-weight: bold;
}

.boton-iniciar, .boton-google {
  --background: #179ace;
  color: white;
  border: 0.714286px solid rgb(218, 220, 224);
  width: 60%;
  height: 85%;
  text-transform: capitalize;
  border-radius: 4px;
}

.boton-iniciar{
  font-size: 20px;
}

.boton-google{
  margin-top: 2%;
  font-size: 16px;
}

.subrayados {
  color: black;
}

</style>