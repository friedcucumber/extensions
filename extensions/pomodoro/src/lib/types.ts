export type GiphyResponse = {
  data: {
    id: string;
    type: string;
    title: string;
    images: {
      fixed_height: {
        url: string;
      };
      fixed_width: {
        url: string;
      };
    };
  };
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
};

export type IntervalType = "focus" | "short-break" | "long-break";

type Part = {
  startedAt: number;
  pausedAt?: number;
  endAt?: number;
};

export type Interval = {
  id: number;
  parts: Part[];
  length: number;
  type: IntervalType;
};

export type IntervalExecutor = {
  title: string;
  onStart: () => void;
};

export type Quote = {
  q: string;
  a: string;
  h: string;
};

export type Preferences = {
  enableTimeOnMenuBar: boolean;
  hideTimeWhenStopped: boolean;
  hideMenuBarWhenStopped: boolean;
  enableFocusWhileFocused: boolean;
  focusIntervalDuration: string;
  shortBreakIntervalDuration: string;
  longBreakIntervalDuration: string;
  longBreakStartThreshold: string;
  randomRewards: string;
  enableConfetti: boolean;
  enableQuote: boolean;
  sound: string;
  enableImage: boolean;
  completionImage: string;
  giphyAPIKey: string;
  giphyTag: string;
  giphyRating: string;
};

export type ExtensionPreferences = Preferences;
