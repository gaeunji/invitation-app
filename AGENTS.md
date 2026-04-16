# AGENTS.md

## Purpose

Build a small, polished web invitation for a birthday party.
The experience should feel like a short interactive game, not a static invitation.

## Product goal

Create a mobile-first single-page web app with this exact user flow:

1. Intro screen
2. Image puzzle as the entrance quest
3. Memory story
4. Party info reveal
5. Game-like RSVP

Do not change the flow order unless explicitly requested.

## Source of truth

If the repository already has an established stack, folder structure, router, styling system, or component conventions, follow the existing project conventions first.
If no clear convention exists, prefer:

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion for lightweight animation

Keep dependencies minimal.

## UX requirements

### 1) Intro screen

Keep the intro concept unchanged.
Required content:

- A strong title or short sentence that sets the mood
- A primary CTA button that starts the experience

Behavior:

- The CTA moves the user to the puzzle screen
- The intro should feel immediate and clean
- Avoid clutter, long paragraphs, and unnecessary forms

### 2) Entrance quest: image puzzle

The first interactive screen must be an image puzzle.
This is the gate to the rest of the invitation.

Requirements:

- Use one memory photo as the puzzle source
- Prefer a simple 3x3 puzzle for MVP
- Must work well on mobile
- Show clear visual feedback for selected / moved pieces
- Detect completion reliably
- On completion, show a short success message and continue to the story

Implementation guidance:

- Prefer a simple click-to-swap interaction for MVP over complex drag-and-drop if that improves reliability
- The puzzle should feel smooth and not frustrating
- Keep completion logic deterministic and easy to test

### 3) Memory story

After the puzzle, show a short interactive memory story.

Requirements:

- Present short story text in steps
- Each step can include 2 to 3 selectable choices
- Choices may slightly change displayed text, but all paths should still converge to the party reveal
- The story should feel personal, warm, and playful
- Keep the total story short enough to finish quickly

Implementation guidance:

- Store story steps in structured data, not hardcoded scattered JSX
- Use simple state transitions
- Add subtle text and card animations only if they do not hurt readability

### 4) Party info reveal

This is the reward screen after the story.

Required content:

- Date
- Time
- Location
- Optional dress code
- Short celebratory message

Behavior:

- Reveal information with a satisfying transition
- Make the information card easy to scan on mobile
- The RSVP CTA should be obvious

### 5) Game-like RSVP

The final step is a playful RSVP, not a boring form.

Requirements:

- Use playful button choices such as:
  - 간다
  - 당연히 간다
  - 무조건 간다
- Show a fun completion response
- Optionally assign a playful role after RSVP, such as DJ, photographer, or vibe maker

Implementation guidance:

- Prioritize delight and clarity over complexity
- If persistence is not explicitly requested, keep RSVP local and UI-focused
- If persistence is added later, isolate it cleanly behind a service layer

## 🎭 Tone & Style

The entire experience must be humorous and playful.

Guidelines:

- Use casual, funny, slightly sarcastic tone
- Avoid formal language
- Make user feel like they are being "tested" to enter the party
- Add small jokes in UI text

Examples:

- "이 파티는 아무나 들어올 수 없다."
- "이건 틀리면 왕서운"
- "다시 생각해봐..."
- "좋은 선택이다. 마음에 든다."

Important:
UX should feel like a light game, not a formal invitation.

## Design principles

- Mobile-first
- Fast first render
- Clean and emotional rather than flashy and noisy
- Use large tap targets
- Keep copy short
- Favor one strong interaction per screen
- Minimize scrolling where possible
- The overall mood should shift from a bright playful style to a dark cinematic style.

## Accessibility

- All interactive elements must be keyboard accessible
- Maintain sufficient color contrast
- Provide alt text for meaningful images
- Do not rely only on color for puzzle state or progress
- Respect reduced motion when practical

## Engineering rules

- Keep components small and focused
- Separate content data from UI components
- Avoid unnecessary abstractions
- Avoid premature backend work
- Avoid adding libraries for trivial problems
- Prefer readable code over clever code
- Add comments only where the intent is not obvious

## Suggested structure

If creating new files from scratch, prefer a structure close to:

- `src/pages` or `src/screens`
- `src/components`
- `src/data`
- `src/assets`
- `src/lib`

Suggested logical split:

- `IntroScreen`
- `PuzzleScreen`
- `StoryScreen`
- `RevealScreen`
- `RsvpScreen`

## State management

For MVP, prefer local React state or a small context.
Do not introduce a heavy global state library unless there is a clear need.

## Content placeholders

If final real content is missing, use clearly labeled placeholders for:

- intro text
- puzzle image
- story lines and options
- party date / time / location
- RSVP success message

Make it easy for a human to replace these values later in one place.

## Animation guidance

Use animation to improve feel, not to slow the experience.
Prefer:

- fade in
- slide up
- scale on success

Avoid:

- long blocking transitions
- excessive particle effects
- animation that delays interaction

## Definition of done

The task is done when:

- The full 5-step flow works end to end
- The puzzle is actually playable and completion advances the flow
- The story has interactive choices
- Party information is clearly revealed
- RSVP feels playful and completes with feedback
- The experience works on common mobile viewport sizes
- The code is organized enough for future editing

## Testing checklist

Before finishing, verify:

- Intro CTA advances correctly
- Puzzle completion detection works
- Story choices progress correctly
- Reveal screen shows all required info
- RSVP buttons work and show completion feedback
- No obvious layout breakage on mobile
- No console errors in normal flow

## What to avoid

- Do not replace the puzzle with another mini-game
- Do not convert the experience into a long multi-page site unless requested
- Do not add login, auth, database, or analytics unless requested
- Do not overbuild admin tools
- Do not bury key party info behind confusing interactions

## When work becomes large

If the requested change is multi-hour or touches many files, create a short plan in `PLANS.md` before major edits.
The plan should include:

- goal
- files to change
- implementation steps
- validation steps

Then keep the implementation aligned with that plan.

## Communication style for the coding agent

When reporting progress:

- be concise
- mention what changed
- mention any assumptions
- mention any remaining placeholder content

## Final handoff expectations

At the end of implementation, provide:

- a short summary of what was built
- where to edit copy and event info
- where to replace the puzzle image
- any remaining placeholders or limitations
