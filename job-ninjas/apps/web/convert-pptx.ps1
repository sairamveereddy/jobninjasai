param($pptxPath, $outDir)
$ErrorActionPreference = "Stop"
try {
    $ppt = New-Object -ComObject PowerPoint.Application
    $pres = $ppt.Presentations.Open($pptxPath, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
    $count = $pres.Slides.Count
    if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }
    for ($i = 1; $i -le $count; $i++) {
        $pres.Slides.Item($i).Export("$outDir\slide_$i.png", "PNG", 1920, 1080)
    }
    $pres.Close()
    $ppt.Quit()
    Write-Output "SUCCESS:$count"
} catch {
    Write-Output "ERROR:$($_.Exception.Message)"
}
