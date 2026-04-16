# PLANS.md

## 🎯 Goal

Build a web-based interactive birthday invitation with a short game-like flow.

Target:
A working MVP that runs locally and is mobile-friendly.

---

## 🧭 Overall Flow

1. Intro screen
2. Puzzle (entry quest)
3. Memory story
4. Party info reveal
5. Game-style RSVP

---

## 📦 Milestone Breakdown

### ✅ Milestone 1: Project Setup

- Initialize project with Vite + React
- Install dependencies:
  - tailwindcss
  - framer-motion
- Setup basic folder structure

Done when:

- App runs with `npm run dev`

---

### ✅ Milestone 2: Main Flow Controller

- Create `MainFlow.jsx`
- Implement step-based navigation

Example:
const [step, setStep] = useState("intro");

- Render components based on step

Done when:

- Can manually switch between steps

---

### ✅ Milestone 3: Intro Screen

- Create `Intro.jsx`
- Display:
  - Title text
  - Start button

Behavior:

- On click → setStep("puzzle")

Done when:

- Button correctly transitions to puzzle

---

### ✅ Milestone 4: Puzzle (Entry Quest)

- Create `Puzzle.jsx`
- Load 1 image from assets
- Split into 3x3 grid
- Shuffle pieces

Interaction:

- Click-to-swap OR drag-and-drop

Logic:

- Detect solved state

On success:

- Trigger next step automatically

Done when:

- Puzzle can be solved and transitions to story

---

### ✅ Milestone 5: Story Interaction

- Create `Story.jsx`

Structure:

- Array of story scenes

Behavior:

- Click choice → next scene
- Track current scene index

End:

- setStep("party")

Done when:

- User can go through all scenes

---

### ✅ Milestone 6: Party Info Reveal

- Create `PartyInfo.jsx`

Display:

- Date
- Time
- Location

Add:

- simple animation (fade-in)

Button:

- "RSVP" → setStep("rsvp")

Done when:

- Info is visible and animated

---

### ✅ Milestone 7: RSVP Interaction

- Create `RSVP.jsx`

UI:

- 3 buttons:
  - 간다
  - 당연히 간다
  - 무조건 간다

Behavior:

- On click:
  - Show celebration message
  - Optional animation (confetti effect)

Done when:

- User can complete RSVP interaction

---

## 🔧 Implementation Order

1. Project setup
2. MainFlow navigation
3. Intro
4. Puzzle
5. Story
6. Party info
7. RSVP

---

## ⚠️ Constraints

- No backend
- No database
- No login system
- Keep logic simple
- Mobile-first layout

---

## 🧪 Testing Checklist

- Flow works end-to-end
- No stuck screens
- Puzzle solvable
- Buttons responsive on mobile
- Animations do not lag

---

## 🚀 Optional Enhancements

- Add sound effects
- Add real photos in puzzle
- Add role assignment after RSVP
- Add share link

---

## ✅ Definition of Done

- User can complete full flow in under 2 minutes
- All steps connected without error
- Works on mobile browser
