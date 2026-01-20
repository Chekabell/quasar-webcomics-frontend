<script setup lang="ts">
import { useAuthStore } from 'src/stores/authStore';
import { useComicsStore } from 'src/stores/comicsListStore';
import { useComicStore } from 'src/stores/comicStore';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const comicsStore = useComicsStore();
const comicStore = useComicStore();
const authStore = useAuthStore();
const router = useRouter();

const canViewDraft = () => {
  return authStore.user?.role == 'writer' || authStore.user?.role == 'admin'
}

const toComic = async (id: string) => {
  comicStore.comicId = id;
  await router.push({
    name: 'comic',
    params: { comicId: id }
  });
}

const toggleDrafted = async () => {
  comicsStore.comics = null;
  await comicsStore.getComics()
}

onMounted(async () => {
  comicsStore.showDrafted = false;
  comicsStore.comics = null;
  await comicsStore.getComics();
});
</script>

<template>
  <q-page class="full-width column content-center bg-primary">
    <div class="comics-list q-my-lg">
      <div class="toolbar">
        <div class="paginator bg-dark shadow-4">
          <q-pagination v-model="comicsStore.currentPage" @update:model-value="comicsStore.getPage"
            :max="comicsStore.pagesCount" input color="white" input-class="text-white" />
        </div>
        <div class="draft bg-dark q-px-md q-py-xs shadow-4" v-if="canViewDraft()">
          <span>Показать черновики</span>
          <q-toggle v-model="comicsStore.showDrafted" @update:model-value="toggleDrafted" color="blue" />
        </div>
      </div>
      <div>
        <div v-if="comicsStore.comics" class="column content-center q-gutter-lg">
          <div v-for="comic in comicsStore.comics" :key="comic.id" class="comic-item shadow-4"
            v-on:click="toComic(comic.id)">
            <q-card class="comic-card text-white">
              <q-img :src="comic.cover_image" class="comic-image" :ratio="3/4" />

              <!-- Контент -->
              <div class="col q-pa-md">
                <div class="row full-height">
                  <!-- Заголовок и тип -->
                  <div class="col-3 column justify-between items-center text-center q-pr-md">
                    <h6 class="q-my-none">{{ comic.title }}</h6>
                    <h5 class="q-my-none ">{{ comic.rating }}</h5>
                    <h4 class="q-my-none text-subtitle1 text-grey">{{ comic.type }}</h4>
                  </div>
                  <q-separator dark vertical />
                  <!-- Описание -->
                  <div class="col-8 row items-center">
                    <p class="q-my-none q-mx-lg text-body1">{{ comic.description }}</p>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>
        <div v-else class="column content-center q-gutter-lg">
          <div v-for="n in 5" :key="n" class="comic-item full-width shadow-4">
            <q-card class="comic-card">
              <q-skeleton type="rect" />
              <div class="col q-pa-md">
                <div class="row full-height">
                  <div class="col-3 column justify-between items-center text-center q-pr-md">
                    <q-skeleton class="q-my-none" type="text" />
                    <q-skeleton class="q-my-none text-subtitle1" type="text" />
                  </div>
                  <div class="col-9">
                    <q-skeleton class="q-my-none q-my-none text-body1" type="text" />
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </div>
      <div class="toolbar">
        <div class="paginator bg-dark">
          <q-pagination v-model="comicsStore.currentPage" @update:model-value="comicsStore.getPage"
            :max="comicsStore.pagesCount" input color="white" input-class="text-white" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.comics-list {
  width: 80%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;

  .toolbar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    width: 60%;

    .paginator {
      display: flex;
      flex-direction: row;
      justify-content: center;
      padding: 0 10px;
      border: 1px solid white;
      border-radius: 30px;
    }

    .draft {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border: 1px solid white;
      color: white;
      border-radius: 30px;
    }
  }


  .comic-item {
    display: flex;
    align-items: center;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.778);
    border-radius: 10px;
    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 6px 20px rgba(120, 120, 120, 0.15);
    }
  }

  .comic-card {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    cursor: pointer;
    transition: box-shadow 0.3s ease;
    background: rgb(29, 29, 29);
    transition: 0.3s ease;

    &:hover {
      background-color: rgba(94, 93, 93, 0.322);
    }

    &:active {
      background-color: rgba(148, 148, 148, 0.322);
    }

    .comic-image {
      object-fit: cover;
      width: 150px;
      height: 200px;
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .comic-item {
    flex-direction: column;

    .comic-card {
      .row {
        flex-direction: column;
      }

    }
  }

  .comics-list {
    .comic-image {
      width: 100% !important;
      max-height: 300px !important;
    }
  }
}
</style>
