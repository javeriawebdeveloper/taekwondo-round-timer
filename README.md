# Taekwondo Round Timer

## Project goal

Build a simple two-minute countdown for Taekwondo training practice. The timer
will open directly in a browser and display the time remaining as minutes and
seconds, starting at **02:00**. No installation or server will be needed.

The timer is implemented with HTML, CSS, and JavaScript. It runs locally without
external dependencies, network requests, or saved personal data.

## Open on Windows

1. On this repository's GitHub page, select `main` and choose **Code > Download ZIP**.
2. Right-click the downloaded ZIP in File Explorer and choose **Extract All**.
3. Open the extracted folder and double-click `index.html`. If needed, use
   **Open with > Microsoft Edge** or **Google Chrome**.
4. Keep `index.html`, `styles.css`, `timer.js`, and `app.js` in the same folder.
5. Click **Start** to begin. Use **Pause** to stop temporarily, **Start** to
   resume, and **Reset** for a fresh round.

JavaScript must be enabled. No server or installation is required. The GitHub
repository link shows the source files; it is not a hosted running app.

## The three buttons

- **Start:** Begin counting down from 02:00, or resume from the remaining time
  after a pause. Clicking Start while already running must not speed up the timer
  or create another countdown. At 00:00, Start does nothing until Reset is used.
- **Pause:** Stop counting down and keep the remaining time. Clicking Pause
  before starting, while already paused, or after finishing changes nothing.
- **Reset:** Stop the countdown and return to 02:00. The timer stays stopped
  until Start is clicked again. Reset works before, during, and after a round.

At the end of a round, the display will stop at **00:00** and show a clear
"Round complete" message. It must never display a negative time or restart
automatically. Sound, multiple rounds, and configurable durations are outside
the first version.

## How we will build it

Use HTML for the display and buttons, CSS for a clear layout, and JavaScript
for the timer. Keep all files together so `index.html` can open directly in
Microsoft Edge or Google Chrome on Windows.

The countdown will calculate elapsed time using a clock rather than assuming
each scheduled update runs exactly on time. A delayed update or returning from
a background tab should show the correct remaining time on the next update.
The browser may delay screen updates while a tab is hidden.

## How we will test

### Automated checks

Use a controllable clock so the timer can be tested without waiting two minutes
for every check.

- Confirm the initial display is 02:00 and the timer is stopped.
- Start, advance one second, and confirm 01:59.
- Click Start repeatedly and confirm the countdown keeps its normal speed.
- Pause during a round, advance the clock, and confirm the remaining time stays
  unchanged. Start again and confirm the countdown resumes from that point.
- Pause partway through a second and confirm resuming preserves the remaining
  duration rather than adding or losing a second.
- Reset before starting, while running, while paused, and after finishing.
  Confirm 02:00 is displayed and the timer remains stopped in every case.
- Advance a running round to 120 seconds and beyond. Confirm 00:00, a completion
  message, no negative time, and no automatic restart.
- Delay a scheduled update and confirm elapsed time is still calculated correctly.
- Check minute transitions, including 02:00 to 01:59 and 01:00 to 00:59.
- Confirm repeated Pause clicks and Start after completion behave as described.

### Manual browser checks

- Open `index.html` directly in current Edge and Chrome on Windows.
- Try Start, Pause, and Reset in the sequences above.
- Run one full two-minute round and compare against a separate stopwatch.
- Leave the tab in the background, return, and check that the timer catches up
  on the next update. If the round has ended, it should show 00:00.
- Confirm the time is readable on narrow and wide screens, with no horizontal
  scrolling, and the buttons are easy to select.
- Use Tab and Enter or Space to operate the buttons. Confirm visible keyboard
  focus, clear button labels, and an accessible completion message.
- Check the browser console for errors.

Record which checks pass and any browser limitations before calling the app
ready for training practice.

## Verification results

Run `node --test timer.test.js` with Node.js to execute the controllable-clock
tests. They cover initial state, time boundaries, repeated Start, partial-second
pause/resume, Reset in every state, completion, delayed updates, and button wiring.
The UI wiring test uses a simulated document; it does not replace browser tests.

Automated tests, JavaScript syntax checks, and whitespace checks passed during
development. Real Edge/Chrome testing, a stopwatch comparison, and visual and
keyboard review on Windows are still pending. The managed environment's required
browser tool was unavailable, so no browser verification is claimed.

Keep the browser and device awake during training. Background tabs can delay
visible updates; the timer catches up when JavaScript next runs. Behavior across
device sleep may vary with the browser's underlying clock.

## Git workflow

The README starts on `main`. Build and review the app on `develop`, using a
separate commit for each agreed milestone. Merge reviewed work into `main`
when it is ready.
