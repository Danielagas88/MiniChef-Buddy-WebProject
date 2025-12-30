export type CompleteBody = {
  recipeId?: string;
  title?: string;
  level?: string;
  minutes?: number;
  sessionId?: string;
};

export function parseCompleteBody(body: CompleteBody) {
  const recipeId = body.recipeId?.trim();
  const title = body.title?.trim();
  const sessionId = body.sessionId?.trim();

  const level = (body.level ?? "").toString().trim();
  const minutes = Number(body.minutes ?? 0);

  if (!recipeId || !title || !sessionId) return null;
  if (!Number.isFinite(minutes) || minutes < 0) return null;

  return { recipeId, title, sessionId, level, minutes };
}
