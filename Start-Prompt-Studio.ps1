$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $PSCommandPath
$localNode = Join-Path $project 'runtime\node.exe'
$serverFile = Join-Path $project 'local-server.mjs'
$logFolder = Join-Path $project 'data\logs'
$url = 'http://127.0.0.1:18819/'

function Test-Node([string]$path) {
  if (-not $path -or -not (Test-Path -LiteralPath $path)) { return $false }
  try {
    $version = (& $path --version).Trim()
    return ($version -match '^v(\d+)\.' -and [int]$Matches[1] -ge 22)
  } catch { return $false }
}

function Get-Local([string]$address) {
  try { return Invoke-RestMethod -Uri $address -TimeoutSec 3 }
  catch { return $null }
}

try {
  $node = $null
  if (Test-Node $localNode) { $node = $localNode }
  else {
    $installed = Get-Command node.exe -ErrorAction SilentlyContinue
    if ($installed -and (Test-Node $installed.Source)) { $node = $installed.Source }
  }
  if (-not $node) {
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $project 'Setup-Prompt-Studio.ps1')
    if ($LASTEXITCODE -ne 0) { throw 'Node.js setup was not completed.' }
    if (Test-Node $localNode) { $node = $localNode }
  }
  if (-not $node) { throw 'Node.js 22 or newer is required. Run SETUP.cmd.' }

  New-Item -ItemType Directory -Path $logFolder -Force | Out-Null
  $health = Get-Local ($url + 'health')
  if ($health -and ($health.globalClean -ne $true -or $health.version -ne '1.19' -or $health.archiveHandoff -ne $true -or $health.videoThumbnails -ne $true -or $health.abCompare -ne $true -or $health.recipeCopy -ne $true -or $health.glossarySuggestions -ne $true -or $health.addonAdvisor -ne $true)) {
    throw 'Port 18819 belongs to another or older application. Close it before starting this clean edition.'
  }
  if (-not $health) {
    Start-Process -FilePath $node -ArgumentList ('"' + $serverFile + '"') -WorkingDirectory $project -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logFolder 'server.stdout.log') -RedirectStandardError (Join-Path $logFolder 'server.stderr.log') | Out-Null
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
      Start-Sleep -Milliseconds 500
      $health = Get-Local ($url + 'health')
      if ($health) { break }
    }
  }
  if (-not $health -or $health.globalClean -ne $true -or $health.version -ne '1.19' -or $health.mediaFavorites -ne $true -or $health.directorTimeline -ne $true -or $health.archiveHandoff -ne $true -or $health.videoThumbnails -ne $true -or $health.abCompare -ne $true -or $health.recipeCopy -ne $true -or $health.glossarySuggestions -ne $true -or $health.addonAdvisor -ne $true) {
    throw 'The local page did not start. See data\logs\server.stderr.log.'
  }

  $ollama = Get-Local 'http://127.0.0.1:11434/api/tags'
  if (-not $ollama) {
    $ollamaCommand = Get-Command ollama.exe -ErrorAction SilentlyContinue
    if ($ollamaCommand) {
      Start-Process -FilePath $ollamaCommand.Source -ArgumentList 'serve' -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logFolder 'ollama.stdout.log') -RedirectStandardError (Join-Path $logFolder 'ollama.stderr.log') | Out-Null
      for ($attempt = 0; $attempt -lt 12; $attempt++) {
        Start-Sleep -Milliseconds 500
        $ollama = Get-Local 'http://127.0.0.1:11434/api/tags'
        if ($ollama) { break }
      }
    }
  }
  if (-not $ollama) { Write-Host 'Local AI is optional and not active. The media archive and manual prompt tools still work.' }
  elseif (-not @($ollama.models | Where-Object { $_.name -eq 'gemma3:4b' -or $_.name -eq 'gemma3:latest' }).Count) {
    Write-Host 'For AI suggestions and translation, download the optional model with: ollama pull gemma3:4b'
  }

  Start-Process $url
  Write-Host "Prompt Studio Global 1.19 is ready: $url"
  exit 0
} catch {
  Write-Host ('START ERROR: ' + $_.Exception.Message) -ForegroundColor Red
  exit 1
}
