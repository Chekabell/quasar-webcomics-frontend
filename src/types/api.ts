export interface ApiError extends Error{
  userMessage: string,
}

export interface Link {
  url: string,
  label: string,
  page: number | null,
  active: boolean
}
