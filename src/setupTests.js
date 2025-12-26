import '@testing-library/jest-dom'
import { afterEach, expect } from 'vitest'
import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'

// add jest-dom matchers to Vitest's expect
expect.extend(matchers)

afterEach(() => cleanup())
