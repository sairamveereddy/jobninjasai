$files = Get-ChildItem -Path "frontend/src" -Include *.jsx,*.css,*.js -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace "novaninjas", "jobninjas"
    $newContent = $newContent -replace "Nova Ninjas", "JobNinjas"
    $newContent = $newContent -replace "NovaNinjas", "JobNinjas"
    $newContent = $newContent -replace "nova-ninjas", "job-ninjas"
    $newContent = $newContent -replace "Nova-Ninjas", "Job-Ninjas"
    
    if ($content -ne $newContent) {
        $newContent | Set-Content $file.FullName -NoNewline
        Write-Host "Updated $($file.FullName)"
    }
}
