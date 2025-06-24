<template>
  <ion-page>
    <ion-content class="ion-align-items-center ion-justify-content-center" fullscreen>
      <ion-grid fixed>
          <ion-row>
              <ion-col size="12">
                <ion-img src="/blog_logo_black.png" alt="logo"></ion-img>
              </ion-col>
          </ion-row>
          <ion-row style="margin-top: -3%;">
              <ion-col size="12" class="ion-text-center">
                  <h2 class="text-recuperar-contra">Recuperar <br> contraseña</h2>
              </ion-col>
          </ion-row>
          <hr class="linea">
          <ion-row class="ion-text-center">
            <ion-col>
              <p class="segundo-texto">Ingresa tu email para recuperar tu contraseña</p>
            </ion-col>
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
              </ion-row><br>
              <ion-row>
                <ion-col size="12" class="ion-text-center">
                  <ion-button expand="default" type="submit" class="ion-margin-top boton-enviar" @click="enviarEmail">
                      Enviar email
                  </ion-button>       
                </ion-col>
              </ion-row>
              <ion-row class="ion-text-center">
                <ion-col>
                  <!-- <ion-button expand="default" type="submit" class="ion-margin-top boton-google">
                    <ion-icon :icon="logoGoogle" slot="start" style="color: #e19693;"></ion-icon>
                    Continuar con Google
                  </ion-button>   -->
                </ion-col>
              </ion-row>
              <ion-row class="ion-text-center">
                <ion-col>
                  <router-link class="ion-margin-top subrayados" to="/login-token">
                    <u style="font-weight: bold; font-size: 14px;">Iniciar sesión con codigo</u>
                  </router-link>  
                </ion-col>
              </ion-row><br>
              <ion-row class="ion-text-center">
                <ion-col>
                  <router-link class="ion-margin-top subrayados" to="/">
                    <u style="font-size: 14px;">Iniciar sesión</u>
                  </router-link> 
                </ion-col>
              </ion-row>
              
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, watch, inject } from 'vue';
import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonInput, IonItem, IonPage, IonRow, IonText, onIonViewWillEnter } from '@ionic/vue';
import { warning, logoGoogle } from 'ionicons/icons';
import axios from 'axios';
import { showToast } from '@/utils/funcionToast';

const global_api = inject('global_api');
const correo = ref('');
const errores = ref({ correo: '' });
const enviado = ref(false);
const router = useRouter();
const isBloqueado = ref(0);

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
const validarCorreo = () => {
    errores.value = { correo: ''}; 
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo.value.trim()) {
      errores.value.correo = 'El correo es obligatorio';
    } else if (!emailRegex.test(correo.value)) {
      errores.value.correo = 'Formato de correo inválido';
    }
    
    return !errores.value.correo;
  };

   // Función para enviar el email para restablecer la contraseña
   const enviarEmail = () => {
    enviado.value = true
    if (!validarCorreo()) return; 

    showToast('Se ha enviado el email', 'success', "top");

  };

    // Observar cambios en los campos despues de la primera vez que ya envio el formulario
    watch(correo, () => {
      if (enviado.value) validarCorreo();
    });

</script>

<style scoped>
ion-img {
width: 70%;
margin: 0 auto;
}

ion-grid{
margin-top: 80px;
}

ion-text {
font-size: 0.9em;
padding-left: 5%;
}

.text-recuperar-contra {
font-family: 'Roboto serif Bold';
font-size: 30px;
}

.linea{
  height: 1.5px;
  background-color: black;
  width: 53%;
  margin: 0 auto;
}

.segundo-texto{
font-size: 10px;
font-family: 'Montserrat', sans-serif;
}

.boton-enviar, .boton-google {
  --background: #179ace;;
  color: white;
  border: 0.714286px solid rgb(218, 220, 224);
  width: 60%;
  height: 85%;
  text-transform: capitalize;
  border-radius: 4px;
}

.boton-enviar{
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