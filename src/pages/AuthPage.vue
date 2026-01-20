<script setup lang="ts">
import { useAuthStore } from 'src/stores/authStore';
import { ref } from 'vue';

  const authStore = useAuthStore();

  const password = ref();
  const email = ref();

  const onSubmit = async () =>{
    await authStore.login(
      {
        email: email.value,
        password: password.value
      })
  };

  const onReset = () =>{
    email.value = null;
    password.value = null;
  };

</script>

<template>
    <div v-if="authStore.isAuthenticated">
      <h2>Здравствуйте, {{ authStore.user?.name }}</h2>
    </div>
    <div v-else>
      <h2>Вход в систему</h2>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          filled
          v-model="email"
          label="Ваша почта"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <q-input
          filled
          type="password"
          v-model="password"
          label="Ваш пароль"
        />

        <div>
          <q-btn label="Войти" type="submit" color="primary"/>
          <q-btn label="Сброс" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
</template>
