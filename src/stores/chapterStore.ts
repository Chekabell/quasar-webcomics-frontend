import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ApiError } from 'src/types/api';
import type { Chapter } from 'src/types/comic';
import { comicsService } from 'src/services/comicsService';

export const useChapterStore = defineStore('chapter', () => {
  const chapterId = ref<string>();
  const chapter = ref<Chapter>();
  const errorMessage = ref('');
  const newPagesFile = ref<File | null | undefined>();
  const newTitle = ref<string | null>();
  const newNumber = ref<number | null>();
  const newDecimal = ref<number | null>();

  async function getChapter(comicId: string) {
    errorMessage.value = '';
    try {
      if (chapterId.value) {
        const response = await comicsService.getChapterWithPages(comicId, chapterId.value);
        chapter.value = response.data;
        return { success: true, data: response.data };
      }
    } catch (error) {
      errorMessage.value = (error as ApiError).userMessage;
      return { success: false, error };
    }
  }

  async function addChapter(comicId: string) {
    if (newPagesFile.value && newTitle.value && newNumber.value) {
      const response = await comicsService.addChapter(
        comicId,
        newTitle.value,
        newNumber.value,
        newDecimal.value,
        newPagesFile.value as Blob,
      );
      newPagesFile.value = null;
      newTitle.value = null;
      newNumber.value = null;
      newDecimal.value = null;
      chapter.value = response.data;
      console.log(response);
      return chapter.value;
    }
  }

  return {
    chapterId,
    chapter,
    errorMessage,
    newPagesFile,
    newTitle,
    newNumber,
    newDecimal,
    getChapter,
    addChapter,
  };
});
