import React from 'react'
import { TopBusLines } from "../hooks/useBusStops"
import styled from 'styled-components'
import BusStations from "./BusStations"

interface Props {
  mappedJourneyPattern: TopBusLines
}

const BusLine: React.FC<Props> = ({ mappedJourneyPattern }) => {
  const { lineNumber, journeyPattern } = mappedJourneyPattern

  return (
    <BusLineWrapper>
      <BusNumber>{`Bus Line ${lineNumber}`}</BusNumber>
      <BusStations busLine={lineNumber} journeyPattern={journeyPattern} />
    </BusLineWrapper>
  )
}

const BusLineWrapper = styled.div`
  background: #E4F4F3;
  margin: 15px;
  padding: 15px;
  border-radius: 6px;
`
const BusNumber = styled.h3`
  display: flex;
`

export default BusLine
