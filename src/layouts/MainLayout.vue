<script setup lang="ts">
import { useAuthStore } from 'src/stores/authStore';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  await authStore.logout();
  if(router.currentRoute.value.name == 'home'){
    router.go(0);
  } else{
    await router.push({
      name: 'home'
    });
  }
}

const canWrite = () =>{
  return authStore.user?.role == 'writer' || authStore.user?.role == 'admin'
}

onMounted(async () =>{
  if(authStore.token != null){
    await authStore.getUser();
  }
})
</script>

<template>
  <q-layout view="hHh lpr fFf">
    <q-header>
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-btn :to="{ name: 'home' }" stretch flat label="Главная" />

        <q-space />

        <q-btn-dropdown
          v-if="authStore.user"
          stretch
          flat
          :label=authStore.user?.name
        >
          <q-list>
            <q-item :to="{ name: 'user' }" clickable v-close-popup>
              <q-item-section>
                <q-item-label>Профиль</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="canWrite()" :to="{ name: 'adding-comics' }" clickable v-close-popup>
              <q-item-section>
                <q-item-label>Добавить новый комикс</q-item-label>
              </q-item-section>
            </q-item>

            <q-item @click="logout" clickable v-close-popup>
              <q-item-section>
                <q-item-label>Выйти из системы</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn :to="{ name: 'auth' }" v-else stretch flat label="Войти" />
      </q-toolbar>
    </q-header>

    <q-page-container class="column justify-start items-center">
      <router-view />
    </q-page-container>

    <q-footer>
    </q-footer>
  </q-layout>
</template>
