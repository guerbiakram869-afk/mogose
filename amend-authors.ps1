param(
  [Parameter(Mandatory=$true)]
  [string]$Path
)

$lines = Get-Content -Path $Path
$output = @()
foreach ($line in $lines) {
  $output += $line
  if ($line -match '^pick ') {
    $output += 'exec git commit --amend --author="akram guerbi <guerbiakram869@gmail.com>" --no-edit'
  }
}
Set-Content -Path $Path -Value $output