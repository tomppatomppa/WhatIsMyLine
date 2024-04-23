export function scriptChanged(
  currentScriptId: string | undefined,
  newScriptId: string
) {
  return currentScriptId !== newScriptId
}
