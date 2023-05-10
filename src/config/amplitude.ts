import * as amplitude from '@amplitude/analytics-browser';

export const initAmplitude = () => {
  amplitude.init(import.meta.env.VITE_AMPLITUDE_API_KEY, undefined, {
    defaultTracking: true,
  });
};

export const trackAmplitudeEvent = (
  eventName: string,
  eventProperties?: any
) => {
  console.log(eventName);
  console.log(eventProperties);
  const a = amplitude.track(eventName, eventProperties);
  console.log(a);
};
