import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

export type Cart = {
  items: CartItem[]
  total: number
}

export async function getCart(): Promise<Cart> {
  const cookieStore = await cookies()
  const cartCookie = cookieStore.get('cart')
  
  if (!cartCookie?.value) {
    return { items: [], total: 0 }
  }

  try {
    const cartData = JSON.parse(cartCookie.value)
    return cartData
  } catch {
    return { items: [], total: 0 }
  }
}

export async function addToCart(productId: number, quantity: number = 1): Promise<Cart> {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    throw new Error('Product not found')
  }

  if (product.stock < quantity) {
    throw new Error('Insufficient stock')
  }

  const cart = await getCart()
  const existingItemIndex = cart.items.findIndex(item => item.id === productId)

  if (existingItemIndex >= 0) {
    const newQuantity = cart.items[existingItemIndex].quantity + quantity
    if (product.stock < newQuantity) {
      throw new Error('Insufficient stock')
    }
    cart.items[existingItemIndex].quantity = newQuantity
  } else {
    cart.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image || undefined
    })
  }

  // Recalculate total
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Save to cookie
  const cookieStore = await cookies()
  cookieStore.set('cart', JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return cart
}

export async function updateCartItem(productId: number, quantity: number): Promise<Cart> {
  if (quantity <= 0) {
    return removeFromCart(productId)
  }

  const cart = await getCart()
  const itemIndex = cart.items.findIndex(item => item.id === productId)

  if (itemIndex === -1) {
    throw new Error('Item not found in cart')
  }

  // Check stock
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product || product.stock < quantity) {
    throw new Error('Insufficient stock')
  }

  cart.items[itemIndex].quantity = quantity
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Save to cookie
  const cookieStore = await cookies()
  cookieStore.set('cart', JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7
  })

  return cart
}

export async function removeFromCart(productId: number): Promise<Cart> {
  const cart = await getCart()
  cart.items = cart.items.filter(item => item.id !== productId)
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Save to cookie
  const cookieStore = await cookies()
  if (cart.items.length === 0) {
    cookieStore.delete('cart')
  } else {
    cookieStore.set('cart', JSON.stringify(cart), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })
  }

  return cart
}

export async function clearCart(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('cart')
}

export async function createOrder(userId: number, cart: Cart) {
  if (cart.items.length === 0) {
    throw new Error('Cart is empty')
  }

  // Check stock for all items
  for (const item of cart.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.id }
    })
    
    if (!product || product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.name}`)
    }
  }

  // Create order with transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create order
    const order = await tx.order.create({
      data: {
        userId,
        total: cart.total,
        status: 'pending'
      }
    })

    // Create order items and update stock
    for (const item of cart.items) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }
      })

      // Update product stock
      await tx.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    return order
  })

  // Clear cart after successful order
  await clearCart()

  return result
}
