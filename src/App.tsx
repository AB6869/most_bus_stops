import React from 'react'
import BusLine from './components/BusLine'
import useBusStops from './hooks/useBusStops'
import styled from 'styled-components'

const App: React.FC = () => {
  const { mappedJourneyPatterns, isLoading, error } = useBusStops()

  const renderContent = () => {
    if (isLoading) {
      return <LoadingText>{'Loading...'}</LoadingText>
    } else if (error) {
      return <ErrorText>{`There is an error ${error} please try again`}</ErrorText>
    }

    return (
      mappedJourneyPatterns?.map((mappedJourneyPattern, index) => (
        <BusLine key={index} mappedJourneyPattern={mappedJourneyPattern} />
      ))
    )
  }

  return (
    <>
      <h2>{'Top 10 Bus Lines with Most Stops'}</h2>
      {renderContent()}
    </>
  )
}

const LoadingText = styled.h2`
  padding-top: 30px;
`

const ErrorText = styled.h3`
  padding-top: 30px;
  color: #FF5733;
`

export default App
