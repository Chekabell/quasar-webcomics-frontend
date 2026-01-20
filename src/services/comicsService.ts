import { api } from 'src/boot/axios';

export class ComicsService {
  async getFeatured() {
    return await api.get('/comics/featured');
  }

  async getAllComics(perPage: number) {
    return await api.get('/comics', {
      params: {
        per_page: perPage,
      },
    });
  }
  async getAllDraftedComics(perPage: number) {
    return await api.get('/comics', {
      params: {
        per_page: perPage,
        status: 'draft',
      },
    });
  }

  async getPage(url: string) {
    return await api.get(url);
  }

  async uploadCover(id: string, file: Blob) {
    const formData = new FormData();
    formData.append('cover_image', file);
    return await api.put('/comics/' + id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getPageDraftedComics(url: string) {
    return await api.get(url, {
      params: {
        status: 'draft',
      },
    });
  }

  async getComic(id: string) {
    return await api.get('/comics/' + id);
  }

  async deleteComic(id: string) {
    return await api.delete('/comics/' + id);
  }

  async getChapters(id: string, perPage: number) {
    return await api.get('/comics/' + id + '/chapters', {
      params: {
        per_page: perPage,
      },
    });
  }

  async getChapterWithPages(comicId: string, chapterId: string) {
    return await api.get('/comics/' + comicId + '/chapters/' + chapterId + '/pages');
  }

  async getPageChapter(url: string) {
    return await api.get(url);
  }

  async getTags() {
    return await api.get('/tags');
  }

  async publishComic(comicId: string) {
    return await api.patch('/comics/' + comicId);
  }

  async addComic(
    newTitle: string,
    coverFile: Blob | undefined,
    newTags: Array<string> | null,
    newType: string,
    newYear: string,
    newDescription: string,
  ) {
    if (typeof coverFile == 'undefined') {
      return await api.post('/comics/', {
        title: newTitle,
        description: newDescription,
        year: newYear,
        type: newType,
        tags: newTags,
      });
    } else {
      const formData = new FormData();
      formData.append('cover_image', coverFile);
      return await api.post('/comics/', formData, {
        params: {
          title: newTitle,
          description: newDescription,
          year: newYear,
          type: newType,
          tags: newTags,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  }

  async addChapter(
    comicId: string,
    newTitle: string,
    newNumber: number,
    newDecimal: number | null | undefined,
    pages: Blob,
  ) {
    const formData = new FormData();
    formData.append('pages_zip', pages);
    if (newDecimal == null || typeof newDecimal == 'undefined') {
      return await api.post('/comics/' + comicId + '/chapters', formData, {
        params: {
          chapter_number: newNumber,
          title: newTitle,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      return await api.post('/comics/' + comicId + '/chapters', formData, {
        params: {
          chapter_number: newNumber,
          chapter_decimal: newDecimal,
          title: newTitle,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  }
}

export const comicsService = new ComicsService();
