$ErrorActionPreference='Stop'
try {
  Write-Host 'Use this only after the local AI answer has finished.'
  $loaded=Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/ps' -TimeoutSec 10
  foreach($model in @($loaded.models)) {
    if(-not $model.name){continue}
    Write-Host ('Unloading local AI: '+$model.name)
    Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/generate' -Method Post -ContentType 'application/json' -Body (@{model=$model.name;keep_alive=0;stream=$false}|ConvertTo-Json) -TimeoutSec 60 | Out-Null
  }
  $remaining=Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/ps' -TimeoutSec 10
  if(@($remaining.models).Count){throw 'Some Ollama models are still loaded.'}
  Write-Host 'Local AI models unloaded. No model files were deleted.' -ForegroundColor Green
} catch {Write-Host $_.Exception.Message -ForegroundColor Red;exit 1}
