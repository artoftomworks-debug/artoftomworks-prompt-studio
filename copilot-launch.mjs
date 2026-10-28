import { spawn } from "node:child_process";

const appIdPattern = /^(?:Microsoft\.Copilot|Microsoft\.MicrosoftOfficeHub)_[A-Za-z0-9]+![A-Za-z0-9_.]+$/i;
const appNamePattern = /(?:^|\s)Copilot(?:\s|$)/i;
const query = "Get-StartApps | Where-Object { $_.Name -like '*Copilot*' } | Select-Object Name, AppID | ConvertTo-Json -Compress";

export function selectInstalledCopilot(raw) {
  const apps = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const matches = apps.filter(app => app && typeof app.Name === "string" &&
    appNamePattern.test(app.Name) && typeof app.AppID === "string" && appIdPattern.test(app.AppID));
  matches.sort((a, b) => Number(b.AppID.startsWith("Microsoft.Copilot_")) -
    Number(a.AppID.startsWith("Microsoft.Copilot_")));
  return matches[0]?.AppID || "";
}

function run(command, args, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide:true, stdio:["ignore", "pipe", "pipe"] });
    let stdout = "", stderr = "", settled = false;
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      error ? reject(error) : resolve(value);
    };
    const timer = setTimeout(() => {
      child.kill();
      finish(new Error("Copilot lookup timed out"));
    }, timeoutMs);
    child.stdout.on("data", chunk => { stdout += chunk; if (stdout.length > 100000) child.kill(); });
    child.stderr.on("data", chunk => { stderr += chunk; if (stderr.length > 10000) child.kill(); });
    child.once("error", error => finish(error));
    child.once("close", code => finish(code === 0 ? null : new Error(stderr.trim() || "Copilot lookup failed"), stdout));
  });
}

export async function launchInstalledCopilot() {
  if (process.platform !== "win32") throw new Error("Windows is required");
  const stdout = await run("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", query]);
  let apps;
  try { apps = JSON.parse(stdout || "null"); }
  catch { throw new Error("Could not read installed Copilot apps"); }
  const appId = selectInstalledCopilot(apps);
  if (!appId) throw new Error("Installed Microsoft Copilot was not found");
  const child = spawn("explorer.exe", [`shell:AppsFolder\\${appId}`],
    { detached:true, stdio:"ignore", windowsHide:true });
  await new Promise((resolve, reject) => {
    child.once("spawn", resolve);
    child.once("error", reject);
  });
  child.unref();
  return { launched:true };
}
