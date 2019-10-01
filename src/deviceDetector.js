
export const DeviceDetector = {
    isSmartphone: window.innerWidth < 768,
    isTablet: window.innerWidth > 768 && window.innerWidth < 1200,
    isComputer: window.innerWidth > 1200
}
