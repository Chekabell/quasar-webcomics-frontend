import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ApiError, Link } from 'src/types/api';
import { comicsService } from 'src/services/comicsService';
import type { Chapter } from 'src/types/comic';

export const useChaptersStore = defineStore('chapters', () => {
  const chapters = ref<Array<Chapter>>();
  const links = ref<Array<Link> | null>(null);
  const currentPage = ref(1);
  const pagesCount = ref<number>(0);
  const perPage = ref<number>(5);
  const errorMessage = ref('');

  async function getChapters(comicId: string) {
    errorMessage.value = '';
    try {
      const response = await comicsService.getChapters(comicId, perPage.value);
      chapters.value = response.data.data;
      links.value = response.data.links;
      pagesCount.value = response.data.last_page;
      return { success: true, data: response.data };
    } catch (error) {
      errorMessage.value = (error as ApiError).userMessage;
      return { success: false, error };
    }
  }

  async function getPage() {
    let response;

    if (links.value !== null) {
      const link = links.value[currentPage.value];

      if (typeof link !== 'undefined' && link !== null) {
        response = await comicsService.getPage(link.url);
        chapters.value = response.data.data;
        links.value = response.data.links;
        pagesCount.value = response.data.last_page;
      }
    }
  }

  return {
    chapters,
    links,
    errorMessage,
    currentPage,
    pagesCount,
    perPage,
    getChapters,
    getPage,
  };
});
