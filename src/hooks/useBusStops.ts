import { useApiData } from "../api/useApiData"
import { useEffect, useState } from "react"

export type JourneyPattern = {
  StopPointName?: string
  LineNumber: string
  DirectionCode: string
  JourneyPatternPointNumber: string
  LastModifiedUtcDateTime: string
  ExistsFromDate: string
}

export type TopBusLines = {
  lineNumber: string
  journeyPattern: JourneyPattern[]
}

const useBusStops = () => {
  const [topBusLines, setTopBusLines] = useState<TopBusLines[]>([])
  const [mappedJourneyPatterns, setMappedJourneyPatterns] = useState<TopBusLines[]>([])

  const [stopDataQuery, journeyPatternQuery] = useApiData()
  const { data: StopData, error: stopDataError, isLoading: stopDataLoading } = stopDataQuery
  const { data: JourneyPatterns, error: journeyPatternError, isLoading: journeyPatternLoading } = journeyPatternQuery

  const isLoading = stopDataLoading || journeyPatternLoading
  const error = stopDataError || journeyPatternError

  const filterBusByDirection = (journeyPatterns: JourneyPattern[]): JourneyPattern[] => {
    return journeyPatterns?.filter((journeyPattern: { DirectionCode: string }) => journeyPattern.DirectionCode === '1')
  }

  const countBusStops = (filteredBusStops: JourneyPattern[]): { [x: string]: JourneyPattern[] } => {
    const busStopsCount: { [x: string]: JourneyPattern[] } = {}

    filteredBusStops.forEach((journeyPattern: JourneyPattern) => {
      const key = `${journeyPattern.LineNumber}`
      busStopsCount[key] = (busStopsCount[key] || [])
      busStopsCount[key].push(journeyPattern)
    })

    return busStopsCount
  }

  const sortBusLines = (busStopsCount: { [x: string]: JourneyPattern[] }): string[] => {
    return Object.keys(busStopsCount).sort((a, b) => busStopsCount[b].length - busStopsCount[a].length)
  }

  const getTopBusLines = (sortedBusLines: string[], busStopsCount: { [x: string]: JourneyPattern[] }): TopBusLines[] => {
    return sortedBusLines.slice(0, 10).map((lineNumber) => {
      return {
        lineNumber,
        journeyPattern: busStopsCount[lineNumber],
      }
    })
  }

  const calculateTop10BusLines = (): TopBusLines[] => {
    const filteredBusStops = filterBusByDirection(JourneyPatterns || [])
    const busStopsCount = countBusStops(filteredBusStops)
    const sortedBusLines = sortBusLines(busStopsCount)
    const topBusLines = getTopBusLines(sortedBusLines, busStopsCount)

    return topBusLines
  }

  const mapStationNames = () => {
    return topBusLines?.map((busline) => {
      return {
        lineNumber: busline.lineNumber,
        journeyPattern: busline.journeyPattern.map((stop) => {
          const stationInfo = StopData?.find(
            (info: { StopPointNumber: string }) => info.StopPointNumber === stop.JourneyPatternPointNumber
          )
          return {
            ...stop,
            StopPointName: stationInfo ? stationInfo.StopPointName : '',
          }
        }),
      }
    })
  }

  useEffect(() => {
    const populateTop10BusLines = async () => {
      const topLines = calculateTop10BusLines()
      setTopBusLines(topLines)
    }

    populateTop10BusLines()
  }, [JourneyPatterns, StopData, isLoading, error])

  useEffect(() => {
    const populateMappedJourneyPatternsData = async () => {
      const topLinesWithStationName = mapStationNames()
      setMappedJourneyPatterns(topLinesWithStationName)
    }

    populateMappedJourneyPatternsData()
  }, [topBusLines])

  return { mappedJourneyPatterns, isLoading,  error}
}

export default useBusStops
