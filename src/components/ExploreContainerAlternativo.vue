<template>
  <ion-grid>
    <ion-card>
      <ion-card-content>
        <ion-row>
          <ion-col>
            <ion-card-title>
              <strong>{{ titulo }}</strong>
            </ion-card-title>
            <ion-card-subtitle class="fecha">PUBLICADO EL {{ fecha }}</ion-card-subtitle>
            <ion-card-subtitle class="descripcion">{{ descripcion }}</ion-card-subtitle>
            <ion-chip color="gray" class="chip-container">
              <ion-avatar>
                <img alt="foto de perfil":src="`https://api.dicebear.com/7.x/pixel-art/svg?seed=`+foto_perfil" />
              </ion-avatar>
              <ion-label class="usuario">Un blog de <u>{{ usuario }}</u></ion-label>
              <div class="metrics-container">
                <div class="metric">
                  <IonIcon :icon="heartOutline" />
                  <ion-label class="numeros">{{ likes }}</ion-label>
                </div>
                <ion-label class="numeros">{{ tiempo_lectura }} min</ion-label>
              </div>
            </ion-chip>
          </ion-col>
        </ion-row>
      </ion-card-content>
    </ion-card>
  </ion-grid>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonChip, IonCardSubtitle, IonLabel, IonAvatar, IonImg, IonCardTitle, IonGrid, IonCol, IonRow, IonIcon } from '@ionic/vue';
import { heartOutline } from 'ionicons/icons';
import { inject } from 'vue';
const global_repo_path = inject('global_repo_path');
defineProps(
 {
  fecha: String,
  titulo: String,
  foto_perfil: String,
  usuario: String,
  descripcion: String,
  color: String,
  likes: String,
  tiempo_lectura: Number
 });
</script>

<style scoped>
ion-card {
  height: 100%;
  width: 140%;
  margin-bottom: -9vh;
  box-shadow: none;
  border: none;
  border-radius: 0;
  margin-left: -20%;
  background: #363636; 
  color: #FFFFFF;
}

ion-card-subtitle {
  display: block;
  margin-top: 0.5vh;
  color: #FFFFFF;
}

ion-chip {
  padding: 1vh;
  width: 100%;
}

strong {
  font-size: 12px;
  font-family: 'Roboto', serif;
  text-transform: uppercase;
  line-height: 1;
  color: #FFFFFF;
  display: block;
}

.fecha {
  font-size: 9px;
  font-family: 'Roboto';
  line-height: 1;
  color: #FFFFFF;
}

.descripcion {
  font-size: 11px;
  font-family: 'Roboto';
  line-height: 1;
  color: #FFFFFF;
}


.chip-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.usuario {
  flex-grow: 1;
  text-align: left;
  font-size: 11px;
  font-family: 'Roboto';
  line-height: 1;
  margin-left: -30%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50%;
  color: #FFFFFF;
}

.metrics-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.metric {
  display: flex;
  align-items: center;
  gap: 2px;
}

.numeros {
  font-size: 6.93px;
  font-family: 'Roboto';
  line-height: 1;
  margin-top: 0.5%;
  white-space: nowrap;
  color: #FFFFFF;
}

.imagen-especial {
  width: 17.32px;
  height: 17.32px;
}

ion-icon {
  width: 10px;
  height: 10px;
  color: #FFFFFF;
}

:root.light ion-card {
  background: #E9EAE4;
  color: #383737; 
}

:root.light ion-card-subtitle,
:root.light strong,
:root.light .fecha,
:root.light .descripcion,
:root.light .usuario,
:root.light .numeros,
:root.light ion-icon {
  color: #383737; 
}
</style>