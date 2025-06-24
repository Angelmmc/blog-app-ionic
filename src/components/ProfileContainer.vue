<template>
  <ion-item class="notification-card">
    <ion-avatar slot="start">
  <img
    alt="foto de perfil"
    :src="`https://api.dicebear.com/7.x/pixel-art/svg?seed=`+foto_perfil" />
</ion-avatar>

    
    <ion-label>
      <h2 class="user-name">{{ nombre }}</h2>
      <h3 class="user-handle">@{{ usuario }}</h3>
      <p class="notification-text">{{ biografia }}</p>
    </ion-label>
    
    <ion-button 
      slot="end" 
      shape="round"
      fill="solid" 
      size="small"
      class="action-button"
      @click=""
    >
      Seguir
    </ion-button>
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem, IonAvatar, IonLabel, IonButton } from '@ionic/vue';
import { inject } from 'vue';
const global_repo_path = inject('global_repo_path');
const global_api = inject('global_api');

const props = defineProps({
  id: [String, Number],
  nombre: String,
  usuario: String,
  biografia: String,
  foto_perfil: String,
});

</script>

<style scoped>
.notification-card {
  --background: #2a2a2a00;
  --color: white;
  --border-radius: 12px;
  margin: 8px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.notification-card ion-avatar {
  width: 48px;
  height: 48px;
  margin-right: 12px;
}

.notification-card ion-avatar img {
  border-radius: 8px; /* Cambia este valor para más o menos redondeo */
  object-fit: cover;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: white;
  margin: 0 0 2px 0;
}

:root.light .user-name {
    color: black !important;
  }

.user-handle {
  font-weight: 400;
  font-size: 13px;
  color: #8e8e93;
  margin: 0 0 4px 0;
}

.notification-text {
  font-size: 13px;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:root.light .notification-text {
    color: black !important;
  }

.action-button {
  --border-radius: 16px;
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 6px;
  --padding-bottom: 6px;
  font-size: 12px;
  font-weight: 500;
  height: 32px;
  --background: #179ace;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .notification-card {
    margin: 4px 8px;
  }
  
  .user-name {
    font-size: 13px;
  }
  
  .user-handle, .notification-text {
    font-size: 12px;
  }
  
  .action-button {
    font-size: 11px;
    --padding-start: 10px;
    --padding-end: 10px;
  }
}
</style>