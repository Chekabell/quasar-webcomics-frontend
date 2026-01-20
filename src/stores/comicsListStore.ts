import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ApiError, Link } from 'src/types/api';
import type { Comic } from 'src/types/comic';
import { comicsService } from 'src/services/comicsService';

export const useComicsStore = defineStore('comics', () => {
  const comics = ref<Array<Comic> | null>(null);
  const links = ref<Array<Link> | null>(null);
  const showDrafted = ref(false);
  const currentPage = ref(1);
  const pagesCount = ref<number>(0);
  const perPage = ref<number>(5);
  const errorMessage = ref('');

  async function getComics() {
    if (!comics.value) {
      errorMessage.value = '';
      try {
        let response;
        if (showDrafted.value) {
          response = await comicsService.getAllDraftedComics(perPage.value);
        } else {
          response = await comicsService.getAllComics(perPage.value);
        }
        comics.value = response.data.data;
        links.value = response.data.meta.links;
        pagesCount.value = response.data.meta.last_page;
        return { success: true, data: response.data };
      } catch (error) {
        errorMessage.value = (error as ApiError).userMessage;
        return { success: false, error };
      }
    }
  }

  async function getPage() {
    if (links.value !== null) {
      let response;
      const link = links.value[currentPage.value];

      if (typeof link !== 'undefined' && link !== null) {
        if (showDrafted.value) {
          response = await comicsService.getPageDraftedComics(link.url);
        } else {
          response = await comicsService.getPage(link.url);
        }

        pagesCount.value = response.data.meta.last_page;
        comics.value = response.data.data;
        links.value = response.data.meta.links;
      }
    }
  }

  return {
    comics,
    links,
    errorMessage,
    showDrafted,
    currentPage,
    pagesCount,
    perPage,
    getComics,
    getPage,
  };
});
