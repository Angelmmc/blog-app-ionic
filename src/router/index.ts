import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import pagina_navegacion from '../views/pagina-de-navegacion.vue'
import pagina_login from '../views/pagina-login.vue'
import storageService from '@/services/storageService';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',    
    component: pagina_login
  },
  {
    path: '/paginas/',
    component: pagina_navegacion, 
    children: [
      {
        path: '',
        redirect: '/paginas/inicio'
      },
      {
        path: 'inicio',
        component: () => import('@/views/pagina-inicio.vue')
      },
      {
        path: 'perfil/:id',
        component: () => import('@/views/pagina-perfil.vue')
      },
      {
        path: 'comunidad',
        component: () => import('@/views/pagina-comunidad.vue')
      },
      {
        path: 'guardados',
        component: () => import('@/views/pagina-guardar.vue')
      },

      {
        path: 'configuración',
        component: () => import('@/views/pagina-configuracion.vue')
      },


      {
        path: 'blog/:id',
        component: () => import('@/views/pagina-blog.vue')
      }
      

    ]
    
  },
  {
    path: '/registro',
    component: () => import('@/views/pagina-registro.vue')
  },
  {
    path: '/verificar',
    component: () => import('@/views/pagina-verificar.vue')
  },
  {
    path: '/recuperar-contraseña',
    component: () => import('@/views/pagina-recuperar-contraseña.vue')
  },
  {
    path: '/reset-contrasena',
    component: () => import('@/views/pagina-reset-contraseña.vue')
  },
  {
    path: '/login-token',
    component: () => import('@/views/pagina-login-token.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

//Funcion que regresa al login si se detecta que no existe información guardada del usuario en cualquier pagina de /paginas
router.beforeEach(async (to, from, next) => {

  const userData = await storageService.getItem('usuario');
  const userID = await storageService.getItem('usuario');

  if (to.path.startsWith("/paginas") && (!userData || !userID)) 
    {
      console.log("Acceso denegado. Redirigiendo al login...");
      next("/"); // Redirige al login si no hay sesión
    } else 
    {
      next();
    }
});

export default router
