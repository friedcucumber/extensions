import { exec } from "node:child_process";
import { Detail, launchCommand, LaunchType, closeMainWindow, popToRoot, List, Icon } from "@raycast/api";
import { ActionPanel, Action } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";
import {
  continueInterval,
  createInterval,
  getCurrentInterval,
  getNextIntervalExecutor,
  getNextIntervalType,
  isPaused,
  pauseInterval,
  preferences,
  resetInterval,
  restartInterval,
  skipInterval,
} from "./lib/intervals";
import { FocusText, IntervalTitles, ShortBreakText, LongBreakText } from "./lib/constants";
import { GiphyResponse, Interval, Quote } from "./lib/types";
import { checkDNDExtensionInstall } from "./lib/doNotDisturb";

const shortcutModifier = process.platform === "win32" ? "ctrl" : "cmd";

const getSoundFileName = (soundName: string): string => {
  const platform = process.platform;
  
  if (!soundName) return "";
  
  if (platform === "darwin") {
    // macOS - звуки как есть в системе
    return `/System/Library/Sounds/${soundName}.aiff`;
  } else if (platform === "win32") {
    // Windows - маппим имена на имеющиеся .wav файлы
    const soundMap: { [key: string]: string } = {
      "Submarine": "Alarm01.wav",
      "Tink": "Alarm02.wav", 
      "Ping": "Alarm03.wav"
    };
    
    const wavFile = soundMap[soundName] || "Alarm01.wav";
    return `C:\\Windows\\Media\\${wavFile}`;
  }
  
  return "";
};

const playSound = () => {
  const soundFile = preferences.sound;
  
  if (!soundFile) return;

  const platform = process.platform;
  const soundPath = getSoundFileName(soundFile);

  if (platform === "darwin") {
    // macOS
    exec(`afplay "${soundPath}" -v 10`, (err) => {
      if (err) console.error("Sound error:", err);
    });
  } else if (platform === "win32") {
    // Windows - используем System.Media.SoundPlayer
    exec(`powershell -Command "& { [System.Media.SoundPlayer]::new('${soundPath}').PlaySync() }"`, (err) => {
      if (err) {
        console.error("SoundPlayer failed, trying alternative method");
        // Fallback - системный beep
        exec(`powershell -Command "[console]::beep(1000, 500)"`);
      }
    });
  }
};

const durations = [1, 3, 5, 10, 15, 20, 25, 30, 45, 60];

const SelectDurationList = ({ intervalType, onBack }: { intervalType: "focus" | "short-break" | "long-break"; onBack: () => void }) => {
  const getTitle = () => {
    switch (intervalType) {
      case "focus":
        return "Select Focus Duration";
      case "short-break":
        return "Select Short Break Duration";
      case "long-break":
        return "Select Long Break Duration";
    }
  };

  const createActionWithDuration = (duration: number) => () => {
    createInterval(intervalType, false, duration * 60);

    try {
      launchCommand({
        name: "pomodoro-menu-bar",
        type: LaunchType.UserInitiated,
      });
    } catch (error) {
      console.error(error);
    }
    popToRoot();
    closeMainWindow();
  };

  return (
    <List navigationTitle={getTitle()}>
      {durations.map((duration) => (
        <List.Item
          key={duration}
          title={`${duration}:00`}
          icon="⏱️"
          actions={
            <ActionPanel>
              <Action
                title="Start"
                onAction={createActionWithDuration(duration)}
              />
              <Action title="Back" onAction={onBack} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
};

const createAction = (action: () => void) => () => {
  action();

  try {
    launchCommand({
      name: "pomodoro-menu-bar",
      type: LaunchType.UserInitiated,
    });
  } catch (error) {
    console.error(error);
  }

  popToRoot();
  closeMainWindow();
};

const ActionsList = () => {
  const [selectedType, setSelectedType] = useState<"focus" | "short-break" | "long-break" | null>(null);
  const currentInterval = getCurrentInterval();
  checkDNDExtensionInstall();
  const skipAction = currentInterval ? (
    <Action onAction={createAction(skipInterval)} title={"Skip to Next"} shortcut={{ modifiers: [shortcutModifier as any], key: "n" }} />
  ) : null;

  if (selectedType && !currentInterval) {
    return <SelectDurationList intervalType={selectedType} onBack={() => setSelectedType(null)} />;
  }

  return (
    <List navigationTitle="Control Pomodoro Timers">
      {currentInterval ? (
        <>
          {isPaused(currentInterval) ? (
            <List.Item
              title="Continue"
              icon={Icon.Play}
              actions={
                <ActionPanel>
                  <Action onAction={createAction(continueInterval)} title={"Continue"} />
                  {skipAction}
                </ActionPanel>
              }
            />
          ) : (
            <List.Item
              title="Pause"
              icon={Icon.Pause}
              actions={
                <ActionPanel>
                  <Action onAction={createAction(pauseInterval)} title={"Pause"} />
                  {skipAction}
                </ActionPanel>
              }
            />
          )}
          <List.Item
            title="Reset"
            icon={Icon.Stop}
            actions={
              <ActionPanel>
                <Action onAction={createAction(resetInterval)} title={"Reset"} />
                {skipAction}
              </ActionPanel>
            }
          />
          <List.Item
            title="Restart Current"
            icon={Icon.Repeat}
            actions={
              <ActionPanel>
                <Action onAction={createAction(restartInterval)} title={"Restart Current"} />
                {skipAction}
              </ActionPanel>
            }
          />
          <List.Item
            title="Skip to Next"
            subtitle={IntervalTitles[getNextIntervalType(currentInterval.type)]}
            icon={Icon.Forward}
            actions={<ActionPanel>{skipAction}</ActionPanel>}
          />
        </>
      ) : (
        <>
          <List.Item
            title={`Focus`}
            subtitle={`Default: ${preferences.focusIntervalDuration}:00`}
            icon={`🎯`}
            actions={
              <ActionPanel>
                <Action title="Choose Duration" onAction={() => setSelectedType("focus")} />
              </ActionPanel>
            }
          />
          <List.Item
            title={`Short Break`}
            subtitle={`Default: ${preferences.shortBreakIntervalDuration}:00`}
            icon={`🧘‍♂️`}
            actions={
              <ActionPanel>
                <Action title="Choose Duration" onAction={() => setSelectedType("short-break")} />
              </ActionPanel>
            }
          />
          <List.Item
            title={`Long Break`}
            subtitle={`Default: ${preferences.longBreakIntervalDuration}:00`}
            icon={`🚶`}
            actions={
              <ActionPanel>
                <Action title="Choose Duration" onAction={() => setSelectedType("long-break")} />
              </ActionPanel>
            }
          />
        </>
      )}
    </List>
  );
};

const handleQuote = (): string => {
  let quote = { content: "You did it!", author: "Unknown" };
  const { isLoading, data } = useFetch<Quote[]>("https://zenquotes.io/api/random", {
    keepPreviousData: true,
  });
  if (!isLoading && data?.length) {
    quote = {
      content: data[0].q,
      author: data[0].a,
    };
  }

  return `> ${quote.content} \n>\n> &dash; ${quote.author}`;
};

const EndOfInterval = ({ intervalType }: { intervalType?: Interval["type"] }) => {
  let markdownContent = `# ${intervalType === "focus" ? "Focus" : "Break"} Completed \n\n`;
  let usingGiphy = false;

  if (preferences.enableConfetti) {
    exec(`open ${process.env.RAYCAST_SCHEME ?? "raycast"}://extensions/raycast/raycast/confetti`, function (err) {
      if (err) {
        console.error(err);
        return;
      }
    });
  }

  if (preferences.sound) {
    playSound();
  }

  if (preferences.enableQuote) {
    markdownContent += handleQuote() + "\n\n";
  }

  if (preferences.randomRewards && intervalType === "focus") {
    const rewards = preferences.randomRewards
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
    if (rewards.length > 0) {
      const reward = rewards[Math.floor(Math.random() * rewards.length)];
      markdownContent += `**Your reward:** ${reward}\n\n`;
    }
  }

  if (preferences.enableImage) {
    if (preferences.giphyAPIKey) {
      const { isLoading, data } = useFetch(
        `https://api.giphy.com/v1/gifs/random?api_key=${preferences.giphyAPIKey}&tag=${preferences.giphyTag}&rating=${preferences.giphyRating}`,
        {
          keepPreviousData: true,
        },
      );
      if (!isLoading && data) {
        const giphyResponse = data as GiphyResponse;
        markdownContent += `![${giphyResponse.data.title}](${giphyResponse.data.images.fixed_height.url})`;
        usingGiphy = true;
      } else if (isLoading) {
        ("You did it!");
      } else {
        markdownContent += `![${"You did it!"}](${preferences.completionImage})`;
      }
    } else {
      markdownContent += preferences.completionImage
        ? `![${"You did it!"}](${preferences.completionImage})`
        : "You did it!";
    }
  }

  if (usingGiphy) {
    markdownContent = `![powered by GIPHY](Poweredby_100px-White_VertLogo.png) \n\n` + markdownContent;
  }

  const executor = getNextIntervalExecutor();

  return (
    <Detail
      navigationTitle={`Interval completed`}
      markdown={markdownContent}
      actions={
        <ActionPanel title="Start Next Interval">
          <Action
            title={executor.title}
            onAction={createAction(executor.onStart)}
            shortcut={{ modifiers: [shortcutModifier as any], key: "n" }}
          />
          <Action
            title={FocusText}
            onAction={createAction(() => createInterval("focus"))}
            shortcut={{ modifiers: [shortcutModifier as any], key: "f" }}
          />
          <Action
            title={ShortBreakText}
            onAction={createAction(() => createInterval("short-break"))}
            shortcut={{ modifiers: [shortcutModifier as any], key: "s" }}
          />
          <Action
            title={LongBreakText}
            onAction={createAction(() => createInterval("long-break"))}
            shortcut={{ modifiers: [shortcutModifier as any], key: "l" }}
          />
        </ActionPanel>
      }
    />
  );
};

export default function Command(props: { launchContext?: { currentInterval?: Interval } }) {
  return props.launchContext?.currentInterval ? (
    <EndOfInterval intervalType={props.launchContext.currentInterval.type} />
  ) : (
    <ActionsList />
  );
}