import { useEffect, useState } from "react";
import { Detail, LaunchType, launchCommand, closeMainWindow, popToRoot } from "@raycast/api";
import { ActionPanel, Action } from "@raycast/api";
import {
  getCurrentInterval,
  getNextIntervalType,
  isPaused,
  pauseInterval,
  continueInterval,
  resetInterval,
  restartInterval,
  skipInterval,
  createInterval,
  preferences,
  progress,
  duration,
  endOfInterval,
  getNextIntervalExecutor,
} from "./lib/intervals";
import { secondsToTime } from "./lib/secondsToTime";
import { Interval, IntervalType } from "./lib/types";
import { checkDNDExtensionInstall } from "./lib/doNotDisturb";
import { IntervalTitles, FocusText, ShortBreakText, LongBreakText } from "./lib/constants";

export default function PomodoroTimerWindow() {
  const [currentInterval, setCurrentInterval] = useState<Interval | undefined>(getCurrentInterval());
  const [tick, setTick] = useState(0);
  const [intervalCompleted, setIntervalCompleted] = useState(false);

  // Auto-refresh every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t: number) => t + 1);
      const curr = getCurrentInterval();
      setCurrentInterval(curr);

      // Check if interval is complete
      if (curr && progress(curr) >= 100) {
        endOfInterval(curr);
        setIntervalCompleted(true);
        
        // Auto-start next interval after 3 seconds
        setTimeout(() => {
          const executor = getNextIntervalExecutor();
          executor.onStart();
          setCurrentInterval(getCurrentInterval());
          setIntervalCompleted(false);
        }, 3000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = (): string => {
    if (!currentInterval) {
      return "No timer running";
    }
    const remaining = currentInterval.length - duration(currentInterval);
    return secondsToTime(remaining);
  };

  const getProgressBar = (): string => {
    if (!currentInterval) return "";
    const p = progress(currentInterval);
    const filled = Math.min(20, Math.max(0, Math.round(p / 5)));
    const empty = Math.max(0, 20 - filled);
    return `[${"=".repeat(filled)}${"-".repeat(empty)}] ${Math.round(p)}%`;
  };

  const getStatus = (): string => {
    if (!currentInterval) return "Stopped";
    if (isPaused(currentInterval)) return "Paused";
    return "Running";
  };

  const getIntervalType = (): string => {
    if (!currentInterval) return "—";
    return IntervalTitles[currentInterval.type as keyof typeof IntervalTitles];
  };

  async function onStart(type: IntervalType) {
    await checkDNDExtensionInstall();
    setCurrentInterval(createInterval(type));
  }

  const shortcutModifier = process.platform === "win32" ? "ctrl" : "cmd";

  const markdown = intervalCompleted
    ? `
# ✅ Interval Completed!

Great job! Your ${currentInterval?.type === "focus" ? "focus" : "break"} session is done.

Ready to start the next one?
`
    : currentInterval
    ? `
# ⏱️ Pomodoro Timer

## Time Remaining
\`\`\`
${getTimeRemaining()}
\`\`\`

## Progress
\`\`\`
${getProgressBar()}
\`\`\`

## Status
**${getStatus()}** · **${getIntervalType()}**

---

**Current Interval:** ${IntervalTitles[currentInterval.type as keyof typeof IntervalTitles]}

**Started:** ${new Date(currentInterval.parts[0].startedAt * 1000).toLocaleTimeString()}

**Time Running:** ${secondsToTime(duration(currentInterval))}
`
    : `
# ⏱️ Pomodoro Timer

## Select a Timer

Choose one of the options below to start your pomodoro session.

### Timer Durations:
- **Focus** - ${preferences.focusIntervalDuration}:00 minutes
- **Short Break** - ${preferences.shortBreakIntervalDuration}:00 minutes  
- **Long Break** - ${preferences.longBreakIntervalDuration}:00 minutes

Use the action buttons below to start your chosen timer.

---

**Keyboard Shortcuts:**
- **${shortcutModifier.toUpperCase()}+F** - Start Focus
- **${shortcutModifier.toUpperCase()}+S** - Start Short Break
- **${shortcutModifier.toUpperCase()}+L** - Start Long Break
`;

  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          {currentInterval ? (
            <>
              {isPaused(currentInterval) ? (
                <Action
                  title="Continue"
                  onAction={() => {
                    setCurrentInterval(continueInterval());
                  }}
                  shortcut={{ modifiers: [shortcutModifier as any], key: "c" }}
                />
              ) : (
                <Action
                  title="Pause"
                  onAction={() => {
                    setCurrentInterval(pauseInterval());
                  }}
                  shortcut={{ modifiers: [shortcutModifier as any], key: "p" }}
                />
              )}
              <Action
                title="Reset"
                onAction={() => {
                  resetInterval();
                  setCurrentInterval(undefined);
                  setTick(0);
                }}
                shortcut={{ modifiers: [shortcutModifier as any], key: "r" }}
              />
              <Action
                title="Restart Current"
                onAction={() => {
                  restartInterval();
                  setCurrentInterval(getCurrentInterval());
                }}
                shortcut={{ modifiers: [shortcutModifier as any], key: "t" }}
              />
              <Action
                title="Skip to Next"
                onAction={() => {
                  setCurrentInterval(skipInterval());
                }}
                shortcut={{ modifiers: [shortcutModifier as any], key: "n" }}
              />
            </>
          ) : (
            <>
              <Action
                title={FocusText}
                onAction={() => onStart("focus")}
                shortcut={{ modifiers: [shortcutModifier as any], key: "f" }}
              />
              <Action
                title={ShortBreakText}
                onAction={() => onStart("short-break")}
                shortcut={{ modifiers: [shortcutModifier as any], key: "s" }}
              />
              <Action
                title={LongBreakText}
                onAction={() => onStart("long-break")}
                shortcut={{ modifiers: [shortcutModifier as any], key: "l" }}
              />
            </>
          )}
        </ActionPanel>
      }
    />
  );
}
