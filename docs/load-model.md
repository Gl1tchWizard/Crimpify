# The Crimpify load model

How the app estimates training load, in one screen.

## The calculation

```
load = active minutes × intensity factor
```

Only active block time counts. Time between blocks — resting, chalking,
picking the next boulder, talking — is session time, not training load.

Weekly load feeds an acute:chronic workload ratio: your recent load
against your longer-term average (it needs about four weeks of history
to mean anything). The app shows this as context — "load balanced",
and similar — never as a gate. No session is ever blocked and no injury
risk diagnosis is shown, because the link between workload ratios and
injury risk is methodologically contested.

## The factors

Each session type has one intensity factor per active minute:

| type | factor | reasoning |
|---|---|---|
| minidose | 0.90 | maximal intensity per minute, short total |
| perf | 0.90 | performance day: maximal attempts |
| strength | 0.85 | max strength: heavy but short work blocks, long rests |
| power | 0.85 | explosive work: high neural load per minute |
| pe | 0.75 | power endurance: high metabolic load |
| gym | 0.75 | conditioning: classic strength work |
| capacity | 0.65 | aerobic volume: submaximal, lots of repetition |
| custom | 0.65 | self-built sessions: neutral midpoint |
| skill | 0.55 | technique: low physical, high motor load |
| drills | 0.45 | loose drill work |
| recovery | 0.30 | active recovery |

## Honest limits

- **These are starter values.** The shape of the model follows
  session-RPE load (duration × intensity, after Foster) and the
  workload-ratio framing follows Gabbett; the specific factor values
  are judgement calls, not the result of a Crimpify dataset. They are
  being tuned with input from coaches as real training data comes in.
- The model does not measure physiological load. It does not see how
  hard your individual attempts were, and it does not know your
  training history outside the app.
- One number per session is a planning aid, not a verdict. The signal
  you log after a session (green / orange / red) is the quality signal;
  load is only the quantity estimate.

Source: `INTENSITY_FACTORS` and `sessionLoad()` in
[app.js](https://github.com/Gl1tchWizard/Crimpify/blob/main/app.js) —
open source under AGPL-3.0, so you can read the exact code this
document describes.
