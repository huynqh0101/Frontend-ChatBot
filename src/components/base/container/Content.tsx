import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

import { Container } from './Container'

export const Content = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className, ...rest }, ref) => (
  <Container
    ref={ref}
    {...rest}
    className={cn(
      'max-w-max-content md:px-content mx-auto w-full px-6',
      className
    )}
  >
    {children}
  </Container>
))

Content.displayName = 'Content'
