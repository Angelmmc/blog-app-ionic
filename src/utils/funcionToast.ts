import { toastController } from '@ionic/vue';

export const showToast = async (mensaje : string, color : string, posición : 'top' | 'bottom' | 'middle' | undefined) => 
    {
      const toast = await toastController.create({
        message: mensaje,
        duration: 3000, // Duración en milisegundos
        color: color, // El color 'warning' generalmente se asocia con advertencias
        position: posición, // Puedes cambiar la posición (top, bottom, middle)
      });
      toast.present();
    };