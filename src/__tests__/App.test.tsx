/* eslint-disable react/react-in-jsx-scope */
import '@testing-library/jest-dom'
import fetchMock from 'jest-fetch-mock'
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MockedJourneyPatterns, MockedStopData } from './MockedData'
import App from '../App'

const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const renderComponent = () => render(
  <QueryClientProvider client={mockQueryClient}>
    <App />
  </QueryClientProvider>
)

fetchMock.enableMocks()

fetchMock.mockResponseOnce(JSON.stringify(MockedStopData))
fetchMock.mockResponseOnce(JSON.stringify(MockedJourneyPatterns))

describe('App Component', () => {
  it('renders loading state', async () => {
    const { getByText } = renderComponent()

    await waitFor(() => expect(getByText('Loading...')).toBeInTheDocument())
  })

  it('renders after data is populated', async () => {
    const { getByText, queryByText } = renderComponent()

    await waitFor(() => expect(getByText('Top 10 Bus Lines with Most Stops')).toBeInTheDocument())
    await waitFor(() => expect(getByText('Bus Line 1')).toBeInTheDocument())
    await waitFor(() => expect(queryByText('Show Station Names (4)')).toBeInTheDocument())
    await waitFor(() => expect(queryByText('Bus Line 21')).toBeNull())
  })
})
