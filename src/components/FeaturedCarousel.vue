<script setup lang="ts">
import { comicsService } from 'src/services/comicsService';
import { onMounted, ref } from 'vue';

const featuredComics = ref();
const slide = ref(1);

onMounted(async()=>{
  const comics = await comicsService.getFeatured();
  featuredComics.value = comics.data;
  console.log(featuredComics.value);
});

</script>

<template>
  <div class="bg-primary full-width">
    <q-carousel v-model="slide" class="full-width" style="height: 230px;">
        <q-carousel-slide
          v-for="comic in featuredComics"
          :key="comic.id"
          :name="comic.id"
        >
        <q-img :src=comic.cover_image class="">
          <span>{{ comic.rating }}</span>
        </q-img>
        <q-card-section class="q-pa-xs">
          <span class="text-nowrap">{{comic.type + ' ' + comic.year}}</span>
          {{comic.title }}
        </q-card-section>
        <div class="hover-shadow full-width full-height"></div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<style lang="scss" scoped>
$height: 200px;
$width: calc($height * 3 / 4);

.comic-card {

  body.screen--md &,
  body.screen--lg &{
    width: $width;
    height: $height;
  };
  img{
    height: 160px;
  }

  .hover-shadow{
    transition: background-color 0.3s ease;
    top:0;
    position: absolute;
    z-index: 3;
  }

  &:hover{
    .hover-shadow{
      background-color: #3c3a3a;
    }
  }

}

</style>
