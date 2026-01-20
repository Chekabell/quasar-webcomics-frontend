import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ApiError } from 'src/types/api';
import type { Comic, Tag } from 'src/types/comic';
import { comicsService } from 'src/services/comicsService';

export const useComicStore = defineStore('comic', () => {
  const comic = ref<Comic | null>(null);
  const comicId = ref<string>();
  const errorMessage = ref('');
  const newFileCover = ref<File | undefined>();
  const newTitle = ref<string | null>();
  const newTags = ref<Array<Tag> | null>();
  const newType = ref<string>();
  const newYear = ref<string>();
  const newDescription = ref<string>();

  async function getComic() {
    errorMessage.value = '';
    try {
      if (comicId.value) {
        const response = await comicsService.getComic(comicId.value);
        comic.value = response.data;
        return { success: true, data: response.data };
      }
    } catch (error) {
      errorMessage.value = (error as ApiError).userMessage;
      return { success: false, error };
    }
  }

  async function publishComic() {
    if (comic.value && comic.value.status !== 'published') {
      const response = await comicsService.publishComic(comic.value.id);
      console.log(response);
      comic.value.status = response.data;
    }
  }

  async function updateCover() {
    if (comic.value && newFileCover.value) {
      const response = await comicsService.uploadCover(comic.value.id, newFileCover.value as Blob);
      comic.value.cover_image = response.data.cover_image;
      newFileCover.value = undefined;
    }
  }

  async function addComic() {
    if (newTitle.value && newDescription.value && newTags.value && newType.value && newYear.value) {
      const ids = newTags.value.map((item) => item.id);
      const response = await comicsService.addComic(
        newTitle.value,
        newFileCover.value,
        ids,
        newType.value,
        newYear.value,
        newDescription.value,
      );
      console.log(response)
      comic.value = response.data;
      newFileCover.value = undefined;
      newTitle.value =  null;
      newTags.value = null;
      newType.value = '';
      newYear.value = '';
      newDescription.value = '';
    }
  }

  return {
    comic,
    comicId,
    newYear,
    newType,
    newTitle,
    newDescription,
    newTags,
    newFileCover,
    errorMessage,
    getComic,
    updateCover,
    addComic,
    publishComic,
  };
});
