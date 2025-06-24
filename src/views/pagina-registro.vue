<template>
    <ion-page>
      <ion-content class="ion-padding">
        <div class="logo-container">
         <img src="/blog_logo_black.png" alt="Logo" class="login-logo">
        </div>
        <p style="text-align: center; font-family: Roboto Serif Bold, sans-serif; font-size: 30px;">Registro</p>
        <hr>
        <p style="text-align: center;">Ingresa tus datos para crear tu cuenta</p>
        
        <form @submit.prevent="validarFormulario">
          <ion-item :class="{'input-error': input_errors.nombre}">
              <ion-input type="text" v-model="nombre" placeholder="Nombre"></ion-input>
          </ion-item>
          <ion-text v-if="input_errors.nombre" color="danger" class="error-msg"> 
            <ion-icon :icon="alertCircleOutline"></ion-icon>
            <span>{{ input_errors.nombre }}</span>
          </ion-text>
          <ion-item :class="{'input-error': input_errors.usuario}">
              <ion-input type="text" v-model="usuario" placeholder="@Usuario"></ion-input>
          </ion-item>
          <ion-text v-if="input_errors.usuario" color="danger" class="error-msg"> 
            <ion-icon :icon="alertCircleOutline"></ion-icon>
            <span>{{ input_errors.usuario }}</span>
          </ion-text>
          <ion-item>
              <ion-input type="email" v-model="email" placeholder="Email"></ion-input>
          </ion-item :class="{'input-error': input_errors.email}">
          <ion-text v-if="input_errors.email" color="danger" class="error-msg"> 
            <ion-icon :icon="alertCircleOutline"></ion-icon>
            <span>{{ input_errors.email }}</span>
          </ion-text>
          <ion-item :class="{'input-error': input_errors.password}">
              <ion-input type="password" v-model="password" placeholder="Password"><ion-input-password-toggle slot="end" color="meduium"></ion-input-password-toggle></ion-input>
          </ion-item>
          <ion-text v-if="input_errors.password" color="danger" class="error-msg"> 
            <ion-icon :icon="alertCircleOutline"></ion-icon>
            <span>{{ input_errors.password }}</span>
          </ion-text>
          <ion-item :class="{'input-error': input_errors.password_confirm}">
              <ion-input type="password" v-model="password_confirm" placeholder="Confirm Password"> <ion-input-password-toggle slot="end" color="meduium"></ion-input-password-toggle></ion-input>
          </ion-item>
          <ion-text v-if="input_errors.password_confirm" color="danger" class="error-msg"> 
            <ion-icon :icon="alertCircleOutline"></ion-icon>
            <span>{{ input_errors.password_confirm }}</span>
          </ion-text>
          <ion-item :class="{'input-error': input_errors.edadCheck}">
              <ion-label>Soy mayor de edad</ion-label>
              <ion-checkbox v-model="edadCheck" slot="start"></ion-checkbox>
          </ion-item>   
          <ion-text v-if="input_errors.edadCheck" color="danger" class="error-msg"> 
            <ion-icon :icon="alertCircleOutline"></ion-icon>
            <span>{{ input_errors.edadCheck }}</span>
          </ion-text>
          <div class="button-container">
            <ion-button expand="full" type="submit" class="ion-margin-top boton-con-fondo" @click="registrar" style="--background: #179ace; color: white;">
              Registrar
            </ion-button>
            
            <!-- <ion-button expand="full" type="submit" class="ion-margin-top boton-con-fondo" @click="registrar" style="--background: white;">
            <ion-icon :icon="logoGoogle" slot="start" style="color: #e19693;"></ion-icon>
              Continuar con Google
            </ion-button> -->
            <ion-button expand="full" fill="clear" class="ion-margin-top boton-sin-fondo"   style="--color: black; text-transform: none;" router-link="/">
                    <span  style="margin-right: 5px; font-size: smaller;">¿Ya tienes cuenta? <u>Inicia sesión</u></span>
            </ion-button>
          </div>    
        </form>
      </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
  import axios from 'axios';
  import { ref, watch, inject } from 'vue';
  import { alertCircleOutline, logoGoogle } from 'ionicons/icons';
  import { useRouter } from 'vue-router';
  import { showToast } from '@/utils/funcionToast';

  import {IonPage,IonContent,IonItem,IonLabel,IonInput,IonButton,IonCheckbox,IonIcon, IonText,onIonViewWillEnter, IonInputPasswordToggle} from "@ionic/vue";

  axios.defaults.headers.common['token'] = '123';

  const global_api = inject('global_api');
  const router = useRouter();
  const nombre = ref('');
  const usuario = ref('');
  const email = ref('');
  const password = ref('');
  const password_confirm = ref('');
  const edadCheck = ref(false);
  const input_errors = ref({ nombre: '', usuario: '', email: '', password: '', password_confirm: '', edadCheck: ''});

   // Función para resetear formulario
   const resetForm = () => {
      nombre.value = '';
      usuario.value = '';
      email.value = '';
      password.value = '';
      password_confirm.value = '';
      edadCheck.value = false;
      input_errors.value = { nombre: '', usuario: '', email: '', password: '', password_confirm: '', edadCheck: ''};
    };

    // Resetear formulario al entrar a la página
    onIonViewWillEnter(() => {
      resetForm();
    });

  watch(usuario, async (newValue) => 
  {
    // Lógica de validación
    if (newValue.match(/\s+$/) || (!newValue.match(/^[a-z_A-Z0-9]+$/) && !newValue.match(/^@{1}[a-z_A-Z0-9]+$/))) 
    {
        input_errors.value.usuario = "El nombre de usuario no es válido";
    } else 
    {
        if (newValue.match(/^[a-z_A-Z0-9]+$/)) 
        {
          usuario.value = `@${newValue}`;
        }
        await checkUser(); // Llamada para validar el usuario en tiempo real
    }
  });

  const validarFormulario = () => 
  {
  // Resetear errores
    input_errors.value = { nombre: '', usuario: '', email: '', password: '', password_confirm: '', edadCheck: ''};

    // Verificar cada campo manualmente
    if (!nombre.value.trim()) {
      input_errors.value.nombre = "El nombre no puede estar en blanco";
    }

    if (!email.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      input_errors.value.email = "El correo electrónico no es válido";
    }

    if (!password.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
      input_errors.value.password =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número";
    }

    if (password.value !== password_confirm.value) {
      input_errors.value.password_confirm = "Las contraseñas no coinciden";
    }

    if (!edadCheck.value) {
      input_errors.value.edadCheck = "Necesitas ser mayor de edad para continuar";
    }

    if (!usuario.value.match(/^@{1}[a-z_A-Z0-9]+$/)) {
      input_errors.value.usuario = "El nombre de usuario no es válido";
    }

    // Retornar true si no hay errores
    return Object.values(input_errors.value).every(value => value === '');
    };

  const checkUser = async () => 
  {
            const usuarioSinArroba = usuario.value.replace('@', '');
            try 
            {
                if (usuarioSinArroba === 'Angelmmc') 
                {
                  input_errors.value.usuario = `El nombre de usuario ingresado ya existe, puedes usar @${usuarioSinArroba}1`;
                } else 
                {
                  input_errors.value.usuario = "";
                }
            } catch (err) 
            {
              console.error('Error al validar el usuario:', err);
              input_errors.value.usuario = "Error al validar el usuario, intenta nuevamente.";
            }
  }

  const registrar = async ()  =>
  {
    if (!validarFormulario()) 
    {
      showToast("Hay errores en algunos campos. Por favor, revisa la información ingresada.","danger", "bottom")
      return;
    } 
    try{
        const post_data = 
                {
                  nombre: nombre.value,
                  usuario: usuario.value.replace('@', ''),
                  email: email.value,
                  password: password.value,
                  password_confirm: password_confirm.value
                };

              console.log('Datos a enviar:', post_data);

                showToast("Formulario correcto. Te hemos enviado un correo de confirmación. Por favor, revisa tu bandeja de entrada. ","success", "bottom").then(() => {
                setTimeout(() => {
                router.push('/'); 
                }, 3000);
                });

    } catch (e : any) {
      console.error('Error al realizar la solicitud:', e);
      if (e.response) {
        showToast("Error del servidor: " + e.response.data.message, "warning", "bottom");
      } else{
        showToast("No se pudo establecer conexión con el servidor. Verifica tu red e intenta nuevamente. " + e.response.data.message, "warning", "bottom");
      }
    };
  }    
  </script>

<style scoped>

ion-content {
  --background: #fefffa;  /* Fondo blanco, independiente del tema oscuro */
}
  /*Imagen de logo*/
.logo-container {
display: flex;
justify-content: center;
margin-bottom: -5vh;
}

.login-logo {
width: 70%; 
object-fit: contain;
  }

    .input-error {
  --highlight-color: red;
  --highlight-color-focused: red;
  border: 1px solid red;
}

.button-container {
  display: flex;
  flex-direction: column;  
  justify-content: center; 
  align-items: center;   
}

.boton-con-fondo {
  width: 55%; 
  margin: 8px 0;
}

.boton-sin-fondo {
  width: 100%; 
  margin: 8px 0;
}


.toast-message {
  white-space: pre;
}


hr {
  border: none; /* Elimina el borde predeterminado */
  height: 1px; /* Altura de la línea */
  background-color: black; /* Color de fondo */
  width: 60%; /* Ancho de la línea */
  opacity: 1; /* Opacidad completa */
  margin-top: -3vh;
  margin-bottom: 2vh;
}

</style>