"use client";

/*
 * One journey state shared by every screen (PRD §19), persisted in sessionStorage so a refresh
 * keeps progress for the rest of the browser session.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { captureAttribution } from "@/lib/attribution";
import { INITIAL_JOURNEY, journeyReducer, type JourneyAction, type JourneyState } from "@/lib/journey";
import { clearSession, readSession, STORAGE_KEYS, writeSession } from "@/lib/storage";

let current: JourneyState | null = null;
const listeners = new Set<() => void>();

function load(): JourneyState {
  const stored = readSession<JourneyState>(STORAGE_KEYS.journey);
  return stored?.version === INITIAL_JOURNEY.version ? { ...INITIAL_JOURNEY, ...stored } : INITIAL_JOURNEY;
}

function getSnapshot(): JourneyState {
  if (current === null) current = load();
  return current;
}

// Storage only exists in the browser: during server rendering and hydration the journey is "not loaded yet".
function getServerSnapshot(): JourneyState | null {
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function dispatchJourney(action: JourneyAction) {
  if (action.type === "reset") clearSession();
  const next = journeyReducer(getSnapshot(), action);
  if (next === current) return;
  current = next;
  if (action.type !== "reset") writeSession(STORAGE_KEYS.journey, next);
  listeners.forEach((listener) => listener());
}

interface JourneyContextValue {
  state: JourneyState;
  /** False until the session has been read in the browser. */
  hydrated: boolean;
  dispatch: (action: JourneyAction) => void;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore<JourneyState | null>(subscribe, getSnapshot, getServerSnapshot);
  const dispatch = useCallback((action: JourneyAction) => dispatchJourney(action), []);

  // Campaign parameters can arrive on any landing URL (PRD D06).
  useEffect(() => {
    captureAttribution(window.location.search, window.location.pathname);
  }, []);

  const value = useMemo<JourneyContextValue>(
    () => ({ state: snapshot ?? INITIAL_JOURNEY, hydrated: snapshot !== null, dispatch }),
    [snapshot, dispatch],
  );
  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney(): JourneyContextValue {
  const context = useContext(JourneyContext);
  if (!context) throw new Error("useJourney must be used inside <JourneyProvider>");
  return context;
}
