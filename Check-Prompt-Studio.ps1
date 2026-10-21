$project = Split-Path -Parent $PSCommandPath
$localNode = Join-Path $project 'runtime\node.exe'
$node = if (Test-Path -LiteralPath $localNode) { $localNode } else { (Get-Command node.exe -ErrorAction SilentlyContinue).Source }
if ($node) {
  try { Write-Host "Node.js: $(& $node --version) ($node)" }
  catch { Write-Host 'Node.js: found but could not run' }
} else { Write-Host 'Node.js: missing; run SETUP.cmd' }

try {
  $health = Invoke-RestMethod -Uri 'http://127.0.0.1:18819/health' -TimeoutSec 3
  if ($health.globalClean -eq $true -and $health.version -eq '1.19' -and $health.mediaFavorites -eq $true -and $health.directorTimeline -eq $true -and $health.recipeCopy -eq $true -and $health.glossarySuggestions -eq $true) {
    Write-Host 'Prompt Studio Global 1.19: running at http://127.0.0.1:18819/'
    $catalog = Invoke-RestMethod -Uri 'http://127.0.0.1:18819/api/catalog/status' -TimeoutSec 3
    Write-Host "Archive folders: $(@($catalog.roots).Count); indexed media: $($catalog.indexed); readable prompts: $($catalog.withPrompt)"
  } else { Write-Host 'Port 18819 belongs to another application or version.' }
} catch { Write-Host 'Prompt Studio server: not running; run START.cmd' }

try {
  $tags = Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 3
  $model = @($tags.models | Where-Object { $_.name -eq 'gemma3:4b' -or $_.name -eq 'gemma3:latest' }).Count -gt 0
  Write-Host "Optional Ollama: running; gemma3:4b available: $model"
} catch { Write-Host 'Optional Ollama: not running; media search still works' }

Write-Host 'Local logs, if any: data\logs\server.stderr.log'
