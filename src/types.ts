export type Character = {
  id: number
  name: string
  crew?: { name?: string | null } | null
  job?: string | null
  age?: string | number | null
  size?: string | number | null
  bounty?: string | number | null
  fruit?: { name?: string | null; type?: string | null } | null
  status?: string | null
}
