// ══ DATA ══
// Sessiekleuren: namen blijven bestaan (localStorage, favs en deel-links slaan
// namen op), waarden wijzen naar de vier fingerprint-tokens.
const FP = t => ({
  color: 'var(--' + t + ')',
  text:  'color-mix(in srgb, var(--' + t + ') 55%, var(--chalk))',
  bg:    'color-mix(in srgb, var(--' + t + ') 7%, var(--ink))',
  border:'color-mix(in srgb, var(--' + t + ') 18%, transparent)',
});
const C = {
  green:  FP('volume'),
  lime:   FP('volume'),
  amber:  FP('max-effort'),
  red:    FP('max-effort'),
  blue:   FP('prepare'),
  purple: FP('skill'),
};

const PRINCIPLES = [
  'Walk away fresh. When power drops, your session is over — unless fatigue is the goal (power endurance).',
  'Quality over volume. It is fine to stop when quality drops.',
  'Rest 3 minutes between boulders from 6a up. Use the timer.',
  'One primary adaptation per session. No training soup.',
  'Check the goal before the session, so you do not climb on impulse.',
  'Short on time? Halve the volume but always warm up well. 45 min warm-up + 15 min board still counts.',
  'Finger pain? Climbing without pain is fine. Pain = adjust the session or stop.',
  'Increase weekly volume by 10-15% max.',
  'Avoid stacking grip stress: no max hangs after a heavy board session.',
  'Bouldering is a skill. Be smart, focus on learning.',
];

// ── DRILLS: warm-up technique drills (1 per session, alternate) ──
// Structure per drill: title, focus tag, setup, execution, goal.
const DRILLS = [
  { n:'Hip open & close', tag:'hip orientation', cat:'hips', dur:'10-15m', src:'technique',
    setup:'Warm-up ladder, climb every boulder twice with a different hip position.',
    do:'First pass: climb with open hips — knees out, inside edge of the shoe, tall and balanced over the foot. Second pass: same boulder with dropknees and inward rotation — knee and hip toward the wall, outside edge or toe, hips flat. Notice the difference in how the force travels.',
    goal:'Feel how hip orientation changes your reach, balance and power transfer.' },
  { n:'Hip shift on stand-ups', tag:'hip timing', cat:'hips', dur:'10-15m', src:'technique',
    setup:'Vertical to slightly overhanging terrain, moves where you have to stand up from a high foot.',
    do:'Falling off the wall the moment you try to stand up? You probably start with your hips already too close to the wall: extending your leg then pushes your hips outward, gravity helping. Do the opposite. Start the move with your hips slightly away from the wall. Drive them actively toward the wall while standing up, so you are closest to the wall at the highest point of the move. Grab the next hold there — more stable and with more reach.',
    goal:'Timing of your hip movement: closest to the wall exactly when you reach.' },
  { n:'High foot & step-through', tag:'foot pressure & balance', cat:'feet', dur:'10-15m', src:'technique',
    setup:'Warm-up ladder, all holds allowed as feet. Every boulder twice.',
    do:'First pass: place a foot as high as possible on every move and turn the hip out, body flat against the wall. Active ankle so you can load it. Second pass: cross your foot over the midline and flag the other foot the same way for counter-tension. Works especially well on side-pulls.',
    goal:'Learn to work with your legs instead of pulling with your arms.' },
  { n:'Foot swaps', tag:'foot precision', cat:'feet', dur:'10-15m', src:'technique',
    setup:'Warm-up ladder. Swap feet at least twice on every foothold before reaching on.',
    do:'Match your feet on the same hold, or switch quickly through your toes to trade on small footholds. Work with the tip of your big toe and make sure the right foot is on for the tension toward the next move. This takes years to refine — be patient.',
    goal:'Accuracy and swap speed on your feet.' },
  { n:'Heel & toe hooks', tag:'hooking & clawing', cat:'feet', dur:'10-15m', src:'technique',
    setup:'Warm-up ladder with open feet. Every boulder twice.',
    do:'First pass: use a heel hook at least three times — heel on the hold, toe down with a tight ankle, pull actively toward your body through the hamstring. Really hook, do not rest. Second pass: the same move with your big toe (toe hook) for holds too far or too small for a heel. Feel the chain from foot to calf, hamstring, glute and core.',
    goal:'Functional hooking with tension through the whole chain, not passive leaning.' },
  { n:'Toe placement', tag:'foot precision', cat:'feet', dur:'10-15m', src:'technique',
    setup:'Warm-up ladder, stay on the same boulders and consciously make the footwork harder.',
    do:'Deliberately pick worse feet — smaller edges, vaguer smears. Repeat until the movement is clean. Put your full attention on how your toe meets the hold: on small footholds the tip of your big toe, actively searching and gripping. On slopers, drop the heel and smear. Notice how pressing through your foot moves your hip.',
    goal:'Every foothold is a chance to generate force. The foot steers the hip, not the other way around.' },
  { n:'Flags & back flags', tag:'balance & flagging', cat:'balance', dur:'10-15m', src:'technique',
    setup:'Warm-up ladder, every boulder twice with one working foot.',
    do:'First pass only your right foot on footholds while reaching, second pass only the left. The other foot may smear against the wall, no holds. Press that free leg actively into the wall to stabilise — it keeps your hip in place and prevents barndooring. Play with back flags and through flags to save movement.',
    goal:'Deliberate balance and counter-pressure, less unnecessary wobble.' },
  { n:'Deadpoint', tag:'dynamics & timing', cat:'dynamics', dur:'10-15m', src:'technique',
    setup:'Warm-up ladder, every move as a deliberate deadpoint.',
    do:'First let your body sink away from the wall into bent legs — feel the spring in your lower body. Then reverse: drive through your legs, pull your hips back toward the wall and catch the hold at the highest, weightless point of the move. The power comes from your legs; your hand follows. Think: load, release, catch. Finish with a few easy boulders reaching with both hands at once.',
    goal:'Timing and precision in dynamic moves, driven from the body.' },
  { n:'Directional opposition', tag:'counter-force & tension', cat:'tension', dur:'10-15m', src:'technique',
    setup:'Warm-up ladder with counter-pressure as the only focus.',
    do:'Pause at every hold and feel which way it points. Deliberately shift your weight the opposite way — a right-facing sidepull means mass to the left. Lock yourself into that tensioned position before reaching on, and hold the tension while moving to the next hold. Only then adjust your feet. Strongest on slopers and pinches, but apply it on good holds too — that is where energy quietly leaks away.',
    goal:'Deliberate body position and counter-force, even where you think you do not need it.' },
  { n:'Active finger curls', tag:'finger strength · power pulls · isometric', cat:'tension', dur:'8-12m', src:'technique',
    setup:'Fingerboard, portable edge or a good rail. Pick an edge you can comfortably hold in half crimp or open hand. Make sure you are warmed up.',
    do:'No dead hanging: actively drive force with your fingers as if you want to curl the edge toward you. Pull your fingertips deliberately into the edge and keep the tension constantly high. Work in isometric holds of 7 to 10 seconds at around 80 to 90 percent of your max — heavy, but stop 1 to 2 counts before failure. Rest 2 to 3 minutes fully between sets. 4 to 6 sets. Feel your forearm and fingers actively working the whole hold, not passively hanging off the tendons.',
    goal:'Maximum finger strength through short, high isometric tension. Active curling instead of passive hanging recruits more, with less total load on your tendons.' },
  { n:'One skill, full focus', tag:'meta / approach', cat:'meta', dur:'1-3m extra', src:'technique',
    setup:'Just one skill per session. A ladder is a series of boulders increasing in difficulty, with more rest as it gets harder.',
    do:'The skill adds one technique pillar to a warm-up that would otherwise run on autopilot. Take a minute or two to read your boulders and pick climbs that suit the movement of the day. Feel free to borrow holds from neighbouring routes if they fit better. Not everything works out? A handful of good repetitions is already a win.',
    goal:'No stress. One pillar per session, added deliberately. Consistency over perfection.' },

  // ── Your own drills, same structure ──
  { n:'One Handed Bouldering', tag:'body tension', cat:'tension', dur:'10-15m', src:'own',
    setup:'Easy boulders only. Every boulder several times.',
    do:'Climb the boulder normally first. Then again with only the left hand (right hand behind your back or along your body). Then only the right hand. Feel where your core and feet have to take over the work. Can it go smoother? One more time.',
    goal:'Maximum body tension and foot confidence. Discover how much you can steer with one hand through feet and core.' },
  { n:'Hovering', tag:'lock-off & stability', cat:'balance', dur:'10-15m', src:'own',
    setup:'Boulder ladder at a comfortable level.',
    do:'Deliberately wait 1 second in a stable, controlled position before grabbing each next hold. No momentum, no rush. Feel whether you are truly still or still wobbling — if you wobble, your footwork or hip position is off.',
    goal:'Not just lock-off strength but stable positions and a functional core. Mercilessly exposes unstable stances.' },
  { n:'No Adjustments', tag:'precision', cat:'precision', dur:'10-15m', src:'own',
    setup:'Boulder ladder, climbs you know well.',
    do:'You may grab every hold only once — no regrabbing, no shuffling, no correcting. First contact is final. Forces you to decide where and how to grab before the move.',
    goal:'Precision and commitment. Stops the unconscious fiddling on holds that costs energy.' },
  { n:'Efficiency Climbing', tag:'movement economy', cat:'precision', dur:'10-15m', src:'own',
    setup:'Easy to moderate boulders.',
    do:'Climb as efficiently as possible: the fewest moves, the least tension, the calmest breathing. Count your moves on a boulder, try the second lap with fewer. Find rest positions, shake out, move only what is needed.',
    goal:'Movement economy and pump management. Directly transfers to capacity and power endurance sessions.' },
  { n:'Silent / Quiet Feet', tag:'foot precision & control', cat:'feet', dur:'10-15m', src:'external',
    setup:'Pick boulders 1-2 grades below your onsight level.',
    do:'Climb without your feet making any sound. Place every foot softly, deliberately and precisely — no stomping, no dragging. Did a foot make noise? Back to the previous foothold and again. Keep eye contact with your foot until it is placed. Climb back down with silent feet too.',
    goal:'Precision, control and trust in your feet. One of the most cited footwork skills because it forces total focus on your feet.' },
  { n:'Sticky Feet', tag:'foot precision', cat:'feet', dur:'10-15m', src:'external',
    setup:'Boulders 1-2 grades below onsight.',
    do:'The moment your foot touches a foothold it is glued — as if there is superglue under your big toe. No more corrections. This forces you to decide in advance where and in which orientation your foot needs to be, because the stance determines your next move.',
    goal:'Accuracy plus better sequence planning. Builds on Quiet Feet.' },
  { n:'Downclimbing', tag:'foot awareness', cat:'feet', dur:'10-15m', src:'external',
    setup:'Boulders 1-2 grades below onsight, climb up first.',
    do:'Climb the boulder back down until both hands are on the start holds again. Downclimbing is feet-first, so you must consciously feel and search your foot placements. Try to touch the mat with your feet instead of jumping off.',
    goal:'Builds deliberate foot awareness and control. Underrated skill because most climbers only practise going up.' },
  { n:'Foothold Stab (precision)', tag:'precision & balance', cat:'precision', dur:'10m', src:'external',
    setup:'Standing in front of the wall, climbing shoes on, about 60 cm from the wall.',
    do:'Balance on one leg and "stab" your raised foot at pre-chosen footholds — big toe calmly and exactly on the hold, as if pecking at it. 20x per foot, stay in balance the whole time. Harder: pick footholds that demand a high step or precarious balance. Do not take your eye off the hold until your foot sits perfectly.',
    goal:'Accuracy and bullseye precision: foot on the right spot in one go, without stalling or correcting.' },
  { n:'Smearing', tag:'smearing & trust', cat:'feet', dur:'10-15m', src:'external',
    setup:'Slab wall with big holds.',
    do:'Place your foot on the wall where there is no foothold and use it as if there were one. Press your foot into the wall and pull yourself up on the holds — the tension between pulling arms and pushing feet carries you. Climb up and back down until smearing feels familiar.',
    goal:'Learn to trust the friction of your rubber, even without positive footholds. Essential on slab and sloper feet.' },
  { n:'Extra Steps', tag:'feet initiate, straight arms', cat:'tension', dur:'10-15m', src:'external',
    setup:'Easy boulders, arms deliberately straight (straight-arm hang).',
    do:'Make at least 2-3 foot movements per hand move. Combine foot swaps, step-throughs and flags. The legs initiate every move; your arms stay straight. Find balance with outside or back flags where possible. Do not bend your arms.',
    goal:'Movement economy and body tension: learn to move from your lower body and pull less with your arms.' },
  { n:'Hover Hands', tag:'static balance', cat:'balance', dur:'10m', src:'external',
    setup:'Easy boulders, familiar climbs.',
    do:'Move into a balanced (flagged) position and hover your reaching hand three counts above the next hold before grabbing. Forces true static balance. Combine with an active flag: kick your free foot into the wall for the counter-pressure.',
    goal:'Static control, lock-off and a functional core. Unmasks positions where you secretly lean on momentum.' },
  { n:'Dead-Point to Pause', tag:'dynamics & control', cat:'dynamics', dur:'10-15m', src:'external',
    setup:'A small deadpoint move on vertical or slightly overhanging terrain.',
    do:'Launch from a controlled start to the next hold and pause there — do not move on. Lock off and brace your core to kill any swing. Hold for 3 seconds, then climb on. The target is catching exactly at the highest, weightless moment of the move.',
    goal:'Dynamic precision plus the body tension to deaden a dynamic move at the moment of contact.' },
  { n:'Cow Stance (tension hold)', tag:'body tension', cat:'tension', dur:'10m', src:'external',
    setup:'Slightly overhanging wall, good hand and foot holds.',
    do:'Right foot high, left foot low and relaxed. Round your back like a cat (think: beach ball on your belly). Pull yourself into the wall until your left shoulder touches or hovers at the left hold. Right hip up and close to the wall, right knee pointing right. Hold 10 sec, relax — one rep. Switch sides.',
    goal:'Teaches you to over-engage core, hips, back and toes between holds — the basis of body tension on steep terrain.' },
  { n:'Blindfold Climbing', tag:'proprioception', cat:'balance', dur:'10m', src:'external',
    setup:'Very easy, familiar boulders. Spotter present.',
    do:'Climb with your eyes closed or blindfolded. Without sight you must find your holds and footholds and distribute your weight entirely by feel. Move slowly and feel every placement. Only on safe, low terrain.',
    goal:'Sharpens proprioception and sensory feedback for foot and hand placement enormously.' },
];

// 1 drill per day, rotates
function drillOfDay() {
  const seed = new Date().getDate() + new Date().getMonth()*31;
  return DRILLS[seed % DRILLS.length];
}

// ══ BLOCK LIBRARY ══
// Every key is a reusable training block. t = base time at a 90 min session.
// Gedeelde uitleg voor beide tendon-blokken: één bron, geen drift tussen de varianten.
const TENDON_WHY = 'Based on the tendon research of Prof. Keith Baar (UC Davis). Tendons respond to isometric load for about ten minutes, then the cells stop responding; more is not better, just more wear. So this caps at ten minutes whatever round you reach. Static holds only, no bounce, light to moderate at roughly 50 percent or less, always pain-free. Ideally a session of its own, morning or pre-training, and you can repeat it after six hours or more. You can also spread the holds across days instead of doing them all at once.';
const BLOCKLIB = {
  // ── openers ──
  dynamic: { n:'Charlie warm-up', t:10, c:'var(--prepare)', rpe:'1-2', guided:true,
    links:[{label:'Follow-along video', url:'https://m.youtube.com/watch?v=58fr4fxk5MA'}],
    why:'Fixed 10 min opener. Quick cardio first, then dynamic stretches with big breaths at end range. Runs automatically — pause or skip whenever you want.',
    items:[
      { n:'Jumping jacks', note:'with shoulder rotations', sec:25 },
      { n:'Seals', note:'20 reps', sec:20 },
      { n:'Split jumps', note:'20 reps', sec:20 },
      { n:'Break', note:'breathe out', sec:10, rest:true },
      { n:'Trunk twists', note:'20 — head and hips stay forward', sec:20 },
      { n:'Side bends', note:'20 — arm over head, other to the foot', sec:20 },
      { n:'Trunk circles', note:'5 per direction', sec:15 },
      { n:'Hip circles', note:'8 per direction', sec:15 },
      { n:'Hands-on-knee circles', note:'8 per direction', sec:15 },
      { n:'Arm circles', note:'10 per direction', sec:15 },
      { n:'Elbow circles', note:'10 per direction', sec:12 },
      { n:'Neck circles', note:'10 — gently', sec:12 },
      { n:'Shoulder shrugs', note:'10 reps', sec:10 },
      { n:'Shoulder rotations', note:'20 — pinky and thumb up', sec:18 },
      { n:'Standing knee circles', note:'5 per leg, both directions', sec:18 },
      { n:'Hip hinges', note:'10 reps', sec:15 },
      { n:'Table turnovers', note:'3 per direction', sec:18 },
      { n:'Full-plank to inch-worms', note:'2 reps', sec:20 },
      { n:'Leg swings sideways L', note:'10 — left leg', sec:12 },
      { n:'Leg swings sideways R', note:'10 — right leg', sec:12 },
      { n:'Leg swings front/back L', note:'10 — left leg', sec:12 },
      { n:'Leg swings front/back R', note:'10 — right leg', sec:12 },
    ] },
  warmup: { n:'Progressive warm-up + skills', t:30, c:'var(--prepare)', rpe:'2-5', drills:true,
    why:'Boulder ladder that gets progressively harder: 4, 4, 5a, 5b, 5c, 6a, 6a, 6b up to 6c. From 6a rest 3 min. The goal is not sending boulders but getting properly warm. Vary wall angle and style. Aim for 10-20 boulders, 1-2 per grade. Add the skill of the day (below) — one pillar per session.' },
  warmupFinger: { n:'Warm-up + fingers', t:35, c:'var(--prepare)', rpe:'2-5', drills:true,
    why:'Progressive warm-up (boulder ladder 4 → 6c) plus specific finger prep: easy hangs, lifting pin building up, at least 15 min of tendon preparation. For heavy finger work this is non-negotiable.' },
  mobilityOpen: { n:'Dynamic stretching + tendon glides', t:20, c:'var(--prepare)', rpe:'-',
    why:'Jumping jacks 30, seals 20, split jumps 20, trunk twists 20, leg swings 20+20, arm/elbow/shoulder circles. Tendon glides on top.' },

  // ── finger/tendon prehab (guided, low load) — submaximaal, daarom prepare i.p.v. max-effort ──
  //    noHangsEmil = eindige lijst; tendon* = loopen tot de 10-min cap (capSec).
  noHangsEmil: { n:'No Hangs (remix)', t:5, c:'var(--prepare)', rpe:'2-3', guided:true, fixed:true, addedDate:'2026-07-16',
    links:[{label:'Follow-along video', url:'https://www.youtube.com/watch?v=sBTI9qiH4UE'}],
    why:'Based on Emil Abrahamsson\'s no hangs. Light, pain-free capacity work for tendon adaptation and prehab, never near your limit. Ten seconds on, twenty seconds off, working through the grips at 40 to 50 percent of a lift-off effort. Gentle enough to do twice a day.',
    items:[
      { n:'Four finger crimp', note:'14mm edge · 40-50% lift-off · set 1 of 3', sec:10 },
      { n:'Rest', note:'ease off the edge', sec:20, rest:true },
      { n:'Four finger crimp', note:'14mm edge · 40-50% lift-off · set 2 of 3', sec:10 },
      { n:'Rest', note:'ease off the edge', sec:20, rest:true },
      { n:'Four finger crimp', note:'14mm edge · 40-50% lift-off · set 3 of 3', sec:10 },
      { n:'Rest', note:'ease off the edge', sec:20, rest:true },
      { n:'Three finger drag', note:'deep pocket · 40-50% · set 1 of 3', sec:10 },
      { n:'Rest', note:'ease off', sec:20, rest:true },
      { n:'Three finger drag', note:'deep pocket · 40-50% · set 2 of 3', sec:10 },
      { n:'Rest', note:'ease off', sec:20, rest:true },
      { n:'Three finger drag', note:'deep pocket · 40-50% · set 3 of 3', sec:10 },
      { n:'Rest', note:'ease off', sec:20, rest:true },
      { n:'Middle two finger pocket', note:'40-50% · 1 set', sec:10 },
      { n:'Rest', note:'ease off', sec:20, rest:true },
      { n:'Front two finger pocket', note:'40-50% · 1 set', sec:10 },
      { n:'Rest', note:'ease off', sec:20, rest:true },
      { n:'Thumb press', note:'door frame · 40-50% · set 1 of 2', sec:10 },
      { n:'Rest', note:'ease off', sec:20, rest:true },
      { n:'Thumb press', note:'door frame · 40-50% · set 2 of 2', sec:10 },
    ] },
  tendonClimb: { n:'Tendon Training: Climb', t:10, c:'var(--prepare)', rpe:'2', guided:true, fixed:true, capSec:600, addedDate:'2026-07-16',
    why:TENDON_WHY,
    items:[
      { n:'Half crimp', note:'fingers and pulleys · ~50% · static', sec:30 },
      { n:'Three finger drag', note:'open hand · ~50% · static', sec:30 },
      { n:'Lunge hold, left', note:'static · hold the position', sec:30 },
      { n:'Lunge hold, right', note:'static · hold the position', sec:30 },
      { n:'Wrist flexion hold', note:'forearm · ~50% · static', sec:30 },
    ] },
  tendonFull: { n:'Tendon Training: Full Body', t:10, c:'var(--prepare)', rpe:'2', guided:true, fixed:true, capSec:600, addedDate:'2026-07-16',
    why:TENDON_WHY,
    items:[
      { n:'Half crimp', note:'fingers and pulleys · ~50% · static', sec:30 },
      { n:'Lunge hold, left', note:'static · hold the position', sec:30 },
      { n:'Lunge hold, right', note:'static · hold the position', sec:30 },
      { n:'Wrist flexion hold', note:'forearm · ~50% · static', sec:30 },
      { n:'Squat hold', note:'wall sit · quads and Achilles · static', sec:30 },
    ] },

  // ── capacity cores ──
  volume: { n:'Volume boulders', t:40, c:'var(--volume)', rpe:'6', sets:30, rest:3, checklist:true, target:30, range:'25-35',
    why:'25-35 boulders around 6a/6b. 3 min rest from 6a, timer on. Drop a grade when quality fades (first 5c, then 5b). Stop at technical failure, not muscular failure.' },
  linked: { n:'Linked boulders', t:40, c:'var(--volume)', rpe:'6-7', sets:8, rest:4,
    why:'Link two boulders together (climb down or step straight through). Grades around 5c-6a per boulder so the link stays doable. 3-4 min rest between links. 6-10 links total.' },
  boardVolume: { n:'Kilterboard volume', t:40, c:'var(--volume)', rpe:'6-7', sets:18, rest:3,
    why:'15-20 boulders below your board max (6a-6b on the board). 3 min rest, timer on. Watch your skin — stop at flappers or move to the gym wall. Repeat boulders that could flow better.' },

  // ── count-blokken: denken in aantal boulders op een niveau, niet in tijd.
  //    checklist:true + target/range sturen de boulder-teller; grade is data
  //    (nog nergens op gefilterd), t blijft de tijdschatting voor tape en schaling.
  easyTen: { n:'10 easy boulders', t:15, c:'var(--prepare)', rpe:'3-4', grade:'easy', checklist:true, target:10, range:'10',
    why:'Ten boulders well below your limit, 2-3 grades under your max. Move calmly, place feet deliberately, breathe. This is the warm-up: leave every boulder feeling easier than the last.' },
  mediumTwenty: { n:'20 medium boulders', t:35, c:'var(--volume)', rpe:'5-6', grade:'medium', checklist:true, target:20, range:'20',
    why:'Twenty boulders around your comfortable flash level. Rest as needed, keep the quality high and do not count boulders that fall apart. Twenty good ones beat twenty-five sloppy ones.' },

  // ── power endurance cores ──
  hehe: { n:'HEHE sets', t:42, c:'var(--volume)', rpe:'7-8', sets:4, rest:8,
    why:'Set = hard boulder (doable but not flashable, ~6b/6c) → straight into a very easy one → straight into a hard one again → finish easy. 3-6 sets, 5-10 min rest between sets. First 2-3 sets just short of failure. Progression: more sets first, only then harder.' },
  fourByFour: { n:'4×4 circuits', t:42, c:'var(--volume)', rpe:'7-8', sets:4, rest:4,
    why:'Pick 4 boulders 2-3 grades below max (~5c-6a), different styles, slightly overhanging, no rest positions. Climb all 4 back to back without rest, then rest 4 min. 4 rounds. Too easy if you never come close to falling; too hard if you already fail in round 2.' },
  peFlow: { n:'PE Flow', t:42, c:'var(--volume)', rpe:'6-8',
    why:'Power endurance by feel. Climb blocks of 2-4 boulders back to back with short rests. Alternate hard and easy. 30-45 min of near-continuous movement with building pump. Stop when technique falls apart.' },

  // ── power cores ──
  board1: { n:'Board Session 1', t:42, c:'var(--max-effort)', rpe:'8', sets:6, rest:4,
    why:'4-8 boulders at your limit. Different styles, grips and wall angles. Pick boulders you can climb within 4 tries: first try = too easy, hopeless after 4 tries = too hard. Weekly progression: wk1 4, wk2 5, wk3 6, wk4 7 boulders. 3+ min rest.' },
  limitBlocks: { n:'Limit boulder blocks', t:42, c:'var(--max-effort)', rpe:'9', sets:3, rest:8,
    why:'2-3 limit blocks of 2-4 moves. Rest 2 min per move (4-move block = 8 min rest). Max effort, fast movement, form under tension. Do not repeat moves to polish beta — this is testing your limit. Power drops = stop.' },
  campus: { n:'Campus boarding', t:22, c:'var(--max-effort)', rpe:'8', sets:5, rest:3,
    why:'~20 total impacts. Ladders 1-2-3 or 1-3-5. Use rungs you control easily and hit fast. Focus on speed and precision, not distance. Avoid failure and slow grinding reps.' },
  dynos: { n:'Dynos', t:20, c:'var(--max-effort)', rpe:'8', sets:4, rest:2,
    why:'3-4 dynos on flat walls, no overhang. 3 reps per dyno. Vary direction and foot positions. Drive from the feet, accuracy first. 2+ min rest per full attempt.' },
  maxHangs: { n:'Max hangs', t:28, c:'var(--max-effort)', rpe:'8-9', sets:4, rest:4,
    why:'3-5 sets of 3-5 sec @ 90-95% of max hang load. Half crimp unless it hurts. Edge 10-30mm. Pull into the edge, shoulder engaged. 3-5 min rest between reps. Fingers not perfect? Skip — no exceptions.' },

  // ── performance cores ──
  compStyle: { n:'Comp blocks', t:50, c:'var(--volume)', rpe:'8-9', sets:6, rest:5,
    why:'Pick 6 physically demanding boulders (ones you normally just barely send). Per boulder: climb it 3x within 5 min, then rest 5 min, then the next. Ideally you make it three times, on your last legs. Three easy sends = go harder next time. Failing on the third is fine, as long as it does not happen on every boulder.' },
  pyramide: { n:'Pyramid', t:50, c:'var(--max-effort)', rpe:'7-9', sets:8, rest:3,
    why:'8 progressively harder boulders, weaknesses included (e.g. dynamic if that is your weakness): 6a, 6a, 6b, 6a dyn, 6c, 6c dyn, 7a, 7a+. Three tries per boulder, ~3 min rest between tries. Failure only in the top grades — otherwise adjust the difficulty.' },
  project: { n:'Project attempts', t:48, c:'var(--max-effort)', rpe:'9-10', sets:8, rest:6,
    why:'Max 8-10 attempts. Full recovery between tries (5-8 min — feels long, is needed). Between attempts: evaluate beta, filming helps. Power drops = done for today.' },

  // ── recovery cores ──
  easyClimb: { n:'Easy climbing', t:40, c:'var(--prepare)', rpe:'3-4',
    why:'At least 2 grades below max (4-5b). Focus on calm movement and footwork. No mini-projects, no temptation.' },
  hog: { n:'HoG session', t:10, c:'var(--prepare)', rpe:'2-3', sets:3, rest:2, fixed:true,
    links:[{label:'Open Grip Gains', url:'https://gripgains.ca'}],
    why:'Follow the Grip Gains schedule. Rotation: week 1 Crusher/Micro/Crusher, week 2 Micro/Crusher/Micro. Crusher = FDS, Micro = FDP. Open the app for your sets and weights.' },

  // ── skill cores ──
  drillBlocks: { n:'Skill blocks', t:45, c:'var(--skill)', rpe:'5-6', sets:3, rest:2, drills:true,
    why:'3 skills × 15 min on boulders 2 grades below max. Per skill: first deliberately slow, then at normal speed, then on a just-challenging boulder. Film yourself at least once per skill.' },
  boardApply: { n:'Board application', t:12, c:'var(--max-effort)', rpe:'6', sets:4, rest:3,
    why:'Apply the skills on 3-4 Kilterboard boulders. No score — only quality of movement counts.' },

  // ── conditioning / closers ──
  mini1: { n:'Mini circuit 1', t:15, c:'var(--prepare)', rpe:'6', sets:5, rest:2,
    why:'Dumbbell bench 3×10 RIR4 · Gorilla squat 3×8 RIR4 · Seated rows 3×10 RIR4 · Dips (assisted) 3×5 RIR3 · Facepulls 3×10.' },
  mini2: { n:'Mini circuit 2', t:15, c:'var(--prepare)', rpe:'6', sets:4, rest:2,
    why:'Dumbbell deadlift 3×12 RIR4 · Compression (Y,T,row) 4×4 RIR3 · External rotations 3×10 RIR4 · Forearm conditioning 3×15 RIR2.' },
  mini3: { n:'Mini circuit 3', t:15, c:'var(--prepare)', rpe:'7', sets:3, rest:3,
    why:'Weighted pull-ups 3×3 RIR1 · Dumbbell press 3×4 RIR2 · Lateral raises 3×8 RIR4.' },
  lockoffs: { n:'Lock-offs', t:10, c:'var(--prepare)', rpe:'7', sets:2, rest:2,
    why:'2×10 sec at 90 and 120 degrees. Stop 2 sec before failure. Wide grip.' },
  gymWarmup: { n:'Gym warm-up', t:10, c:'var(--prepare)', rpe:'2-3',
    why:'Get up to temperature calmly: 5 min cardio (rowing, bike or jump rope) plus shoulder mobility, band pull-aparts and a few light warm-up sets for the first exercise. Prepare tendons and joints for load.' },
  pullStrength: { n:'Pull strength', t:18, c:'var(--prepare)', rpe:'7-8', sets:4, rest:3,
    why:'Weighted pull-ups or rows as the main lift. 3-5 sets of 3-6 reps with a controlled eccentric. Full rest between sets — this is strength, not conditioning.' },
  pushStrength: { n:'Push strength', t:15, c:'var(--prepare)', rpe:'7-8', sets:4, rest:3,
    why:'Bench press or overhead press. 3-4 sets of 6-10 reps. Keep 1-2 reps in reserve (RIR), bar speed high. Antagonist balance for your shoulders after all the pulling in climbing.' },
  coreLegs: { n:'Core & legs', t:12, c:'var(--prepare)', rpe:'6-7', sets:3, rest:2,
    why:'Single-leg Romanian deadlift, Bulgarian split squats and anti-rotation core (TRX body saws or pallof press). 3 sets, 8-10 reps. Stability and strength for your lower body — often neglected in climbers.' },
  slab: { n:'Slab (if energy allows)', t:12, c:'var(--skill)', rpe:'5',
    why:'Easy slab as a technical dessert. Balance and footwork. Skip without guilt if you are empty — walk away fresh.' },
  skillLight: { n:'Movement skill light', t:12, c:'var(--skill)', rpe:'3-4', drills:true,
    why:'One skill of your choice on easy terrain. Pure coordination, zero strength. Cool the nervous system down.' },
  drillsOnly: { n:'Movement skills', t:20, c:'var(--skill)', rpe:'4-5', drills:true,
    why:'A short focused skill session as the main course. Pick the skill of the day and work it deliberately on boulders below your max. Quality of movement counts, no score.' },
  drillLibrary: { n:'Skill library', t:30, c:'var(--skill)', rpe:'4-5', library:true,
    why:'The full library. Pick the skills you want to do today yourself.' },
  sprayLight: { n:'Spray wall (short)', t:15, c:'var(--volume)', rpe:'4-5',
    why:'Short, light spray session. Deliberately keep the RPE low (4-5) so your fingers stay fresh for HoG afterwards. 6-10 boulders well below your max, focus on smooth movement and the skill of the day. No limit work — this is not a power session.' },
  nohangs: { n:'No hangs + stretch', t:8, c:'var(--max-effort)', rpe:'-', sets:2, rest:1,
    why:'No hangs 2×30 sec half crimp. Then a short stretch: shoulders and forearms.' },
  // ── minimal dose micro blocks (minimum effective dose; López/Lattice research on short frequent finger training) ──
  activeCurls: { n:'Active finger curls', t:12, c:'var(--max-effort)', rpe:'8-9', sets:'4-6', rest:2, fixed:true,
    why:'Power pulls on an edge or fingerboard: no dead hanging but actively driving force as if curling the edge toward you. Isometric holds of 7-10 sec at 80-90% of your max, stop 1-2 counts before failure, 2-3 min full rest, 4-6 sets. Active curling recruits more with less total tendon load.' },
  mdFinger: { n:'Finger prep', t:5, c:'var(--prepare)', rpe:'3-5', fixed:true,
    why:'Progressive loading on the edge: 3-4 short, increasingly heavy hangs with full rest. Bring the tendons up to tension before the maximal work — never max hang cold.' },
  mdMaxHangs: { n:'Micro max hangs', t:12, c:'var(--max-effort)', rpe:'8-9', sets:5, rest:2, fixed:true,
    why:'5 hangs of 7-10 sec at 85-90% of your max (half crimp), 2 min full rest between hangs. Short and heavy delivers most of the strength adaptation in a fraction of the time. Stop 1-2 counts before failure.' },
  mdNoHangs: { n:'Micro no-hangs', t:10, c:'var(--max-effort)', rpe:'8', sets:4, rest:2, fixed:true,
    why:'Lifting edge or block off the floor: 4 lifts per hand of 8-10 sec at high intensity, 2 min rest. Shoulder-friendly alternative with the same finger stimulus, easy to dose exactly.' },
  mdPull: { n:'Micro pull', t:6, c:'var(--prepare)', rpe:'7-8', sets:3, rest:2, fixed:true,
    why:'3×3 heavy pull-ups (weighted if 3 is easy), full rest. Maintain pull strength in six minutes.' },
  mdCore: { n:'Micro core', t:5, c:'var(--prepare)', rpe:'6-7', sets:3, fixed:true,
    why:'3 rounds: 20 sec hollow hold plus 8 hanging knee raises. Maintain tension without eating time.' },
  // ── front-load fasen (voor de Fresh First-sessie): drie flexibele blokken met
  //    gelijke basis-t, zodat ze in gelijke derden meeschalen met de tijd-slider.
  //    Kleur volgt uit de groep (orange → teal → blue = hardst eerst, rustig laatst).
  frontGrowth: { n:'Limit work (fresh)', t:20, c:'var(--max-effort)', rpe:'8-9',
    why:'First third, while your nervous system is fresh. Your hardest material: limit boulders, a project, committing dynos, complex coordination. This is the point of the session. Long rests, real effort, and you walk away before the quality drops.' },
  frontBuild: { n:'Working boulders', t:20, c:'var(--volume)', rpe:'6-7',
    why:'Middle third. Material you are developing: not comfortable, not impossible. Boulders you can nearly do. This is where skills consolidate. Keep the quality high and rest enough to try hard.' },
  frontMaint: { n:'Easy wind-down', t:20, c:'var(--prepare)', rpe:'3-4',
    why:'Final third. Easy volume, simple movement, familiar problems. Warm-up-style climbing belongs here, at the end, not the start. Move smooth and leave feeling good.' },
  stretch: { n:'Stretch', t:10, c:'var(--prepare)', rpe:'-',
    why:'Pancake progression (Aidan Roberts: Leaning → Rocking), shoulder flexion, T-spine and lats. 2 min per position. Breathe out.' },
  stretchLong: { n:'Extended stretch', t:25, c:'var(--prepare)', rpe:'-',
    why:'Full routine: pancake 2 min, pigeon, shoulder flexion work, T-spine rotations, lats, wrist flexors. Aidan Roberts mobility line.' },

  // ── activation protocols ──
  tensionAct: { n:'Tension activation', t:12, c:'var(--prepare)', rpe:'6', sets:3, rest:2,
    why:'Preload the nervous system before limit work. Heavy isometrics, short and fresh: heel-hook isometric pulls at 60/90/120 degrees, 1 rep per angle, far from failure.' },
};

// ══ SESSIONS = energy system containers ══
// slots: fixed blocks (string) or choice slots (array = generator picks one, rotates per day)
const sessions = [
  { id:'strength', cat:'Strength', name:'Strength', desc:'Max strength\nfingers and body', color:'amber', rpe:'8-9', tags:['strength','max','fingers','limit','hangs'],
    intent:'Maximum strength. Heavy, short efforts with full recovery — fingers first (fresh), then limit boulders. Quality over volume; power drops = session over.',
    slots:[ 'dynamic', 'warmupFinger', ['maxHangs','nohangs'], ['limitBlocks','board1'], ['slab','skillLight'], 'stretch' ] },
  { id:'power', cat:'Power', name:'Power', desc:'Explosiveness\nspeed of force', color:'red', rpe:'8-9', tags:['power','explosive','campus','dynos','contact'],
    intent:'Explosive power: the speed at which you apply force. Fully fresh, full commitment, long rests. Stop the moment you lose speed — training power tired trains slowness.',
    slots:[ 'dynamic', 'warmupFinger', 'tensionAct', ['campus','dynos'], ['boardApply','board1'], 'stretch' ] },
  { id:'pe', cat:'Power Endurance', name:'Power Endurance', desc:'Anaerobic capacity\npump tolerance', color:'lime', rpe:'7-8', tags:['power endurance','hehe','4x4','pump','anaerobic'],
    intent:'Anaerobic capacity. Keep climbing on tired forearms without technique collapsing — fatigue is the goal here.',
    slots:[ 'dynamic', 'warmup', ['hehe','fourByFour','peFlow'], ['mini1','mini2'], 'stretch' ] },
  { id:'capacity', cat:'Capacity', name:'Capacity', desc:'Aerobic base\nvolume and repetition', color:'green', rpe:'6-7', tags:['capacity','volume','aerobic','endurance','base'],
    intent:'Build aerobic capacity. Lots of repetitions with good technique — light fatigue is fine, failure is not.',
    slots:[ 'dynamic', 'warmup', ['volume','linked','boardVolume'], ['mini1','mini2'], 'nohangs' ] },
  { id:'gym', cat:'Conditioning', name:'Conditioning', desc:'Strength & condition\naway from the fingers', color:'amber', rpe:'7-8', tags:['conditioning','gym','strength','antagonist','core'],
    intent:'Strength training outside climbing: pull, push, core and legs. Antagonist balance and general strength without finger load.',
    slots:[ 'gymWarmup', 'pullStrength', 'pushStrength', 'coreLegs', ['mini1','mini2','mini3'], 'stretch' ] },
  { id:'skill', cat:'Skill', name:'Skill', desc:'Technique isolation\ndeliberate climbing', color:'purple', rpe:'5-6', tags:['skill','technique','drills','movement'],
    intent:'Technique as the main course. Three skills done thoroughly instead of two in passing — video feedback recommended.',
    slots:[ 'dynamic', 'warmup', 'drillBlocks', 'boardApply', 'stretch' ] },
  { id:'perf', cat:'Performance', name:'Performance', desc:'Performing\nprojects and formats', color:'red', rpe:'8-10', tags:['performance','project','comp','pyramid'],
    intent:'Perform when it counts. Full recovery between attempts, every attempt with intention. Note what worked.',
    slots:[ 'dynamic', 'warmup', ['project','compStyle','pyramide'], ['skillLight','slab'], 'stretch' ] },
  { id:'recovery', cat:'Recovery', name:'Recovery', desc:'Active recovery\nHoG and mobility', color:'blue', rpe:'2-4', tags:['recovery','hog','mobility','grippers'],
    intent:'Recover by moving. Circulation, mobility and finger maintenance — without any climbing load of significance.',
    slots:[ 'dynamic', ['hog','easyClimb'], ['skillLight','lockoffs'], 'stretchLong' ] },
  { id:'minidose', cat:'Minimal Dose', name:'Minimal Dose', desc:'High return\n~20 minutes', color:'amber', rpe:'8', tags:['minimal dose','short','fingers','efficient'],
    intent:'Minimum effective dose: the smallest volume that still drives adaptation. Fingers first, fresh and heavy, short total time. Sustainable two to four times a week next to a busy life.',
    slots:[ 'mdFinger', ['mdMaxHangs','mdNoHangs'], ['mdPull','mdCore'] ] },
  { id:'drills', cat:'Skills', name:'Skill library', desc:'Full library\npick your own', color:'purple', rpe:'4-5', tags:['drills','skills','technique','movement','skill','library'],
    intent:'The full skill library. Pick the skills you want to do, with instructions.',
    slots:[ 'drillLibrary' ] },
];

// ── eenmalige migratie: odyssey_* → crimpify_* ──
(function(){
  try {
    ['history','draft','favs','hidden_blocks','custom_blocks'].forEach(k=>{
      const oldV = localStorage.getItem('odyssey_'+k);
      if (oldV !== null && localStorage.getItem('crimpify_'+k) === null) {
        localStorage.setItem('crimpify_'+k, oldV);
      }
    });
  } catch {}
})();

// startlijst (tot je eigen sessies binnenkomen)
let recent = [];  // gevuld vanuit historie; favorieten komen apart uit crimpify_favs

// ── SESSIE-HISTORIE (recency + frequency) ──
// opgeslagen in localStorage: [{id, variant, time, ts}], nieuwste eerst
function loadHistory() {
  try { return JSON.parse(localStorage.getItem('crimpify_history') || '[]'); }
  catch { return []; }
}
function saveHistory(h) {
  try { localStorage.setItem('crimpify_history', JSON.stringify(h.slice(0,50))); } catch {}
}
// ── LOAD-MODEL (sessie-RPE benadering, naar Foster et al. 2001) ──
// load = duur (min) × intensiteitsfactor van het energiesysteem.
// De factoren benaderen de typische sessie-RPE per systeem, geschaald 0-1 (≈ RPE/10).
// LET OP: dit zijn startwaarden, bedoeld om met een sportwetenschapper te tunen.
// Elke gelogde sessie bewaart id, duur, load en stoplicht-signaal — de ruwe data
// blijft dus beschikbaar om het model later te herijken.
const INTENSITY_FACTORS = {
  minidose: 0.90,   // minimal dose: maximale intensiteit per minuut, kort totaal
  strength: 0.85,   // max kracht: zwaar maar korte werkblokken, lange rust
  power:    0.85,   // explosief: hoge neurale belasting per minuut
  perf:     0.90,   // performance: maximale pogingen
  pe:       0.75,   // power endurance: hoge metabole belasting
  gym:      0.75,   // conditioning: klassiek krachtwerk
  capacity: 0.65,   // aeroob volume: submaximaal, veel herhaling
  custom:   0.65,   // eigen sessies: neutraal middenpunt
  skill:    0.55,   // techniek: lage fysieke, hoge motorische belasting
  drills:   0.45,   // drill-bibliotheek los
  recovery: 0.30,   // actief herstel
};
function sessionLoad(id, minutes) {
  return Math.round((minutes||0) * (INTENSITY_FACTORS[id] != null ? INTENSITY_FACTORS[id] : 0.65));
}
function logSessionDone(id, variant, time, sig, snap) {
  const h = loadHistory();
  const e = { id, variant: variant||'', time: time||0, ts: Date.now(), sig: sig || null, load: sessionLoad(id, time) };
  if (snap) { e.keys = snap.keys; e.name = snap.name; e.color = snap.color; e.blocks = snap.blocks; }
  h.unshift(e);
  saveHistory(h);
  if (typeof clearActive === 'function') clearActive();
  rebuildRecent();
  renderSignalCal();
  if (typeof renderTodaysPick === 'function') renderTodaysPick();
  if (typeof renderStreakLine === 'function') renderStreakLine();
}
function agoLabel(ts) {
  const d = Math.floor((Date.now() - ts) / 86400000);
  if (d <= 0) return 'today';
  if (d === 1) return 'yesterday';
  if (d < 7) return d + 'd ago';
  if (d < 30) return Math.floor(d/7) + 'w ago';
  return Math.floor(d/30) + 'mo ago';
}
function rebuildRecent() {
  const h = loadHistory();
  if (h.length === 0) { recent = []; if (typeof buildRecent==='function') buildRecent(); return; }
  // score per sessie-id: recency (laatste keer) + frequency (aantal keer)
  const now = Date.now();
  const byId = {};
  h.forEach(e => {
    if (!byId[e.id]) byId[e.id] = { id:e.id, count:0, last:0, variant:e.variant, time:e.time, sig:null };
    byId[e.id].count++;
    if (e.ts > byId[e.id].last) { byId[e.id].last = e.ts; byId[e.id].variant = e.variant; byId[e.id].time = e.time; byId[e.id].sig = e.sig || null; }
  });
  const scored = Object.values(byId).map(s => {
    const daysAgo = (now - s.last) / 86400000;
    const recencyScore = Math.max(0, 30 - daysAgo);      // recenter = hoger, ~maand venster
    const freqScore = Math.min(20, s.count * 4);          // vaker = hoger, gecapt
    return { ...s, score: recencyScore + freqScore };
  }).sort((a,b)=> b.score - a.score);
  recent = scored.slice(0, 8).map(s => ({ id:s.id, ago:agoLabel(s.last), time:s.time||60, variant:s.variant, sig:s.sig, ts:s.last }));
  if (typeof buildRecent==='function') buildRecent();
}
const categories = ['Strength','Power','Power Endurance','Capacity','Conditioning','Skill','Performance','Recovery'];

// variatie-offset: reroll bump per sessie
const variantOffset = {};
// handmatige duur per blok: { sessionId: { slotIndex: minutes } }
const durationOverride = {};

const timeValues = [30,45,60,75,90,105,120,150,Infinity];  // Infinity = geen tijdslimiet (MOCK-prototype)
let activeTimeIdx = 2;
let activeSessionId = 'capacity';
let currentBlocks = [];
let currentBlockIdx = 0;

// timer state
let timerInterval = null;
let timerRunning = false;
let timerSeconds = 0;
let timerTotal = 0;
let timerElapsed = 0;          // werkelijk verstreken sec in huidig blok (detail-timer)
let sessionLog = {};           // { blockIndex: {name, planned, spent} }
let sessionStartTime = null;
// centrale blok-stopwatch: meet echte tijd voor ELK bloktype
let blockClockStart = null;    // timestamp waarop het huidige blok geopend werd
function blockClockElapsed() { return blockClockStart ? Math.round((Date.now() - blockClockStart) / 1000) : 0; }

// ── HELPERS ──
function getT() { return timeValues[activeTimeIdx]; }
// eindige tijd voor opslag/encoding: bij ∞ de som van de huidige blokduren
function getTFinite() { return isFinite(getT()) ? getT() : currentBlocks.reduce((s,b)=>s+b.t,0); }

// ── DRAFT (eigen/aangepaste sessie) ──
let customSession = null;   // {id:'custom', cat, name, desc, color, rpe, intent, slots:[]}
let customKeys = null;      // array van blok-keys van de draft

function saveDraft() {
  try {
    if (customKeys && customSession) localStorage.setItem('crimpify_draft', JSON.stringify({ keys: customKeys, name: customSession.name, color: customSession.color, rpe: customSession.rpe, intent: customSession.intent, locked: sessionLocked, owned: sessionOwned, basedOn: customSession.basedOn || undefined }));
  } catch {}
}
function loadDraft() {
  try { return JSON.parse(localStorage.getItem('crimpify_draft') || 'null'); } catch { return null; }
}
function composeFromKeys(keys) {
  const base = keys.filter(k=>BLOCKLIB[k]).map((key, i) => ({...BLOCKLIB[key], _key:key, _slot:i, _alts:1}));
  const isFixed = (b) => b.fixed === true || b._key === 'dynamic' || (durationOverride['custom'] && durationOverride['custom'][b._slot] != null);
  const fixedTotal = base.filter(isFixed).reduce((sum,b)=>{
    const ov = durationOverride['custom'] && durationOverride['custom'][b._slot];
    return sum + (ov != null ? ov : b.t);
  }, 0);
  const flexBase = base.filter(b=>!isFixed(b)).reduce((sum,b)=>sum+b.t,0);
  const flexBudget = Math.max(0, getT() - fixedTotal);
  const ratio = flexBase > 0 && isFinite(flexBudget) ? flexBudget / flexBase : 1;  // ∞ = natuurlijke lengte
  return base.map(b=>{
    const ov = durationOverride['custom'] && durationOverride['custom'][b._slot];
    if (ov != null) return {...b, t: ov};
    if (b.fixed === true || b._key === 'dynamic') return {...b};
    return {...b, t: Math.max(3, Math.round(b.t * ratio))};
  });
}

function getBlocks(id) {
  if (id === 'custom') return customKeys ? composeFromKeys(customKeys) : [];
  const s = sessions.find(x=>x.id===id);
  if (!s) return [];
  // compose: per slot, vast blok of keuze (roteert per dag + reroll-offset)
  const daySeed = new Date().getDate() + new Date().getMonth()*31;
  const offset = variantOffset[id] || 0;
  const base = s.slots.map((slot, i) => {
    let key;
    if (Array.isArray(slot)) {
      key = slot[(daySeed + offset + i) % slot.length];
    } else {
      key = slot;
    }
    return {...BLOCKLIB[key], _key:key, _slot:i, _alts: Array.isArray(slot) ? slot.length : 1};
  });
  // vaste blokken (fixed:true of handmatig overschreven) schalen niet mee
  const isFixed = (b) => b.fixed === true || b._key === 'dynamic' || (durationOverride[id] && durationOverride[id][b._slot] != null);
  const fixedTotal = base.filter(isFixed).reduce((sum,b)=>{
    const ov = durationOverride[id] && durationOverride[id][b._slot];
    return sum + (ov != null ? ov : b.t);
  }, 0);
  const flexBase = base.filter(b=>!isFixed(b)).reduce((sum,b)=>sum+b.t,0);
  const flexBudget = Math.max(0, getT() - fixedTotal);
  const ratio = flexBase > 0 && isFinite(flexBudget) ? flexBudget / flexBase : 1;  // ∞ = natuurlijke lengte
  return base.map(b=>{
    const ov = durationOverride[id] && durationOverride[id][b._slot];
    if (ov != null) return {...b, t: ov};
    if (b.fixed === true || b._key === 'dynamic') return {...b};
    return {...b, t: Math.max(3, Math.round(b.t * ratio))};
  });
}

function rerollSession(id) {
  variantOffset[id] = (variantOffset[id] || 0) + 1;
  durationOverride[id] = {}; // reset handmatige aanpassingen bij nieuwe rol
  sessionLocked = false;
  buildSlab();
  renderPreview();
  buildCategories();
}

function adjustBlock(id, slotIdx, currentT, delta) {
  if (!durationOverride[id]) durationOverride[id] = {};
  const next = Math.max(3, currentT + delta);
  durationOverride[id][slotIdx] = next;
  buildSlab();
  renderPreview();
}

function getSession(id) { if (id === 'custom') return customSession; return sessions.find(x=>x.id===id); }

// ── NAVIGATION ──
function goTo(viewId) {
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  if (viewId === 'v-browse' && typeof renderContinue === 'function') renderContinue();
  if (viewId === 'v-browse' && typeof renderNews === 'function') renderNews();
  stopTimer();
  if (viewId !== 'v-guided') { gRunning = false; clearInterval(gInterval); }
  if (viewId !== 'v-drills' && typeof dpIntervals !== 'undefined') { dpIntervals.forEach((iv,i)=>{ if(iv) clearInterval(iv); dpIntervals[i]=null; }); }
  if (viewId !== 'v-drillfocus' && typeof dfInterval !== 'undefined') { clearInterval(dfInterval); dfRunning = false; }
}

// ── SESSIE-BEWAKING ──
// Hoeveel seconden zit er "werk" in de huidige actieve view?
function activeView() {
  const v = document.querySelector('.view.active');
  return v ? v.id : null;
}
function hasLiveProgress() {
  const v = activeView();
  if (v === 'v-detail') {
    // detail-timer: bevestig als er >10 sec verstreken is
    return timerTotal > 0 && (timerTotal - timerSeconds) >= 10;
  }
  if (v === 'v-guided') {
    const elapsed = gItems[gIdx] ? (gItems[gIdx].sec - gRemain) : 0;
    // gElapsed dekt cap-blokken: daar wrapt gIdx terug naar 0 tijdens de rotatie
    return gIdx > 0 || elapsed >= 10 || gElapsed >= 10;
  }
  if (v === 'v-drillfocus') {
    const elapsed = dfTotal - dfRemain;
    return dfIdx > 0 || elapsed >= 10;
  }
  if (v === 'v-drills') {
    // drill-player: lopende timer of afgevinkte drill
    if (typeof dpIntervals !== 'undefined' && dpIntervals.some(iv=>iv!=null)) return true;
    return !!document.querySelector('.dp-card.done');
  }
  if (v === 'v-check') {
    return checkCount > 0;
  }
  return false;
}

let _pendingExit = null;
function guardedExit(fn) {
  if (hasLiveProgress()) {
    _pendingExit = fn;
    const v = activeView();
    const msg = v === 'v-check'
      ? `You counted ${checkCount} boulders. Leaving now loses that count.`
      : 'Your timer is still running. Are you sure?';
    document.getElementById('confirmMsg').textContent = msg;
    document.getElementById('confirmExit').style.display = 'flex';
  } else {
    fn();
  }
}
function confirmStay() {
  _pendingExit = null;
  document.getElementById('confirmExit').style.display = 'none';
  restoreConfirmDialog();
}
function confirmLeave() {
  document.getElementById('confirmExit').style.display = 'none';
  const fn = _pendingExit; _pendingExit = null;
  restoreConfirmDialog();
  if (fn) fn();
}
function restoreConfirmDialog() {
  const dlg = document.getElementById('confirmExit');
  document.getElementById('confirmTitle').textContent = 'Leave session?';
  const leaveBtn = dlg.querySelector('button[onclick="confirmLeave()"]');
  if (leaveBtn) leaveBtn.textContent = 'Leave';
}

function goToSession() {
  if (activeSessionId !== 'custom') sessionLocked = false;
  // library-only sessie: direct naar de bibliotheek
  const s = getSession(activeSessionId);
  if (s && s.slots && s.slots.length === 1 && BLOCKLIB[s.slots[0]] && BLOCKLIB[s.slots[0]].library) {
    currentBlocks = getBlocks(s.id);
    currentBlockIdx = 0;
    startDrillLibrary(0);
    return;
  }
  buildSlab();
  goTo('v-session');
}

const QUOTES = [
  // Game / Arcade
  { q: "Finish Him!" }, { q: "Victory. Flawless." }, { q: "Level Complete." },
  { q: "Quest Complete." }, { q: "+1000 XP" }, { q: "Achievement Unlocked." },
  { q: "You Survived." }, { q: "Boss Defeated." }, { q: "New Skill Acquired." },
  { q: "Checkpoint Reached." }, { q: "A Man’s Sword Is A Man’s Honour." },
  // Boulder / Climbing
  { q: "Stronger Than Yesterday." }, { q: "One Move Closer." }, { q: "Trust the Process." },
  { q: "The Wall Remembers." }, { q: "Leave Skin. Take Strength." }, { q: "Every Send Starts Here." },
  { q: "Grip. Pull. Repeat." }, { q: "Rest. Adapt. Return." }, { q: "Training Logged. Progress Loading..." },
  { q: "Your Future Project Just Got Easier." },
  // Gym (alleen in gym-sessie)
  { q: "Weights Returned. Respect Earned.", gym: true }, { q: "Iron Never Lies.", gym: true },
  { q: "Strength Deposited.", gym: true }, { q: "Muscles Under Construction.", gym: true },
  { q: "Recovery Starts Now.", gym: true }, { q: "Built, Not Bought.", gym: true },
  { q: "Small Gains. Big Results.", gym: true }, { q: "Consistency Wins.", gym: true },
  { q: "You Did the Work.", gym: true }, { q: "Mission Complete.", gym: true },
  // Stoïcijns / Minimalistisch
  { q: "Discipline > Motivation." }, { q: "Done Is Powerful." }, { q: "Keep Showing Up." },
  { q: "No Zero Days." }, { q: "Earn Tomorrow." }, { q: "Progress Compounds." },
  { q: "Another Brick in the Wall." }, { q: "One Percent Better." }, { q: "The Work Is the Reward." },
  { q: "Return Tomorrow." },
  // Harder / Badass
  { q: "Pain Paid." }, { q: "Earned." }, { q: "Built Different." }, { q: "No Excuses." },
  { q: "Another One Down." }, { q: "Outworked Yesterday." }, { q: "The Mountain Doesn't Care." },
  { q: "Stay Dangerous." }, { q: "Built by Reps." }, { q: "Never Finished." },
  { q: "Vincent gives you strength" }, { q: "You're Almost there" },
  // Met een knipoog
  { q: "Go Eat Some Protein." }, { q: "Hydrate, You Goblin." }, { q: "Your Forearms Hate You." },
  { q: "Your Couch Can Wait." }, { q: "Gravity Lost Again." }, { q: "Fingerprints Not Found." },
  { q: "Achievement: Didn't Skip Leg Day." }, { q: "You May Now Complain." },
  { q: "Please Return Tomorrow." }, { q: "Congratulations. You're Sore Tomorrow." },
  // Soulslike / Fantasy
  { q: "Bonfire Lit." }, { q: "Praise the Send." }, { q: "Strength +1" }, { q: "Vitality Increased." },
  { q: "You Grew Stronger." }, { q: "Forge Complete." }, { q: "Steel Tempered." },
  { q: "The Hero Returns." }, { q: "Your Legend Continues." }, { q: "The Journey Never Ends." },
  { q: "Guru is impressed" },
];

function fmtMin(sec){
  const m = Math.round(sec/60);
  return m + ' min';
}

function showSessionSummary() {
  clearActive();  // sessie afgerond — geen Continue-kaart meer
  const blocks = Object.keys(sessionLog).map(k=>sessionLog[k]);
  const totalSpent = blocks.reduce((s,b)=>s+(b.spent||0),0);
  const totalPlanned = blocks.reduce((s,b)=>s+(b.planned||0),0);
  const spentMin = Math.round(totalSpent/60);
  const plannedMin = Math.round(totalPlanned/60);

  document.getElementById('summaryTotal').textContent = `${blocks.length} block${blocks.length === 1 ? '' : 's'} done`;
  document.getElementById('summarySpentBig').textContent = spentMin;
  document.getElementById('summaryPlannedBig').textContent = plannedMin;

  // verschil-regel
  const totDiff = spentMin - plannedMin;
  const diffEl = document.getElementById('summaryDiff');
  if (Math.abs(totDiff) < 1) { diffEl.textContent = 'precies op schema'; diffEl.style.color = 'var(--dust)'; }
  else if (totDiff > 0) { diffEl.textContent = `${totDiff} min longer than planned`; diffEl.style.color = 'var(--dust)'; }
  else { diffEl.textContent = `${Math.abs(totDiff)} min shorter than planned`; diffEl.style.color = 'var(--dust)'; }

  // gestapelde verdelingsbalk (per blok, naar rato van bestede tijd)
  const barTotal = totalSpent || 1;
  document.getElementById('summaryBar').innerHTML = blocks.map(b=>{
    const pct = ((b.spent||0) / barTotal * 100).toFixed(1);
    return `<div title="${b.name}" style="width:${pct}%;background:${b.color||'var(--prepare)'};"></div>`;
  }).join('');

  document.getElementById('summaryBlocks').innerHTML = blocks.map(b=>{
    const planned = b.planned||0, spent = b.spent||0;
    const diff = spent - planned;
    const diffTxt = Math.abs(diff) < 30 ? 'on time' : (diff > 0 ? `+${fmtMin(Math.abs(diff))}` : `−${fmtMin(Math.abs(diff))}`);
    const diffCol = 'var(--dust)';  // tijd-cues neutraal: geen kleursignaal op over/onder schema
    return `<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:var(--carbon);border-radius:8px;border-left:3px solid ${b.color||'var(--prepare)'};">
      <div style="flex:1;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;text-transform:uppercase;letter-spacing:.03em;color:var(--chalk);">${b.name}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:18px;color:${b.color||'var(--chalk)'};">${fmtMin(spent)}</div>
      <div style="font-family:'DM Mono',monospace;font-size:9px;color:${diffCol};min-width:48px;text-align:right;">${diffTxt}</div>
    </div>`;
  }).join('');
  // gym-quotes alleen in de gym-sessie; anders uitsluiten
  const isGym = activeSessionId === 'gym';
  const pool = QUOTES.filter(qt => isGym ? true : !qt.gym);
  const quote = pool[Math.floor(Math.random()*pool.length)];
  document.getElementById('summaryQuote').textContent = quote.q;
  document.getElementById('summaryQuoteAuthor').style.display = 'none';
  document.getElementById('sessionSummary').style.display = 'flex';

  // logging gebeurt pas bij de stoplicht-tik (of overslaan)
  const s = getSession(activeSessionId);
  const totalMin = spentMin || (s ? getTFinite() : 60);
  const coreBlock = blocks.filter((b,i)=>i>0).sort((a,b)=>b.spent-a.spent)[0];
  const variant = coreBlock ? coreBlock.name : (s ? s.name : '');
  _pendingLog = s ? { id: s.id, variant, time: totalMin, snap: {
    keys: currentBlocks.map(b => b._key),
    name: s.name,
    color: s.color || 'lime',
    blocks: blocks.map(b => ({ name: b.name, spent: b.spent||0, color: b.color || 'var(--prepare)' }))
  } } : null;
  // stoplicht-UI terugzetten naar beginstand
  document.getElementById('signalAsk').style.display = '';
  document.getElementById('signalAdvice').style.display = 'none';
}

// ── STOPLICHT (sessie-autoregulatie, één tik) ──
let _pendingLog = null;
const SIGNAL_ADVICE = {
  green:  { col:'var(--sig-green)', title:'Green', txt:'Strong work, and you stayed fresh. Next session can take a little more: one set, one grade, or five minutes.' },
  orange: { col:'var(--sig-orange)', title:'Orange', txt:'Right at or just over the edge. Keep the volume flat or take a little off next session, and grab an extra rest day if one presents itself.' },
  red:    { col:'var(--sig-red)', title:'Red — recover now', txt:'Stop signal. Plan 1-2 days of rest; make the next session light (Recovery or Skill). Pain that will not fade? Get it checked.' },
};
function signalTap(sig) {
  if (_pendingLog) { logSessionDone(_pendingLog.id, _pendingLog.variant, _pendingLog.time, sig, _pendingLog.snap); _pendingLog = null; }
  const a = SIGNAL_ADVICE[sig];
  document.getElementById('signalAsk').style.display = 'none';
  const box = document.getElementById('signalAdvice');
  box.style.display = '';
  box.style.borderColor = 'color-mix(in srgb, ' + a.col + ' 33%, transparent)';
  document.getElementById('signalAdviceTitle').textContent = a.title;
  document.getElementById('signalAdviceTitle').style.color = a.col;
  document.getElementById('signalAdviceTxt').textContent = a.txt;
}
function signalSkip() {
  if (_pendingLog) { logSessionDone(_pendingLog.id, _pendingLog.variant, _pendingLog.time, null, _pendingLog.snap); _pendingLog = null; }
  closeSummary();
}

function shareSummary() {
  if (!currentBlocks || !currentBlocks.length) return;
  const s = getSession(activeSessionId);
  const url = location.origin + location.pathname + '#s=' + encodeSession();
  const name = s ? s.name : 'Session';
  if (navigator.share) { navigator.share({ title: 'Crimpify: ' + name, text: shareText(name), url }).catch(()=>{ openShareDialog(url); }); }
  else { openShareDialog(url); }
}
function closeSummary() {
  // vangnet: als er nog een ongelogde sessie hangt, log zonder signaal
  if (_pendingLog) { logSessionDone(_pendingLog.id, _pendingLog.variant, _pendingLog.time, null, _pendingLog.snap); _pendingLog = null; }
  document.getElementById('sessionSummary').style.display = 'none';
  sessionLog = {};
  sessionStartTime = null;
  clearActive();
  recentFolded = false; applyRecentFold();
  goTo('v-browse');
}

// ── ONAFGEMAAKTE SESSIE (Continue-kaart) ──
// crimpify_active bewaart de lopende training per blokgrens; hervatten kan na
// reload of app-sluiting. Lopende timers overleven dat niet, blokvoortgang wel.
function saveActive() {
  if (!sessionStartTime) return;  // alleen echt gestarte sessies
  try {
    const s = getSession(activeSessionId);
    if (!s || !currentBlocks.length) return;
    const spent = {};
    Object.keys(sessionLog).forEach(k => { spent[k] = sessionLog[k].spent || 0; });
    localStorage.setItem('crimpify_active', JSON.stringify({
      keys: currentBlocks.map(b => b._key), name: s.name, color: s.color || 'lime',
      sessionId: s.id, idx: currentBlockIdx, spent, ts: Date.now(),
    }));
  } catch {}
}
function clearActive() {
  try { localStorage.removeItem('crimpify_active'); } catch {}
  if (typeof renderContinue === 'function') renderContinue();
}
function loadActive() {
  try {
    const a = JSON.parse(localStorage.getItem('crimpify_active') || 'null');
    if (!a || !Array.isArray(a.keys) || !a.keys.length) return null;
    if (Date.now() - a.ts > 12 * 3600000) { localStorage.removeItem('crimpify_active'); return null; }  // verlopen
    return a;
  } catch { return null; }
}
function renderContinue() {
  const el = document.getElementById('continueCard');
  if (!el) return;
  const a = loadActive();
  if (!a) { el.innerHTML = ''; return; }
  const keys = a.keys.filter(k => BLOCKLIB[k]);
  const spentMin = Object.values(a.spent || {}).reduce((s, v) => s + v, 0) / 60;
  const plannedMin = keys.reduce((s, k) => s + (BLOCKLIB[k].t || 0), 0);
  const left = Math.max(1, Math.round(plannedMin - spentMin));
  el.innerHTML = `<div class="continue-card" onclick="resumeActive()">
    <div style="min-width:0;">
      <div class="pick-kicker">continue</div>
      <div class="continue-name">${a.name}</div>
      <div class="continue-meta">Block ${Math.min(a.idx + 1, keys.length)} of ${keys.length} · ~${left} min remaining</div>
    </div>
    <button class="pick-btn" onclick="event.stopPropagation();resumeActive()">Resume →</button>
  </div>`;
}
function resumeActive() {
  const a = loadActive();
  if (!a) return;
  customSession = { id:'custom', cat:'again', name: a.name, desc:'', color: a.color || 'lime', rpe:'–', intent:'Picked up where you left off.' };
  customKeys = a.keys.filter(k => BLOCKLIB[k]);
  activeSessionId = 'custom';
  sessionLocked = true;
  sessionOwned = true;
  buildSlab();
  sessionLog = {};
  Object.keys(a.spent || {}).forEach(k => {
    const i = parseInt(k), b = currentBlocks[i];
    if (b) sessionLog[i] = { name: b.n, planned: b.t * 60, spent: a.spent[k], color: b.c };
  });
  sessionStartTime = Date.now();
  openBlock(Math.min(a.idx, currentBlocks.length - 1));
}

function startSession() {
  currentBlockIdx = 0;
  sessionLog = {};
  sessionStartTime = Date.now();
  openBlock(0);
}

function nextBlock() {
  // log blok met ECHTE bestede tijd (centrale blok-stopwatch)
  if (sessionLog[currentBlockIdx] === undefined) {
    const b = currentBlocks[currentBlockIdx];
    if (b) {
      const realSpent = blockClockElapsed();
      sessionLog[currentBlockIdx] = { name: b.n, planned: b.t*60, spent: realSpent, color: b.c };
    }
  }
  currentBlockIdx++;
  if (currentBlockIdx >= currentBlocks.length) {
    showSessionSummary();
    return;
  }
  openBlock(currentBlockIdx);
}

function openBlock(idx) {
  currentBlockIdx = idx;
  const b = currentBlocks[idx];
  timerElapsed = 0;
  blockClockStart = Date.now();   // start de echte klok voor dit blok
  saveActive();                   // blokgrens: voortgang bewaren voor de Continue-kaart
  updateSlabProgress(idx);
  if (b && b.guided && b.items) {
    startGuided(idx);
  } else if (b && b.library) {
    startDrillLibrary(idx);
  } else if (b && b.checklist) {
    startChecklist(idx);
  } else if (b && b.drills && (b._key === 'drillsOnly' || b._key === 'drillBlocks')) {
    startDrillFocus(idx);
  } else {
    buildDetail(idx);
    goTo('v-detail');
  }
}

// ══ GUIDED WARMUP PLAYER ══
let gItems = [], gIdx = 0, gRemain = 0, gInterval = null, gRunning = false;
let gElapsed = 0, gCap = null;  // gCap (sec) = looptijd-cap; blok loopt de items rond tot de cap

function startGuided(blockIdx) {
  const b = currentBlocks[blockIdx];
  gItems = b.items;
  gIdx = 0;
  gElapsed = 0;
  gCap = b.capSec || null;
  document.getElementById('guidedTitle').textContent = b.n;
  goTo('v-guided');
  loadGuidedItem(0);
  // niet auto-starten: toon overlay-startknop
  document.getElementById('guidedStartOverlay').style.display = 'flex';
  document.getElementById('guidedPauseBtn').textContent = 'Pause';
}

function guidedBegin() {
  document.getElementById('guidedStartOverlay').style.display = 'none';
  guidedRun();
}

function renderGuided() {
  const stack = document.getElementById('guidedStack');
  stack.innerHTML = gItems.map((it,i)=>{
    const cls = i < gIdx ? 'done' : (i === gIdx ? 'active' : '');
    const rest = it.rest ? ' rest' : '';
    return `<div class="gi ${cls}${rest}" id="gi-${i}">
      <div class="gi-check">${i < gIdx ? '✓' : ''}</div>
      <div class="gi-body">
        <div class="gi-name">${it.n}</div>
        <div class="gi-note">${it.note||''}</div>
      </div>
      <div class="gi-timer" id="gi-t-${i}">${i===gIdx ? formatSec(gRemain) : it.sec+'s'}</div>
    </div>`;
  }).join('');
  // scroll active into center
  const active = document.getElementById('gi-'+gIdx);
  if (active) active.scrollIntoView({block:'center', behavior:'smooth'});
  document.getElementById('guidedProg').textContent = gCap
    ? `${fmtMMSS(gElapsed)} / ${fmtMMSS(gCap)}`
    : `${Math.min(gIdx+1,gItems.length)} / ${gItems.length}`;
}

function formatSec(s){ return s + 's'; }
// mm:ss-weergave: fmtMMSS staat bij de drill-player (één definitie voor de hele app)

function loadGuidedItem(i) {
  gIdx = i;
  gRemain = gItems[i].sec;
  renderGuided();
}

function guidedRun() {
  gRunning = true;
  document.getElementById('guidedPauseBtn').textContent = 'Pause';
  clearInterval(gInterval);
  gInterval = setInterval(()=>{
    gRemain--;
    if (gCap) {
      gElapsed++;
      // de cap-teller moet per seconde meelopen, niet alleen op item-overgangen
      const pEl = document.getElementById('guidedProg');
      if (pEl) pEl.textContent = `${fmtMMSS(gElapsed)} / ${fmtMMSS(gCap)}`;
    }
    const tEl = document.getElementById('gi-t-'+gIdx);
    if (gRemain > 0) {
      if (tEl) tEl.textContent = formatSec(gRemain);
    } else {
      // tijd op → direct door naar volgende oefening
      clearInterval(gInterval);
      guidedAdvance();
    }
  }, 1000);
}

function guidedAdvance() {
  // cap-blokken (tendon): overslaan telt als verbruikte tijd, anders is het blok
  // met de Next-knop nooit af te ronden (de rotatie loopt tot de looptijd-cap)
  if (gCap) gElapsed += Math.max(0, gRemain);
  const done = gCap ? gElapsed >= gCap : gIdx >= gItems.length - 1;
  if (done) {
    // klaar → terug naar sessie, markeer blok als gedaan
    gRunning = false;
    clearInterval(gInterval);
    nextBlock();
    return;
  }
  loadGuidedItem(gCap ? (gIdx + 1) % gItems.length : gIdx + 1);
  if (gRunning) guidedRun();
}

function guidedToggle() {
  if (gRunning) {
    gRunning = false;
    clearInterval(gInterval);
    document.getElementById('guidedPauseBtn').textContent = 'Resume';
  } else {
    guidedRun();
  }
}

function guidedNext() {
  clearInterval(gInterval);
  guidedAdvance();
}

function exitGuided() {
  gRunning = false;
  clearInterval(gInterval);
  goTo('v-session');
}

// ══ DRILL PICKER (gedeeld) ══
function pickDrills(n) {
  const seed = new Date().getDate() + new Date().getMonth()*31 + (variantOffset[activeSessionId]||0);
  const pool = DRILLS.filter(d=>d.cat !== 'meta');
  const cats = [...new Set(pool.map(d=>d.cat))];
  const out = [];
  const catOrder = cats.slice().sort((a,b)=> ((seed+a.charCodeAt(0))%7) - ((seed+b.charCodeAt(0))%7));
  for (const c of catOrder) {
    if (out.length >= n) break;
    const inCat = pool.filter(d=>d.cat===c);
    const pick = inCat[(seed + c.charCodeAt(0)) % inCat.length];
    if (!out.includes(pick)) out.push(pick);
  }
  let k = 0;
  while (out.length < n && k < pool.length*2) {
    const cand = pool[(seed + k*5) % pool.length];
    if (!out.includes(cand)) out.push(cand);
    k++;
  }
  return out.slice(0,n);
}

// ══ DRILL PLAYER ══
let dpDrills = [], dpTimers = [], dpIntervals = [], drillMode = 'session';

function startDrillPlayer(blockIdx) {
  drillMode = 'session';
  const b = currentBlocks[blockIdx];
  const n = (b._key === 'drillBlocks') ? 3 : 2;
  dpDrills = pickDrills(n);
  // verdeel blokduur over de drills als richttijd
  const per = Math.max(3, Math.round(b.t / n));
  dpTimers = dpDrills.map(()=> per*60);
  dpIntervals = dpDrills.map(()=> null);
  document.getElementById('drillSub').textContent = `${n} skills · target ${per} min each · tap open for instructions`;
  document.getElementById('drillFooter').innerHTML = `movement skills<br><b style="color:var(--skill);">${b.t} min total</b>`;
  document.getElementById('drillTitle').textContent = 'Movement skills';
  renderDrillPlayer();
  goTo('v-drills');
}

function startDrillLibrary(blockIdx) {
  dpFilter = '';
  const dsi = document.getElementById('drillSearch');
  if (dsi) dsi.value = '';
  drillMode = 'library';
  // volledige bibliotheek, zonder meta-drill; jij kiest zelf
  dpDrills = DRILLS.filter(d=>d.cat !== 'meta');
  dpTimers = dpDrills.map(()=> 5*60); // 5 min richttijd per drill, vrij aan te passen
  dpIntervals = dpDrills.map(()=> null);
  document.getElementById('drillTitle').textContent = 'Skill library';
  document.getElementById('drillSub').textContent = `${dpDrills.length} skills · pick your own · tap open for instructions`;
  document.getElementById('drillFooter').innerHTML = `${dpDrills.length} skills`;
  renderDrillPlayer();
  goTo('v-drills');
}

function drillBack() {
  if (drillMode === 'swap') { drillMode = 'session'; swapTargetIdx = null; goTo('v-drillfocus'); return; }
  if (drillMode === 'library') goTo('v-browse');
  else goTo('v-session');
}
function drillDone() {
  if (drillMode === 'swap') { drillMode = 'session'; swapTargetIdx = null; goTo('v-drillfocus'); return; }
  if (drillMode === 'library') goTo('v-browse');
  else nextBlock();
}

// ══ FOCUSED DRILL PLAYER (big timer) ══
let dfDrills = [], dfIdx = 0, dfRemain = 0, dfTotal = 0, dfInterval = null, dfRunning = false;

function startDrillFocus(blockIdx) {
  const b = currentBlocks[blockIdx];
  const n = (b._key === 'drillBlocks') ? 3 : 2;
  dfDrills = pickDrills(n);
  dfTotal = Math.max(3, Math.round(b.t / n)) * 60;
  dfIdx = 0;
  loadDf(0);
  goTo('v-drillfocus');
}

function loadDf(i) {
  dfRunning = false;
  clearInterval(dfInterval);
  dfIdx = i;
  dfRemain = dfTotal;
  const d = dfDrills[i];
  document.getElementById('dfProg').textContent = `${i+1} / ${dfDrills.length}`;
  document.getElementById('dfName').textContent = d.n;
  document.getElementById('dfTag').textContent = d.tag + ('');
  document.getElementById('dfSetup').textContent = d.setup;
  document.getElementById('dfDo').textContent = d.do;
  document.getElementById('dfGoal').textContent = d.goal;
  document.getElementById('dfInfo').style.display = 'none';
  document.getElementById('dfInfoBtn').textContent = 'instructions ▾';
  document.getElementById('dfPlayBtn').textContent = 'Start';
  document.getElementById('dfState').textContent = 'target time';
  dfRender();
}

function dfRender() {
  const m = Math.floor(Math.max(0,dfRemain)/60);
  const s = Math.max(0,dfRemain)%60;
  const t = document.getElementById('dfTimer');
  t.textContent = `${m}:${s.toString().padStart(2,'0')}`;
  // acid in de laatste minuut (aandacht = interactie)
  if (dfRemain <= 60 && dfRemain > 0) t.style.color = 'var(--acid)';
  else if (dfRemain <= 0) t.style.color = 'var(--acid)';
  else t.style.color = 'var(--chalk)';
}

function dfAdjust(deltaSec) {
  dfRemain = Math.max(30, dfRemain + deltaSec);
  dfTotal = Math.max(dfTotal, dfRemain);
  dfRender();
}

function dfToggle() {
  if (dfRunning) {
    dfRunning = false;
    clearInterval(dfInterval);
    document.getElementById('dfPlayBtn').textContent = 'Resume';
    document.getElementById('dfState').textContent = 'paused';
    return;
  }
  if (dfRemain <= 0) { dfRemain = dfTotal; dfRender(); }
  dfRunning = true;
  document.getElementById('dfPlayBtn').textContent = 'Pause';
  document.getElementById('dfState').textContent = 'running';
  clearInterval(dfInterval);
  dfInterval = setInterval(()=>{
    dfRemain--;
    dfRender();
    if (dfRemain <= 0) {
      clearInterval(dfInterval);
      dfRunning = false;
      document.getElementById('dfPlayBtn').textContent = 'Opnieuw';
      document.getElementById('dfState').textContent = 'time is up!';
    }
  }, 1000);
}

function dfOpenInfo() {
  const el = document.getElementById('dfInfo');
  const open = el.style.display === 'block';
  el.style.display = open ? 'none' : 'block';
  document.getElementById('dfInfoBtn').textContent = open ? 'instructions ▾' : 'instructions ▴';
}

function dfBack() {
  if (dfIdx > 0) loadDf(dfIdx - 1);
  else goTo('v-session');
}
function dfNext() {
  if (dfIdx < dfDrills.length - 1) loadDf(dfIdx + 1);
  else { clearInterval(dfInterval); dfRunning = false; nextBlock(); }
}

// drill wisselen: open bibliotheek in swap-modus
let swapTargetIdx = null;
function dfSwitch() {
  clearInterval(dfInterval); dfRunning = false;
  swapTargetIdx = dfIdx;
  drillMode = 'swap';
  dpDrills = DRILLS.filter(d=>d.cat !== 'meta');
  dpTimers = dpDrills.map(()=> 5*60);
  dpIntervals = dpDrills.map(()=> null);
  document.getElementById('drillTitle').textContent = 'Pick a skill';
  document.getElementById('drillSub').textContent = `replace "${dfDrills[swapTargetIdx].n}" — tap a skill to pick it`;
  document.getElementById('drillFooter').innerHTML = `switch skill<br><b style="color:var(--skill);">${dpDrills.length} options</b>`;
  renderDrillPlayer();
  goTo('v-drills');
}
function dfApplySwap(libIdx) {
  const chosen = dpDrills[libIdx];
  dfDrills[swapTargetIdx] = chosen;
  swapTargetIdx = null;
  drillMode = 'session';
  loadDf(dfDrills.indexOf(chosen));
  goTo('v-drillfocus');
}

// ══ BOULDER CHECKLIST ══
let checkCount = 0, checkTarget = 30, checkMax = 35;
function startChecklist(blockIdx) {
  const b = currentBlocks[blockIdx];
  checkCount = 0;
  checkTarget = b.target || 30;
  const range = b.range || '25-35';
  const parts = range.split('-');
  checkMax = parseInt(parts[1] || parts[0]) || 35;  // '20' = exact doel, '25-35' = bereik
  document.getElementById('checkTitle').textContent = b.n;
  document.getElementById('checkRange').textContent = `goal ${range}`;
  document.getElementById('checkSub').textContent = `${range} boulders${b.grade ? ' · ' + b.grade : ''} · rpe ${b.rpe}`;
  document.getElementById('checkWhy').textContent = b.why;
  document.getElementById('checkFooter').innerHTML = `${b.n.toLowerCase()}<br><b style="color:var(--success);">goal ${range}</b>`;
  const sub = document.getElementById('checkSuccessSub');
  if (sub) sub.textContent = `${parseInt(parts[0]) || 25}+ boulders, everything after is bonus`;
  renderCheck();
  goTo('v-check');
}
function checkAdjust(d) {
  const prev = checkCount;
  checkCount = Math.max(0, checkCount + d);
  renderCheck();
  // succes-popup: precies bij het bereiken van de ondergrens (omhoog)
  const minR = checkTargetMin();
  if (d > 0 && prev < minR && checkCount >= minR) showCheckSuccess();
}
function checkTargetMin() {
  return parseInt((document.getElementById('checkRange').textContent.match(/\d+/g)||[25])[0]) || 25;
}
function renderCheck() {
  document.getElementById('checkCount').textContent = checkCount;
  document.getElementById('checkProg').textContent = `${checkCount} / ${checkTarget}`;
  const cEl = document.getElementById('checkCount');
  const minR = checkTargetMin();
  // geleidelijke kleuropbouw
  let col;
  if (checkCount === 0) col = 'var(--disabled)';
  else if (checkCount < minR * 0.5) col = 'var(--dust)';                                  // net begonnen
  else if (checkCount < minR) col = 'color-mix(in srgb, var(--chalk) 70%, var(--dust))';  // bijna in zone
  else if (checkCount <= checkMax) col = 'var(--success)';                                // in doelzone
  else col = 'var(--dust)';                                                               // erover, rustig aan
  cEl.style.color = col;
  cEl.style.transition = 'color .3s';
  // glow in de doelzone
  cEl.style.textShadow = (checkCount >= minR && checkCount <= checkMax) ? '0 0 24px color-mix(in srgb, var(--chalk) 30%, transparent)' : 'none';
  // grid
  const grid = document.getElementById('checkGrid');
  let html = '';
  for (let i=1; i<=checkMax; i++) {
    const filled = i <= checkCount;
    const inRange = i >= minR;
    html += `<div onclick="checkSetTo(${i})" style="aspect-ratio:1;border-radius:6px;border:1px solid ${filled?'var(--success)':(inRange?'var(--disabled)':'var(--graphite)')};background:${filled?'color-mix(in srgb, var(--success) 18%, transparent)':'transparent'};display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:9px;color:${filled?'var(--success)':'var(--disabled)'};cursor:pointer;transition:all .15s;">${i}</div>`;
  }
  grid.innerHTML = html;
}
function checkSetTo(n) {
  const prev = checkCount;
  checkCount = (checkCount === n) ? n-1 : n;
  renderCheck();
  const minR = checkTargetMin();
  if (prev < minR && checkCount >= minR) showCheckSuccess();
}
function showCheckSuccess() {
  const ov = document.getElementById('checkSuccess');
  if (!ov) return;
  ov.style.display = 'flex';
  // korte viering, dan vanzelf weg
  clearTimeout(window._checkSuccessT);
  window._checkSuccessT = setTimeout(()=>{ ov.style.opacity = '0'; }, 1600);
  ov.style.opacity = '1';
  setTimeout(()=>{ if(ov.style.opacity==='0') ov.style.display='none'; }, 2200);
}

let dpFilter = '';
function dpMatch(d, q) {
  if (!q) return true;
  return (d.n + ' ' + (d.tag||'') + ' ' + (d.setup||'') + ' ' + (d.do||'') + ' ' + (d.goal||'')).toLowerCase().includes(q);
}
function renderDrillPlayer() {
  const stack = document.getElementById('drillStack');
  const q = (dpFilter||'').toLowerCase().trim();
  const shown = dpDrills.filter(d=>dpMatch(d,q)).length;
  document.getElementById('drillProg').textContent = q ? `${shown} / ${dpDrills.length} skills` : `${dpDrills.length} skills`;
  stack.innerHTML = dpDrills.map((d,i)=>{
    if (!dpMatch(d,q)) return '';
    const running = dpIntervals[i] != null;
    return `<div class="dp-card" id="dp-${i}">
      <div class="dp-head" onclick="dpToggleOpen(${i})">
        <div class="dp-num">${i+1}</div>
        <div class="dp-info">
          <div class="dp-name">${d.n}</div>
          <div class="dp-tag">${d.tag}${''}</div>
        </div>
        <div class="dp-timer-mini" id="dp-t-${i}">${fmtMMSS(dpTimers[i])}</div>
        <div class="dp-chev">›</div>
      </div>
      <div class="dp-detail">
        <div class="dp-detail-inner">
          <div class="dp-lbl">setup</div><p>${d.setup}</p>
          <div class="dp-lbl">execution</div><p>${d.do}</p>
          <div class="dp-lbl" style="color:var(--skill);">goal</div><p style="color:color-mix(in srgb, var(--skill) 55%, var(--chalk));">${d.goal}</p>
        </div>
      </div>
      <div class="dp-controls">
        ${drillMode === 'swap'
          ? `<button class="dp-tbtn" onclick="dfApplySwap(${i})" style="border-color:var(--skill);background:color-mix(in srgb, var(--skill) 18%, transparent);">Pick this one →</button>`
          : `<button class="dp-tbtn" id="dp-btn-${i}" onclick="dpToggleTimer(${i})">${running?'Pause':'Start timer'}</button>
             <button class="dp-tbtn done-btn" onclick="dpMarkDone(${i})">Done ✓</button>`}
      </div>
    </div>`;
  }).join('');
}

function fmtMMSS(s){ const m=Math.floor(Math.max(0,s)/60); const sec=Math.max(0,s)%60; return `${m}:${sec.toString().padStart(2,'0')}`; }

function dpToggleOpen(i) {
  const card = document.getElementById('dp-'+i);
  card.classList.toggle('open');
}

function dpToggleTimer(i) {
  if (dpIntervals[i] != null) {
    clearInterval(dpIntervals[i]); dpIntervals[i] = null;
    document.getElementById('dp-btn-'+i).textContent = 'Resume';
    document.getElementById('dp-'+i).classList.remove('active');
    return;
  }
  // stop andere lopende timers (één actief tegelijk)
  dpIntervals.forEach((iv,k)=>{
    if (iv != null && k !== i) {
      clearInterval(dpIntervals[k]); dpIntervals[k] = null;
      const ob = document.getElementById('dp-btn-'+k); if (ob) ob.textContent = 'Resume';
      const oc = document.getElementById('dp-'+k); if (oc) oc.classList.remove('active');
    }
  });
  document.getElementById('dp-btn-'+i).textContent = 'Pause';
  document.getElementById('dp-'+i).classList.add('active');
  dpIntervals[i] = setInterval(()=>{
    dpTimers[i]--;
    const t = document.getElementById('dp-t-'+i);
    if (t) t.textContent = fmtMMSS(dpTimers[i]);
    if (dpTimers[i] <= 0) {
      clearInterval(dpIntervals[i]); dpIntervals[i] = null;
      if (t) t.style.color = 'var(--success)';
      const btn = document.getElementById('dp-btn-'+i);
      if (btn) btn.textContent = 'Done ✓';
      const c = document.getElementById('dp-'+i); if (c) c.classList.remove('active');
    }
  }, 1000);
}

function dpMarkDone(i) {
  if (dpIntervals[i] != null) { clearInterval(dpIntervals[i]); dpIntervals[i] = null; }
  const c = document.getElementById('dp-'+i);
  c.classList.add('done');
  c.classList.remove('open');
  c.classList.remove('active');
}


// ── VIEW 1: BROWSE ──
function loadFavs() { try { return JSON.parse(localStorage.getItem('crimpify_favs') || '[]'); } catch { return []; } }
function saveFavs(f) { try { localStorage.setItem('crimpify_favs', JSON.stringify(f.slice(0,12))); } catch {} }

function buildRecent() {
  const row = document.getElementById('recentRow');
  let html = '';

  // 1. concept-draft (verder waar je was)
  const draft = loadDraft();
  if (draft && draft.keys && draft.keys.length) {
    html += `<div class="recent-card" style="background:color-mix(in srgb, var(--acid) 5%, transparent);border-color:color-mix(in srgb, var(--acid) 30%, transparent);" onclick="openDraft()">
      <div class="rc-top" style="background:var(--acid);"></div>
      <div class="rc-body">
        <div class="rc-name" style="color:var(--acid);">▶ ${draft.name || 'Concept'}</div>
        <div class="rc-meta" style="color:color-mix(in srgb, var(--acid) 65%, var(--ink));">continue</div>
        <div class="rc-date">${draft.keys.length} blocks</div>
      </div>
    </div>`;
  }

  // 2. favorieten — Saved toont alleen wat je zelf bewaarde of bouwde; recaps
  //    van losse sessies lopen via de rhythm-strip. Stoplicht-dot = jongste
  //    gelogde sessie met dezelfde naam.
  const favs = loadFavs();
  const hist = loadHistory();
  favs.forEach((f, i) => {
    const col = C[f.color] || C.lime;
    const last = hist.find(e => (e.name || '') === f.name);
    const dot = last && last.sig ? `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${SIG_COL[last.sig]};margin-right:5px;"></span>` : '';
    html += `<div class="recent-card" style="background:${col.bg};border-color:${col.border};" onclick="openFav(${i})" ontouchstart="favPressStart(${i})" ontouchend="favPressEnd()" ontouchmove="favPressEnd()" onmousedown="favPressStart(${i})" onmouseup="favPressEnd()">
      <div class="rc-top" style="background:${col.color};"></div>
      <div class="rc-body">
        <div class="rc-name" style="color:${col.text};">★ ${f.name}</div>
        <div class="rc-meta" style="color:${col.color};">favourite</div>
        <div class="rc-date">${dot}${f.keys.length} blocks · ${f.time}'</div>
      </div>
    </div>`;
  });

  const recentHead = document.getElementById('recentHead');
  if (!html) {
    if (recentHead) recentHead.style.display = 'none';
    row.style.display = 'none';
    row.innerHTML = '';
    return;
  }
  if (recentHead) recentHead.style.display = '';
  if (typeof applyRecentFold === 'function') applyRecentFold(); else row.style.display = '';
  row.innerHTML = html;
}

let _favPressTimer = null, _favLongPressed = false;
function favPressStart(i) {
  clearTimeout(_favPressTimer);
  _favPressTimer = setTimeout(()=>{ _favLongPressed = true; if (navigator.vibrate) navigator.vibrate(25); removeFav(i); }, 600);
}
function favPressEnd() { clearTimeout(_favPressTimer); setTimeout(()=>{ _favLongPressed = false; }, 300); }

// ── STOPLICHT-KALENDER (weergave: laatste 14 dagen; ACWR rekent los hiervan over de volle historie) ──
function renderSignalCal() {
  const wrap = document.getElementById('signalCalWrap');
  const cal = document.getElementById('signalCal');
  if (!wrap || !cal) return;
  const h = loadHistory();
  if (!h.length) { wrap.style.display = 'none'; return; }
  wrap.style.display = '';
  const SIG_RANK = { red:3, orange:2, green:1 };
  // per dag: zwaarste signaal wint; sessie zonder signaal = neutraal gevuld
  const days = [];
  const now = new Date(); now.setHours(0,0,0,0);
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i*86400000);
    const entries = h.filter(e => { const t = new Date(e.ts); t.setHours(0,0,0,0); return t.getTime() === d.getTime(); });
    let col = null, load = 0;
    entries.forEach(e => {
      load += e.load || 0;
      if (e.sig && (!col || SIG_RANK[e.sig] > SIG_RANK[col])) col = e.sig;
    });
    // entries staat nieuwste-eerst; recap opent de laatste sessie van die dag
    days.push({ trained: entries.length > 0, n: entries.length, col, load, day: d.getDay(), ts: entries.length ? entries[0].ts : null });
  }
  // strip: dag-letters + één dot per dag. Dot = stoplichtsignaal van die dag,
  // neutraal gevuld bij een sessie zonder signaal, leeg zonder training.
  // Nooit sessietype-kleuren: de strip toont hoe het gaat, niet wat je trainde.
  cal.innerHTML = `<div class="rhythm-letters">${days.map(d => `<span>${'SMTWTFS'[d.day]}</span>`).join('')}</div>
    <div class="rhythm-dots">${days.map(d => {
      const fill = d.trained ? `background:${d.col ? SIG_COL[d.col] : 'var(--disabled)'};` : 'border:1px solid var(--graphite);';
      const glow = d.col === 'red' ? 'box-shadow:0 0 8px color-mix(in srgb, var(--sig-red) 40%, transparent);' : '';
      const click = d.ts ? ` onclick="openRecap(${d.ts})"` : '';
      return `<i${click} title="${d.trained ? 'load ' + d.load : ''}" style="${fill}${glow}${d.ts ? 'cursor:pointer;' : ''}"></i>`;
    }).join('')}</div>`;
  // samenvatting: sessies in het venster + ACWR-zone in één woord (tik = ACWR-paneel)
  const trained = days.reduce((s,d)=>s+d.n,0);
  const { ratio } = computeACWR();
  const zoneWord = ratio == null ? 'building history'
    : ratio < 0.8 ? 'load light' : ratio <= 1.3 ? 'load balanced' : ratio <= 1.5 ? 'load climbing' : 'load high';
  document.getElementById('signalCalSummary').textContent = `${trained} session${trained === 1 ? '' : 's'} · ${zoneWord}`;
}

// ── ACWR: acute vs chronische belasting (Gabbett) ──
// acute = som load laatste 7 dagen; chronisch = weekgemiddelde laatste 28 dagen.
// zones: <0.8 onderbelast · 0.8-1.3 sweet spot · 1.3-1.5 verhoogd · >1.5 hoog risico
function computeACWR() {
  const h = loadHistory();
  const now = Date.now();
  const acute = h.filter(e => now - e.ts <= 7*86400000).reduce((s,e)=>s+(e.load||0),0);
  const last28 = h.filter(e => now - e.ts <= 28*86400000).reduce((s,e)=>s+(e.load||0),0);
  const chronic = last28 / 4;
  const ratio = chronic > 0 ? acute / chronic : null;
  return { acute, chronic: Math.round(chronic), ratio };
}
function acwrZone(r) {
  if (r == null) return { name:'not enough data', col:'var(--dust)', txt:'Not enough history yet for a reliable ratio. Keep training for 2-3 weeks and this picture becomes meaningful.' };
  if (r < 0.8) return { name:'undertraining', col:'var(--dust)', txt:'You are training clearly less than you are used to this week. Fine as a recovery week; if it lasts longer, build back up gradually.' };
  if (r <= 1.3) return { name:'sweet spot', col:'var(--sig-green)', txt:'Your load sits nicely on top of your base. This is the zone where you adapt with the lowest injury risk.' };
  if (r <= 1.5) return { name:'elevated', col:'var(--sig-orange)', txt:'Your acute load is climbing relative to your base. No alarm yet, but do not add extra volume or intensity this week.' };
  return { name:'high risk', col:'var(--sig-red)', txt:'You are training far more than your body is used to; this is the elevated injury-risk zone. Take rest or shift down to Recovery and Skill.' };
}
function renderLoadPanel() {
  const { acute, chronic, ratio } = computeACWR();
  document.getElementById('acwrAcute').textContent = acute;
  document.getElementById('acwrChronic').textContent = chronic;
  const rEl = document.getElementById('acwrRatio');
  const z = acwrZone(ratio);
  rEl.textContent = ratio == null ? '–' : ratio.toFixed(2);
  rEl.style.color = z.col;
  document.getElementById('acwrAdvice').textContent = z.txt;
  // marker op de zonebalk: schaal 0 → 2.5 over 0% → 100%
  const pos = ratio == null ? 0 : Math.min(100, Math.max(0, ratio / 2.5 * 100));
  document.getElementById('acwrMarker').style.left = pos + '%';
}
function toggleLoadPanel() {
  const p = document.getElementById('loadPanel');
  const chev = document.getElementById('loadChev');
  const open = p.style.display !== 'none';
  p.style.display = open ? 'none' : '';
  if (chev) chev.textContent = open ? '▾' : '▴';
  if (!open) renderLoadPanel();
}

// ── ADAPTIEVE COACH ──
// Autoregulatie in vier lagen, in volgorde van voorrang:
// 1. rood signaal of ACWR > 1.5  → herstel afdwingen
// 2. twee keer oranje op rij of ACWR 1.3-1.5 → volume vasthouden, licht systeem
// 3. gisteren zwaar (strength/power/perf) → vandaag laag-intensief alterneren
// 4. anders → progressie, roteer energiesystemen

// ── RECAP OF A FINISHED SESSION (openen vanuit Mijn sessies) ──
let _recapEntry = null;
const SIG_COL = { green:'var(--sig-green)', orange:'var(--sig-orange)', red:'var(--sig-red)' };
function openRecap(ts) {
  const e = loadHistory().find(x => x.ts === ts);
  if (!e) return;
  _recapEntry = e;
  const s = getSession(e.id);
  const name = e.name || (s ? s.name : 'Session');
  const el = id => document.getElementById(id);
  el('recapName').textContent = name;
  const d = new Date(e.ts);
  const sigTxt = e.sig === 'green' ? 'strong' : e.sig === 'orange' ? 'on the edge' : e.sig === 'red' ? 'too much' : 'no signal';
  el('recapMeta').textContent = nlDate(d) + ' · ' + (e.time || 0) + ' min · ' + sigTxt;
  el('recapDot').style.background = SIG_COL[e.sig] || 'var(--graphite)';
  el('recapDot').style.boxShadow = SIG_COL[e.sig] ? '0 0 14px color-mix(in srgb, ' + SIG_COL[e.sig] + ' 50%, transparent)' : 'none';

  const blocks = e.blocks || [];
  const total = blocks.reduce((sum,b)=>sum+(b.spent||0),0) || 1;
  el('recapBar').innerHTML = blocks.map(b => '<div style="width:' + ((b.spent||0)/total*100).toFixed(1) + '%;background:' + (b.color||'var(--prepare)') + ';"></div>').join('');
  el('recapBar').style.display = blocks.length ? 'flex' : 'none';
  el('recapBlocks').innerHTML = blocks.map(b =>
    '<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:var(--carbon);border-radius:8px;border-left:3px solid ' + (b.color||'var(--prepare)') + ';">' +
      '<div style="flex:1;font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:15px;text-transform:uppercase;letter-spacing:.03em;color:var(--chalk);">' + b.name + '</div>' +
      '<div style="font-family:\'Barlow Condensed\',sans-serif;font-weight:900;font-size:18px;color:' + (b.color||'var(--chalk)') + ';">' + Math.round((b.spent||0)/60) + ' min</div>' +
    '</div>').join('');

  const canShare = Array.isArray(e.keys) && e.keys.length;
  el('recapShareBtn').style.display = canShare ? '' : 'none';
  el('recapAgainBtn').style.display = canShare ? '' : 'none';
  const note = el('recapNote');
  if (!canShare) {
    note.style.display = '';
    note.textContent = 'This session was logged before the update, so its structure was not saved. Sessions from now on can be revisited and shared here.';
  } else { note.style.display = 'none'; }
  el('recapView').style.display = 'flex';
}
function closeRecap() { document.getElementById('recapView').style.display = 'none'; _recapEntry = null; }
function recapShare() {
  const e = _recapEntry;
  if (!e || !e.keys || !e.keys.length) return;
  const s = getSession(e.id);
  const url = location.origin + location.pathname + '#s=' + encodePayload(e.name || (s ? s.name : 'Session'), e.keys, e.time || 60, e.color || 'lime');
  const name = e.name || (s ? s.name : 'Session');
  if (navigator.share) { navigator.share({ title: 'Crimpify: ' + name, text: shareText(name, e.time), url }).catch(()=>{ openShareDialog(url); }); }
  else { openShareDialog(url); }
}
function recapAgain() {
  const e = _recapEntry;
  if (!e || !e.keys || !e.keys.length) return;
  closeRecap();
  const s = getSession(e.id);
  customSession = { id:'custom', cat:'again', name: e.name || (s ? s.name : 'Session'), desc:'', color: e.color || 'lime', rpe: s ? s.rpe : '–', intent:'Same session as before. Adapt and lock in, or start right away.' };
  customKeys = e.keys.filter(k => BLOCKLIB[k]);
  activeSessionId = 'custom';
  sessionLocked = false;
  sessionOwned = true;
  const ti = timeValues.indexOf(e.time);
  if (ti >= 0) setTimeIdx(ti);
  buildSlab();
  goTo('v-session');
}

// ── hoe vaak traint deze persoon werkelijk? (mediaan tussen trainingsdagen) ──
function typicalGapDays(h) {
  const days = [...new Set(h.map(e => Math.floor(e.ts / 86400000)))].sort((a,b) => b - a);
  if (days.length < 3) return null;
  const gaps = [];
  for (let i = 0; i < Math.min(days.length - 1, 10); i++) gaps.push(days[i] - days[i+1]);
  gaps.sort((a,b) => a - b);
  return gaps[Math.floor(gaps.length / 2)];
}

let _coachPick = null;
function coachSuggest() {
  const h = loadHistory();
  const { ratio } = computeACWR();
  const now = Date.now();
  const last = h[0] || null;
  const daysSince = last ? Math.floor((now - last.ts) / 86400000) : null;
  const sig1 = last ? last.sig : null;
  const sig2 = h[1] ? h[1].sig : null;
  const HEAVY = ['strength','power','perf','pe'];

  if (!h.length) return { id:'capacity', time:60, badge:'var(--sig-green)',
    reason:'No history yet. Start with an aerobic base: volume with good technique, everything else builds on that.' };
  if (sig1 === 'red') return { id:'recovery', time:45, badge:'var(--sig-red)',
    reason:'Your last session was red. Active recovery today: circulation and mobility, no load of significance.' };
  if (ratio != null && ratio > 1.5) return { id:'recovery', time:45, badge:'var(--sig-red)',
    reason:'Your acute load is far above what you are used to (ratio ' + ratio.toFixed(2) + '). Recovering now prevents injuries later.' };
  if (sig1 === 'orange' && sig2 === 'orange') return { id:'skill', time:60, badge:'var(--sig-orange)',
    reason:'Orange twice in a row. Technique work keeps you moving without stacking more load.' };
  if (ratio != null && ratio > 1.3) return { id:'capacity', time:45, badge:'var(--sig-orange)',
    reason:'Your load is climbing (ratio ' + ratio.toFixed(2) + '). Light aerobic volume, no added intensity this week.' };
  // rest is the default advice right after a session; the person's own rhythm corrects it
  const gap = typicalGapDays(h);
  if (daysSince === 0) return { rest:true, id:'recovery', time:30, badge:'var(--dust)',
    reason: gap != null && gap <= 1
      ? 'You already trained today. You usually train daily, so a second session is fine, but keep it light.'
      : 'You already trained today. Adaptation happens in the rest, not in the session.' };
  if (daysSince === 1 && (gap == null || gap >= 2)) return { rest:true, id:'recovery', time:30, badge:'var(--dust)',
    reason: gap == null
      ? 'You trained yesterday. One rest day lets the adaptation land; not enough history yet to know your rhythm.'
      : 'You trained yesterday, and you usually train every ' + gap + ' days. Rest today, sharp again tomorrow.' };
  if (last && HEAVY.includes(last.id) && daysSince <= 1) {
    return { id:'skill', time:60, badge:'var(--sig-green)',
      reason:'Heavy training yesterday (' + (getSession(last.id) ? getSession(last.id).name : last.id) + '). Alternate: technique or light volume today, intensity again tomorrow.' };
  }
  // progressie: roteer weg van het laatst getrainde systeem
  const rotation = ['strength','pe','capacity','power'];
  const lastIdx = rotation.indexOf(last ? last.id : '');
  const nextId = rotation[(lastIdx + 1 + rotation.length) % rotation.length] || 'capacity';
  const extra = sig1 === 'green' ? ' Your last session was green, so you can add a little: a set, a grade or five minutes.' : '';
  return { id: nextId, time:60, badge:'var(--sig-green)',
    reason:'Fresh enough for quality. ' + (getSession(nextId) ? getSession(nextId).name : nextId) + ' is up next in your rotation.' + extra };
}
// MOCK-prototype: verzoen wat je lijf nodig heeft (coachSuggest) met de tijd die je hébt (slider).
// De suggestie loopt live mee met de tijdbalk; autoregulatie wint altijd van ambitie.
function adaptCoachToTime(pick) {
  const t = getT();
  const p = { ...pick };
  if (!isFinite(t)) {
    p.reason += ' No time limit set. The stoplight ends this session, not the clock.';
    return p;
  }
  if (t <= 30) {
    if (p.rest || p.id === 'recovery') {
      p.time = 30;
      p.reason += ' Thirty minutes of easy movement is plenty today.';
      return p;
    }
    return { id:'minidose', time:30, badge:p.badge,
      reason:'Short window today. Minimal dose: fingers and pull in twenty focused minutes, no filler.' };
  }
  if (t >= 75) {
    if (p.rest) {
      p.reason += ' Planning ' + t + ' minutes on a rest day? You know best. If you go, keep it light and log it honestly.';
      return p;
    }
    if (p.id === 'recovery') {
      p.reason += ' You have ' + t + ' minutes, your body asked for ' + p.time + '. Recovery does not scale; do it well and go home.';
      return p;
    }
  }
  return p;
}

// ── TODAY'S PICK: het primaire moment op de landing. De coach/ACWR-logica
// (coachSuggest + adaptCoachToTime) blijft ongewijzigd; alleen de vorm is nieuw. ──
function deriveGear(blocks) {
  // materiaal van het kernblok (grootste), niet van een kleine afsluiter
  const FING = ['maxHangs','nohangs','activeCurls','mdFinger','mdMaxHangs','mdNoHangs','hog'];
  const BOARD = ['board1','boardVolume','boardApply','campus'];
  const GYM = ['gymWarmup','pullStrength','pushStrength','coreLegs','mini1','mini2','mini3'];
  const core = blocks.slice().sort((a, b) => b.t - a.t)[0];
  const k = core ? core._key : '';
  if (FING.includes(k)) return 'Fingerboard';
  if (BOARD.includes(k)) return 'Board';
  if (GYM.includes(k)) return 'Gym';
  return 'Gym wall';
}
// verwachte belasting van een gegenereerde sessie: intensiteitsfactor → vier standen
function loadDots(id) {
  const f = INTENSITY_FACTORS[id] != null ? INTENSITY_FACTORS[id] : 0.65;
  return f >= 0.85 ? 4 : f >= 0.7 ? 3 : f >= 0.5 ? 2 : 1;
}
function renderTodaysPick() {
  const card = document.getElementById('todaysPick');
  if (!card) return;
  const pick = adaptCoachToTime(coachSuggest());
  _coachPick = pick;
  const s = getSession(pick.id);
  if (!s) { card.innerHTML = ''; return; }
  const reason = loadHistory().length ? pick.reason : 'A good first session to get you going.';
  if (pick.rest) {
    card.innerHTML = `<div class="pick-card">
      <div class="pick-body">
        <div class="pick-kicker">recommended today</div>
        <div class="pick-name">Rest day</div>
        <div class="pick-reason">${reason}</div>
        <button class="pick-why-btn" onclick="togglePickWhy(this)">${_pickWhyOpen ? 'why this? ▴' : 'why this? →'}</button>
        <div class="pick-why${_pickWhyOpen ? ' open' : ''}" id="pickWhy">${_pickWhyOpen ? coachDetail(pick) : ''}</div>
        <button class="pick-btn ghost" onclick="applyCoach()">Easy recovery →</button>
      </div>
    </div>`;
    return;
  }
  const blocks = getBlocks(pick.id);
  const total = blocks.reduce((sum, b) => sum + b.t, 0);
  const band = blocks.map(b => `<div style="flex:${b.t};background:${b.c};" title="${b.n}"></div>`).join('');
  const t = getT();
  card.innerHTML = `<div class="pick-card">
    <div class="pick-band">${band}</div>
    <div class="pick-body">
      <div class="pick-kicker">recommended today</div>
      <div class="pick-name">${s.name}</div>
      <div class="pick-meta"><span>${s.desc.split('\n')[0].toLowerCase()}</span><span>${isFinite(t) ? t : total} min</span><span>${deriveGear(blocks)}</span><span class="pick-load">load ${chPhalanx(loadDots(pick.id), true)}</span></div>
      <div class="pick-reason">${reason}</div>
      <button class="pick-why-btn" onclick="togglePickWhy(this)">${_pickWhyOpen ? 'why this? ▴' : 'why this? →'}</button>
      <div class="pick-why${_pickWhyOpen ? ' open' : ''}" id="pickWhy">${_pickWhyOpen ? coachDetail(pick) : ''}</div>
      <button class="pick-btn" onclick="applyCoach()">Start session</button>
    </div>
  </div>`;
}
// WHY THIS?: de causale regel blijft staan, dit klapt de volledige coach-redenering uit.
// Advies, geen oordeel (productprincipe 3). Samengesteld uit bestaande data; het
// zone-woord komt uit acwrZone zodat het nooit kan afwijken van het ACWR-paneel.
function coachDetail(pick) {
  const s = getSession(pick.id);
  const h = loadHistory();
  const { ratio } = computeACWR();
  const parts = [];
  if (ratio != null) parts.push(`Your load ratio sits at ${ratio.toFixed(2)} (${acwrZone(ratio).name}).`);
  else parts.push('There is not enough history yet to read your load trend, so this is a gentle default.');
  if (h.length && h[0].sig) parts.push(`Your last session logged ${h[0].sig}.`);
  if (s) {
    const blocks = getBlocks(pick.id);
    const names = blocks.map(b => b.n).join(', ');
    const what = s.desc ? s.desc.split('\n')[0].toLowerCase() : (s.goal ? s.goal.toLowerCase() : 'training');
    if (names) parts.push(`${s.name} works ${what}: ${names}.`);
  }
  parts.push('This is advice, not a verdict. Your own rhythm and how you feel today win.');
  return parts.join(' ');
}
// open-staat overleeft re-renders (tijd-chip ververst de kaart); inhoud pas berekend bij openen
let _pickWhyOpen = false;
function togglePickWhy(btn) {
  const el = document.getElementById('pickWhy');
  if (!el) return;
  _pickWhyOpen = !_pickWhyOpen;
  if (_pickWhyOpen && !el.textContent && _coachPick) el.textContent = coachDetail(_coachPick);
  el.classList.toggle('open', _pickWhyOpen);
  btn.textContent = _pickWhyOpen ? 'why this? ▴' : 'why this? →';
}
function applyCoach() {
  if (!_coachPick) return;
  const pick = _coachPick;  // vastpakken: setTimeIdx hieronder ververst _coachPick via renderTodaysPick
  const ti = timeValues.indexOf(pick.time);
  if (ti >= 0) setTimeIdx(ti);
  selectSession(pick.id);
  goToSession();
}

// ── TWEE PADEN ──
function toggleGenerate() {
  const s = document.getElementById('generateSection');
  const chev = document.getElementById('genChev');
  const open = s.style.display !== 'none';
  s.style.display = open ? 'none' : '';
  if (chev) chev.textContent = open ? '▾' : '▴';
}

function startBuildPath() {
  customSession = { id:'custom', cat:'own', name:'My session', desc:'', color:'lime', rpe:'–',
    intent:'Self-assembled. Add blocks, adjust duration inside each block.' };
  customKeys = [];
  sessionLocked = false;
  sessionOwned = true;
  activeSessionId = 'custom';
  durationOverride['custom'] = {};
  buildSlab();
  goTo('v-session');
}

function openDraft() {
  const d = loadDraft();
  if (!d) return;
  customSession = { id:'custom', cat:'own', name:d.name || 'My session', desc:'', color:d.color || 'lime', rpe:d.rpe || '–', intent:d.intent || 'Self-assembled.' };
  if (d.basedOn) customSession.basedOn = d.basedOn;
  customKeys = d.keys.slice();
  activeSessionId = 'custom';
  sessionLocked = !!d.locked;
  sessionOwned = d.owned !== false;
  buildSlab();
  goTo('v-session');
}

function openFav(i) {
  if (_favLongPressed) return;
  const f = loadFavs()[i];
  if (!f) return;
  customSession = { id:'custom', cat:'own', name:f.name, desc:'', color:f.color || 'lime', rpe:f.rpe || '–', intent:f.intent || 'Favourite session.' };
  if (f.basedOn) customSession.basedOn = f.basedOn;
  customKeys = f.keys.slice();
  activeSessionId = 'custom';
  sessionLocked = true;   // favourites were locked in earlier
  sessionOwned = true;
  buildSlab();
  goTo('v-session');
}

// generatieve sessie omzetten naar bewerkbare draft
function ensureDraftMode() {
  if (activeSessionId === 'custom') return;
  const s = getSession(activeSessionId);
  customKeys = currentBlocks.map(b => b._key);
  customSession = { id:'custom', cat:'own', name: s ? s.name : 'My session', desc:'', color: s ? s.color : 'lime', rpe: s ? s.rpe : '–', intent: s ? s.intent : '' };
  durationOverride['custom'] = {};
  activeSessionId = 'custom';
  sessionLocked = false;
}

// ── BLOCK PICKER (gegroepeerd + zoeken) ──
// Indeling volgt de opbouw van een sessie én de energiesysteem-taxonomie:
// warm-up → techniek → energiesysteem-werk (capaciteit / PE / max) → vingers → antagonist → herstel
const BLOCK_GROUPS = [
  { name:'Warm-up & activation',        keys:['dynamic','warmup','warmupFinger','gymWarmup','mobilityOpen','tensionAct','easyTen','noHangsEmil','tendonClimb','tendonFull'] },
  { name:'Technique & skills',          keys:['drillsOnly','drillBlocks','drillLibrary','skillLight','slab'] },
  { name:'Capacity · aerobic volume', keys:['volume','boardVolume','easyClimb','sprayLight','mediumTwenty','frontBuild'] },
  { name:'Power endurance',            keys:['peFlow','fourByFour','hehe','linked','compStyle'] },
  { name:'Max strength & power',         keys:['limitBlocks','project','board1','campus','dynos','boardApply','pyramide','frontGrowth'] },
  { name:'Finger strength',               keys:['maxHangs','nohangs','activeCurls'] },
  { name:'Antagonist, core & gym',     keys:['pullStrength','pushStrength','coreLegs','mini1','mini2','mini3','lockoffs'] },
  { name:'Recovery & mobility',       keys:['stretch','stretchLong','hog','frontMaint'] },
];
// ── KLEURGRAMMATICA ──
// kleur = wat het traint (categorie), badge = waar het vandaan komt, tekst = hoe zwaar.
// Elke categorie één kleur uit de C-palette; blokken erven die van hun groep.
const CAT_COLOR = {
  'Warm-up & activation':       'var(--prepare)',
  'Technique & skills':         'var(--skill)',
  'Capacity · aerobic volume': 'var(--volume)',
  'Power endurance':            'var(--volume)',
  'Max strength & power':       'var(--max-effort)',
  'Finger strength':            'var(--max-effort)',
  'Antagonist, core & gym':     'var(--prepare)',
  'Recovery & mobility':        'var(--prepare)',
};
const UX_COLOR = 'var(--graphite)';  // eigen oefeningen: geen aparte kleur, wel een YOURS-badge
function applyCategoryColors() {
  BLOCK_GROUPS.forEach(g => {
    const col = CAT_COLOR[g.name];
    if (!col) return;
    g.keys.forEach(k => { if (BLOCKLIB[k]) BLOCKLIB[k].c = col; });
  });
  Object.keys(BLOCKLIB).filter(k => k.startsWith('ux_')).forEach(k => { BLOCKLIB[k].c = UX_COLOR; });
}
function yoursBadge(key) {
  return key && key.startsWith('ux_')
    ? `<span style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;color:var(--dust);border:1px solid var(--graphite);border-radius:3px;padding:0 4px;margin-left:6px;vertical-align:middle;">YOURS</span>`
    : '';
}
// verborgen blokken (gebruiker kan de bibliotheek opschonen)
function loadHidden() { try { return JSON.parse(localStorage.getItem('crimpify_hidden_blocks') || '[]'); } catch { return []; } }
function saveHidden(a) { try { localStorage.setItem('crimpify_hidden_blocks', JSON.stringify(a)); } catch {} }
function hideBlock(key) {
  const b = BLOCKLIB[key];
  askConfirm('Hide block?', `"${b ? b.n : key}" will disappear from the library. You can always restore it at the bottom.`, 'Hide', ()=>{
    const h = loadHidden();
    if (!h.includes(key)) h.push(key);
    saveHidden(h);
    renderBlockPicker(document.getElementById('blockSearch').value);
  });
}
function restoreBlock(key) {
  saveHidden(loadHidden().filter(k=>k!==key));
  renderBlockPicker(document.getElementById('blockSearch').value);
}
function openBlockPicker() {
  document.getElementById('blockSearch').value = '';
  renderBlockPicker('');
  if (_openGroups === null) _openGroups = new Set(['Own']);
  document.getElementById('blockPicker').style.display = 'flex';
}
let _openGroups = null;
function renderBlockPicker(query) {
  const q = (query||'').toLowerCase().trim();
  const hidden = loadHidden();
  const grouped = new Set();
  BLOCK_GROUPS.forEach(g=>g.keys.forEach(k=>grouped.add(k)));
  const own = Object.keys(BLOCKLIB).filter(k=>k.startsWith('ux_'));
  const rest = Object.keys(BLOCKLIB).filter(k=>!grouped.has(k) && !k.startsWith('ux_'));
  const allGroups = [
    ...(own.length ? [{name:'Own', keys:own}] : []),
    ...BLOCK_GROUPS,
    ...(rest.length ? [{name:'Other', keys:rest}] : [])
  ];

  const html = allGroups.map(g=>{
    const items = g.keys
      .filter(k=>BLOCKLIB[k] && !hidden.includes(k))
      .filter(k=>{
        if (!q) return true;
        const b = BLOCKLIB[k];
        return (b.n + ' ' + (b.why||'')).toLowerCase().includes(q);
      })
      .map(k=>{
        const b = BLOCKLIB[k];
        const bm = b.bm ? `<span style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;color:var(--acid);border:1px solid color-mix(in srgb, var(--acid) 30%, transparent);border-radius:3px;padding:0 4px;margin-left:6px;vertical-align:middle;">BENCHMARK</span>` : '';
        const del = k.startsWith('ux_')
          ? `<div onclick="event.stopPropagation();deleteCustomBlock('${k}')" style="font-family:'DM Mono',monospace;font-size:13px;color:var(--danger);padding:6px 10px;margin-right:2px;">×</div>`
          : `<div onclick="event.stopPropagation();hideBlock('${k}')" style="font-family:'DM Mono',monospace;font-size:13px;color:var(--disabled);padding:6px 10px;margin-right:2px;">×</div>`;
        return `<div onclick="pickBlock('${k}')" style="display:flex;align-items:center;gap:8px;padding:12px 14px;background:var(--carbon);border-radius:8px;border-left:3px solid ${b.c};cursor:pointer;">
          <div style="flex:1;">
            <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;text-transform:uppercase;letter-spacing:.03em;color:${nameColor(b.c)};">${b.n}${bm}${yoursBadge(k)}</div>
            <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.08em;color:var(--disabled);margin-top:2px;">rpe ${b.rpe || '–'} · base ${b.t}'</div>
          </div>
          ${del}
          <div style="font-family:'DM Mono',monospace;font-size:12px;color:${nameColor(b.c)};">+</div>
        </div>`;
      }).join('');
    if (!items) return '';
    const open = q ? true : (_openGroups && _openGroups.has(g.name));
    const count = g.keys.filter(k=>BLOCKLIB[k] && !hidden.includes(k)).length;
    const accent = CAT_COLOR[g.name] || 'var(--disabled)';
    const head = `<div onclick="toggleBlockGroup('${g.name.replace(/'/g,"\\'")}')" style="display:flex;align-items:center;gap:9px;padding:12px 4px;margin-top:4px;cursor:pointer;border-bottom:1px solid var(--graphite);">
      <span style="width:8px;height:8px;border-radius:2px;background:${accent};flex-shrink:0;"></span>
      <span style="flex:1;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;letter-spacing:.05em;text-transform:uppercase;color:var(--chalk);">${g.name}</span>
      <span style="font-family:'DM Mono',monospace;font-size:9px;color:var(--disabled);">${count}</span>
      <span style="font-family:'DM Mono',monospace;font-size:11px;color:var(--disabled);">${open?'▾':'▸'}</span>
    </div>`;
    return head + (open ? `<div style="display:flex;flex-direction:column;gap:8px;padding:8px 0 2px;">${items}</div>` : '');
  }).join('');
  const newBtn = `<div onclick="openNewExercise()" style="display:flex;align-items:center;justify-content:center;padding:13px;border:1px dashed var(--graphite);border-radius:8px;cursor:pointer;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--acid);">+ new exercise</div>`;
  // terugzet-sectie voor verborgen blokken
  const hiddenList = hidden.filter(k=>BLOCKLIB[k]);
  const hiddenHTML = (!q && hiddenList.length)
    ? `<div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--disabled);margin:14px 0 2px;">hidden · tap to restore</div>` +
      hiddenList.map(k=>`<div onclick="restoreBlock('${k}')" style="display:flex;align-items:center;gap:10px;padding:9px 14px;background:none;border:1px dashed var(--graphite);border-radius:8px;cursor:pointer;">
        <div style="flex:1;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.03em;color:var(--disabled);">${BLOCKLIB[k].n}</div>
        <div style="font-family:'DM Mono',monospace;font-size:10px;color:var(--disabled);">↩</div>
      </div>`).join('')
    : '';
  document.getElementById('blockPickerList').innerHTML = newBtn + (html || `<div style="padding:20px;text-align:center;font-family:'Barlow',sans-serif;font-size:13px;color:var(--dust);">Nothing found for "${query}".</div>`) + hiddenHTML;
}
function toggleBlockGroup(name) {
  if (!_openGroups) _openGroups = new Set();
  if (_openGroups.has(name)) _openGroups.delete(name); else _openGroups.add(name);
  renderBlockPicker(document.getElementById('blockSearch') ? document.getElementById('blockSearch').value : '');
}
function closeBlockPicker() { document.getElementById('blockPicker').style.display = 'none'; }
function pickBlock(key) {
  if (sessionLocked) { showToast('Session is locked. Unlock it to add blocks.'); return; }
  ensureDraftMode();
  customKeys.push(key);
  sessionLocked = false;
  closeBlockPicker();
  buildSlab();
  // vanuit News/landing beland je anders onzichtbaar in een gewijzigde draft
  if (activeView() !== 'v-session') goTo('v-session');
}

// ── EIGEN OEFENINGEN ──
function loadCustomBlocks() { try { return JSON.parse(localStorage.getItem('crimpify_custom_blocks') || '{}'); } catch { return {}; } }
function saveCustomBlocks(o) { try { localStorage.setItem('crimpify_custom_blocks', JSON.stringify(o)); } catch {} }
function registerCustomBlocks() {
  const o = loadCustomBlocks();
  Object.keys(o).forEach(k => { BLOCKLIB[k] = o[k]; });
}
function linkLabel(url) {
  try {
    const h = new URL(url).hostname.replace('www.','');
    if (h.includes('instagram')) return 'Bekijk op Instagram';
    if (h.includes('youtube') || h.includes('youtu.be')) return 'Bekijk op YouTube';
    if (h.includes('kilterboard')) return 'Open in Kilter Board';
    if (h.includes('tiktok')) return 'Bekijk op TikTok';
    return 'Bekijk bron';
  } catch { return 'Bekijk bron'; }
}
function openNewExercise() {
  ['neName','neMin','neRpe','neWhy','neLink'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('neMin').value = '10';
  document.getElementById('newExerciseDialog').style.display = 'flex';
}
function closeNewExercise() { document.getElementById('newExerciseDialog').style.display = 'none'; }
function confirmNewExercise() {
  const name = (document.getElementById('neName').value || '').trim();
  if (!name) { document.getElementById('neName').focus(); return; }
  const t = Math.max(3, parseInt(document.getElementById('neMin').value) || 10);
  const rpe = (document.getElementById('neRpe').value || '').trim() || '–';
  const why = (document.getElementById('neWhy').value || '').trim() || 'Own exercise.';
  const url = (document.getElementById('neLink').value || '').trim();
  const key = 'ux_' + Date.now().toString(36);
  const block = { n: name, t, c: UX_COLOR, rpe, why, fixed: false };
  if (url) block.links = [{ label: linkLabel(url), url }];
  const store = loadCustomBlocks();
  store[key] = block;
  saveCustomBlocks(store);
  BLOCKLIB[key] = block;
  closeNewExercise();
  // direct toevoegen aan de huidige sessie
  pickBlock(key);
}

// ── DELEN VIA LINK (eerst opslaan, dan delen) ──
let sessionLocked = false;   // vastgelegd: structuur op slot, delen en starten mogelijk
let sessionOwned = true;     // false = ontvangen via deel-link (alleen kopie kan bewerkt)
let _pendingShare = false;   // delen gevraagd terwijl nog niet opgeslagen
function isCurrentFav() {
  const s = getSession(activeSessionId);
  const name = s ? s.name : '';
  return loadFavs().some(f => f.name === name);
}
function updateFavStar() {
  const locked = sessionLocked;
  const el = id => document.getElementById(id);
  // bewerken alleen op eigen sessies; kopie alleen op ontvangen sessies
  if (el('editBtn')) el('editBtn').style.display = (locked && sessionOwned) ? 'flex' : 'none';
  if (el('dupBtn')) el('dupBtn').style.display = (locked && !sessionOwned) ? 'flex' : 'none';
  if (el('favStarBtn')) {
    el('favStarBtn').style.display = locked ? 'flex' : 'none';
    const fav = isCurrentFav();
    el('favStarBtn').textContent = fav ? '★' : '☆';
    el('favStarBtn').style.color = fav ? 'var(--acid)' : 'var(--dust)';
  }
  if (el('shareBtn')) el('shareBtn').style.display = locked ? 'flex' : 'none';
  if (el('saveBigBtn')) el('saveBigBtn').style.display = locked ? 'none' : '';
  if (el('startBtn')) el('startBtn').style.display = locked ? '' : 'none';
}
function unlockEdit() {
  sessionLocked = false;
  buildSlab();
}
function duplicateSession() {
  if (customSession) customSession.name = chooseCopyTitle(customSession.name);
  sessionOwned = true;
  sessionLocked = false;
  if (customSession) customSession.intent = 'Your own take on a shared session. Adapt and lock it in.';
  buildSlab();
}
function toggleFavorite() {
  const s = getSession(activeSessionId);
  if (!s) return;
  let favs = loadFavs();
  if (favs.some(f => f.name === s.name)) {
    favs = favs.filter(f => f.name !== s.name);
  } else {
    const entry = { name: s.name, keys: currentBlocks.map(b=>b._key), color: s.color || 'lime', rpe: s.rpe || '–', intent: s.intent || '', time: getTFinite() };
    if (activeSessionId === 'custom' && customSession && customSession.basedOn) entry.basedOn = customSession.basedOn;
    favs.unshift(entry);
  }
  saveFavs(favs);
  buildRecent();
  updateFavStar();
  if (typeof syncChooseStars === 'function') syncChooseStars();  // Choose-sterren meebewegen
}
function encodeSession() {
  const s = getSession(activeSessionId);
  return encodePayload(s ? s.name : 'Session', currentBlocks.map(b=>b._key), getTFinite(), s ? s.color : 'lime');
}
function encodePayload(name, keys, time, color) {
  const payload = { n: name || 'Session', k: keys, t: time, c: color || 'lime' };
  // eigen oefeningen reizen mee in de link
  const own = keys.filter(k=>k.startsWith('ux_') && BLOCKLIB[k]);
  if (own.length) {
    payload.x = {};
    own.forEach(k=>{ const b = BLOCKLIB[k]; payload.x[k] = { n:b.n, t:b.t, rpe:b.rpe, why:b.why, links:b.links }; });
  }
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function decodeSession(hash) {
  try {
    const b64 = hash.replace(/-/g,'+').replace(/_/g,'/');
    return JSON.parse(decodeURIComponent(escape(atob(b64))));
  } catch { return null; }
}
function shareSession() {
  if (!currentBlocks.length) return;
  if (!sessionLocked) { openSaveFav(); return; }
  doShare();
}
function shareText(sessName, time) {
  let who = '';
  try { who = localStorage.getItem('crimpify_name') || ''; } catch {}
  const label = who ? who + "\u2019s \u201C" + sessName + "\u201D" : "\u201C" + sessName + "\u201D";
  return label + ' \u00B7 ' + (time || getTFinite()) + ' min boulder session \u2192 tap the link to train it';
}
function doShare() {
  const url = location.origin + location.pathname + '#s=' + encodeSession();
  const s = getSession(activeSessionId);
  const name = s ? s.name : 'Session';
  if (navigator.share) {
    navigator.share({ title: 'Crimpify: ' + name, text: shareText(name), url }).catch(()=>{ openShareDialog(url); });
  } else {
    openShareDialog(url);
  }
}
// toast: één element, korte bevestiging, verdwijnt vanzelf
let _toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}
function openShareDialog(url) {
  document.getElementById('shareLinkInput').value = url;
  document.getElementById('shareDialog').style.display = 'flex';
}
function closeShareDialog() { document.getElementById('shareDialog').style.display = 'none'; }
function copyShareLink() {
  const inp = document.getElementById('shareLinkInput');
  inp.select();
  try { navigator.clipboard.writeText(inp.value); } catch { document.execCommand('copy'); }
  const btn = document.getElementById('copyLinkBtn');
  btn.textContent = 'Copied ✓';
  setTimeout(()=>{ btn.textContent = 'Kopieer link'; }, 1800);
}
function importFromHash() {
  const m = location.hash.match(/#s=(.+)/);
  if (!m) return false;
  const p = decodeSession(m[1]);
  history.replaceState(null, '', location.pathname);
  if (!p || !Array.isArray(p.k) || !p.k.length) return false;
  // meegereisde eigen oefeningen registreren en lokaal bewaren
  if (p.x) {
    const store = loadCustomBlocks();
    Object.keys(p.x).forEach(k=>{
      const d = p.x[k];
      const block = { n:d.n||'Exercise', t:d.t||10, c: UX_COLOR, rpe:d.rpe||'–', why:d.why||'', fixed:false };
      if (d.links) block.links = d.links;
      BLOCKLIB[k] = block;
      store[k] = block;
    });
    saveCustomBlocks(store);
  }
  const validKeys = p.k.filter(k=>BLOCKLIB[k]);
  if (!validKeys.length) return false;
  customSession = { id:'custom', cat:'shared', name: (p.n||'Shared session'), desc:'', color: p.c||'lime', rpe:'–', intent:'Shared session · locked by its maker. Want something different? Make your own copy (⧉).' };
  customKeys = validKeys;
  activeSessionId = 'custom';
  sessionLocked = true;
  sessionOwned = false;
  const ti = timeValues.indexOf(p.t);
  if (ti >= 0) { activeTimeIdx = ti; }
  buildSlab();
  goTo('v-session');
  return true;
}

// ── LOCK-IN DIALOG ──
function openSaveFav() {
  if (!currentBlocks.length) return;
  const s = getSession(activeSessionId);
  document.getElementById('favNameInput').value = s && s.name !== 'My session' ? s.name : '';
  document.getElementById('saveFavDialog').style.display = 'flex';
}
function closeSaveFav() { document.getElementById('saveFavDialog').style.display = 'none'; _pendingShare = false; document.getElementById('favDialogHint').style.display = 'none'; }
function confirmSaveFav() {
  // vastleggen: naam + slot. Favoriet is een aparte, latere keuze (☆).
  const name = (document.getElementById('favNameInput').value || '').trim() || (getSession(activeSessionId) ? getSession(activeSessionId).name : 'My session');
  if (customSession && activeSessionId === 'custom') { customSession.name = name; }
  sessionLocked = true;
  closeSaveFav();
  buildSlab();
  updateFavStar();
  if (_pendingShare) { _pendingShare = false; doShare(); }
}

function buildCategories() {
  const el = document.getElementById('categorySections');
  const tilesHTML = sessions.map(s=>{
      const col = C[s.color];
      const blocks = getBlocks(s.id);
      const total = blocks.reduce((sum,b)=>sum+b.t,0);
      // core block = biggest non-warmup block, show the variant of the day
      const core = blocks.filter(b=>b._slot>0).sort((a,b)=>b.t-a.t)[0];
      const isActive = s.id===activeSessionId;
      return `<div class="tile ${isActive?'active':''}"
        style="background:${col.bg};border-color:${isActive?col.color:col.border};--tile-color:${col.color};"
        onclick="selectSession('${s.id}')">
        <div class="tile-accent" style="background:${col.color};${isActive?'':'opacity:.5;'}"></div>
        <div class="tile-body">
          <div class="tile-cat" style="color:${col.color};">${s.cat}</div>
          <div class="tile-name" style="color:${col.text};">${s.name}</div>
          <div class="tile-desc" style="color:${col.text};">today:<br>${core ? core.n.toLowerCase() : s.desc}</div>
          <div class="tile-foot">
            <div class="tile-rpe" style="color:${col.color};">rpe ${s.rpe}</div>
            <div class="tile-dur-ghost" style="color:${col.color};">${total}'</div>
          </div>
        </div>
      </div>`;
    }).join('');
  el.innerHTML = `<div><div class="section-head"><div class="section-title">Energy system</div><div class="section-more">⟳ varies per day</div></div><div class="tiles-grid">${tilesHTML}</div></div>`;
}

function renderPreview() {
  const s = getSession(activeSessionId);
  if (!s) return;
  const col = C[s.color];
  const blocks = getBlocks(s.id);
  const total = blocks.reduce((sum,b)=>sum+b.t,0);
  const tape = blocks.map(b=>`<div class="ap-seg" style="width:${(b.t/total*100).toFixed(1)}%;background:${b.c};opacity:.8;"></div>`).join('');
  const rows = blocks.map(b=>`<div class="ap-row"><div class="ap-dot" style="background:${b.c};"></div><div class="ap-name" style="color:${b.c};opacity:.8;">${b.n}</div><div class="ap-t">${b.t}'</div></div>`).join('');
  document.getElementById('activePreview').innerHTML = `
    <div class="ap-tape" style="background:var(--carbon);">${tape}</div>
    <div class="ap-body"><div class="ap-head"><div class="ap-title" style="color:${col.text};">${s.name}</div><div class="ap-meta">rpe ${s.rpe} · ${total}'</div></div><div class="ap-rows">${rows}</div></div>`;
  document.getElementById('footerSub').textContent = `${s.name.toLowerCase()} · ${total}'`;
}

let recentFolded = false;
function selectSession(id) {
  activeSessionId = id;
  sessionLocked = false;
  sessionOwned = true;
  // recent-rij inklappen zodra een systeem gekozen is
  if (!recentFolded) { recentFolded = true; applyRecentFold(); }
  buildRecent();
  buildCategories();
  renderPreview();
}
function toggleRecent() {
  recentFolded = !recentFolded;
  applyRecentFold();
}
function applyRecentFold() {
  const row = document.getElementById('recentRow');
  const chev = document.getElementById('recentChevron');
  const more = document.getElementById('recentMore');
  if (recentFolded) {
    row.style.display = 'none';
    if (chev) chev.textContent = '▸';
    if (more) more.textContent = 'show';
  } else {
    row.style.display = '';
    if (chev) chev.textContent = '▾';
    if (more) more.textContent = '';
  }
}

// tape-tooltip: welk blok en welke trainingscategorie zit achter deze kleur
function blockGroupName(key) {
  if (key && key.startsWith('ux_')) return 'Own';
  for (const g of BLOCK_GROUPS) { if (g.keys.includes(key)) return g.name; }
  return 'Other';
}
function tapeInfo(i) {
  const b = currentBlocks[i];
  if (!b) return;
  const tip = document.getElementById('tapeTip');
  document.getElementById('tapeTipDot').style.background = b.c;
  document.getElementById('tapeTipName').textContent = b.n;
  document.getElementById('tapeTipMeta').textContent = `${b.t}' · ${blockGroupName(b._key).toLowerCase()}`;
  tip.style.display = 'flex';
}
function tapeInfoHide() {
  const tip = document.getElementById('tapeTip');
  if (tip) tip.style.display = 'none';
}

// ── VIEW 2: SLAB ──
function nameColor(c) {
  // dim tinten (graphite/eigen blokken, legacy grijzen) zijn onleesbaar als tekst → naar dust
  const dim = ['var(--graphite)','#3A3A38','#2A2A28','#2A2A2A'];
  if (!c || dim.includes(String(c))) return 'var(--dust)';
  return c;
}

function buildSlab() {
  const s = getSession(activeSessionId);
  const col = C[s.color] || C.lime;
  currentBlocks = getBlocks(s.id);
  const total = currentBlocks.reduce((sum,b)=>sum+b.t,0);
  const isCustom = s.id === 'custom';

  document.getElementById('slabTitle').textContent = s.name;
  document.getElementById('slabTitle').style.color = col.text;
  document.getElementById('slabMeta').textContent = `do · rpe ${s.rpe} · ${total} min`;
  document.getElementById('slabMeta').style.color = col.color;
  document.getElementById('slabMeta').style.opacity = '.5';
  document.getElementById('slabFooterMeta').innerHTML = `${(s.cat||'own').toLowerCase()}<br><b>${total} min</b>`;
  document.getElementById('slabIntent').textContent = s.intent || '';

  // attributie op kopieën uit de catalogus; originelen en eigen sessies tonen niets
  const bo = document.getElementById('slabBasedOn');
  if (bo) {
    if (s.basedOn) { bo.style.display = ''; bo.textContent = 'BASED ON ' + s.basedOn.title + ' by ' + s.basedOn.coach; }
    else bo.style.display = 'none';
  }

  // varieer alleen voor gegenereerde, niet-vastgelegde sessies
  const rerollBtn = document.querySelector('button[onclick="rerollSession(activeSessionId)"]');
  if (rerollBtn) rerollBtn.style.display = (isCustom || sessionLocked) ? 'none' : '';
  if (sessionLocked) slabEditMode = false;

  // tape
  document.getElementById('slabTape').innerHTML = total > 0 ? currentBlocks.map((b,i)=>
    `<div class="slab-seg" style="width:${(b.t/total*100).toFixed(1)}%;background:${b.c};opacity:.75;"
      ontouchstart="tapeInfo(${i})" ontouchend="tapeInfoHide()" ontouchcancel="tapeInfoHide()"
      onmouseenter="tapeInfo(${i})" onmouseleave="tapeInfoHide()"></div>`).join('') : '';

  // blocks + acties
  const blocksHTML = currentBlocks.map((b,i)=>{
    if (slabEditMode) {
      return `<div class="slab-block slab-real" data-idx="${i}" style="background:color-mix(in srgb, ${b.c} 9%, transparent);">
        <div class="slab-accent" style="background:${nameColor(b.c)};"></div>
        <div class="slab-drag-handle" ontouchstart="handleDragStart(event,this)" ontouchmove="slabPressMove(event)" ontouchend="slabPressEnd()" onmousedown="handleDragStart(event,this)" style="z-index:3;">≡</div>
        <div class="slab-block-name" style="color:${nameColor(b.c)};">${b.n}${yoursBadge(b._key)}</div>
        <button onclick="removeBlock(${i})" class="edit-mini" style="color:var(--danger);border-color:color-mix(in srgb, var(--danger) 27%, transparent);z-index:3;flex-shrink:0;">×</button>
      </div>`;
    }
    const dragAttrs = sessionLocked ? '' : `ontouchstart="slabPressStart(event,this)" ontouchmove="slabPressMove(event)" ontouchend="slabPressEnd()" onmousedown="slabPressStart(event,this)"`;
    return `<div class="slab-block slab-real" data-idx="${i}" style="background:color-mix(in srgb, ${b.c} 9%, transparent);" onclick="slabBlockTap(${i})" ${dragAttrs}>
      <div class="slab-accent" style="background:${nameColor(b.c)};"></div>
      <div class="slab-block-name" style="color:${nameColor(b.c)};">${b.n}${yoursBadge(b._key)}</div>
      <div class="slab-ghost" style="color:${nameColor(b.c)};">${b.t}<span class="gu">'</span></div>
    </div>`;
  }).join('');
  const emptyHint = currentBlocks.length === 0
    ? `<div style="padding:26px 20px;text-align:center;font-family:'Barlow',sans-serif;font-size:13px;color:var(--dust);">Empty. Add your first block.</div>` : '';
  const addRow = `
    <div class="slab-block" style="background:none;border:1px dashed var(--graphite);min-height:54px;justify-content:center;" onclick="openBlockPicker()">
      <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--dust);">+ add block</div>
    </div>
    <div class="slab-block" style="background:none;min-height:44px;justify-content:center;" onclick="toggleSlabEdit()">
      <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${slabEditMode?'var(--acid)':'var(--disabled)'};">${slabEditMode?'✓ done editing':'✎ edit'}</div>
    </div>`;
  const lockedRow = sessionLocked ? `
    <div class="slab-block" style="background:none;min-height:40px;justify-content:center;pointer-events:none;">
      <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:var(--disabled);">${sessionOwned ? 'locked · ✎ to edit' : 'shared session · ⧉ for your own copy'}</div>
    </div>` : '';
  document.getElementById('slabBlocks').innerHTML = blocksHTML + emptyHint + (sessionLocked ? lockedRow : addRow);

  updateSlabProgress(0);
  if (typeof updateFavStar === 'function') updateFavStar();
  if (isCustom) saveDraft();
}

// ── EDIT & DRAG (Spotify-stijl herordenen) ──
let slabEditMode = false;
let _pressTimer = null;
let _dragging = false, _dragEl = null, _pressY = 0, _justDragged = false;

function slabBlockTap(i) {
  if (_justDragged) { _justDragged = false; return; }
  openBlock(i);
}
function slabPressStart(ev, el) {
  clearTimeout(_pressTimer);
  const t = ev.touches ? ev.touches[0] : ev;
  _pressY = t.clientY;
  _pressTimer = setTimeout(()=>{ beginDrag(el); }, 420);
}
function handleDragStart(ev, handle) {
  // drag-handle in bewerkmodus: direct slepen, geen long-press
  ev.preventDefault();
  const t = ev.touches ? ev.touches[0] : ev;
  _pressY = t.clientY;
  beginDrag(handle.closest('.slab-real'));
}
function beginDrag(el) {
  if (!el || sessionLocked) return;
  ensureDraftMode();
  _dragging = true; _dragEl = el;
  el.classList.add('drag-lift');
  if (navigator.vibrate) navigator.vibrate(25);
}
function slabPressMove(ev) {
  const t = ev.touches ? ev.touches[0] : ev;
  if (!_dragging) {
    // beweging voor de long-press afgaat = scrollen → annuleer
    if (Math.abs(t.clientY - _pressY) > 10) clearTimeout(_pressTimer);
    return;
  }
  ev.preventDefault();
  const y = t.clientY;
  const container = document.getElementById('slabBlocks');
  const sibs = [...container.querySelectorAll('.slab-real')].filter(b => b !== _dragEl);
  for (const b of sibs) {
    const r = b.getBoundingClientRect();
    if (y > r.top && y < r.bottom) {
      const before = y < r.top + r.height / 2;
      const target = before ? b : b.nextSibling;
      if (target !== _dragEl && target !== _dragEl.nextSibling) {
        container.insertBefore(_dragEl, target);
      }
      break;
    }
  }
}
function slabPressEnd() {
  clearTimeout(_pressTimer);
  if (_dragging) endDrag();
}
function endDrag() {
  _dragging = false;
  _justDragged = true;
  setTimeout(()=>{ _justDragged = false; }, 350);
  if (_dragEl) _dragEl.classList.remove('drag-lift');
  // nieuwe volgorde uit de DOM lezen en terugschrijven
  const order = [...document.querySelectorAll('#slabBlocks .slab-real')].map(el => parseInt(el.dataset.idx));
  const newKeys = order.map(i => customKeys[i]);
  const ov = durationOverride['custom'] || {};
  const nov = {};
  order.forEach((oldI, newI) => { if (ov[oldI] != null) nov[newI] = ov[oldI]; });
  customKeys = newKeys;
  durationOverride['custom'] = nov;
  _dragEl = null;
  sessionLocked = false; updateFavStar();
  buildSlab();
}
// muis-ondersteuning voor desktop preview
window.addEventListener('mousemove', (e)=>{ if (_pressTimer || _dragging) slabPressMove(e); });
window.addEventListener('mouseup', ()=>{ slabPressEnd(); });

function toggleSlabEdit() { if (sessionLocked) return; slabEditMode = !slabEditMode; buildSlab(); }

// generieke bevestiging (hergebruikt de exit-dialoog)
function askConfirm(title, msg, btnLabel, fn) {
  _pendingExit = fn;
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent = msg;
  const dlg = document.getElementById('confirmExit');
  const leaveBtn = dlg.querySelector('button[onclick="confirmLeave()"]');
  if (leaveBtn) leaveBtn.textContent = btnLabel;
  dlg.style.display = 'flex';
}
function removeFav(i) {
  const favs = loadFavs();
  const f = favs[i];
  if (!f) return;
  askConfirm('Remove favourite?', `"${f.name}" will be taken off your list.`, 'Remove', ()=>{
    favs.splice(i,1); saveFavs(favs); buildRecent();
  });
}
function deleteCustomBlock(key) {
  const b = BLOCKLIB[key];
  askConfirm('Delete exercise?', `"${b ? b.n : 'Exercise'}" will disappear from your library.`, 'Delete', ()=>{
    delete BLOCKLIB[key];
    const store = loadCustomBlocks();
    delete store[key];
    saveCustomBlocks(store);
    renderBlockPicker(document.getElementById('blockSearch').value);
  });
}
function removeBlock(i) {
  ensureDraftMode();
  customKeys.splice(i, 1);
  const ov = durationOverride['custom'] || {};
  const next = {};
  Object.keys(ov).forEach(k=>{
    const idx = parseInt(k);
    if (idx === i) return;
    next[idx > i ? idx-1 : idx] = ov[k];
  });
  durationOverride['custom'] = next;
  sessionLocked = false; updateFavStar();
  buildSlab();
}

function updateSlabProgress(idx) {
  const pct = currentBlocks.length ? (idx / currentBlocks.length * 100) : 0;
  document.getElementById('slabProgressFill').style.width = pct + '%';
  // dim completed blocks (alleen echte blokken, niet de actie-rijen)
  document.querySelectorAll('#slabBlocks .slab-block').forEach((el,i)=>{
    el.style.opacity = (i < idx && i < currentBlocks.length) ? '.3' : '1';
  });
}

// ── VIEW 3: DETAIL ──
function toggleNextInfo() {
  const el = document.getElementById('nextInfo');
  const arr = document.getElementById('nextArr');
  if (!el) return;
  const open = el.style.display === 'block';
  el.style.display = open ? 'none' : 'block';
  if (arr) arr.textContent = open ? '▾' : '▴';
}

function buildDetail(idx) {
  const b = currentBlocks[idx];
  const s = getSession(activeSessionId);
  const col = C[s.color];
  const isLast = idx === currentBlocks.length - 1;

  // header
  document.getElementById('detailBlockNum').textContent = `${idx+1} / ${currentBlocks.length}`;
  document.getElementById('detailName').textContent = b.n;
  document.getElementById('detailName').style.color = b.c;
  document.getElementById('detailCat').textContent = (b.rpe && b.rpe !== '-' && b.rpe !== '–') ? `rpe ${b.rpe}` : 'geen intensiteit';
  document.getElementById('detailCat').style.color = b.c;

  // timer — volledige reset bij openen blok
  clearInterval(timerInterval);
  timerRunning = false;
  timerTotal = b.t * 60;
  timerSeconds = timerTotal;
  updateTimerDisplay();
  document.getElementById('timerRingFill').style.stroke = b.c;
  document.getElementById('timerLabel').textContent = `${b.t} min`;
  document.getElementById('timerStartBtn').textContent = 'Start';
  timerElapsed = 0;
  // Reset pas beschikbaar nadat er gestart is
  const rb = document.getElementById('timerResetBtn');
  rb.disabled = true; rb.style.opacity = '.4';
  const fb = document.getElementById('timerFinishBtn');
  if (fb) fb.style.display = 'none';

  // footer
  document.getElementById('detailFooter').innerHTML = `block ${idx+1} of ${currentBlocks.length}<br><b style="color:${b.c};">${b.t} min</b>`;

  // info
  let info = `<div class="detail-section-lbl">why this block</div>
    <div class="detail-card"><p>${b.why}</p></div>`;

  // drills — Warm-up = 1 drill van de dag; Skill Focus drill blocks = 3.
  if (b.drills) {
    const drillCard = d => `
      <div class="detail-card" style="margin-bottom:8px;">
        <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px;">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:${b.c};">${d.n}</div>
          <div style="font-family:'DM Mono',monospace;font-size:7px;letter-spacing:.1em;text-transform:uppercase;color:var(--disabled);">${d.tag}${''}</div>
        </div>
        <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--disabled);margin:2px 0;">setup</div>
        <p style="margin-bottom:6px;">${d.setup}</p>
        <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--disabled);margin:2px 0;">execution</div>
        <p style="margin-bottom:6px;">${d.do}</p>
        <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:${b.c};opacity:.6;margin:2px 0;">goal</div>
        <p style="color:${b.c};opacity:.75;">${d.goal}</p>
      </div>`;
    const seed = new Date().getDate() + new Date().getMonth()*31 + (variantOffset[activeSessionId]||0);
    // pool zonder meta-drill
    const pool = DRILLS.filter(d=>d.cat !== 'meta');
    // pick N drills, gespreid over categorieën, deterministisch op seed
    const pickSpread = (n) => {
      const cats = [...new Set(pool.map(d=>d.cat))];
      const out = [];
      const usedCats = new Set();
      // ronde 1: één per categorie tot n bereikt, categorieën in seed-volgorde
      const catOrder = cats.slice().sort((a,b)=> ((seed+a.charCodeAt(0))%7) - ((seed+b.charCodeAt(0))%7));
      for (const c of catOrder) {
        if (out.length >= n) break;
        const inCat = pool.filter(d=>d.cat===c);
        const pick = inCat[(seed + c.charCodeAt(0)) % inCat.length];
        if (!out.includes(pick)) { out.push(pick); usedCats.add(c); }
      }
      // aanvullen als nodig
      let k = 0;
      while (out.length < n && k < pool.length*2) {
        const cand = pool[(seed + k*5) % pool.length];
        if (!out.includes(cand)) out.push(cand);
        k++;
      }
      return out.slice(0,n);
    };
    if (b._key === 'drillBlocks') {
      const picks = pickSpread(3);
      info += `<div class="detail-section-lbl">3 skills · spread across categories</div>` + picks.map(drillCard).join('');
    } else if (b._key === 'drillsOnly') {
      const picks = pickSpread(2);
      info += `<div class="detail-section-lbl">2 skills · picked for you (${DRILLS.length} in the library)</div>` + picks.map(drillCard).join('');
    } else {
      // Warm-up / skill licht: 1 drill van de dag (Charlie's regel)
      const d = pool[seed % pool.length];
      info += `<div class="detail-section-lbl">skill of the day — one pillar per session</div>` + drillCard(d);
    }
  }

  // external links (e.g. Grip Gains)
  if (b.links) {
    info += `<div class="detail-section-lbl">protocol</div>` + b.links.map(l =>
      `<a href="${l.url}" target="_blank" style="display:flex;align-items:center;justify-content:space-between;background:var(--carbon);border:1px solid color-mix(in srgb, var(--acid) 25%, transparent);border-radius:8px;padding:13px 14px;text-decoration:none;margin-bottom:8px;">
        <span style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--acid);">${l.label}</span>
        <span style="color:color-mix(in srgb, var(--acid) 55%, transparent);font-size:14px;">↗</span>
      </a>`).join('');
  }

  if (b.sets) {
    const setDots = Array.from({length:b.sets},(_,i)=>
      `<div class="set-dot" onclick="this.classList.toggle('done')" style="--c:${b.c};">${i+1}</div>`).join('');
    info += `<div class="detail-section-lbl">sets</div>
      <div class="detail-stat-row">
        <div class="detail-stat"><div class="detail-stat-val" style="color:${b.c};">${b.sets}</div><div class="detail-stat-lbl">sets</div></div>
        ${b.rest ? `<div class="detail-stat"><div class="detail-stat-val" style="color:${b.c};">${b.rest}'</div><div class="detail-stat-lbl">rest</div></div>` : ''}
        ${b.rpe !== '–' ? `<div class="detail-stat"><div class="detail-stat-val" style="color:${b.c};">${b.rpe}</div><div class="detail-stat-lbl">rpe</div></div>` : ''}
      </div>
      <div class="detail-section-lbl">log sets</div>
      <div class="sets-row">${setDots}</div>`;
  }

  if (!isLast) {
    const next = currentBlocks[idx+1];
    const nextWhy = (next.why || '').length > 140 ? next.why.slice(0,140).trim() + '…' : (next.why || '');
    info += `<div class="detail-section-lbl">next block</div>
      <div class="next-block" onclick="toggleNextInfo()">
        <div class="next-dot" style="background:${next.c};"></div>
        <div class="next-name" style="color:${next.c};">${next.n}</div>
        <div style="font-family:'DM Mono',monospace;font-size:9px;color:var(--disabled);margin-right:8px;">${next.t}'</div>
        <div class="next-arr" id="nextArr">▾</div>
      </div>
      <div id="nextInfo" style="display:none;padding:11px 14px;margin-top:6px;background:var(--carbon);border:1px solid var(--graphite);border-radius:8px;font-family:'Barlow',sans-serif;font-size:13px;line-height:1.55;color:var(--dust);">${nextWhy}</div>`;
  }

  // principle of the day
  const pIdx = (new Date().getDate() + idx) % PRINCIPLES.length;
  info += `<div class="detail-section-lbl">principle</div>
    <div class="detail-card" style="border-color:color-mix(in srgb, var(--acid) 12%, transparent);">
      <p style="color:color-mix(in srgb, var(--acid) 55%, transparent);">${PRINCIPLES[pIdx]}</p>
    </div>`;

  document.getElementById('detailInfo').innerHTML = info;
}

// ── TIMER ──
function toggleTimer() {
  if (timerRunning) {
    pauseTimer();
  } else {
    runTimer();
  }
}

function runTimer() {
  timerRunning = true;
  document.getElementById('timerStartBtn').textContent = 'Pauzeer';
  document.getElementById('timerLabel').textContent = 'running';
  // Reset + Finish beschikbaar zodra je gestart bent
  const rb = document.getElementById('timerResetBtn');
  if (rb) { rb.disabled = false; rb.style.opacity = '1'; }
  const fb = document.getElementById('timerFinishBtn');
  if (fb) fb.style.display = '';
  clearInterval(timerInterval);
  timerInterval = setInterval(()=>{
    timerSeconds--;
    timerElapsed++;
    updateTimerDisplay();
  }, 1000);
}

function finishBlock() {
  // log werkelijke tijd, ga naar volgende blok
  clearInterval(timerInterval);
  timerRunning = false;
  const b = currentBlocks[currentBlockIdx];
  if (b) sessionLog[currentBlockIdx] = { name: b.n, planned: b.t*60, spent: blockClockElapsed(), color: b.c };
  nextBlock();
}

function pauseTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  document.getElementById('timerStartBtn').textContent = 'Resume';
  document.getElementById('timerLabel').textContent = 'paused';
}

function stopTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
}

function resetTimerConfirm() {
  const rb = document.getElementById('timerResetBtn');
  if (rb && rb.disabled) return;
  _pendingExit = () => resetTimer();
  document.getElementById('confirmTitle').textContent = 'Timer resetten?';
  document.getElementById('confirmMsg').textContent = 'The clock jumps back to the start of this block.';
  // hergebruik dezelfde dialoog, maar met reset-actie
  const dlg = document.getElementById('confirmExit');
  dlg.style.display = 'flex';
  // knoplabels tijdelijk passend
  dlg.querySelector('button[onclick="confirmLeave()"]').textContent = 'Reset';
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  const b = currentBlocks[currentBlockIdx];
  if (b) { timerTotal = b.t*60; timerSeconds = timerTotal; }
  const btn = document.getElementById('timerStartBtn');
  if (btn) btn.textContent = 'Start';
  const lbl = document.getElementById('timerLabel');
  if (lbl && b) lbl.textContent = `${b.t} min`;
  const ring = document.getElementById('timerRingFill');
  if (ring && b) ring.style.stroke = b.c;
  // Reset weer uitzetten tot opnieuw gestart
  const rb = document.getElementById('timerResetBtn');
  if (rb) { rb.disabled = true; rb.style.opacity = '.4'; }
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const disp = document.getElementById('timerDisplay');
  const ring = document.getElementById('timerRingFill');
  const lbl = document.getElementById('timerLabel');
  if (timerSeconds >= 0) {
    const m = Math.floor(timerSeconds/60);
    const sec = timerSeconds % 60;
    if (disp) { disp.textContent = `${m}:${sec.toString().padStart(2,'0')}`; disp.style.color = 'var(--chalk)'; }
    const circumference = 377;
    const progress = timerTotal > 0 ? timerSeconds / timerTotal : 1;
    if (ring) { ring.style.strokeDashoffset = circumference * (1 - progress); ring.style.stroke = currentBlocks[currentBlockIdx]?.c || 'var(--prepare)'; }
  } else {
    // overtijd: tel omhoog met + prefix, kleur amber/geel
    const over = -timerSeconds;
    const m = Math.floor(over/60);
    const sec = over % 60;
    if (disp) { disp.textContent = `+${m}:${sec.toString().padStart(2,'0')}`; disp.style.color = 'var(--dust)'; }
    if (ring) { ring.style.strokeDashoffset = 0; ring.style.stroke = 'var(--dust)'; }
    if (lbl && timerRunning) lbl.textContent = 'over time · finish?';
  }
}

// ── TIJD-CHIPS (compacte rij: slepen scrollt, tik kiest en klapt de rij dicht) ──
const track = document.getElementById('timeTrack');
let tDrag=false,tMoved=false,tSX,tSS;
track.addEventListener('mousedown',e=>{tDrag=true;tMoved=false;tSX=e.clientX;tSS=track.scrollLeft;});
document.addEventListener('mousemove',e=>{if(!tDrag)return;if(Math.abs(e.clientX-tSX)>4)tMoved=true;track.scrollLeft=tSS-(e.clientX-tSX);});
document.addEventListener('mouseup',()=>{tDrag=false;});
track.addEventListener('touchstart',e=>{tMoved=false;tSX=e.touches[0].clientX;},{passive:true});
track.addEventListener('touchmove',e=>{if(Math.abs(e.touches[0].clientX-tSX)>4)tMoved=true;},{passive:true});

function setTimeIdx(idx){
  activeTimeIdx=idx;
  [...track.querySelectorAll('.time-item')].forEach((item,i)=>item.classList.toggle('active',i===idx));
  const item=track.querySelectorAll('.time-item')[idx];
  if(item) track.scrollTo({left:item.offsetLeft-track.offsetWidth/2+item.offsetWidth/2,behavior:'smooth'});
  const sum=document.getElementById('timeSummary');
  if(sum) sum.textContent = timeLabel();
  buildCategories(); renderPreview();
  renderTodaysPick();  // de pick loopt live mee met de tijdkeuze
}
function setTimePickerOpen(open){
  const w=document.getElementById('timeTrackWrap');
  w.style.display = open ? 'block' : 'none';
  const chev=document.getElementById('timeChev');
  if(chev) chev.textContent = open ? '▴' : '▾';
  if(open){ const item=track.querySelectorAll('.time-item')[activeTimeIdx]; if(item) track.scrollTo({left:item.offsetLeft-track.offsetWidth/2+item.offsetWidth/2}); }
}
function toggleTimePicker(){
  setTimePickerOpen(document.getElementById('timeTrackWrap').style.display==='none');
}
[...track.querySelectorAll('.time-item')].forEach((item,i)=>item.addEventListener('click',()=>{ if(tMoved) return; setTimeIdx(i); setTimePickerOpen(false); }));

// ── SEARCH ──
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const mainContent = document.getElementById('mainContent');

searchInput.addEventListener('input',()=>{
  const q=searchInput.value.toLowerCase().trim();
  if(!q){searchResults.classList.remove('visible');mainContent.classList.remove('hidden');return;}
  mainContent.classList.add('hidden');searchResults.classList.add('visible');
  const matches=sessions.filter(s=>s.name.toLowerCase().includes(q)||s.cat.toLowerCase().includes(q)||s.tags.some(t=>t.includes(q)));
  if(!matches.length){searchResults.innerHTML=`<div style="font-family:'DM Mono',monospace;font-size:9px;color:var(--disabled);padding:12px 0;letter-spacing:.1em;">geen resultaten</div>`;return;}
  searchResults.innerHTML=matches.map(s=>{
    const col=C[s.color];
    const blocks=getBlocks(s.id);
    const total=blocks.reduce((sum,b)=>sum+b.t,0);
    return `<div class="sr-item" onclick="selectSession('${s.id}');searchInput.value='';searchResults.classList.remove('visible');mainContent.classList.remove('hidden');">
      <div class="sr-dot" style="background:${col.color};"></div>
      <div class="sr-info"><div class="sr-name" style="color:${col.text};">${s.name}</div><div class="sr-sub">${s.cat} · rpe ${s.rpe}</div></div>
      <div class="sr-dur">${total}'</div>
    </div>`;
  }).join('');
});
document.addEventListener('click',e=>{
  if(!e.target.closest('.search-wrap')&&!e.target.closest('.search-results')){
    if(searchResults.classList.contains('visible')){searchResults.classList.remove('visible');mainContent.classList.remove('hidden');searchInput.value='';}
  }
});



// ── begroeting: naam lokaal, geen account. Eén regel met rechts de tijd (context, geen formulier) ──
function timeLabel() {
  const v = timeValues[activeTimeIdx];
  return isFinite(v) ? v + ' MIN' : '∞ NO LIMIT';
}
function renderGreeting() {
  const el = document.getElementById('greetEl');
  if (!el) return;
  let name = '';
  try { name = localStorage.getItem('crimpify_name') || ''; } catch {}
  el.innerHTML = '';
  const line = document.createElement('div');
  line.style.cssText = 'display:flex;align-items:baseline;justify-content:space-between;gap:10px;';
  const h = document.createElement('div');
  h.style.cssText = "font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:24px;color:var(--chalk);letter-spacing:.01em;line-height:1.1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
  const timeBtn = document.createElement('div');
  timeBtn.onclick = toggleTimePicker;
  timeBtn.style.cssText = 'display:flex;align-items:center;gap:6px;cursor:pointer;flex-shrink:0;';
  timeBtn.innerHTML = `<span id="timeSummary" style="color:var(--acid);font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.06em;">${timeLabel()}</span><span id="timeChev" style="font-size:11px;opacity:.5;color:var(--dust);">▾</span>`;
  line.appendChild(h); line.appendChild(timeBtn);
  el.appendChild(line);
  if (name) {
    h.textContent = 'Welcome back, ' + name;
  } else {
    h.textContent = 'Welcome to Crimpify';
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;margin-top:10px;';
    const inp = document.createElement('input');
    inp.type = 'text'; inp.placeholder = 'What should we call you?'; inp.maxLength = 24;
    inp.style.cssText = "flex:1;min-width:0;padding:11px 13px;border-radius:10px;border:1px solid var(--graphite);background:var(--ink);color:var(--chalk);font-family:'Barlow',sans-serif;font-size:14px;outline:none;";
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.style.cssText = "padding:11px 18px;border-radius:10px;border:none;background:var(--acid);color:var(--acid-text);font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:14px;cursor:pointer;";
    btn.onclick = () => { const v = inp.value.trim(); if (!v) return; try { localStorage.setItem('crimpify_name', v); } catch {} renderGreeting(); };
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') btn.onclick(); });
    row.appendChild(inp); row.appendChild(btn);
    el.appendChild(row);
    const hint = document.createElement('div');
    hint.textContent = 'stays on this device only · no account needed';
    hint.style.cssText = "font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.08em;color:var(--disabled);margin-top:7px;";
    el.appendChild(hint);
  }
}
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch {}

// ── echte datum + eerlijke weekteller ──
const NL_DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const NL_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function nlDate(d) { return NL_DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + NL_MONTHS[d.getMonth()]; }
function renderDates() {
  const now = new Date();
  const el = id => document.getElementById(id);
  if (el('footerDate')) el('footerDate').textContent = nlDate(now);
  if (el('slabWeek')) el('slabWeek').textContent = nlDate(now);
}
function renderStreakLine() {
  const h = loadHistory();
  const now = Date.now();
  const week = h.filter(e => now - e.ts < 7*86400000).length;
  const streakEl = document.getElementById('streakEl');
  const phaseEl = document.getElementById('phaseLine');
  if (streakEl) streakEl.innerHTML = week > 0 ? `this week <b>${week} session${week===1?'':'s'}</b>` : '';
  if (phaseEl) {
    if (h.length === 0) { phaseEl.innerHTML = ''; }
    else { phaseEl.innerHTML = `${h.length} session${h.length===1?'':'s'} logged · <b>last ${agoLabel(h[0].ts)}</b>`; }
  }
}

// ── INIT ──
['maxHangs','nohangs','fourByFour','hehe','campus','lockoffs'].forEach(k=>{ if (BLOCKLIB[k]) BLOCKLIB[k].bm = true; });
registerCustomBlocks();
applyCategoryColors();
rebuildRecent(); renderSignalCal(); renderTodaysPick(); renderContinue(); buildRecent(); buildCategories(); renderPreview(); renderDates(); renderStreakLine(); renderGreeting();
importFromHash();  // gedeelde sessie via #s=… direct openen
setTimeout(()=>setTimeIdx(activeTimeIdx),60);

// desktop: verticaal scrollwiel → horizontaal op de rijen
function enableWheelScroll(sel){
  document.querySelectorAll(sel).forEach(row=>{
    row.addEventListener('wheel', e=>{
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        row.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, {passive:false});
  });
}
enableWheelScroll('#timeTrack');
enableWheelScroll('#recentRow');

// ── OPENING SCENE: shine → flash → wegvegen ──
(function(){
  const splash = document.getElementById('splash');
  if (!splash) return;
  // shine duurt ~1.4s; daarna flits, daarna weg
  setTimeout(()=> { document.getElementById('splashFlash').classList.add('fire'); }, 1500);
  setTimeout(()=> { splash.classList.add('done'); }, 1700);
  setTimeout(()=> { splash.remove(); }, 2250);
})();

// ── bescherming tegen per ongeluk weg-swipen / tab sluiten ──
window.addEventListener('beforeunload', e => {
  if (typeof hasLiveProgress === 'function' && hasLiveProgress()) {
    e.preventDefault();
    e.returnValue = ''; // toont de browser-standaard "weet je het zeker?"
    return '';
  }
});

// ── PWA: register external service worker (auto-updating) ──
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    // check meteen en periodiek op een nieuwe versie
    reg.update();
    setInterval(() => reg.update(), 60 * 60 * 1000);
    reg.addEventListener('updatefound', () => {
      const sw = reg.installing;
      if (!sw) return;
      sw.addEventListener('statechange', () => {
        // nieuwe versie geïnstalleerd terwijl er al een actief was → ververs
        if (sw.state === 'installed' && navigator.serviceWorker.controller) {
          location.reload();
        }
      });
    });
  }).catch(()=>{ /* offline cache optioneel */ });
}

// ══════════════════════════════════════════════════════════════
// MOCK — Choose-prototype (throwaway). Alles hieronder is nep:
// verzonnen sessies, verzonnen coaches, verzonnen like-tellers.
// Geen backend, geen opslag. Verwijderen na de test.
// ══════════════════════════════════════════════════════════════
// ── ZOEKEN IN CHOOSE: icoon klapt uit tot veld + filterchips; actief = verticale resultaten ──
let chSearchOpen = false;
let chQuery = '';
let chFilters = { time:null, goal:null, gear:null, load:null, level:null };  // single-select, null = uit
const CH_GOAL_SYS = { 'recovery':['recovery'], 'volume':['capacity','power endurance'], 'max power':['power','performance'], 'fingers':['strength'], 'technique':['skill'] };
const CH_GEAR_MAP = { 'gym wall':['Gym wall'], 'board':['Kilterboard','Spray wall'], 'fingerboard':['Fingerboard'], 'weights':['Weights'], 'none':[] };
const CH_FILTER_DEF = [
  { key:'time',  label:'time',      opts:[{v:30,l:'≤30'},{v:45,l:'≤45'},{v:60,l:'≤60'},{v:75,l:'≤75'},{v:90,l:'90+'}] },
  { key:'goal',  label:'goal',      opts:['recovery','volume','max power','fingers','technique'].map(v=>({v,l:v})) },
  { key:'gear',  label:'equipment', opts:['gym wall','board','fingerboard','weights','none'].map(v=>({v,l:v})) },
  { key:'load',  label:'load',      opts:[1,2,3,4].map(v=>({v,l:String(v)})) },
  { key:'level', label:'level',     opts:['all','beginner','intermediate','advanced'].map(v=>({v,l:v})) },
];
function chSearchActive() {
  return chQuery.trim() !== '' || chFilters.time != null || !!chFilters.goal || !!chFilters.gear || chFilters.load != null || !!chFilters.level;
}
function chMatch(s) {
  const q = chQuery.trim().toLowerCase();
  if (q && !(s.name + ' ' + s.coach + ' ' + s.goal + ' ' + s.gear.join(' ')).toLowerCase().includes(q)) return false;
  const f = chFilters;
  if (f.time != null) {
    if (f.time === 90) { if (s.mins < 90) return false; }
    else if (s.mins > f.time) return false;
  }
  if (f.goal && !CH_GOAL_SYS[f.goal].includes(s.sys)) return false;
  if (f.gear) {
    if (f.gear === 'none') { if (s.gear.length) return false; }
    else if (!s.gear.some(g => CH_GEAR_MAP[f.gear].includes(g))) return false;
  }
  if (f.load != null && s.load !== f.load) return false;
  if (f.level && f.level !== 'advanced') {
    // "geschikt voor mij": beginner alleen all levels, intermediate ook intermediate+
    const ok = f.level === 'beginner' ? ['all levels'] : ['all levels', 'intermediate+'];
    if (!ok.includes(s.level)) return false;
  }
  return true;
}
function toggleChSearch() {
  chSearchOpen = !chSearchOpen;
  document.getElementById('chSearchWrap').style.display = chSearchOpen ? '' : 'none';
  document.getElementById('chSearchToggle').classList.toggle('on', chSearchOpen);
  if (chSearchOpen) document.getElementById('chSearchInput').focus();
  else clearChSearch();  // dichtklappen = zoeken verlaten, planken terug
}
function clearChSearch() {
  chQuery = '';
  chFilters = { time:null, goal:null, gear:null, load:null, level:null };
  const inp = document.getElementById('chSearchInput');
  if (inp) inp.value = '';
  updateChSearchUI();
  renderChoose();
}
function setChFilter(key, val) {
  if (key === 'level' && val === 'all') chFilters.level = null;  // "all" = geen filter
  else chFilters[key] = (chFilters[key] === val) ? null : val;   // actieve chip nogmaals = deselect
  updateChSearchUI();
  renderChoose();
}
function updateChSearchUI() {
  document.querySelectorAll('#chSearchWrap .ch-fchip').forEach(el => {
    const key = el.dataset.fg;
    const val = key === 'time' || key === 'load' ? (el.dataset.fv === '' ? null : +el.dataset.fv) : el.dataset.fv;
    const on = key === 'level' && val === 'all' ? chFilters.level == null : chFilters[key] === val;
    el.classList.toggle('on', on);
  });
  const anyChip = chFilters.time != null || !!chFilters.goal || !!chFilters.gear || chFilters.load != null || !!chFilters.level;
  const clr = document.querySelector('#chSearchWrap .ch-clear');
  if (clr) clr.style.display = anyChip ? '' : 'none';
}
function buildChSearch() {
  const wrap = document.getElementById('chSearchWrap');
  if (!wrap) return;
  const groups = CH_FILTER_DEF.map(g => `
    <div class="ch-fgroup">
      <div class="ch-flabel">${g.label}</div>
      <div class="ch-fchips">${g.opts.map(o =>
        `<button class="ch-fchip" data-fg="${g.key}" data-fv="${o.v}" onclick="setChFilter('${g.key}', ${typeof o.v === 'number' ? o.v : `'${o.v}'`})">${o.l}</button>`).join('')}</div>
    </div>`).join('');
  wrap.innerHTML = `
    <div class="search-wrap" style="padding-top:10px;">
      <div class="search-box"><div class="search-icon">⌕</div>
        <input class="search-input" id="chSearchInput" placeholder="Search Easy Thirty, Vincent or max power..." autocomplete="off">
      </div>
    </div>
    ${groups}
    <button class="ch-clear" style="display:none;" onclick="clearChSearch()">clear all ×</button>`;
  document.getElementById('chSearchInput').addEventListener('input', function () {
    chQuery = this.value;
    renderChoose();
  });
  enableWheelScroll('#chSearchWrap .ch-fchips');
}
function chResultCard(i) {
  const s = MOCK_CHOOSE[i];
  return `<div class="ch-result" onclick="openChoosePreview(${i})">
    ${chStarBtn(i)}
    <div class="ch-print" style="height:44px;">${chBlueprint(s.keys)}</div>
    <div class="ch-result-body">
      <div class="ch-name">${s.name}</div>
      <div class="ch-result-coach">by ${s.coach} <span>· ${COACH_ROLE[s.coach] || 'coach'}</span></div>
      <div class="ch-line">${s.goal} · ${s.mins} min · ${s.gear.join(', ')}</div>
      <div class="ch-foot"><span style="display:flex;align-items:center;gap:6px;">load ${chPhalanx(s.load, true)}</span><span>${s.done} done</span></div>
    </div>
  </div>`;
}
function renderChooseResults() {
  const hits = MOCK_CHOOSE.map((s, i) => ({ s, i })).filter(x => chMatch(x.s)).sort((a, b) => b.s.done - a.s.done);
  if (!hits.length) return `<div class="ch-empty">No sessions match<span>Try fewer filters or a different word.</span></div>`;
  return `<div class="ch-results">
    <div class="ch-shelf-sub" style="padding:14px 0 8px;">${hits.length} session${hits.length === 1 ? '' : 's'} found</div>
    ${hits.map(x => chResultCard(x.i)).join('')}
  </div>`;
}

// Datamodel volgt CLAUDE.md Choose-flow punt 5 (vastgelegd, backend later):
// sys = energiesysteem (matcht sessie-cats voor For you), goal = primary_goal,
// gear = equipment[], level = recommended_level, load = expected_load (1-4,
// door de maker, voedt ACWR), done = completion_count (mock tot er een backend is).
const MOCK_CHOOSE = [
  // cat: 'featured' | 'new' | 'popular' | 'coach' (redactionele herkomst)
  { cat:'featured', name:'Crimp Factory',  coach:'Mila Berg',     mins:75, color:'amber',  rpe:'8-9', done:214, load:4, sys:'strength', goal:'Max fingers', gear:['Fingerboard','Kilterboard'], level:'intermediate+', keys:['dynamic','maxHangs','board1','stretch'],
    intent:'Max finger strength on small edges. Long rests, full effort.',
    why:'Most climbers plateau because their fingers never see a truly maximal stimulus. Crimp Factory is built around one thing: small edges, long rests, full effort. You leave strong, not wrecked.' },
  { cat:'featured', name:'Power Hour',     coach:'Teo Marchetti', mins:60, color:'red',    rpe:'8-9', done:187, load:4, sys:'power', goal:'Max power', gear:['Gym wall'], level:'all levels', keys:['dynamic','limitBlocks','dynos','stretch'],
    intent:'Hard moves, big holds, full commitment.',
    why:'Hard moves on big holds train your ability to pull fast. Attempts are short, rests are long, and quality beats volume all session.' },
  { cat:'featured', name:'Base Camp',      coach:'Ana Kovač',     mins:90, color:'green',  rpe:'6',   done:156, load:2, sys:'capacity', goal:'Aerobic base', gear:['Gym wall','Kilterboard'], level:'all levels', keys:['warmup','volume','boardApply','stretchLong'],
    intent:'Volume day. Stay smooth, stop before form breaks.',
    why:'A wide aerobic base makes every other session land better. Base Camp keeps you moving at a volume you can finish smooth, and you stop before form breaks.' },
  { cat:'new',      name:'Board Blitz',    coach:'Teo Marchetti', mins:60, color:'amber',  rpe:'8',   done:12,  load:3, sys:'power', goal:'Max power', gear:['Kilterboard'], level:'intermediate+', keys:['dynamic','campus','board1','stretch'],
    intent:'Short and sharp board work.',
    why:'Board work compresses power training into an hour: controlled attempts, full rests, skin watched. Short and sharp beats long and sloppy.' },
  { cat:'new',      name:'Flow State',     coach:'Ines Fujimoto', mins:75, color:'purple', rpe:'5-6', done:8,   load:2, sys:'skill', goal:'Technique', gear:['Gym wall','Spray wall'], level:'all levels', keys:['warmup','drillBlocks','sprayLight','stretch'],
    intent:'Movement quality over difficulty. Quiet feet, straight arms.',
    why:'Movement quality over difficulty. You climb below your max so your attention can go where it matters: hips, feet and pace.' },
  { cat:'new',      name:'Silent Feet',    coach:'Ines Fujimoto', mins:45, color:'purple', rpe:'4-5', done:19,  load:2, sys:'skill', goal:'Technique', gear:['Gym wall'], level:'all levels', keys:['dynamic','drillsOnly','skillLight','stretch'],
    intent:'Technique session. Every foot placement counts.',
    why:'Every foot placement counts. One session of deliberate feet changes how you climb for weeks after.' },
  { cat:'popular',  name:'The Grinder',    coach:'Ana Kovač',     mins:90, color:'lime',   rpe:'7-8', done:342, load:3, sys:'power endurance', goal:'Power endurance', gear:['Gym wall'], level:'intermediate+', keys:['warmup','hehe','fourByFour','stretchLong'],
    intent:'Power endurance. Pace yourself, the last set decides.',
    why:'Pump tolerance is trainable. The Grinder builds it in sets: pace yourself early, because the last set decides.' },
  { cat:'popular',  name:'Send Day',       coach:'Mila Berg',     mins:75, color:'red',    rpe:'9-10',done:298, load:4, sys:'performance', goal:'Performance', gear:['Gym wall'], level:'advanced', keys:['warmupFinger','project','stretch'],
    intent:'Project attempts at full freshness. Rest long, try hard.',
    why:'Project attempts at full freshness. The long rests feel slow and are the point: every try deserves your best power.' },
  { cat:'popular',  name:'Easy Does It',   coach:'Jonas Steen',   mins:45, color:'blue',   rpe:'3-4', done:251, load:1, sys:'recovery', goal:'Recovery', gear:['Gym wall'], level:'all levels', keys:['mobilityOpen','easyClimb','hog','stretch'],
    intent:'Recovery climbing. Leave the gym feeling better.',
    why:'Recovery climbing keeps you moving without adding load. The goal is simple: leave the gym feeling better than you came in.' },
  { cat:'coach',    name:'Finger School',  coach:'Mila Berg',     mins:60, color:'amber',  rpe:'8-9', done:96,  load:4, sys:'strength', goal:'Max fingers', gear:['Fingerboard'], level:'intermediate+', keys:['warmupFinger','maxHangs','activeCurls','stretch'],
    intent:'Structured finger loading, from prep to max.',
    why:'Structured finger loading from preparation to maximal work, in the order tendons like. No cold max hangs, ever.' },
  { cat:'coach',    name:'Comp Simulator', coach:'Teo Marchetti', mins:90, color:'red',    rpe:'8-9', done:74,  load:4, sys:'performance', goal:'Performance', gear:['Gym wall'], level:'advanced', keys:['dynamic','compStyle','pyramide','stretchLong'],
    intent:'Four-minute walls of effort, comp format.',
    why:'Comp format: four-minute walls of effort with real decisions under fatigue. Train the format before you meet it.' },
  { cat:'coach',    name:'The Reset',      coach:'Jonas Steen',   mins:45, color:'blue',   rpe:'2-3', done:63,  load:1, sys:'recovery', goal:'Recovery', gear:['Fingerboard'], level:'all levels', keys:['mobilityOpen','hog','nohangs','stretchLong'],
    intent:'Tendon care and easy movement on a rest week.',
    why:'Tendon care and easy movement for a rest week. The point of resting well is coming back stronger.' },
  // echte gecureerde sessie: denkt in aantallen (count-blokken), niet in tijd
  { cat:'coach',    name:'Easy Thirty',    coach:'Vincent',       mins:60, color:'green',  rpe:'4-5', done:57,  load:2, sys:'capacity', goal:'Easy volume', gear:['Gym wall'], level:'all levels', keys:['dynamic','easyTen','mediumTwenty'],
    intent:'Thirty boulders, counted, not timed. Warm up and flow.',
    why:'A session that thinks in boulders instead of minutes: ten easy ones to warm up, twenty medium ones as the main course. You tick them off as you climb, and quality decides whether a boulder counts.' },
  // huis-sessie op een gevestigd principe: intensiteit vooraan terwijl je fris bent (geen merkclaim)
  { cat:'coach',    name:'Fresh First',    coach:'Crimpify',      mins:60, color:'amber',  rpe:'8-9', done:88,  load:4, sys:'performance', goal:'Hardest first', gear:['Gym wall'], level:'intermediate+', keys:['frontGrowth','frontBuild','frontMaint'], addedDate:'2026-07-16',
    intent:'Hardest work first while you are fresh, easy volume last. Arrive warm.',
    why:'Most climbers do it backwards: they warm up forever, then try hard when they are already tired. Fresh First flips it. The hardest material goes first, while your nervous system is sharp and your focus is full, because that is when you can actually move the needle. The middle third builds the boulders you are developing. Easy volume and simple movement come last, as the wind-down, not the opener. Arrive warm, spend your best energy on what matters, and finish smooth.' }
];
const COACH_ROLE = { 'Mila Berg':'strength coach', 'Teo Marchetti':'power & comp coach', 'Ana Kovač':'endurance coach', 'Ines Fujimoto':'technique coach', 'Jonas Steen':'recovery coach', 'Vincent':'easy day coach', 'Crimpify':'the house method' };
function coachShort(name) { const p = name.split(' '); return p.length > 1 ? p[0] + ' ' + p[1][0] + '.' : name; }

// vingerafdruk: de echte bloksequentie, breedte naar rato van basisduur, categoriekleuren
function chBlueprint(keys) {
  return keys.filter(k => BLOCKLIB[k]).map(k => {
    const b = BLOCKLIB[k];
    return `<div style="flex:${b.t};background:${b.c};" title="${b.n}"></div>`;
  }).join('');
}
// phalanx = verwachte belasting (vier standen, door de maker); nooit rpe, nooit voortgang.
// Altijd acid-gevuld / load-empty (tokens in CSS), nooit de sessiekleur.
function chPhalanx(load, mini) {
  const blocks = [1,2,3,4].map(n => `<i${n <= load ? ' class="on"' : ''}></i>`).join('');
  return `<span class="phalanx${mini ? ' mini' : ''}">${blocks}</span>`;
}
// ster = opslaan, nooit sociaal: hergebruikt crimpify_favs (dedupe op naam, max 12)
function isChooseSaved(name) { return loadFavs().some(f => f.name === name); }
function chooseFavEntry(s) {
  return { name: s.name, keys: s.keys.slice(), color: s.color || 'lime', rpe: s.rpe || '–', intent: s.intent || '', time: s.mins };
}
function toggleChooseSave(ev, i) {
  if (ev) ev.stopPropagation();  // kaart-onclick opent de preview
  const s = MOCK_CHOOSE[i];
  if (!s) return;
  let favs = loadFavs();
  const was = favs.some(f => f.name === s.name);
  favs = was ? favs.filter(f => f.name !== s.name) : [chooseFavEntry(s), ...favs];
  saveFavs(favs);
  buildRecent();
  syncChooseStars();
  updateFavStar();
  if (!was) showToast('Saved on this device');
}
// in-place refresh van alle sterknoppen: geen re-render, dus railscroll en focus blijven staan
function syncChooseStars() {
  const set = new Set(loadFavs().map(f => f.name));
  document.querySelectorAll('[data-chstar]').forEach(el => {
    const s = MOCK_CHOOSE[+el.dataset.chstar];
    if (!s) return;
    const on = set.has(s.name);
    el.classList.toggle('on', on);
    el.textContent = el.dataset.label ? (on ? '★ Saved' : '☆ Save') : (on ? '★' : '☆');
  });
}
function chStarBtn(i, label) {
  const on = isChooseSaved(MOCK_CHOOSE[i].name);
  if (label) return `<button class="pv-act${on ? ' on' : ''}" id="pvSaveBtn" data-chstar="${i}" data-label="1" onclick="toggleChooseSave(event, ${i})">${on ? '★ Saved' : '☆ Save'}</button>`;
  return `<button class="ch-star${on ? ' on' : ''}" data-chstar="${i}" aria-label="save" onclick="toggleChooseSave(event, ${i})">${on ? '★' : '☆'}</button>`;
}
function chCard(i, noStar) {
  const s = MOCK_CHOOSE[i];
  const col = C[s.color] || C.lime;
  return `<div class="ch-card" onclick="openChoosePreview(${i})">
    ${noStar ? '' : chStarBtn(i)}
    <div class="ch-print">${chBlueprint(s.keys)}</div>
    <div class="ch-card-body">
      <div class="ch-name">${s.name}</div>
      <div class="ch-line">${s.goal} · ${s.mins} min</div>
      <div class="ch-line">${s.gear[0]} · load ${chPhalanx(s.load, true)}</div>
      <div class="ch-foot"><span>${coachShort(s.coach)}</span><span>${s.done} done</span></div>
    </div>
  </div>`;
}
function chShelf(shelf) {
  if (!shelf || !shelf.idxs.length) return '';
  return `<div class="ch-shelf-head"><div class="ch-shelf-title">${shelf.title}</div></div>
    ${shelf.sub ? `<div class="ch-shelf-sub">${shelf.sub}</div>` : ''}
    <div class="ch-shelf">${shelf.idxs.map(ix => chCard(ix)).join('')}</div>`;
}

// For you: client-side uit localStorage-historie (recente energiesystemen en signalen).
// Geen historie → vriendelijke starterskeuze. Geen account, geen server (productprincipe 1).
function computeForYou() {
  const idxOf = name => MOCK_CHOOSE.findIndex(s => s.name === name);
  const h = loadHistory();
  if (!h.length) return { title:'For you', sub:'new here · good first sessions', idxs:[idxOf('Base Camp'), idxOf('Silent Feet'), idxOf('Easy Does It')] };
  const needRest = h[0].sig === 'red' || (h[0].sig === 'orange' && h[1] && h[1].sig === 'orange');
  if (needRest) {
    return { title:'For you', sub:'your last signals ask for an easy day',
      idxs: MOCK_CHOOSE.map((s, i) => ({ s, i })).filter(x => x.s.load <= 2).sort((a, b) => a.s.load - b.s.load || b.s.done - a.s.done).slice(0, 4).map(x => x.i) };
  }
  // roteer energiesystemen: wat je de laatste 7 dagen niet trainde komt eerst
  const now = Date.now();
  const recentCats = new Set(h.filter(e => now - e.ts < 7 * 86400000)
    .map(e => { const s = getSession(e.id); return s ? s.cat.toLowerCase() : null; }).filter(Boolean));
  const fresh = MOCK_CHOOSE.map((s, i) => ({ s, i })).filter(x => !recentCats.has(x.s.sys))
    .sort((a, b) => b.s.done - a.s.done).slice(0, 4).map(x => x.i);
  return { title:'For you', sub:'rotates with your recent training', idxs: fresh };
}
// tijd-plank: live uit de lokale tijd-slider; geen match → plank verbergen (echt, geen mock)
function computeTimeShelf() {
  const t = getT();
  const all = MOCK_CHOOSE.map((s, i) => ({ s, i }));
  if (!isFinite(t)) return { title:'Any length', sub:'no time limit set', idxs: all.sort((a, b) => b.s.mins - a.s.mins).map(x => x.i) };
  return { title:`Under ${t} min`, sub:'fits the time you set', idxs: all.filter(x => x.s.mins <= t).sort((a, b) => b.s.done - a.s.done).map(x => x.i) };
}
// gecureerd: handmatig samengestelde lijst in afstemming met de Apex-gym, hardcoded tot er
// een backend is; wordt dan berekend, het ontwerp blijft gelijk (CLAUDE.md Choose-flow punt 4)
const APEX_PICKS = ['The Grinder', 'Send Day', 'Easy Does It', 'Board Blitz'];

function renderChoose() {
  const body = document.getElementById('chooseBody');
  if (!body) return;
  if (chSearchActive()) { body.innerHTML = renderChooseResults(); return; }  // zoeken vervangt de planken
  const fi = 0;  // session of the week: redactionele keuze
  const f = MOCK_CHOOSE[fi];
  const fcol = C[f.color] || C.lime;
  const hero = `
    <div class="ch-kicker">session of the week</div>
    <div class="ch-feat">
      <div class="ch-feat-name">${f.name}</div>
      <div class="ch-promise">${f.intent}</div>
      <div class="ch-whybtn" onclick="toggleHeroWhy(this)">why it works →</div>
      <div class="ch-why" id="heroWhy">${f.why}</div>
      <div class="ch-byline">
        <div class="ch-monogram" style="color:${fcol.text};">${f.coach.split(' ').map(w => w[0]).join('')}</div>
        <div>
          <div class="ch-byline-name">${f.coach}</div>
          <div class="ch-byline-role">${COACH_ROLE[f.coach] || 'coach'} · ${f.done} done</div>
        </div>
      </div>
      <div class="ch-tape">${chBlueprint(f.keys)}</div>
      <div class="ch-feat-meta">
        <span>${f.mins} min</span><span>${f.goal.toLowerCase()}</span><span>${f.done} done</span>
        <span style="margin-left:auto;display:flex;align-items:center;gap:6px;">load ${chPhalanx(f.load)}</span>
      </div>
      <button class="ch-view-btn" onclick="openChoosePreview(${fi})">View session</button>
    </div>`;
  const newShelf = { title:'New', sub:'fresh from the coaches', idxs: MOCK_CHOOSE.map((s, i) => ({ s, i })).filter(x => x.s.cat === 'new').map(x => x.i) };
  const apexShelf = { title:'Popular at Apex', sub:'curated with apex bouldergym', idxs: APEX_PICKS.map(n => MOCK_CHOOSE.findIndex(s => s.name === n)).filter(i => i >= 0) };
  body.innerHTML = hero
    + chShelf(computeForYou())
    + chShelf(computeTimeShelf())
    + chShelf(apexShelf)
    + chShelf(newShelf)
    + '<div style="height:16px;"></div>';
  enableWheelScroll('#chooseBody .ch-shelf');
}
function toggleHeroWhy(btn) {
  const el = document.getElementById('heroWhy');
  const open = el.classList.toggle('open');
  btn.textContent = open ? 'why it works ▴' : 'why it works →';
}

function openChoose() {
  // catalogus opent altijd met de planken; zoekstaat van een vorig bezoek vervalt
  chSearchOpen = false;
  const wrap = document.getElementById('chSearchWrap');
  if (wrap) wrap.style.display = 'none';
  const tgl = document.getElementById('chSearchToggle');
  if (tgl) tgl.classList.remove('on');
  chQuery = '';
  chFilters = { time:null, goal:null, gear:null, load:null, level:null };
  const inp = document.getElementById('chSearchInput');
  if (inp) inp.value = '';
  updateChSearchUI();
  renderChoose();  // elke keer vers: tijd-plank en For you zijn live
  goTo('v-choose');
}

// ── PREVIEW-LAAG (kaart → preview → sessie; starten kan alleen hier, nooit uit de catalogus) ──
let _previewIdx = null;
function openChoosePreview(i) {
  const s = MOCK_CHOOSE[i];
  if (!s) return;
  _previewIdx = i;
  const col = C[s.color] || C.lime;
  const blocks = s.keys.filter(k => BLOCKLIB[k]).map(k => {
    const b = BLOCKLIB[k];
    return `<div class="pv-block" style="border-left-color:${b.c};">
      <div class="pv-block-name">${b.n}</div>
      <div class="pv-block-t" style="color:${nameColor(b.c)};">${b.t} min</div>
    </div>`;
  }).join('');
  document.getElementById('previewBody').innerHTML = `
    <div class="ch-kicker">preview</div>
    <div class="pv-name">${s.name}</div>
    <div class="pv-meta">
      <span>${s.mins} min</span><span>${s.goal.toLowerCase()}</span><span>${s.level}</span><span>${s.done} done</span>
      <span style="display:flex;align-items:center;gap:6px;">load ${chPhalanx(s.load)}</span>
    </div>
    <div class="pv-section">
      <div class="ch-byline" style="margin-top:12px;">
        <div class="ch-monogram" style="color:${col.text};">${s.coach.split(' ').map(w => w[0]).join('')}</div>
        <div>
          <div class="ch-byline-name">${s.coach}</div>
          <div class="ch-byline-role">${COACH_ROLE[s.coach] || 'coach'}</div>
        </div>
      </div>
      <div class="pv-lbl">why this session</div>
      <div class="pv-why">${s.why}</div>
      <div class="pv-lbl">session structure · scales to your time when you start</div>
      ${blocks}
      <div class="pv-lbl">equipment</div>
      <div class="pv-chips">${s.gear.map(g => `<div class="pv-chip">${g}</div>`).join('')}</div>
      <div style="height:16px;"></div>
    </div>`;
  const sb = document.getElementById('pvSaveBtn');
  if (sb) { sb.dataset.chstar = i; }
  syncChooseStars();
  const pv = document.getElementById('previewView');
  pv.style.display = 'flex';
  pv.querySelector('.scroll-body').scrollTop = 0;
}
function closeChoosePreview() { document.getElementById('previewView').style.display = 'none'; _previewIdx = null; }
function startFromPreview() {
  if (_previewIdx == null) return;
  const i = _previewIdx;
  closeChoosePreview();
  openMockSession(i);  // bestaande sessie-flow: slab, timers, delen — onaangeroerd
}
// customize = lokale kopie met attributie; het origineel in de catalogus is read-only
function chooseCopyTitle(base) {
  let who = '';
  try { who = localStorage.getItem('crimpify_name') || ''; } catch {}
  return base + ' · ' + (who ? who + ' version' : 'your version');
}
function customizeFromChoose() {
  if (_previewIdx == null) return;
  const s = MOCK_CHOOSE[_previewIdx];
  customSession = { id:'custom', cat:'own', name: chooseCopyTitle(s.name), desc:'', color: s.color, rpe: s.rpe, intent: s.intent, basedOn: { title: s.name, coach: s.coach } };
  customKeys = s.keys.slice();
  durationOverride['custom'] = {};  // verse kopie, geen stale slot-overrides
  activeSessionId = 'custom';
  sessionLocked = false;
  sessionOwned = true;
  closeChoosePreview();
  buildSlab();
  goTo('v-session');
}

function openMockSession(i) {
  const s = MOCK_CHOOSE[i];
  if (!s) return;
  customSession = { id:'custom', cat:'choose', name:s.name, desc:'', color:s.color, rpe:s.rpe, intent:s.intent + ' · by ' + s.coach + ' (mock)' };
  customKeys = s.keys.slice();
  activeSessionId = 'custom';
  sessionLocked = true;
  sessionOwned = false;
  // de gekozen tijd op de landing bepaalt het schema, ook voor Choose-sessies;
  // de minuten op de kaart zijn browse-informatie, geen override
  buildSlab();
  goTo('v-session');
}

function openGenerate() {
  goTo('v-generate');
  setTimeIdx(activeTimeIdx);  // chip-status en samenvatting syncen nu de view zichtbaar is
}

// ── DISCOVER: etalage op de landing — de gecureerde Apex-plank met de
// bestaande Choose-kaarten (tik → preview, nooit direct starten) ──
function renderDiscover() {
  const el = document.getElementById('discoverShelf');
  if (!el) return;
  // landing blijft sterloos (één sterk moment); opslaan kan in de Choose-view
  el.innerHTML = APEX_PICKS.map(n => MOCK_CHOOSE.findIndex(s => s.name === n)).filter(i => i >= 0).map(ix => chCard(ix, true)).join('');
}
// ── NEWS: rustige plank onderaan de landing (onder Discover) ──
// Twee bronnen: ANNOUNCEMENTS (handmatig broadcast, geen backend — productprincipe 1)
// en auto "Freshly added" uit een addedDate-veld op blokken/sessies (14 dagen, verloopt vanzelf).
// Weggetikte items onthouden we in crimpify_seen_news; komen niet terug.
const ANNOUNCEMENTS = [
  // link is optioneel: {type:'session', name:'Easy Thirty'} | {type:'block', key:'tendonClimb'} | 'https://…'
  { id:'beta-2026-07', title:'We are in beta', date:'2026-07-16',
    body:'Still working out the beta, the sequence that makes it all flow. Expect things to change.' },
];
function loadSeenNews() { try { return JSON.parse(localStorage.getItem('crimpify_seen_news') || '[]'); } catch { return []; } }
function saveSeenNews(a) { try { localStorage.setItem('crimpify_seen_news', JSON.stringify(a)); } catch {} }
function computeNews() {
  const seen = new Set(loadSeenNews());
  const hidden = loadHidden();  // verborgen blokken horen ook niet in News (lege picker anders)
  const now = Date.now();
  // ondergrens -2 dagen: Date.parse('2026-07-16') is UTC-middernacht, dus een addedDate
  // van "vandaag" kan lokaal nog even in de toekomst liggen; verse deploys tonen meteen
  const fresh = d => { const t = Date.parse(d); return !isNaN(t) && (now - t) < 14*864e5 && (now - t) > -2*864e5; };
  const ann = ANNOUNCEMENTS
    .filter(a => !seen.has(a.id))
    .map(a => ({ kind:'ann', id:a.id, title:a.title, body:a.body, link:a.link||null, sort:Date.parse(a.date)||0 }))
    .sort((x, y) => y.sort - x.sort);
  const auto = [];
  Object.keys(BLOCKLIB).forEach(k => {
    const b = BLOCKLIB[k];
    if (b.addedDate && fresh(b.addedDate) && !seen.has('fresh:' + k) && !hidden.includes(k))
      auto.push({ kind:'auto', id:'fresh:' + k, name:b.n, link:{ type:'block', key:k }, sort:Date.parse(b.addedDate) });
  });
  MOCK_CHOOSE.forEach((s, i) => {
    if (s.addedDate && fresh(s.addedDate) && !seen.has('fresh:session:' + s.name))
      auto.push({ kind:'auto', id:'fresh:session:' + s.name, name:s.name, link:{ type:'session', idx:i }, sort:Date.parse(s.addedDate) });
  });
  auto.sort((x, y) => y.sort - x.sort);
  return ann.concat(auto).slice(0, 4);  // announcements boven auto, nieuwste eerst, hoogstens een paar
}
function renderNews() {
  const wrap = document.getElementById('newsWrap');
  if (!wrap) return;
  const items = computeNews();
  if (!items.length) { wrap.style.display = 'none'; return; }  // niets zichtbaar → geen lege huls
  wrap.style.display = '';
  // ids kunnen sessienamen bevatten; escapen zodat een apostrof de onclick niet breekt
  const esc = id => String(id).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
  document.getElementById('newsList').innerHTML = items.map(it => {
    const clickable = it.link ? `onclick="openNews('${esc(it.id)}')"` : '';
    const arrow = it.link ? '<span class="news-arrow">→</span>' : '';
    const head = it.kind === 'ann'
      ? `<div class="news-line"><span class="news-new">NEW</span> <span class="news-title">${it.title}</span>${arrow}</div><div class="news-body">${it.body}</div>`
      : `<div class="news-line"><span class="news-fresh">Freshly added:</span> <span class="news-title">${it.name}</span>${arrow}</div>`;
    return `<div class="news-item">
      <div class="news-main" ${clickable}>${head}</div>
      <button class="news-x" onclick="dismissNews('${esc(it.id)}')" aria-label="dismiss">×</button>
    </div>`;
  }).join('');
}
function openNews(id) {
  const it = computeNews().find(x => x.id === id);
  if (!it || !it.link) return;
  if (typeof it.link === 'string') { window.open(it.link, '_blank', 'noopener'); return; }  // announcement met url
  if (it.link.type === 'session') {
    let idx = it.link.idx;
    if (idx == null && it.link.name != null) idx = MOCK_CHOOSE.findIndex(s => s.name === it.link.name);
    if (idx >= 0) openChoosePreview(idx);
  } else if (it.link.type === 'block') {
    openNewsBlock(it.link.key);
  }
}
function openNewsBlock(key) {
  const b = BLOCKLIB[key];
  if (!b) return;
  openBlockPicker();  // bibliotheek-overlay, voorgefilterd op dit blok
  const inp = document.getElementById('blockSearch');
  if (inp) inp.value = b.n;
  renderBlockPicker(b.n);
}
function dismissNews(id) {
  const seen = loadSeenNews();
  if (!seen.includes(id)) { seen.push(id); saveSeenNews(seen); }
  renderNews();
}

renderDiscover();
enableWheelScroll('#discoverShelf');
buildChSearch();
renderNews();
