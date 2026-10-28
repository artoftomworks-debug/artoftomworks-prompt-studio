$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $PSCommandPath
$runtime = Join-Path $project 'runtime'
$localNode = Join-Path $runtime 'node.exe'

function Test-Node([string]$path) {
  if (-not $path -or -not (Test-Path -LiteralPath $path)) { return $false }
  try {
    $version = (& $path --version).Trim()
    return ($version -match '^v(\d+)\.' -and [int]$Matches[1] -ge 22)
  } catch { return $false }
}

try {
  if (Test-Node $localNode) {
    Write-Host "Ready: portable Node.js $(& $localNode --version)"
  } else {
    $systemNode = Get-Command node.exe -ErrorAction SilentlyContinue
    if ($systemNode -and (Test-Node $systemNode.Source)) {
      Write-Host "Ready: installed Node.js $(& $systemNode.Source --version)"
    } else {
      $architecture = [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString()
      $platform = switch ($architecture) {
        'X64' { 'win-x64' }
        'Arm64' { 'win-arm64' }
        default { throw "Unsupported Windows architecture: $architecture" }
      }
      Write-Host 'Node.js 22 or newer is needed to run the local media archive.'
      $choice = Read-Host 'Download tested Node.js 24.19.0 from nodejs.org into this folder? (Y/N)'
      if ($choice -notmatch '^(?i:y|yes)$') {
        throw 'Setup cancelled. You can install Node.js yourself from https://nodejs.org/en/download/ and run START.cmd again.'
      }
      $version = '24.19.0'
      $name = "node-v$version-$platform.zip"
      $baseUrl = "https://nodejs.org/download/release/v$version"
      $temporary = Join-Path ([IO.Path]::GetTempPath()) ('PromptStudioSetup-' + [guid]::NewGuid().ToString('N'))
      New-Item -ItemType Directory -Path $temporary | Out-Null
      try {
        $archive = Join-Path $temporary $name
        $hashes = Join-Path $temporary 'SHASUMS256.txt'
        Write-Host 'Downloading Node.js and its official checksum...'
        Invoke-WebRequest -Uri "$baseUrl/$name" -OutFile $archive -UseBasicParsing -TimeoutSec 600
        Invoke-WebRequest -Uri "$baseUrl/SHASUMS256.txt" -OutFile $hashes -UseBasicParsing -TimeoutSec 60
        $line = Get-Content -LiteralPath $hashes | Where-Object { $_.EndsWith("  $name") -or $_.EndsWith(" *$name") } | Select-Object -First 1
        if (-not $line) { throw 'Official checksum for the downloaded archive is missing.' }
        $expected = ($line -split '\s+')[0]
        $actual = (Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash
        if ($actual -ne $expected) { throw 'Node.js checksum mismatch. Nothing was installed.' }
        $unpacked = Join-Path $temporary 'unpacked'
        Expand-Archive -LiteralPath $archive -DestinationPath $unpacked
        $inside = Join-Path $unpacked "node-v$version-$platform"
        $sourceNode = Join-Path $inside 'node.exe'
        $sourceLicense = Join-Path $inside 'LICENSE'
        if (-not (Test-Path -LiteralPath $sourceNode) -or -not (Test-Path -LiteralPath $sourceLicense)) {
          throw 'The official archive is incomplete.'
        }
        New-Item -ItemType Directory -Path $runtime -Force | Out-Null
        Copy-Item -LiteralPath $sourceNode -Destination $localNode
        Copy-Item -LiteralPath $sourceLicense -Destination (Join-Path $runtime 'NODE_LICENSE.txt')
        if (-not (Test-Node $localNode)) { throw 'Downloaded Node.js did not pass the version check.' }
        Write-Host "Ready: portable Node.js $(& $localNode --version)"
      } finally {
        $resolved = [IO.Path]::GetFullPath($temporary).TrimEnd('\')
        $tempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd('\') + '\'
        if ($resolved.StartsWith($tempRoot,[StringComparison]::OrdinalIgnoreCase) -and
            (Split-Path -Leaf $resolved).StartsWith('PromptStudioSetup-')) {
          Remove-Item -LiteralPath $resolved -Recurse -Force -ErrorAction SilentlyContinue
        }
      }
    }
  }
  Write-Host 'Core setup is complete. Double-click START.cmd.'
  Write-Host 'Optional local AI: install Ollama separately. See LOCAL_AI_GUIDE.md to choose a text or vision model. Some legacy translation tools use gemma3:4b.'
  exit 0
} catch {
  Write-Host ('SETUP ERROR: ' + $_.Exception.Message) -ForegroundColor Red
  exit 1
}
