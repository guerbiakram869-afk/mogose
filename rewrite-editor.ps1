param(
  [Parameter(Mandatory=$true)]
  [string]$Path
)

$lines = Get-Content -Path $Path
for ($i = 0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match '^pick ') {
    $lines[$i] = ($lines[$i] -replace '^pick ', 'drop ')
    break
  }
}
Set-Content -Path $Path -Value $lines