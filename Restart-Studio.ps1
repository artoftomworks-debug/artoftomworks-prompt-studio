param([string]$Target=(Split-Path -Parent $PSCommandPath))
$ErrorActionPreference='Stop'
try {
 $studioRoot=[IO.Path]::GetFullPath($Target).TrimEnd('\')
 $studioServer=Join-Path $studioRoot 'local-server.mjs'
 if(-not (Test-Path -LiteralPath $studioServer -PathType Leaf)){throw 'Studio server not found.'}
 Write-Host 'Checking the Studio process...'
 if(Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue){
  $listeners=@(Get-NetTCPConnection -LocalPort 18819 -State Listen -ErrorAction SilentlyContinue | Sort-Object OwningProcess -Unique)
 }else{
  $listeners=@()
  foreach($row in (& (Join-Path $env:SystemRoot 'System32\netstat.exe') -ano -p tcp)){
   if($row -match '^\s*TCP\s+\S+:18819\s+\S+:0\s+\S+\s+(\d+)\s*$'){$listeners+=,[pscustomobject]@{OwningProcess=[int]$Matches[1]}}
  }
  $listeners=@($listeners | Sort-Object OwningProcess -Unique)
 }
 foreach($listener in $listeners){
  $ownerId=$listener.OwningProcess
  if(Get-Command Get-CimInstance -ErrorAction SilentlyContinue){$owner=Get-CimInstance Win32_Process -Filter ('ProcessId='+$ownerId)}
  else{
   Add-Type -AssemblyName System.Management
   $query=New-Object System.Management.ManagementObjectSearcher ('SELECT Name,CommandLine FROM Win32_Process WHERE ProcessId='+$ownerId)
   try{$owner=@($query.Get())[0]}finally{$query.Dispose()}
  }
  $expected='(?i)(^|\s|"|\x27)'+[regex]::Escape($studioServer)+'(?=\s|"|\x27|$)'
  if(-not $owner -or $owner.Name -notmatch '^node(\.exe)?$' -or $owner.CommandLine -notmatch $expected){
   throw 'Port 18819 is owned by an unrecognized process. Nothing was stopped. Close that application manually.'
  }
  Write-Host 'Stopping only this Studio server. Other applications are left running.'
  Stop-Process -Id $ownerId -ErrorAction Stop
 }
 $nodePath=Join-Path $studioRoot 'runtime\node.exe'
 if(-not (Test-Path -LiteralPath $nodePath -PathType Leaf)){$nodePath=(Get-Command node.exe -ErrorAction Stop).Source}
 $version=(& $nodePath --version).Trim()
 if($version -notmatch '^v(\d+)\.' -or [int]$Matches[1] -lt 22){throw 'Node.js 22 or newer is required.'}
 $logRoot=Join-Path $studioRoot 'data\logs'
 [IO.Directory]::CreateDirectory($logRoot)|Out-Null
 $stamp=Get-Date -Format 'yyyyMMdd-HHmmss-fff'
 Write-Host 'Starting the updated local Studio...'
 Start-Process -FilePath $nodePath -ArgumentList ('"'+$studioServer+'"') -WorkingDirectory $studioRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logRoot ('sound-'+$stamp+'.stdout.log')) -RedirectStandardError (Join-Path $logRoot ('sound-'+$stamp+'.stderr.log')) | Out-Null
 $health=$null
 for($attempt=0;$attempt -lt 40;$attempt++){
  Start-Sleep -Milliseconds 500
  try{$health=Invoke-RestMethod -Uri 'http://127.0.0.1:18819/health' -TimeoutSec 2}catch{$health=$null}
  if($health.version -eq '1.21.0' -and $health.lightSphere -eq $true -and $health.petPoses -eq $true){break}
 }
 if($health.version -ne '1.21.0' -or $health.lightSphere -ne $true -or $health.petPoses -ne $true){throw ('The updated server is not ready yet. Check '+$logRoot)}
 Start-Process 'http://127.0.0.1:18819/'
 Write-Host 'OK. In Studio press Ctrl+F5. Open Virtual studio - Figures and poses - Light sphere / Add dog / Add cat.'
 exit 0
}catch{
 Write-Host ('Restart needs attention: '+$_.Exception.Message)
 Write-Host 'The installed update was kept. Do not close unrelated Node applications.'
 exit 1
}
