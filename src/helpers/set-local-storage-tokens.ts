import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '@/variables/local-storage-tokens'

interface SetLocalStorageTokensProps {
  accessToken: string
  refreshToken: string
}

export const setLocalStorageTokens = (tokens: SetLocalStorageTokensProps) => {
  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, tokens.refreshToken)
}
