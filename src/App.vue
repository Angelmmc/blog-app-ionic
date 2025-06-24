<template>
  <ion-app>
    <ion-menu side="end" menu-id="main-menu" content-id="main-content" swipe-gesture="false">
        <ion-content>
          <ion-list>
            <ion-item @click="cerrarSesion">Cerrar Sesión</ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>

    <ion-router-outlet  id="main-content"/>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, menuController, IonMenu, IonContent, IonList, IonItem } from '@ionic/vue';
import storageService from '@/services/storageService';
import { useRouter } from 'vue-router'

const router = useRouter();

const cerrarSesion = async() => {
  await menuController.close('main-menu');
  storageService.clear();
  router.replace('/');
}

</script>
