export const directorProfiles = Object.freeze({
  h3:{ label:"MiniMax H3 / DaSiWa / Eros", fps:24, grid:17, offset:5, maxFrames:362, field:"SwarmUI: Text2Video Frames" },
  ltx25:{ label:"LTX 2.5", fps:24, grid:8, offset:1, maxFrames:null, field:"Workflow: frame count / length" },
  custom:{ label:"Other model / manual check", fps:24, grid:1, offset:0, maxFrames:null, field:"Model-specific frame count" }
});

export function directorSettings(model,requestedSeconds,fpsOverride) {
  const profile = Object.hasOwn(directorProfiles,model) ? directorProfiles[model] : directorProfiles.custom;
  const seconds = Number(requestedSeconds);
  if (!Number.isFinite(seconds) || seconds < 1 || seconds > 15) throw new Error("Duration must be between 1 and 15 seconds");
  const fps = model === "custom" ? Number(fpsOverride) : profile.fps;
  if (!Number.isInteger(fps) || fps < 1 || fps > 120) throw new Error("FPS must be between 1 and 120");
  const desiredFrames = Math.round(seconds * fps);
  const frames = profile.offset + Math.max(0,Math.ceil((desiredFrames-profile.offset)/profile.grid))*profile.grid;
  if (profile.maxFrames && frames > profile.maxFrames) throw new Error("This model profile exceeds its documented maximum frame count");
  return { model:Object.hasOwn(directorProfiles,model) ? model : "custom", fps, frames, requestedSeconds:seconds,
    estimatedSeconds:Number((frames/fps).toFixed(2)), field:profile.field,
    advisory:model !== "h3" };
}

export function directorTimelineIssues(beats,duration) {
  if (!Array.isArray(beats) || !beats.length) return ["Add at least one time segment"];
  const issues=[];
  let cursor=0;
  for (const [index,beat] of beats.entries()) {
    const start=Number(beat.start), end=Number(beat.end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start || end > duration+0.001) {
      issues.push(`Segment ${index+1} has an invalid time range`); continue;
    }
    if (Math.abs(start-cursor) > 0.05) issues.push(`Gap or overlap before segment ${index+1}`);
    cursor=end;
  }
  if (Math.abs(cursor-duration) > 0.05) issues.push("Segments must cover the full requested duration");
  return issues;
}

export function buildDirectorPrompt(plan) {
  const settings=directorSettings(plan.model,plan.seconds,plan.fps);
  const issues=directorTimelineIssues(plan.beats,settings.requestedSeconds);
  if (issues.length) throw new Error(issues.join("; "));
  const lines=[];
  if (String(plan.basePrompt || "").trim()) lines.push(String(plan.basePrompt).trim());
  lines.push(`Continuous ${settings.requestedSeconds}-second video. Keep the subject, clothing, setting and lighting consistent across the timeline.`);
  let describedBeats=0;
  for (const beat of plan.beats) {
    const action=String(beat.action || "").trim();
    const camera=String(beat.camera || "").trim();
    const sound=String(beat.sound || "").trim();
    if (!action && !camera && !sound) continue;
    describedBeats++;
    const details=[action,camera ? `Camera: ${camera}.` : "",sound ? `Sound: ${sound}.` : ""].filter(Boolean).join(" ");
    lines.push(`[${Number(beat.start).toFixed(1)}–${Number(beat.end).toFixed(1)}s] ${details}`);
  }
  if (!describedBeats) throw new Error("Describe at least one action, camera move, or sound");
  if (String(plan.feedback || "").trim()) lines.push(`Revision priorities from the previous result: ${String(plan.feedback).trim()}`);
  return { prompt:lines.join("\n"), settings };
}
