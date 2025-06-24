<template>
    <ion-page>
      <ion-content class="ion-align-items-center ion-justify-content-center" fullscreen>
        <ion-grid fixed>
            <ion-row>
                <ion-col size="12">
                    <ion-img src="/logo_blog.png" alt="logo"></ion-img>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col size="12" class="ion-text-center">
                    <h1>Restablecer contraseña</h1>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col size="12" class="ion-text-center">
                    Ingresa una nueva contraseña
                </ion-col>
            </ion-row><br><br>
            <ion-row>
                  <ion-col size="12">
                    <ion-item>
                      <ion-input v-model="contraseña" label="Contraseña" labelPlacement="stacked" color="medium" type="password" maxlength="16">
                        <ion-input-password-toggle slot="end" color="meduium"></ion-input-password-toggle>
                      </ion-input>
                    </ion-item>    
                    <ion-text color="danger" v-if="errores.contraseña">
                      <ion-icon :icon="warning" color="danger"></ion-icon>
                      {{ errores.contraseña }}
                    </ion-text>              
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="12">
                    <ion-item>
                      <ion-input v-model="confirmContraseña" label="Confirmar Contraseña" labelPlacement="stacked" color="medium" type="password">
                        <ion-input-password-toggle slot="end" color="meduium"></ion-input-password-toggle>
                      </ion-input>
                    </ion-item>    
                    <ion-text color="danger" v-if="errores.confirmContraseña">
                      <ion-icon :icon="warning" color="danger"></ion-icon>
                      {{ errores.confirmContraseña }}
                    </ion-text>              
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="1"></ion-col>
                  <ion-col size="10" class="ion-text-center">
                    <ion-button expand="default" type="submit" class="ion-margin-top" style="--background: #F1928D;" @click="actualizarPass">
                        Actualizar contraseña
                    </ion-button>     
                    <!-- <ion-button expand="full" fill="clear" class="ion-margin-top"   style="--color: #F1928D;" router-link="/">
                        Iniciar sesión
                    </ion-button> -->
                  </ion-col>
                </ion-row>
                
        </ion-grid>
      </ion-content>
    </ion-page>
  </template>

  <script setup lang="ts">
    import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonInput, IonItem, IonPage, IonRow, IonText, IonInputPasswordToggle } from '@ionic/vue';
    import axios from 'axios';
    import { ref, watch, inject } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { warning } from 'ionicons/icons';
    import { showToast } from '@/utils/funcionToast';

    const global_api = inject('global_api');
    const contraseña = ref('');
    const confirmContraseña = ref('');
    const errores = ref({ contraseña: '' , confirmContraseña: ''});
    const router = useRouter();
    const Route = useRoute();
    const enviado = ref(false);
    axios.defaults.headers.common['token'] = "123";

    // Función para validar
    const validarCampos = () => {
      errores.value = { contraseña: '', confirmContraseña: '' }; 

        if (!contraseña.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
        errores.value.contraseña = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número";
        }

        if (contraseña.value !== confirmContraseña.value) {
        errores.value.confirmContraseña = "Las contraseñas no coinciden";
        }

        return !errores.value.contraseña && !errores.value.confirmContraseña;

    };

    const actualizarPass = async () => {
        enviado.value = true;        
        if (!validarCampos()) return;
        const token = Route.query.t;

        const response = await axios.put(global_api + "usuarios/password/usuarios/publico/", {
            PASSWORD: contraseña.value,
            TOKEN: token
        });
        
        if(response.data.response == "error"){
          showToast(response.data.message, "danger", "top");
        }else{
          showToast(response.data.message, "success", "top");
          router.replace('/');
        }
        // console.log(response.data);
    };

    watch([contraseña, confirmContraseña], () => {
        if (enviado.value) validarCampos();
    });

  
  </script>

<style scoped>
ion-img {
  width: 200px;
  margin: 0 auto;
}

ion-grid{
  margin-top: 100px;
}

ion-text {
  font-size: 0.9em;
  padding-left: 5%;
}


</style>