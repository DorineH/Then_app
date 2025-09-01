
export interface AddApiFavoriteProps {
  category: string
  title?: string // devient optionnel
  description?: string
  authorOrArtistOrDirector?: string
  link?: string
  photo?: string
}

export interface AddApiCategoryProps {
  name: string
}
