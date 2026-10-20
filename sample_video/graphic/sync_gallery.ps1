# Gallery Sync Script
$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $currentDir) { $currentDir = Get-Location }

$projectFolders = Get-ChildItem -Path $currentDir -Directory -Filter "project-*"

foreach ($folder in $projectFolders) {
    $imgFiles = Get-ChildItem -Path $folder.FullName -File | Where-Object {
        $_.Extension -match "^\.(jpe?g|png|webp|svg|gif|avif)$"
    } | Sort-Object { [regex]::Replace($_.Name, '\d+', { $args[0].Value.PadLeft(8, '0') }) } | Select-Object -ExpandProperty Name

    if ($imgFiles) {
        $jsonContent = ConvertTo-Json -InputObject @($imgFiles) -Compress
        $targetJsonPath = Join-Path $folder.FullName "images.json"
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($targetJsonPath, $jsonContent, $utf8NoBom)
        $count = $imgFiles.Count
        $name = $folder.Name
        Write-Host " [OK] $name : $count images found and saved." -ForegroundColor Green
    } else {
        $name = $folder.Name
        Write-Host " [!] $name : No images found." -ForegroundColor Yellow
    }
}
Write-Host "`nGallery sync completed successfully!" -ForegroundColor Cyan
