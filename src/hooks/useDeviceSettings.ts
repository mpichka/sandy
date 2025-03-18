import { useEffect, useState } from 'react';
import { DeviceSettings } from '../../core';

export function useDeviceSettings() {
  const [device, setDevice] = useState<DeviceSettings>({
    width: 0,
    height: 0,
    dpi: 0,
  });

  function setDeviceSettings() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpi = window.devicePixelRatio || 1;

    setDevice({ width, height, dpi });
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setDeviceSettings();

    const controller = new AbortController();

    window.addEventListener('resize', setDeviceSettings, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, []);

  return device;
}
