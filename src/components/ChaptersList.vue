<script setup lang="ts">
import { useAuthStore } from 'src/stores/authStore';
import { useChaptersStore } from 'src/stores/chaptersListStore';
import { useChapterStore } from 'src/stores/chapterStore';
import { useComicStore } from 'src/stores/comicStore';
import type { Chapter } from 'src/types/comic';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const chaptersStore = useChaptersStore();
const chapterStore = useChapterStore();
const comicStore = useComicStore();
const authStore = useAuthStore()
const modalActive = ref(false);

const addChapter = async () => {
  if (comicStore.comicId) {
    await chapterStore.addChapter(comicStore.comicId);
    if (chapterStore.chapter) {
      chaptersStore.chapters?.push(chapterStore.chapter);
    }
  }
}

const canAddChapters= () => {
  return authStore.user != null && (authStore.user?.role == 'admin' || (authStore.user?.role == 'writer' && comicStore.comic?.author.id == authStore.user.id));
}

const reset = () => {
  chapterStore.newNumber = null;
  chapterStore.newDecimal = null;
  chapterStore.newPagesFile = null;
  chapterStore.newTitle = null
}

const toChapter = async (chapter: Chapter) => {
  await router.push({
    name: 'chapter',
    params: {
      comicId: chapter.comic_id,
      chapterId: chapter.id
    }
  });
}

</script>

<template>
  <q-list class="chapter-list">
    <q-item v-if="canAddChapters()" class="full-width justify-center q-mx-2 q-py-xs q-px-none">
      <div class="chapter-item cursor-pointer">
        <div class="q-px-lg" @click="modalActive = true">
          Добавить новую главу +
        </div>
        <q-dialog v-model="modalActive" persistent>
          <q-card style="min-width: 400px">
            <q-card-section>
              <div class="text-h6">Заполните данные</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-file outlined v-model="chapterStore.newPagesFile" label="Прикрепите zip файл со страницами">
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input v-model="chapterStore.newTitle" label="Название главы" />
            </q-card-section>

            <q-card-section class="row q-pt-none">
              <q-input v-model="chapterStore.newNumber" label="Номер главы" />
              <q-input v-model="chapterStore.newDecimal" label="Номер части главы" />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Отменить" @click="reset()" v-close-popup />
              <q-btn flat label="Отправить" @click="addChapter()" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-item>
    <q-item v-for="chapter in chaptersStore.chapters" :key="chapter.id" class="full-width q-py-xs q-px-none">
      <div class="chapter-item cursor-pointer" @click="toChapter(chapter)">
        <div class="number q-px-lg">
          {{ chapter.full_chapter_number }}
        </div>
        <q-separator dark vertical />
        <div class="title q-px-lg">
          {{ chapter.title }}
        </div>
      </div>
    </q-item>
    <q-item class="paginator-wrapper q-py-xs">
      <div class="paginator q-px-sm">
        <q-pagination v-model="chaptersStore.currentPage" @update:model-value="chaptersStore.getPage"
          :max="chaptersStore.pagesCount" input color="white" input-class="text-white" />
      </div>
    </q-item>
  </q-list>

</template>

<style lang="scss" scoped>
.chapter-list {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1px;

  .paginator-wrapper {
    width: 30%;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .paginator {
      border: 1px solid white;
      border-radius: 30px;
    }
  }

  .chapter-item {
    display: flex;
    flex-direction: row;
    border: 1px solid white;
    align-items: center;
    border-radius: 30px;
    width: 100%;
    transition: box-shadow 0.3s ease;

    &:hover {
      z-index: 4;
      background-color: rgba(94, 93, 93, 0.322);
      box-shadow: 0 4px 6px rgba(148, 148, 148, 0.322);
    }

    &:active {
      background-color: rgba(148, 148, 148, 0.322);
    }

    .number {
      display: flex;
      justify-content: center;
      width: 5%;
    }

    .title {
      display: flex;
      justify-content: start;
      width: 95%;
    }
  }
}
</style>
