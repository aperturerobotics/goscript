import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '../trpc/router'

export const trpc = createTRPCReact<AppRouter>()
