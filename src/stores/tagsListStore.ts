import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ApiError } from 'src/types/api';
import { comicsService } from 'src/services/comicsService';
import type { Tag } from 'src/types/comic';

export const useTagsListStore = defineStore('tagsList', () => {
  const tags = ref<Array<Tag> | undefined>();
  const errorMessage = ref('');

  async function getTags() {
    errorMessage.value = '';
    try {
      const response = await comicsService.getTags();
      tags.value = response.data;
      return { success: true, data: response.data };
    } catch (error) {
      errorMessage.value = (error as ApiError).userMessage;
      return { success: false, error };
    }
  }

  return { tags, errorMessage, getTags };
});
