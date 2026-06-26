import PocketBase from 'pocketbase'

// In production replace with your deployed PocketBase URL
const PB_URL = process.env.NEXT_PUBLIC_PB_URL ?? 'http://127.0.0.1:8090'

export const pb = new PocketBase(PB_URL)

export interface Cafe {
  id: string
  name: string
  email: string
  partner_code: string
  address?: string
  active: boolean
  onboarded_at: string
}

export interface Stamp {
  id: string
  user_id: string
  cafe_id: string
  stamped_at: string
  redeemed: boolean
}

export async function registerCafe(name: string, partnerCode: string, email?: string): Promise<Cafe> {
  return pb.collection('cafes').create<Cafe>({
    name,
    email: email ?? `${partnerCode.toLowerCase()}@strudl.at`,
    partner_code: partnerCode,
    active: true,
    onboarded_at: new Date().toISOString(),
  })
}

export async function getCafe(id: string): Promise<Cafe> {
  return pb.collection('cafes').getOne<Cafe>(id)
}

export async function getStampsForCafe(cafeId: string): Promise<Stamp[]> {
  return pb.collection('stamps').getFullList<Stamp>({
    filter: `cafe_id = "${cafeId}"`,
    sort: '-stamped_at',
  })
}

export async function addStamp(userId: string, cafeId: string): Promise<Stamp> {
  return pb.collection('stamps').create<Stamp>({
    user_id: userId,
    cafe_id: cafeId,
    stamped_at: new Date().toISOString(),
    redeemed: false,
  })
}

export async function redeemStamp(stampId: string): Promise<Stamp> {
  return pb.collection('stamps').update<Stamp>(stampId, { redeemed: true })
}
