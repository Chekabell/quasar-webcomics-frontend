import type { User } from "./user"

export interface Comic{
  id: string,
  title: string,
  description: string,
  year: number,
  type: string,
  cover_image: string,
  rating: number,
  views_count: number,
  comments_count: number,
  chapters_count: number,
  has_chapters: boolean,
  rating_stars: RatingStars,
  published_at: Date,
  author: User,
  status: string,
  tags: Array<Tag>,
  first_chapter:{
    id: number,
    chapter_number: number
  }
}

export interface Tag{
  id: string,
  title: string,
}

export interface RatingStars{
  full: number,
  half: boolean,
  empty: number
}

export interface Chapter{
  id: string,
  comic_id: string,
  title: string,
  full_chapter_number: number,
  pages: Array<Page>,
  pagesCount: number,
};

export interface Page{
  id: string,
  pageNumber: number,
  image_url: string,
}
