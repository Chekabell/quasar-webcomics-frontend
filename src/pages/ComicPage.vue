<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from 'src/stores/authStore';
import ChaptersList from 'src/components/ChaptersList.vue';
import { useComicStore } from 'src/stores/comicStore';
import { useChaptersStore } from 'src/stores/chaptersListStore';
import { useRouter } from 'vue-router';

const props = defineProps<{
  comicId: string
}>();

const authStore = useAuthStore();
const comicStore = useComicStore();
const chaptersStore = useChaptersStore();
const router = useRouter();

const modalActive = ref(false);
const tab = ref("chapters");

const canRedact = () => {
  return authStore.user != null && (authStore.user?.role == 'admin' || (authStore.user?.role == 'writer' && comicStore.comic?.author.id == authStore.user.id));
}

const toReadFirstChapter = async () => {
  console.log(comicStore.comic)
  if (comicStore.comic && comicStore.comic.first_chapter) {
    await router.push({
      name: 'chapter',
      params: {
        comicId: comicStore.comicId,
        chapterId: comicStore.comic.first_chapter.id
      }
    });
  }
}

onMounted(async () => {
  if (!comicStore.comic || comicStore.comic.id != comicStore.comicId) {
    comicStore.comicId = props.comicId;
    await comicStore.getComic();
    await chaptersStore.getChapters(comicStore.comicId);
  }
});

</script>

<template>
  <q-page class="comics-detail-page shadow-5 q-pt-xl" :style="'background: linear-gradient(rgba(63, 63, 63, 0.80), rgba(17, 17, 17, 1)),' + 'url(' + comicStore.comic?.cover_image
    + ')' + 'center/cover no-repeat;'">
    <div class="page-background bg-primary q-pa-lg">
      <!-- Левая колонка с изображением -->
      <div class="left-column">
        <q-img :src="comicStore.comic?.cover_image" alt="картинка" :ratio="3 / 4" class="rounded-borders comic-cover"
          fit="cover" />
        <q-btn class="q-mt-sm" :color="comicStore.comic?.has_chapters ? 'accent' : 'primary'" label="Читать"
          @click="toReadFirstChapter()" />
        <div class="column q-gutter-y-md q-pt-md" v-show="canRedact()">
          <q-btn color="secondary" label="Сменить обложку" v-on:click="modalActive = true" />
          <q-btn v-if="comicStore.comic?.status == 'draft'" color="secondary" label="Опубликовать"
            @click="comicStore.publishComic()" />
          <q-btn color="primary" label="Редактировать" />
          <q-dialog v-model="modalActive" persistent>
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">Прикрепите файл</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <q-file outlined v-model="comicStore.newFileCover">
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </q-card-section>

              <q-card-actions class="text-primary">
                <q-btn flat label="Отменить" @click="comicStore.newFileCover = undefined" v-close-popup />
                <q-btn flat label="Отправить" @click="comicStore.updateCover()" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </div>

      <!-- Правая колонка с информацией -->
      <div class="right-column">
        <!-- Заголовок и мета-информация -->
        <div class="header bg-dark q-px-sm shadow-3 q-py-xs">
          <div class="row items-center q-gutter-md">
            <div class="row items-center">
              <span class="q-ml-xs">{{ comicStore.comic?.rating }}</span>
            </div>
            <span>•</span>
            <span>{{ comicStore.comic?.year }}</span>
            <span>•</span>
            <span>{{ comicStore.comic?.type }}</span>
          </div>
        </div>

        <div class="bg-dark shadow-3 q-px-md q-py-sm">
          <span class="text-h5 text-white">{{ comicStore.comic?.title }}</span>
        </div>
        <!-- Описание и теги -->
        <q-card class="description shadow-3 bg-dark text-white q-pa-md">
          <div class="text-body1">{{ comicStore.comic?.description }}</div>

          <div class="q-mt-md">
            <q-chip v-for="tag in comicStore.comic?.tags" :key="tag.id" color="secondary" text-color="white"
              class="q-mr-xs q-mb-xs cursor-pointer">
              {{ tag.title }}
            </q-chip>
          </div>
        </q-card>

        <!-- Комментарии и главы-->
        <q-card class="menu bg-dark shadow-3 q-pa-md text-white ">
          <q-tabs v-model="tab" dense class="text-white" active-color="white" indicator-color="primary" align="justify">
            <q-tab name="chapters" label="Главы" class="bg-accent" />
            <q-tab name="comments" label="Комментарии" class="bg-accent" />
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel class="q-pa-none bg-dark" name="chapters">
              <chapters-list v-if="chaptersStore.chapters" />
              <q-skeleton type="rect" v-else></q-skeleton>
            </q-tab-panel>

            <q-tab-panel class="q-pa-none" name="comments">
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.comics-detail-page {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100%;

  .page-background {
    gap: 30px;
    display: flex;
    flex-direction: row;
    align-items: start;
    width: 80%;
    border-radius: 15px 15px 0px 0px;
  }

  .left-column {
    display: flex;
    flex-direction: column;
    position: sticky;
    width: 30%;
  }

  .right-column {
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 70%;
    color: white;
    gap: 10px;

    .description {
      width: 100%;
    }

    .menu {
      width: 100%;
    }
  }

  .comic-cover {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: $breakpoint-md) {
    .sticky-column {
      position: static;
    }

    .comic-cover {
      max-width: 100%;
      margin: 0 auto;
    }
  }
}
</style>
