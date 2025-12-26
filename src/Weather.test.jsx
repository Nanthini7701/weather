/* @vitest-environment jsdom */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, test, vi, expect } from 'vitest'
import Weather from './Weather'

const sampleResponse = {
  name: 'London',
  sys: { country: 'GB' },
  main: { temp: 285.15, humidity: 81 },
  weather: [{ main: 'Clouds', description: 'overcast clouds', icon: '04d' }],
}

// Ensure localStorage exists in any environment
if (typeof localStorage === 'undefined') {
  const _store = {}
  globalThis.localStorage = {
    getItem: (k) => (_store[k] ?? null),
    setItem: (k, v) => { _store[k] = String(v) },
    removeItem: (k) => { delete _store[k] },
    clear: () => { for (const k in _store) delete _store[k] },
  }
}

beforeEach(() => {
  // provide an API key for the component
  globalThis.__VITE_OPENWEATHERMAP_API_KEY = 'test-key'
  localStorage.clear()
  vi.restoreAllMocks()
})

test('successful search shows data and saves history', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => sampleResponse,
  }))

  render(<Weather />)

  const inputs = screen.getAllByPlaceholderText(/Enter city name/i)
  const input = inputs[inputs.length - 1]
  await userEvent.type(input, 'London')
  const btns = screen.getAllByRole('button', { name: /search/i })
  const btn = btns[btns.length - 1]
  await userEvent.click(btn)

  // result appears
  await waitFor(() => expect(screen.getByText(/London, GB/i)).toBeTruthy())
  expect(screen.getByText(/81%/i)).toBeTruthy()
  expect(JSON.parse(localStorage.getItem('weather:recent') || '[]')).toContain('London')
})

test('invalid city shows error message', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
    ok: false,
    json: async () => ({ message: 'city not found' }),
  }))

  render(<Weather />)

  const inputs = screen.getAllByPlaceholderText(/Enter city name/i)
  const input = inputs[inputs.length - 1]
  await userEvent.type(input, 'NoSuchCity')
  const btns = screen.getAllByRole('button', { name: /search/i })
  const btn = btns[btns.length - 1]
  await userEvent.click(btn)

  await waitFor(() => expect(screen.getByText(/city not found/i)).toBeTruthy())
})

test('clicking a history item triggers a fetch', async () => {
  localStorage.setItem('weather:recent', JSON.stringify(['Paris']))

  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => sampleResponse,
  }))

  render(<Weather />)

  const historyBtn = await screen.findByText(/Paris/i)
  await userEvent.click(historyBtn)

  await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled())
})