import { useQueries } from '@tanstack/react-query';

const API_KEY = '6d8ce86b3a024cb1a9de60aec54acc4d'
const URL_FOR_FETCH_BUS_STOPS_DATA = `api.sl.se/api2/LineData.json?model=stop&DefaultTransportModeCode=BUS&key=${API_KEY}`
const URL_FOR_JOURNEY_PATTERN = `api.sl.se/api2/LineData.json?model=JourneyPatternPointOnLine&DefaultTransportModeCode=BUS&key=${API_KEY}`
const STOP_QUERY_KEY = 'StopData'
const JOURNEY_QUERY_KEY = 'JourneyPattern'

const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Host': 'api.sl.se',
    'Accept-Encoding': 'gzip',
  },
}

export const useApiData = () => {
  const fetchStopData = async () => {
    try {
      const response = await fetch(URL_FOR_FETCH_BUS_STOPS_DATA, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch bus stop data: ${response.statusText}`);
      }
      const data = await response.json();
      const result = data?.ResponseData?.Result;

      if (result === undefined) {
        throw new Error('Response is undefined for stop data');
      }

      if (!Array.isArray(result)) {
        throw new Error('Unexpected response format for stop data');
      }

      return result;
    } catch (error) {
      console.error('Error fetching bus stop data:', error);
      return null;
    }
  }

  const fetchJourneyPattern = async () => {
    try {
      const response = await fetch(URL_FOR_JOURNEY_PATTERN, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch journey pattern data: ${response.statusText}`);
      }

      const data = await response.json();
      const result = data?.ResponseData?.Result;

      if (result === undefined) {
        throw new Error('Response is undefined for journey pattern data');
      }

      if (!Array.isArray(result)) {
        throw new Error('Unexpected response format for journey pattern data');
      }

      return result;
    } catch (error) {
      console.error('Error fetching journey pattern data:', error);
      return null;
    }
  }

  return useQueries({
    queries: [
      { queryKey: [STOP_QUERY_KEY], queryFn: fetchStopData},
      { queryKey: [JOURNEY_QUERY_KEY], queryFn: fetchJourneyPattern}
    ]
  })
}
