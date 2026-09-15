/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Menu Bar Time - Shows time on the Menu Bar */
  "enableTimeOnMenuBar": boolean,
  /** Hide Time When Stopped - Hide time on the Menu Bar when the timer is stopped */
  "hideTimeWhenStopped": boolean,
  /** Hide Menu Bar When Stopped - Hide the entire menu bar item when the timer is stopped */
  "hideMenuBarWhenStopped": boolean,
  /** Enable Do Not Disturb while Focused - Uses the do-not-disturb extension to enable Do Not Disturb mode when starting a focus interval. Disables Do Not Disturb mode when the focus interval ends. (macOS only) */
  "enableFocusWhileFocused"?: boolean,
  /** Focus Interval Duration - Interval duration, minutes */
  "focusIntervalDuration": "1" | "3" | "5" | "10" | "15" | "20" | "25" | "30" | "35" | "40" | "45" | "50" | "55" | "60" | "90",
  /** Short Break Duration - Interval duration, minutes */
  "shortBreakIntervalDuration": "1" | "3" | "5" | "10" | "15" | "20" | "25" | "30" | "35" | "40" | "45" | "50" | "55" | "60",
  /** Long Break Duration - Interval duration, minutes */
  "longBreakIntervalDuration": "1" | "3" | "5" | "10" | "15" | "20" | "25" | "30" | "35" | "40" | "45" | "50" | "55" | "60",
  /** Long Break Start Threshold - Pomodoro cycles after which you want to take a long break */
  "longBreakStartThreshold": "2" | "3" | "4" | "5" | "6" | "7" | "8",
  /** Random Rewards - Random rewards tap into variable ratio reinforcement — the same psychology behind slot machines. Surprising yourself with a random treat after focused work boosts motivation and makes habits stick. */
  "randomRewards": string,
  /** Show Confetti (Deprecated) - Shows confetti when interval finishes */
  "enableConfetti": boolean,
  /** Show Quote - Shows a random quote from zenquotes.io when interval finishes */
  "enableQuote": boolean,
  /** Play Completion Sound - Play sound */
  "sound": "" | "Submarine" | "Tink" | "Ping" | "Alarm01" | "Alarm02" | "Alarm03" | "Alarm04" | "Alarm05",
  /** Show Image - Shows the image configured below when interval finishes */
  "enableImage": boolean,
  /** Default Image Link - Image on interval completion, URL */
  "completionImage": string,
  /** Giphy API Key - Use an API key from Giphy to get random images on interval completion. Get your API key here: https://developers.giphy.com/docs/api#quick-start-guide */
  "giphyAPIKey"?: string,
  /** Giphy Tag - Tag to use for Giphy API. Default is 'success'. */
  "giphyTag": string,
  /** Giphy Rating - Rating to use for Giphy API. Default is 'g'. */
  "giphyRating": "g" | "pg" | "pg-13" | "r"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `pomodoro-menu-bar` command */
  export type PomodoroMenuBar = ExtensionPreferences & {}
  /** Preferences accessible in the `pomodoro-control-timer` command */
  export type PomodoroControlTimer = ExtensionPreferences & {}
  /** Preferences accessible in the `pomodoro-timer-window` command */
  export type PomodoroTimerWindow = ExtensionPreferences & {}
  /** Preferences accessible in the `stats-pomodoro-timer` command */
  export type StatsPomodoroTimer = ExtensionPreferences & {
  /** Weekly Stats - Shows the weekly stats of the Pomodoro timer */
  "showWeeklyStats": boolean,
  /** Daily Stats - Shows the daily stats of the Pomodoro timer */
  "showDailyStats": boolean
}
  /** Preferences accessible in the `slack-pomodoro-menu-bar` command */
  export type SlackPomodoroMenuBar = ExtensionPreferences & {}
  /** Preferences accessible in the `slack-pomodoro-control-timer` command */
  export type SlackPomodoroControlTimer = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `pomodoro-menu-bar` command */
  export type PomodoroMenuBar = {}
  /** Arguments passed to the `pomodoro-control-timer` command */
  export type PomodoroControlTimer = {}
  /** Arguments passed to the `pomodoro-timer-window` command */
  export type PomodoroTimerWindow = {}
  /** Arguments passed to the `stats-pomodoro-timer` command */
  export type StatsPomodoroTimer = {}
  /** Arguments passed to the `slack-pomodoro-menu-bar` command */
  export type SlackPomodoroMenuBar = {}
  /** Arguments passed to the `slack-pomodoro-control-timer` command */
  export type SlackPomodoroControlTimer = {}
}

