<template>
    <ion-fab class="fab-global" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="">
        <ion-icon :icon="pencil"></ion-icon>
      </ion-fab-button>
    </ion-fab>
</template>

<script setup lang="ts">
import { IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { pencil } from 'ionicons/icons';
</script>

<style scoped>
  ion-fab-button {
    --background: #179ace;
    width: 40.05px;
    height: 40.05px;
  }

  .fab-global {
    bottom: 65px;
}
  ion-icon {
    width: 25px;
    height: 25px;
  }

  :root.light ion-icon {
    color: #ffffff;
  }

</style>