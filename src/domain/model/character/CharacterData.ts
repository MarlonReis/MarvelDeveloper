export interface CreateCharacterData {
  name: string
  description: string
  topImage: string
  profileImage: string
}

export interface CharacterResponse {
  id: string
  name: string
  description: string
  topImage: string
  profileImage: string
  comics: any[]
}
