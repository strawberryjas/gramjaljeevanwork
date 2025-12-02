# PowerShell Icon Replacement Script
# Replaces all lucide-react icons with realistic image icons

$iconMap = @{
    'Droplet' = 'droplet'
    'Activity' = 'activity'
    'Gauge' = 'gauge'
    'Power' = 'power'
    'Zap' = 'power'
    'Thermometer' = 'thermometer'
    'Beaker' = 'beaker'
    'FlaskConical' = 'flask'
    'Microscope' = 'microscope'
    'Server' = 'gauge'
    'Map' = 'map'
    'MapPin' = 'mapPin'
    'Navigation' = 'navigation'
    'Layers' = 'layers'
    'AlertTriangle' = 'alertTriangle'
    'CheckCircle' = 'checkCircle'
    'Radio' = 'radio'
    'Settings' = 'settings'
    'Clock' = 'clock'
    'X' = 'x'
    'Menu' = 'menu'
    'Filter' = 'filter'
    'PlusCircle' = 'plusCircle'
    'TrendingUp' = 'trendingUp'
}

function Get-TailwindClass {
    param($size)
    $sizeMap = @{
        10 = 'w-[10px] h-[10px]'
        16 = 'w-4 h-4'
        18 = 'w-[18px] h-[18px]'
        20 = 'w-5 h-5'
        24 = 'w-6 h-6'
        28 = 'w-7 h-7'
        32 = 'w-8 h-8'
    }
    if ($sizeMap.ContainsKey([int]$size)) {
        return $sizeMap[[int]$size]
    }
    return "w-[$size`px] h-[$size`px]"
}

$files = @(
    'src\App.jsx'
)

$totalReplacements = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $replacements = 0
        
        foreach ($icon in $iconMap.Keys) {
            $pattern = "<$icon\s+size=\{(\d+)\}[^/>]*\/>"
            $matches = [regex]::Matches($content, $pattern)
            
            foreach ($match in $matches) {
                $size = $match.Groups[1].Value
                $tailwindClass = Get-TailwindClass $size
                $iconKey = $iconMap[$icon]
                $replacement = "<img src={getIconPath('$iconKey')} alt=`"$icon`" className=`"$tailwindClass`" />"
                $content = $content.Replace($match.Value, $replacement)
                $replacements++
            }
        }
        
        if ($replacements -gt 0) {
            Set-Content $file -Value $content -NoNewline
            Write-Host "✅ $file`: $replacements icons replaced" -ForegroundColor Green
            $totalReplacements += $replacements
        }
    }
}

Write-Host "`n✨ Complete! $totalReplacements total icons replaced." -ForegroundColor Cyan
