<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from 'src/stores/authStore';
import { useComicStore } from 'src/stores/comicStore';
import { useTagsListStore } from 'src/stores/tagsListStore';
import { useRouter } from 'vue-router';
import { QFile, useQuasar } from 'quasar';
import { useChaptersStore } from 'src/stores/chaptersListStore';

const authStore = useAuthStore();
const comicStore = useComicStore();
const tagsListStore = useTagsListStore();
const chaptersStore = useChaptersStore();
const router = useRouter();
const $q = useQuasar();

const types = ['манга', 'манхва', 'маньхуа', 'западное', 'другое'];

const imagePreview = ref<string | null>(null);
const fileInput = ref<QFile | null>(null);

const addComic = async () => {
  if (authStore.user) {
    comicStore.comic = null;
    await comicStore.addComic();
    if (comicStore.comic && comicStore.comicId) {
      $q.notify({
          message: 'Комикс успешно создан',
          color: 'green'
        });
      await chaptersStore.getChapters(comicStore.comicId)
      await router.push({
        name: 'comic',
        params: { comicId: comicStore.comicId }
      });
    }else{
      $q.notify({
          message: comicStore.errorMessage,
          color: 'red'
        });
      comicStore.errorMessage = '';
    }
  }
}

const handleFileSelect = () => {
  if (!comicStore.newFileCover) {
    imagePreview.value = null;
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    imagePreview.value = event.target?.result as string;
  };

  reader.onerror = (error) => {
    console.error('Ошибка чтения файла:', error);
  };

  reader.readAsDataURL(comicStore.newFileCover);
}

const removeFile = (event: Event) => {
  event.stopPropagation();
  comicStore.newFileCover = undefined;
  imagePreview.value = null;
}

const openFileDialog = () => {
  if (fileInput.value) {
    fileInput.value.pickFiles();
  }
}

onMounted(async () => {
  if (!tagsListStore.tags) {
    await tagsListStore.getTags();
  }
});
</script>

<template>
  <q-page class="comic-edit-page shadow-5 q-pt-xl" :style="'background: linear-gradient(rgba(63, 63, 63, 0.90), rgba(17, 17, 17, 1)),' + 'url(' + imagePreview
    + ')' + 'center/cover no-repeat;'">
    <div class="page-background bg-dark q-pa-lg">
      <q-form class="form ">
        <div class="left">
          <div :style="'background:' + 'url(' + imagePreview + ')' + 'center/cover no-repeat;'"
            class="rounded-borders comic-cover" @click="openFileDialog">

            <q-file ref="fileInput" v-model="comicStore.newFileCover" style="display: none;"
              @update:model-value="handleFileSelect()" borderless />

            <q-btn v-if="imagePreview" round dense flat icon="close" class="remove-btn" @click="removeFile" size="sm">
              <q-tooltip>Удалить обложку</q-tooltip>
            </q-btn>

            <div v-else class="upload-placeholder">
              <q-icon name="add_photo_alternate" size="3em" />
              <div class="text-caption q-mt-sm">Добавить обложку</div>
            </div>
          </div>
        </div>
        <div class="right">
          <q-input class="shadow-2" input-style="color: white;" color="white" label-color="white" filled
            v-model="comicStore.newTitle" label="Название комикса" />
          <q-input class="shadow-2" input-style="color: white;" color="white" label-color="white" filled type="textarea"
            v-model="comicStore.newDescription" label="Описание" />
          <div class="row year-type">
            <q-input class="shadow-2 year" input-style="color: white;" color="white" label-color="white" filled
              v-model="comicStore.newYear" label="Год начала выпуска" />
            <q-select class="shadow-2 type q-px-sm" style="" color="white" :input-style="{ color: 'white' }"
              label-color="white" v-model="comicStore.newType" :options="types" label="Тип комикса" />
          </div>
          <q-select class="shadow-2 q-px-sm" :input-style="{ color: 'white' }" label-color="white"
            v-model="comicStore.newTags" :options="tagsListStore.tags" option-value="id" option-label="title" use-chips
            stack-label multiple color="black" label="Тэги" />
          <q-btn color="accent" @click="addComic()">Добавить новый комикс</q-btn>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.comic-edit-page {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  color: white;

  .page-background {
    display: flex;
    flex-direction: row;
    align-items: start;
    width: 80%;
    border-radius: 15px 15px 0px 0px;

    .form {
      width: 100%;
      display: flex;
      flex-direction: row;
      gap: 20px;

      .left {
        width: 30%;

        .comic-cover {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          cursor: pointer;
          position: relative;
          min-height: 400px;
          background-color: #2e2e2e;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          .remove-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            z-index: 10;

            &:hover {
              background: rgba(0, 0, 0, 0.8);
            }
          }

          .upload-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #aaa;
            padding: 20px;
            text-align: center;
          }

          &:hover {
            box-shadow:
              inset 0 0 20px rgb(146, 81, 166),
              0 10px 25px rgba(0, 0, 0, 0.5);

            .upload-placeholder {
              color: #fff;
            }
          }
        }
      }

      .right {
        color: white;
        display: flex;
        flex-direction: column;
        width: 70%;
        gap: 10px;

        .year-type {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          gap: 15px;

          .year {
            width: 50%;
          }

          .type {
            width: 50%;

            :deep(.q-field__native) {
              color: white !important;
            }

            :deep(.q-field__input) {
              color: white !important;
            }
          }
        }
      }
    }
  }
}
</style>
