import React from 'react'
import styled from 'styled-components'
import { JourneyPattern } from '../hooks/useBusStops'
import { useState } from 'react'
import { useCollapse } from 'react-collapsed'
import arrowDown from '../assets/images/arrow_down.svg'
import arrowUp from '../assets/images/arrow_up.svg'

interface Props {
  busLine: string
  journeyPattern: JourneyPattern[]
}

const BusStations: React.FC<Props> = ({ busLine, journeyPattern }) => {
  const [isExpanded, setExpanded] = useState(false)
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })

  const renderContent = () => (
    <ListWrapper>
      {journeyPattern
        .filter((busStop: { LineNumber: string }) =>
          busStop.LineNumber === busLine)
        .map((journeyPattern) => (
          <ListItem key={journeyPattern.JourneyPatternPointNumber}>{journeyPattern.StopPointName}</ListItem>
      ))}
    </ListWrapper>
  )

  const renderHeaderState = () => {
    if (isExpanded) {
      return (
        <StationNameHeader>
          <Text>{'Hide Station Names'}</Text>
          <img src={arrowUp} alt='collapsed' height={12} width={22}/>
        </StationNameHeader>
      )
    }

    return (
        <StationNameHeader>
          <Text>{`Show Station Names (${journeyPattern.length})`}</Text>
          <img src={arrowDown} alt='expanded' />
        </StationNameHeader>
    )
  }

  const toggleStationName = () => {
    setExpanded(!isExpanded)
  }

  return (
    <>
      <Button {...getToggleProps({ onClick: toggleStationName })}>
        {renderHeaderState()}
      </Button>
      <section {...getCollapseProps()}>
        {renderContent()}
      </section>
    </>
  )
}

const ListWrapper = styled.div`
  background: #BFD7ED;
  border-radius: 6px;
  margin: 10px 0;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-template-rows: repeat(4, auto);
`
const StationNameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ListItem = styled.li`
  display: flex;
`
const Text = styled.p`
  margin: 5px
`

const Button = styled.button`
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  width: 100%;
`

export default BusStations
