# Fitryx

A home workout app built with React Native & Expo. No gym, no equipment — just you and your body.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        App.js (Root)                        │
│                   NavigationContainer                       │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Bottom Tab Navigator                   │   │
│   │                                                     │   │
│   │   ┌───────────────────────┐   ┌─────────────────┐  │   │
│   │   │    🏠 Workouts Tab    │   │  👤 Profile Tab  │  │   │
│   │   │                       │   │                 │  │   │
│   │   │  Native Stack Navigator│   │  ProfileScreen  │  │   │
│   │   │                       │   │                 │  │   │
│   │   │  ┌─────────────────┐  │   └─────────────────┘  │   │
│   │   │  │   HomeScreen    │  │                         │   │
│   │   │  │  - Category     │  │                         │   │
│   │   │  │    filter chips │  │                         │   │
│   │   │  │  - Workout cards│  │                         │   │
│   │   │  │  - Stats row    │  │                         │   │
│   │   │  └───────┬─────────┘  │                         │   │
│   │   │          │ navigate('Workout', { workout })      │   │
│   │   │  ┌───────▼─────────┐  │                         │   │
│   │   │  │  WorkoutScreen  │  │                         │   │
│   │   │  │  - Hero section │  │                         │   │
│   │   │  │  - Exercise list│  │                         │   │
│   │   │  │  - Start button │  │                         │   │
│   │   │  └───────┬─────────┘  │                         │   │
│   │   │          │ navigate('Exercise', { workout, index })  │
│   │   │  ┌───────▼─────────┐  │                         │   │
│   │   │  │ ExerciseScreen  │  │                         │   │
│   │   │  │  - Timer / Reps │  │                         │   │
│   │   │  │  - Set tracker  │  │                         │   │
│   │   │  │  - Phase FSM    │  │                         │   │
│   │   │  │  - Animated bar │  │                         │   │
│   │   │  └─────────────────┘  │                         │   │
│   │   └───────────────────────┘                         │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

                        Data Layer
┌─────────────────────────────────────────────────────────────┐
│                    src/data/workouts.js                     │
│                                                             │
│   WORKOUTS[]          CATEGORIES[]       LEVEL_COLORS{}     │
│   ┌───────────┐       ┌──────────┐       ┌──────────────┐   │
│   │ id        │       │ All      │       │ Beginner     │   │
│   │ title     │       │ Full Body│       │ Intermediate │   │
│   │ category  │       │ Core     │       │ Advanced     │   │
│   │ level     │       │ Lower    │       └──────────────┘   │
│   │ duration  │       │ Upper    │                          │
│   │ calories  │       │ Cardio   │                          │
│   │ exercises │       │ Mobility │                          │
│   └───────────┘       └──────────┘                          │
│         │                                                   │
│   exercises[]                                               │
│   ┌───────────────────────────┐                             │
│   │ id · name · emoji         │                             │
│   │ sets · reps · duration    │                             │
│   │ rest · muscles            │                             │
│   │ instructions              │                             │
│   └───────────────────────────┘                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Screen Flow

```
[Launch]
    │
    ▼
[HomeScreen]  ──filter──▶  [filtered workout list]
    │
    │ tap workout card
    ▼
[WorkoutScreen]
    │
    │ tap Start / tap exercise row
    ▼
[ExerciseScreen]
    │
    ├── rep-based  ──▶ tap "Done" ──▶ REST phase ──▶ next set
    │
    └── duration-based ──▶ auto countdown ──▶ REST ──▶ next set
              │
              └── last exercise + last set ──▶ popToTop() [HomeScreen]
```

---

## Design Patterns

### 1. Composite Navigation Pattern
`App.js` nests a **Native Stack Navigator** inside a **Bottom Tab Navigator**. The tab owns top-level destinations (Workouts, Profile) while the stack manages the drill-down flow within the Workouts tab. This keeps tab state isolated and allows deep navigation without losing tab position.

### 2. Finite State Machine (FSM) — ExerciseScreen
`ExerciseScreen` models the workout phase as an explicit FSM with three states:

| State | Trigger to next |
|-------|----------------|
| `exercise` | timer ends / user taps Done |
| `rest` | rest countdown ends |
| `done` | all sets complete |

This prevents invalid transitions (e.g. jumping from `rest` to `done`) and makes the timer logic predictable and easy to follow.

### 3. Static Data Module (Repository-lite)
All workout content lives in `src/data/workouts.js` as exported constants (`WORKOUTS`, `CATEGORIES`, `LEVEL_COLORS`). Screens import directly from this single source of truth. This separates data from presentation and makes swapping to an API or local database straightforward in the future.

### 4. Props Drilling via Navigation Params
Data flows through the screen stack via React Navigation's `route.params` rather than a global store. `HomeScreen` passes the full `workout` object to `WorkoutScreen`, which passes it along with `exerciseIndex` to `ExerciseScreen`. This keeps state co-located and avoids unnecessary global state for a linear flow.

### 5. Controlled Component + Local State
`HomeScreen` uses a single `useState` (`selectedCategory`) to drive the filtered workout list. The category chips and workout cards are purely derived from this state — no side effects, no refs. Classic React controlled component pattern.

### 6. Animation via Animated API (Declarative Animation)
`ExerciseScreen` uses React Native's `Animated.timing` to drive the progress bar width declaratively. The animation is tied to the `timerRunning` state, so pausing the timer halts the animation without manual frame cancellation.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo ~50) |
| Navigation | React Navigation 6 (Stack + Bottom Tabs) |
| Animations | React Native Animated API |
| Data | Static JS module (no backend) |
| Styling | StyleSheet.create (inline styles) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Run on iOS Simulator
npx expo start --ios

# Run on Android Emulator
npx expo start --android
```

Scan the QR code with **Expo Go** (iOS/Android) to run on a physical device. Ensure your phone and Mac are on the same WiFi network.
