<script setup lang="ts">
import { comicsService } from 'src/services/comicsService';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  comicId: string,
  chapterId: string
}>();

const chapterPage = ref();
const links = ref();
const nextPage = ref();
const prevPage = ref();

const toPrev = async () => {
  if (prevPage.value != null) {
    const response = await comicsService.getPageChapter(prevPage.value)
    chapterPage.value = response.data.data[0];
    links.value = response.data.links;
    nextPage.value = response.data.next_page_url;
    prevPage.value = response.data.prev_page_url;
    window.scrollTo(0, 0)
  }
};

const toNext = async () => {
  if (nextPage.value != null) {
    const response = await comicsService.getPageChapter(nextPage.value)
    chapterPage.value = response.data.data[0];
    links.value = response.data.links;
    nextPage.value = response.data.next_page_url;
    prevPage.value = response.data.prev_page_url;
    window.scrollTo(0, 0)
  }
};

onMounted(async () => {
  const response = await comicsService.getChapterWithPages(props.comicId, props.chapterId);
  chapterPage.value = response.data.data[0];
  links.value = response.data.links;
  nextPage.value = response.data.next_page_url;
  prevPage.value = response.data.prev_page_url;
});
</script>

<template>
  <div class="column content-center full-width bg-primary">
    <div class="page">
      <q-img :src="chapterPage?.image">
        <div class="fit">
          <div class="prev" @click="toPrev()" />
          <div class="next" @click="toNext()" />
        </div>
      </q-img>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 60%;

  .fit {
    background: none;
    display: flex;
    justify-content: space-between;
    padding: 0 !important;

    .prev {
      width: 20%;
      height: 100%;
    }

    .next {
      width: 20%;
      height: 100%;
    }
  }
}
</style>
