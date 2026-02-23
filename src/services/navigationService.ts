let navigator: ((to: string) => void) | null = null;

export const setNavigator = (nav: (to: string) => void) => {
  navigator = nav;
};

export const navigateTo = (to: string) => {
  if (navigator) {
    navigator(to);
  }
};