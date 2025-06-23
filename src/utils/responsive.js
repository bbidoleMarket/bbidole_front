export const isMobile = () => {
  return window.innerWidth <= 768; // Adjust the breakpoint as needed
};

export const isTablet = () => {
  return window.innerWidth > 768 && window.innerWidth <= 1024; // Adjust the breakpoint as needed
};

export const isDesktop = () => {
  return window.innerWidth > 1024; // Adjust the breakpoint as needed
};