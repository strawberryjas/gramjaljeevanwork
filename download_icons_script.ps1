# PowerShell Script to Download Missing Icons from Lucide
# This script downloads SVG icons from the Lucide CDN

$iconsToDownload = @(
    "arrow-down",
    "arrow-left",
    "arrow-right",
    "award",
    "calendar",
    "calendar-clock",
    "check-circle",
    "chevron-left",
    "chevron-right",
    "clipboard",
    "clipboard-list",
    "database",
    "dollar-sign",
    "eye",
    "eye-off",
    "history",
    "home",
    "info",
    "lightbulb",
    "line-chart",
    "list",
    "mail",
    "message-circle",
    "mic",
    "mic-off",
    "phone",
    "refresh-ccw",
    "refresh-cw",
    "satellite",
    "server",
    "shield-check",
    "star",
    "target",
    "trophy",
    "users",
    "volume-2",
    "wrench",
    "zoom-in",
    "zoom-out",
    "layout"
)

$outputDir = "public\images\icons"
$cdnBase = "https://unpkg.com/lucide-static@latest/icons"

# Create output directory if it doesn't exist
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

Write-Host "Downloading $($iconsToDownload.Count) icons..." -ForegroundColor Cyan

$successCount = 0
$failCount = 0

foreach ($icon in $iconsToDownload) {
    $url = "$cdnBase/$icon.svg"
    $outputPath = Join-Path $outputDir "$icon.svg"
    
    try {
        Write-Host "Downloading: $icon..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $outputPath -ErrorAction Stop
        Write-Host " ✓" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host " ✗ Failed" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Red
        $failCount++
    }
    
    # Small delay to avoid rate limiting
    Start-Sleep -Milliseconds 100
}

Write-Host "`nDownload Complete!" -ForegroundColor Cyan
Write-Host "Success: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Icons saved to: $outputDir" -ForegroundColor Yellow
